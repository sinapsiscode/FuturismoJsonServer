/**
 * Servicio de servicios turísticos
 * Maneja toda la lógica de servicios turísticos con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';


class ServicesService extends BaseService {
  constructor() {
    super('/services');
    this.realtimeInterval = null;
  }

  /**
   * Obtener todos los servicios
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getServices(filters = {}) {
return this.get('', filters);
  }

  /**
   * Obtener servicios activos
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getActiveServices(filters = {}) {
return this.get('/active', filters);
  }

  /**
   * Obtener servicio por ID
   * @param {string} id - ID del servicio
   * @returns {Promise<Object>}
   */
  async getServiceById(id) {
return this.get(`/${id}`);
  }

  /**
   * Crear nuevo servicio
   * @param {Object} serviceData - Datos del servicio
   * @returns {Promise<Object>}
   */
  async createService(serviceData) {
return this.post('', serviceData);
  }

  /**
   * Actualizar servicio
   * @param {string} id - ID del servicio
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateService(id, updateData) {
return this.put(`/${id}`, updateData);
  }

  /**
   * Actualizar estado del servicio
   * @param {string} id - ID del servicio
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>}
   */
  async updateServiceStatus(id, status) {
return this.put(`/${id}/status`, { status });
  }

  /**
   * Actualizar ubicación del servicio
   * @param {string} id - ID del servicio
   * @param {Object} location - Nueva ubicación {lat, lng}
   * @returns {Promise<Object>}
   */
  async updateServiceLocation(id, location) {
return this.put(`/${id}/location`, location);
  }

  /**
   * Actualizar ubicación del guía
   * @param {string} guideId - ID del guía
   * @param {Object} location - Nueva ubicación {lat, lng}
   * @returns {Promise<Object>}
   */
  async updateGuideLocation(guideId, location) {
return this.put(`/guide/${guideId}/location`, location);
  }

  /**
   * Eliminar servicio
   * @param {string} id - ID del servicio
   * @returns {Promise<Object>}
   */
  async deleteService(id) {
return this.delete(`/${id}`);
  }

  /**
   * Obtener estadísticas de servicios
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getStatistics(filters = {}) {
return this.get('/statistics', filters);
  }

  /**
   * Calificar servicio completado
   * @param {string} id - ID del servicio
   * @param {number} rating - Calificación (1-5)
   * @param {string} feedback - Comentarios opcionales
   * @returns {Promise<Object>}
   */
  async rateService(id, rating, feedback = '') {
return this.post(`/${id}/rate`, { rating, feedback });
  }

  /**
   * Obtener tipos de servicio disponibles
   * @returns {Promise<Object>}
   */
  async getServiceTypes() {
return this.get('/types');
  }

  /**
   * Iniciar servicio
   * @param {string} id - ID del servicio
   * @returns {Promise<Object>}
   */
  async startService(id) {
return this.post(`/${id}/start`);
  }

  /**
   * Pausar servicio
   * @param {string} id - ID del servicio
   * @param {string} reason - Razón de la pausa
   * @returns {Promise<Object>}
   */
  async pauseService(id, reason = '') {
    return this.post(`/${id}/pause`, { reason });
  }

  /**
   * Reanudar servicio pausado
   * @param {string} id - ID del servicio
   * @returns {Promise<Object>}
   */
  async resumeService(id) {
return this.post(`/${id}/resume`);
  }

  /**
   * Finalizar servicio
   * @param {string} id - ID del servicio
   * @param {Object} completionData - Datos de finalización
   * @returns {Promise<Object>}
   */
  async finishService(id, completionData = {}) {
    return this.post(`/${id}/finish`, completionData);
  }

  /**
   * Cancelar servicio
   * @param {string} id - ID del servicio
   * @param {string} reason - Razón de cancelación
   * @returns {Promise<Object>}
   */
  async cancelService(id, reason) {
    return this.post(`/${id}/cancel`, { reason });
  }

  /**
   * Obtener historial de ubicaciones de un servicio
   * @param {string} id - ID del servicio
   * @returns {Promise<Object>}
   */
  async getLocationHistory(id) {
    return this.get(`/${id}/location-history`);
  }

  /**
   * Asignar guía a servicio
   * @param {string} serviceId - ID del servicio
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async assignGuide(serviceId, guideId) {
    return this.post(`/${serviceId}/assign-guide`, { guideId });
  }

  /**
   * Obtener servicios por guía
   * @param {string} guideId - ID del guía
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getServicesByGuide(guideId, filters = {}) {
return this.get(`/guide/${guideId}`, filters);
  }

  /**
   * Iniciar actualizaciones en tiempo real
   * @param {Function} callback - Función a ejecutar con las actualizaciones
   * @returns {number} ID del intervalo
   */
  startRealtimeUpdates(callback) {
    // En producción, esto sería una conexión WebSocket
    console.log('Realtime updates would be handled via WebSocket in production');
    return null;
  }

  /**
   * Detener actualizaciones en tiempo real
   */
  stopRealtimeUpdates() {
    if (this.realtimeInterval) {
      this.realtimeInterval = null;
    }
  }

  /**
   * Enviar notificación de emergencia
   * @param {string} serviceId - ID del servicio
   * @param {Object} emergencyData - Datos de la emergencia
   * @returns {Promise<Object>}
   */
  async sendEmergencyAlert(serviceId, emergencyData) {
    return this.post(`/${serviceId}/emergency`, emergencyData);
  }

  /**
   * Obtener ruta óptima para el servicio
   * @param {string} serviceId - ID del servicio
   * @returns {Promise<Object>}
   */
  async getOptimalRoute(serviceId) {
    return this.get(`/${serviceId}/route`);
  }
}

export const servicesService = new ServicesService();
export default servicesService;