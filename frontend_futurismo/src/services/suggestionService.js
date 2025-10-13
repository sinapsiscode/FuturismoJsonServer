/**
 * Servicio para gestión de sugerencias y mejora continua
 */

import BaseService from './baseService';

class SuggestionService extends BaseService {
  constructor() {
    super('/suggestions');
  }

  /**
   * Obtener todas las sugerencias
   * @param {Object} filters - Filtros opcionales (status, priority, area, type)
   * @returns {Promise<Object>}
   */
  async getAllSuggestions(filters = {}) {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.area) params.append('area', filters.area);
    if (filters.type) params.append('type', filters.type);

    const queryString = params.toString();
    return this.get(queryString ? `?${queryString}` : '');
  }

  /**
   * Obtener una sugerencia por ID
   * @param {number} id - ID de la sugerencia
   * @returns {Promise<Object>}
   */
  async getSuggestionById(id) {
    return this.get(`/${id}`);
  }

  /**
   * Crear nueva sugerencia
   * @param {Object} suggestionData - Datos de la sugerencia
   * @returns {Promise<Object>}
   */
  async createSuggestion(suggestionData) {
    return this.post('', suggestionData);
  }

  /**
   * Actualizar estado de una sugerencia
   * @param {number} id - ID de la sugerencia
   * @param {string} status - Nuevo estado (pending, reviewed, in_progress, implemented, rejected)
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    return this.patch(`/${id}`, { status });
  }

  /**
   * Actualizar sugerencia completa
   * @param {number} id - ID de la sugerencia
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateSuggestion(id, data) {
    return this.patch(`/${id}`, data);
  }

  /**
   * Añadir respuesta a una sugerencia
   * @param {number} suggestionId - ID de la sugerencia
   * @param {Object} response - Datos de la respuesta
   * @returns {Promise<Object>}
   */
  async addResponse(suggestionId, response) {
    return this.post(`/${suggestionId}/responses`, response);
  }

  /**
   * Eliminar sugerencia
   * @param {number} id - ID de la sugerencia
   * @returns {Promise<Object>}
   */
  async deleteSuggestion(id) {
    return this.delete(`/${id}`);
  }

  /**
   * Obtener estadísticas de sugerencias
   * @returns {Promise<Object>}
   */
  async getStats() {
    return this.get('/stats');
  }
}

export default new SuggestionService();
