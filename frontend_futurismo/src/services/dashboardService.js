/**
 * Servicio de dashboard
 * Maneja las estadísticas y métricas del dashboard
 */

import BaseService from './baseService';

class DashboardService extends BaseService {
  constructor() {
    super('/dashboard');
  }

  /**
   * Obtener estadísticas del dashboard según el rol del usuario
   * @param {string} userId - ID del usuario
   * @param {string} role - Rol del usuario (guide, agency, admin)
   * @returns {Promise<Object>}
   */
  async getStats(userId, role) {
    if (this.isUsingMockData) {
      // Mock data específico por rol
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      switch (role) {
        case 'guide':
          return {
            success: true,
            data: {
              toursThisWeek: Math.floor(Math.random() * 10) + 3,
              completedToday: Math.floor(Math.random() * 3),
              nextTour: nextWeek,
              personalRating: 4.2 + Math.random() * 0.8,
              toursCompleted: 120 + Math.floor(Math.random() * 50),
              monthlyIncome: 2800 + Math.floor(Math.random() * 1000)
            }
          };

        case 'agency':
          return {
            success: true,
            data: {
              activeServices: 8 + Math.floor(Math.random() * 10),
              completedToday: Math.floor(Math.random() * 12),
              totalRevenue: 12000 + Math.floor(Math.random() * 8000),
              punctualityRate: 88 + Math.random() * 10,
              totalReservations: 100 + Math.floor(Math.random() * 50),
              totalTourists: 250 + Math.floor(Math.random() * 200),
              monthlyRevenue: 75000 + Math.floor(Math.random() * 30000)
            }
          };

        case 'admin':
        default:
          return {
            success: true,
            data: {
              activeServices: 35 + Math.floor(Math.random() * 20),
              totalAgencies: 8 + Math.floor(Math.random() * 8),
              totalGuides: 25 + Math.floor(Math.random() * 15),
              totalReservations: 1500 + Math.floor(Math.random() * 500),
              totalTourists: 3800 + Math.floor(Math.random() * 1000),
              totalRevenue: 220000 + Math.floor(Math.random() * 100000)
            }
          };
      }
    }

    return this.get('/stats', { userId, role });
  }

  /**
   * Obtener datos para gráficos mensuales
   * @param {string} userId - ID del usuario
   * @param {string} role - Rol del usuario
   * @param {number} months - Número de meses hacia atrás
   * @returns {Promise<Object>}
   */
  async getMonthlyData(userId, role, months = 6) {
    if (this.isUsingMockData) {
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const today = new Date();
      const data = [];

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        const monthName = monthNames[date.getMonth()];

        switch (role) {
          case 'guide':
            data.push({
              name: monthName,
              tours: 15 + Math.floor(Math.random() * 20),
              income: 2000 + Math.floor(Math.random() * 2000),
              rating: 4.0 + Math.random() * 1.0
            });
            break;

          case 'agency':
            data.push({
              name: monthName,
              reservations: 80 + Math.floor(Math.random() * 60),
              revenue: 60000 + Math.floor(Math.random() * 40000),
              tourists: 200 + Math.floor(Math.random() * 150)
            });
            break;

          case 'admin':
          default:
            data.push({
              name: monthName,
              services: 300 + Math.floor(Math.random() * 200),
              revenue: 180000 + Math.floor(Math.random() * 120000),
              users: 80 + Math.floor(Math.random() * 40)
            });
            break;
        }
      }

      return {
        success: true,
        data
      };
    }

    return this.get('/monthly-data', { userId, role, months });
  }

  // Mantener compatibilidad con métodos existentes
  async getDashboardStats(timeRange = 'month') {
    const monthlyData = await this.getMonthlyData('current', 'admin', 7);
    return {
      lineData: monthlyData.data,
      barData: [],
      pieData: [],
      kpiData: {},
      summaryData: {}
    };
  }

  async getKPIs(timeRange = 'month') {
    try {
      const result = await this.get('/kpis', { timeRange });
      return result.data;
    } catch (error) {
      console.warn('Error fetching KPIs, using fallback data:', error);
      return {
        totalReservas: { actual: 0, anterior: 0, crecimiento: 0 },
        totalTuristas: { actual: 0, anterior: 0, crecimiento: 0 },
        ingresosTotales: { actual: 0, anterior: 0, crecimiento: 0 }
      };
    }
  }

  async getChartData(chartType, timeRange = 'month') {
    try {
      const result = await this.get('/chart-data', { type: chartType, timeRange });
      return result.data;
    } catch (error) {
      console.warn('Error fetching chart data, using fallback:', error);
      return [];
    }
  }

  async getSummaryData(timeRange = 'month') {
    try {
      const result = await this.get('/summary', { timeRange });
      return result.data;
    } catch (error) {
      console.warn('Error fetching summary data, using fallback:', error);
      return {
        popularTour: 'Sin datos',
        avgPerBooking: 0,
        bestDay: 'Sin datos',
        conversionRate: 0
      };
    }
  }
}

const dashboardService = new DashboardService();

export default dashboardService;