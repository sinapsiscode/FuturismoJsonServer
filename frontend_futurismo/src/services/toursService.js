/**
 * Servicio de tours
 * Maneja toda la lógica de tours con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';


class ToursService extends BaseService {
  constructor() {
    super('/tours');
  }

  /**
   * Obtener todos los tours
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getTours(filters = {}) {
return this.get('', filters);
  }

  /**
   * Obtener tour por ID
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async getTourById(id) {
return this.get(`/${id}`);
  }

  /**
   * Crear nuevo tour
   * @param {Object} tourData - Datos del tour
   * @returns {Promise<Object>}
   */
  async createTour(tourData) {
return this.post('', tourData);
  }

  /**
   * Actualizar tour
   * @param {string} id - ID del tour
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateTour(id, updateData) {
return this.put(`/${id}`, updateData);
  }

  /**
   * Eliminar tour
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async deleteTour(id) {
return this.delete(`/${id}`);
  }

  /**
   * Cambiar estado del tour
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async toggleTourStatus(id) {
return this.put(`/${id}/toggle-status`);
  }

  /**
   * Destacar/Quitar destacado del tour
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async toggleTourFeatured(id) {
return this.put(`/${id}/toggle-featured`);
  }

  /**
   * Obtener categorías de tours
   * @returns {Promise<Object>}
   */
  async getCategories() {
return this.get('/categories');
  }

  /**
   * Obtener estadísticas de tours
   * @returns {Promise<Object>}
   */
  async getStatistics() {
return this.get('/statistics');
  }

  /**
   * Obtener tours disponibles para una fecha
   * @param {Date} date - Fecha a consultar
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise<Object>}
   */
  async getAvailableTours(date, filters = {}) {
return this.get('/available', { date: date.toISOString(), ...filters });
  }

  /**
   * Duplicar tour
   * @param {string} id - ID del tour a duplicar
   * @returns {Promise<Object>}
   */
  async duplicateTour(id) {
return this.post(`/${id}/duplicate`);
  }

  /**
   * Obtener idiomas disponibles
   * @returns {Promise<Object>}
   */
  async getLanguages() {
    return this.get('/languages');
  }

  /**
   * Buscar tours por texto
   * @param {string} searchTerm - Término de búsqueda
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise<Object>}
   */
  async searchTours(searchTerm, filters = {}) {
return this.get('/search', { q: searchTerm, ...filters });
  }

  /**
   * Obtener itinerario detallado del tour
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async getTourItinerary(id) {
    return this.get(`/${id}/itinerary`);
  }

  /**
   * Actualizar itinerario del tour
   * @param {string} id - ID del tour
   * @param {Array} itinerary - Nuevo itinerario
   * @returns {Promise<Object>}
   */
  async updateTourItinerary(id, itinerary) {
return this.put(`/${id}/itinerary`, { itinerary });
  }

  /**
   * Obtener precios especiales del tour
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async getTourPricing(id) {
    return this.get(`/${id}/pricing`);
  }

  /**
   * Actualizar precios del tour
   * @param {string} id - ID del tour
   * @param {Object} pricing - Nuevos precios
   * @returns {Promise<Object>}
   */
  async updateTourPricing(id, pricing) {
return this.put(`/${id}/pricing`, pricing);
  }

  /**
   * Obtener disponibilidad del tour
   * @param {string} id - ID del tour
   * @param {Date} startDate - Fecha inicial
   * @param {Date} endDate - Fecha final
   * @returns {Promise<Object>}
   */
  async getTourAvailability(id, startDate, endDate) {
    return this.get(`/${id}/availability`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
  }

  /**
   * Importar tours desde archivo
   * @param {File} file - Archivo a importar
   * @returns {Promise<Object>}
   */
  async importTours(file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.post('/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Exportar tours
   * @param {Object} filters - Filtros para exportación
   * @returns {Promise<Blob>}
   */
  async exportTours(filters = {}) {
    const response = await this.get('/export', filters, {
      responseType: 'blob'
    });

    return response.data;
  }

  /**
   * Verificar disponibilidad de guía para un tour
   * @param {string} tourId - ID del tour
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async checkGuideAvailability(tourId, guideId) {
return this.post(`/${tourId}/check-guide-availability`, { guideId });
  }

  /**
   * Verificar competencias del guía para un tour
   * @param {string} tourId - ID del tour
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async checkGuideCompetences(tourId, guideId) {
return this.post(`/${tourId}/check-guide-competences`, { guideId });
  }

  /**
   * Asignar guía a tour
   * @param {string} tourId - ID del tour
   * @param {string} guideId - ID del guía
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  async assignGuideToTour(tourId, guideId, options = {}) {
return this.post(`/${tourId}/assign-guide`, { guideId, ...options });
  }

  /**
   * Asignar tour a agencia
   * @param {string} tourId - ID del tour
   * @param {string} agencyId - ID de la agencia
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  async assignTourToAgency(tourId, agencyId, options = {}) {
return this.post(`/${tourId}/assign-agency`, { agencyId, ...options });
  }

  /**
   * Obtener guías disponibles para un tour
   * @param {string} tourId - ID del tour
   * @param {string} date - Fecha del tour
   * @returns {Promise<Object>}
   */
  async getAvailableGuidesForTour(tourId, date) {
return this.get(`/${tourId}/available-guides`, { date });
  }

  /**
   * Remover asignación de tour
   * @param {string} tourId - ID del tour
   * @param {string} assignmentType - Tipo de asignación ('guide' o 'agency')
   * @returns {Promise<Object>}
   */
  async removeAssignment(tourId, assignmentType = 'guide') {
return this.delete(`/${tourId}/assignment/${assignmentType}`);
  }

  /**
   * Obtener tours asignados a un guía específico
   * @param {string} guideId - ID del guía
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getGuideTours(guideId, filters = {}) {
    return this.get('/guide-tours', { guideId, ...filters });
  }

  /**
   * Actualizar estado de tour del guía
   * @param {string} tourId - ID del tour
   * @param {string} status - Nuevo estado
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async updateTourStatus(tourId, status, guideId) {
    return this.put(`/${tourId}/status`, { status, guideId });
  }

  /**
   * Asignar proveedores a un tour
   * @param {string} tourId - ID del tour
   * @param {Array} providers - Array de proveedores asignados
   * @returns {Promise<Object>}
   */
  async assignProviders(tourId, providers) {
    return this.post(`/${tourId}/assign-providers`, { providers });
  }

  // Método auxiliar para generar CSV
  generateCSV(tours) {
    const headers = ['Código', 'Nombre', 'Categoría', 'Precio', 'Duración', 'Capacidad', 'Estado'];
    const rows = tours.map(tour => [
      tour.code,
      tour.name,
      tour.category,
      tour.price,
      tour.duration,
      tour.capacity,
      tour.status
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export const toursService = new ToursService();
export default toursService;