/**
 * Servicio de calificaciones y ratings
 * Maneja las calificaciones de agencias, guías y servicios
 */

import BaseService from './baseService';

class RatingsService extends BaseService {
  constructor() {
    super('/ratings');
  }

  /**
   * Obtener calificaciones de agencias
   * @param {Object} params - Parámetros de filtro
   * @param {string} params.period - Período (week, month, quarter, year)
   * @param {string} params.agencyId - ID de agencia específica (opcional)
   * @returns {Promise<Object>}
   */
  async getAgencyRatings({ period = 'month', agencyId = null } = {}) {
    const params = { period };
    if (agencyId) params.agencyId = agencyId;

    return this.get('/agencies', params);
  }

  /**
   * Obtener resumen de calificaciones de agencias
   * @returns {Promise<Object>}
   */
  async getAgencyRatingsSummary() {
    return this.get('/agencies/summary');
  }

  /**
   * Obtener estadísticas del dashboard de ratings
   * @returns {Promise<Object>}
   */
  async getDashboardStats() {
    return this.get('/dashboard/stats');
  }

  /**
   * Obtener estadísticas por área de servicio
   * @returns {Promise<Object>}
   */
  async getAreaStats() {
    return this.get('/areas');
  }

  /**
   * Obtener estadísticas de personal
   * @returns {Promise<Object>}
   */
  async getStaffStats() {
    return this.get('/staff');
  }

  /**
   * Obtener distribución de calificaciones
   * @returns {Promise<Object>}
   */
  async getRatingsDistribution() {
    return this.get('/distribution');
  }

  /**
   * Crear nueva evaluación de personal
   * @param {Object} evaluation - Datos de la evaluación
   * @returns {Promise<Object>}
   */
  async createEvaluation(evaluation) {
    return this.post('/evaluations', evaluation);
  }
}

export default new RatingsService();
