import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import useAuthStore from '../stores/authStore';

const useDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  // Cargar estadísticas del dashboard
  const loadStats = async () => {
    if (!user?.id || !user?.role) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getStats(user.id, user.role);
      
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Error al cargar estadísticas');
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos mensuales para gráficos
  const loadMonthlyData = async () => {
    if (!user?.id || !user?.role) return;

    try {
      const response = await dashboardService.getMonthlyData(user.id, user.role);
      
      if (response.success) {
        setMonthlyData(response.data);
      }
    } catch (err) {
      console.error('Error loading monthly data:', err);
    }
  };

  // Formatear próximo tour para guides
  const getFormattedNextTour = () => {
    if (user?.role !== 'guide' || !stats?.nextTour) {
      return '0';
    }

    const nextTour = new Date(stats.nextTour);
    const day = nextTour.getDate().toString().padStart(2, '0');
    const month = (nextTour.getMonth() + 1).toString().padStart(2, '0');
    const year = nextTour.getFullYear().toString().slice(-2);
    
    return `${day}-${month}-${year}`;
  };

  // Obtener datos específicos según el rol
  const getRoleSpecificStats = () => {
    if (!stats) return {};

    switch (user?.role) {
      case 'guide':
        return {
          card1: {
            value: stats.toursThisWeek ?? 0,
            label: 'Tours esta semana',
            icon: 'calendar',
            trend: stats.toursThisWeekTrend || null
          },
          card2: {
            value: getFormattedNextTour(),
            label: 'Siguiente tour',
            icon: 'clock',
            trend: null // No aplica trend para fecha
          },
          card3: {
            value: stats.personalRating ? stats.personalRating.toFixed(1) : '0.0',
            label: 'Rating personal',
            icon: 'star',
            trend: stats.ratingTrend || null
          },
          card4: {
            value: stats.monthlyIncome ?? 0,
            label: 'Ingresos mensuales',
            icon: 'dollar',
            format: 'currency',
            trend: stats.monthlyIncomeTrend || null
          }
        };

      case 'agency':
        return {
          card1: {
            value: stats.activeServices ?? 0,
            label: 'Servicios activos',
            icon: 'service',
            trend: stats.activeServicesTrend || null
          },
          card2: {
            value: stats.completedToday ?? 0,
            label: 'Completados hoy',
            icon: 'check',
            trend: stats.completedTodayTrend || null
          },
          card3: {
            value: stats.totalRevenue ?? 0,
            label: 'Ingresos totales',
            icon: 'dollar',
            format: 'currency',
            trend: stats.totalRevenueTrend || null
          },
          card4: {
            value: stats.punctualityRate ? stats.punctualityRate.toFixed(1) : '0.0',
            label: 'Puntualidad %',
            icon: 'clock',
            trend: stats.punctualityRateTrend || null
          }
        };

      case 'admin':
      default:
        return {
          card1: {
            value: stats.activeServices ?? 0,
            label: 'Servicios activos',
            icon: 'service',
            trend: stats.activeServicesTrend || null
          },
          card2: {
            value: stats.totalAgencies ?? 0,
            label: 'Agencias totales',
            icon: 'building',
            trend: stats.totalAgenciesTrend || null
          },
          card3: {
            value: stats.totalRevenue ?? 0,
            label: 'Ingresos totales',
            icon: 'dollar',
            format: 'currency',
            trend: stats.totalRevenueTrend || null
          }
        };
    }
  };

  // Cargar datos al montar y cuando cambie el usuario
  useEffect(() => {
    if (user?.id) {
      loadStats();
      loadMonthlyData();
    }
  }, [user?.id, user?.role]);

  return {
    stats,
    loading,
    error,
    monthlyData,
    roleSpecificStats: getRoleSpecificStats(),
    getFormattedNextTour,
    refresh: () => {
      loadStats();
      loadMonthlyData();
    }
  };
};

export default useDashboard;