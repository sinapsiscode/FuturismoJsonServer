import { useMemo } from 'react';

const useReservationStats = (reservations = []) => {
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
        tourTypeDistribution: []
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

      // Tendencia mensual (simplificada para ejemplo)
      // En producción, esto debería calcularse basándose en fechas reales
      const monthlyTrend = generateMonthlyTrend(totalClients, totalRevenue);

      return {
        totalClients,
        totalTourists,
        totalRevenue,
        avgGroupSize: Number(avgGroupSize.toFixed(1)),
        avgRevenuePerClient: Math.round(avgRevenuePerClient),
        topDestinations,
        topGuides,
        monthlyTrend,
        tourTypeDistribution
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
        error: true
      };
    }
  }, [reservations]);

  return stats;
};

// Función auxiliar para generar tendencia mensual
const generateMonthlyTrend = (totalClients, totalRevenue) => {
  // En producción, esto debería basarse en datos reales
  const months = ['Ene', 'Feb', 'Mar'];
  const factors = [0.8, 0.9, 1.0];
  
  return months.map((month, index) => ({
    month,
    clients: Math.floor(totalClients * factors[index]),
    revenue: Math.round(totalRevenue * factors[index])
  }));
};

export default useReservationStats;