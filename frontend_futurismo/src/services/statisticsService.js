/**
 * Servicio de estadísticas
 * Maneja toda la lógica de estadísticas y reportes con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockStatisticsService } from './mockStatisticsService';

class StatisticsService extends BaseService {
  constructor() {
    super('/statistics');
  }

  /**
   * Obtener estadísticas diarias
   * @param {Date} date - Fecha específica
   * @returns {Promise<Object>}
   */
  async getDailyStatistics(date = new Date()) {
    if (this.isUsingMockData) {
      return mockStatisticsService.getDailyStatistics(date);
    }

    return this.get('/daily', { date: date.toISOString() });
  }

  /**
   * Obtener estadísticas semanales
   * @param {Date} startDate - Fecha de inicio de la semana
   * @returns {Promise<Object>}
   */
  async getWeeklyStatistics(startDate = new Date()) {
    if (this.isUsingMockData) {
      return mockStatisticsService.getWeeklyStatistics(startDate);
    }

    return this.get('/weekly', { startDate: startDate.toISOString() });
  }

  /**
   * Obtener estadísticas mensuales
   * @param {number} year - Año
   * @param {number} month - Mes (1-12)
   * @returns {Promise<Object>}
   */
  async getMonthlyStatistics(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
    if (this.isUsingMockData) {
      return mockStatisticsService.getMonthlyStatistics(year, month);
    }

    return this.get('/monthly', { year, month });
  }

  /**
   * Obtener estadísticas anuales
   * @param {number} year - Año
   * @returns {Promise<Object>}
   */
  async getYearlyStatistics(year = new Date().getFullYear()) {
    if (this.isUsingMockData) {
      return mockStatisticsService.getYearlyStatistics(year);
    }

    return this.get('/yearly', { year });
  }

  /**
   * Obtener estadísticas personalizadas por rango de fechas
   * @param {Date} startDate - Fecha inicial
   * @param {Date} endDate - Fecha final
   * @param {string} groupBy - Agrupación (day, week, month)
   * @returns {Promise<Object>}
   */
  async getCustomStatistics(startDate, endDate, groupBy = 'day') {
    if (this.isUsingMockData) {
      return mockStatisticsService.getCustomStatistics(startDate, endDate, groupBy);
    }

    return this.get('/custom', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      groupBy
    });
  }

  /**
   * Obtener estadísticas por tour
   * @param {string} tourId - ID del tour
   * @param {string} period - Período (day, week, month, year)
   * @returns {Promise<Object>}
   */
  async getTourStatistics(tourId, period = 'month') {
    if (this.isUsingMockData) {
      return mockStatisticsService.getTourStatistics(tourId, period);
    }

    return this.get(`/tour/${tourId}`, { period });
  }

  /**
   * Obtener estadísticas por guía
   * @param {string} guideId - ID del guía
   * @param {string} period - Período (day, week, month, year)
   * @returns {Promise<Object>}
   */
  async getGuideStatistics(guideId, period = 'month') {
    if (this.isUsingMockData) {
      return mockStatisticsService.getGuideStatistics(guideId, period);
    }

    return this.get(`/guide/${guideId}`, { period });
  }

  /**
   * Obtener estadísticas de ocupación
   * @param {string} period - Período (week, month)
   * @returns {Promise<Object>}
   */
  async getOccupancyStatistics(period = 'week') {
    if (this.isUsingMockData) {
      return mockStatisticsService.getOccupancyStatistics(period);
    }

    return this.get('/occupancy', { period });
  }

  /**
   * Obtener KPIs principales
   * @returns {Promise<Object>}
   */
  async getKPIs() {
    if (this.isUsingMockData) {
      return mockStatisticsService.getKPIs();
    }

    return this.get('/kpis');
  }

  /**
   * Obtener proyecciones futuras
   * @param {number} months - Número de meses a proyectar
   * @returns {Promise<Object>}
   */
  async getProjections(months = 3) {
    if (this.isUsingMockData) {
      return mockStatisticsService.getProjections(months);
    }

    return this.get('/projections', { months });
  }

  /**
   * Obtener comparación con período anterior
   * @param {string} metric - Métrica a comparar
   * @param {string} period - Período (day, week, month, year)
   * @returns {Promise<Object>}
   */
  async getComparison(metric, period = 'month') {
    if (this.isUsingMockData) {
      // Mock: generar comparación
      const current = Math.floor(Math.random() * 1000) + 500;
      const previous = Math.floor(Math.random() * 1000) + 400;
      const trend = ((current - previous) / previous * 100).toFixed(1);
      
      return {
        success: true,
        data: {
          metric,
          period,
          current,
          previous,
          difference: current - previous,
          trend: parseFloat(trend),
          improved: current > previous
        }
      };
    }

    return this.get('/comparison', { metric, period });
  }

  /**
   * Obtener dashboard de estadísticas
   * @returns {Promise<Object>}
   */
  async getDashboard() {
    if (this.isUsingMockData) {
      // Combinar múltiples estadísticas para el dashboard
      const [daily, weekly, monthly, kpis] = await Promise.all([
        this.getDailyStatistics(),
        this.getWeeklyStatistics(),
        this.getMonthlyStatistics(),
        this.getKPIs()
      ]);

      return {
        success: true,
        data: {
          daily: daily.data,
          weekly: weekly.data,
          monthly: monthly.data,
          kpis: kpis.data
        }
      };
    }

    return this.get('/dashboard');
  }

  /**
   * Generar reporte en PDF
   * @param {Object} options - Opciones del reporte
   * @returns {Promise<Blob>}
   */
  async generateReport(options = {}) {
    if (this.isUsingMockData) {
      // Mock: retornar blob vacío
      return new Blob(['Mock PDF Report'], { type: 'application/pdf' });
    }

    const response = await this.post('/report', options, {
      responseType: 'blob'
    });

    return response.data;
  }

  /**
   * Exportar estadísticas a Excel
   * @param {Object} filters - Filtros para exportación
   * @returns {Promise<Blob>}
   */
  async exportToExcel(filters = {}) {
    if (this.isUsingMockData) {
      // Mock: generar CSV simple
      const stats = await this.getMonthlyStatistics();
      const csv = `Fecha,Reservas,Turistas,Ingresos\n${new Date().toISOString()},${stats.data.reservations},${stats.data.tourists},${stats.data.revenue}`;
      return new Blob([csv], { type: 'text/csv' });
    }

    const response = await this.get('/export', filters, {
      responseType: 'blob'
    });

    return response.data;
  }

  /**
   * Obtener tendencias históricas
   * @param {string} metric - Métrica a analizar
   * @param {number} months - Número de meses hacia atrás
   * @returns {Promise<Object>}
   */
  async getHistoricalTrends(metric, months = 6) {
    if (this.isUsingMockData) {
      const data = [];
      const baseValue = Math.floor(Math.random() * 1000) + 500;
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        data.push({
          date: date.toISOString().substring(0, 7),
          value: baseValue + Math.floor(Math.random() * 200) - 100
        });
      }
      
      return {
        success: true,
        data: {
          metric,
          months,
          data,
          trend: Math.random() > 0.5 ? 'upward' : 'downward',
          averageGrowth: (Math.random() * 10 - 5).toFixed(1) + '%'
        }
      };
    }

    return this.get('/trends', { metric, months });
  }

  /**
   * Obtener análisis de temporada
   * @param {number} year - Año a analizar
   * @returns {Promise<Object>}
   */
  async getSeasonalAnalysis(year = new Date().getFullYear()) {
    if (this.isUsingMockData) {
      return {
        success: true,
        data: {
          year,
          highSeason: {
            months: ['Junio', 'Julio', 'Agosto', 'Diciembre'],
            averageOccupancy: 85,
            averageRevenue: 120000
          },
          lowSeason: {
            months: ['Febrero', 'Marzo', 'Abril'],
            averageOccupancy: 65,
            averageRevenue: 70000
          },
          recommendations: [
            'Aumentar promociones en temporada baja',
            'Preparar más personal para temporada alta',
            'Ajustar precios según demanda estacional'
          ]
        }
      };
    }

    return this.get('/seasonal', { year });
  }
}

export const statisticsService = new StatisticsService();
export default statisticsService;