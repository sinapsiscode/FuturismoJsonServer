import { useMemo, useState, useEffect } from 'react';
import api from '../services/api';

const useReservationStats = (reservations = []) => {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trends from API
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/statistics/reservations/trends');

        if (response.data.success) {
          setTrends(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching reservation trends:', err);
        setError(err.message);
        setTrends(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [reservations.length]); // Re-fetch when reservations change

  const stats = useMemo(() => {
    // Estado inicial si no hay reservaciones
    if (!reservations.length) {
      return {
        totalClients: 0,
        totalTourists: 0,
        totalRevenue: 0,
        avgGroupSize: 0,
        avgRevenuePerClient: 0,
        topDestinations: [],
        topGuides: [],
        monthlyTrend: [],
        tourTypeDistribution: [],
        trends: {
          totalClients: { trendLabel: '0%' },
          totalTourists: { trendLabel: '0%' },
          totalRevenue: { trendLabel: '0%' },
          avgGroupSize: { trendLabel: '0%' },
          avgRevenuePerClient: { trendLabel: '0%' },
          activeDestinations: { trendLabel: '0%' }
        },
        loading,
        error
      };
    }

    try {
      // Cálculos básicos
      const totalClients = reservations.length;
      const totalTourists = reservations.reduce((sum, res) =>
        sum + (res.tourists || 0), 0
      );
      const totalRevenue = reservations.reduce((sum, res) =>
        sum + (res.totalAmount || 0), 0
      );
      const avgGroupSize = totalClients > 0 ? (totalTourists / totalClients) : 0;
      const avgRevenuePerClient = totalClients > 0 ? (totalRevenue / totalClients) : 0;

      // Calcular top destinos
      const destinationCounts = reservations.reduce((acc, res) => {
        if (res.destination) {
          acc[res.destination] = (acc[res.destination] || 0) + 1;
        }
        return acc;
      }, {});

      const topDestinations = Object.entries(destinationCounts)
        .map(([destination, count]) => ({
          destination,
          count,
          name: destination // Para compatibilidad con TopItemsList
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calcular top guías
      const guideCounts = reservations.reduce((acc, res) => {
        if (res.guide) {
          acc[res.guide] = (acc[res.guide] || 0) + 1;
        }
        return acc;
      }, {});

      const topGuides = Object.entries(guideCounts)
        .map(([guide, count]) => ({
          guide,
          count,
          name: guide // Para compatibilidad con TopItemsList
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Distribución por tipo de tour
      const tourTypeCounts = reservations.reduce((acc, res) => {
        if (res.tourType) {
          acc[res.tourType] = (acc[res.tourType] || 0) + 1;
        }
        return acc;
      }, {});

      const tourTypeDistribution = Object.entries(tourTypeCounts)
        .map(([type, count]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          count,
          percentage: ((count / totalClients) * 100).toFixed(1),
          name: type.charAt(0).toUpperCase() + type.slice(1) // Para compatibilidad
        }));

      // Tendencia mensual (calculada desde el API)
      const monthlyTrend = generateMonthlyTrend(reservations);

      return {
        totalClients,
        totalTourists,
        totalRevenue,
        avgGroupSize: Number(avgGroupSize.toFixed(1)),
        avgRevenuePerClient: Math.round(avgRevenuePerClient),
        topDestinations,
        topGuides,
        monthlyTrend,
        tourTypeDistribution,
        trends: trends || {
          totalClients: { trendLabel: '0%' },
          totalTourists: { trendLabel: '0%' },
          totalRevenue: { trendLabel: '0%' },
          avgGroupSize: { trendLabel: '0%' },
          avgRevenuePerClient: { trendLabel: '0%' },
          activeDestinations: { trendLabel: '0%' }
        },
        loading,
        error
      };

    } catch (error) {
      console.error('Error calculating reservation stats:', error);
      // Retornar valores por defecto en caso de error
      return {
        totalClients: 0,
        totalTourists: 0,
        totalRevenue: 0,
        avgGroupSize: 0,
        avgRevenuePerClient: 0,
        topDestinations: [],
        topGuides: [],
        monthlyTrend: [],
        tourTypeDistribution: [],
        trends: {
          totalClients: { trendLabel: '0%' },
          totalTourists: { trendLabel: '0%' },
          totalRevenue: { trendLabel: '0%' },
          avgGroupSize: { trendLabel: '0%' },
          avgRevenuePerClient: { trendLabel: '0%' },
          activeDestinations: { trendLabel: '0%' }
        },
        error: true,
        loading: false
      };
    }
  }, [reservations, trends, loading, error]);

  return stats;
};

// Función auxiliar para generar tendencia mensual desde datos reales
const generateMonthlyTrend = (reservations) => {
  if (!reservations.length) {
    return [];
  }

  // Agrupar reservaciones por mes
  const monthlyData = {};
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  reservations.forEach(res => {
    const date = new Date(res.created_at || res.date || new Date());
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthLabel,
        clients: 0,
        revenue: 0,
        date: date
      };
    }

    monthlyData[monthKey].clients += 1;
    monthlyData[monthKey].revenue += res.totalAmount || res.total_amount || 0;
  });

  // Convertir a array y ordenar por fecha
  const monthlyArray = Object.values(monthlyData)
    .sort((a, b) => a.date - b.date)
    .slice(-6); // Últimos 6 meses

  return monthlyArray.map(item => ({
    month: item.month,
    clients: item.clients,
    revenue: Math.round(item.revenue)
  }));
};

export default useReservationStats;
