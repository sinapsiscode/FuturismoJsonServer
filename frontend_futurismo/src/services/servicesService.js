/**
 * Servicio de servicios turísticos
 * Maneja toda la lógica de servicios turísticos con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockServicesService } from './mockServicesService';

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
    if (this.isUsingMockData) {
      return mockServicesService.getServices(filters);
    }

    return this.get('', filters);
  }

  /**
   * Obtener servicios activos
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getActiveServices(filters = {}) {
    if (this.isUsingMockData) {
      return mockServicesService.getActiveServices(filters);
    }

    return this.get('/active', filters);
  }

  /**
   * Obtener servicio por ID
   * @param {string} id - ID del servicio
   * @returns {Promise<Object>}
   */
  async getServiceById(id) {
    if (this.isUsingMockData) {
      return mockServicesService.getServiceById(id);
    }

    return this.get(`/${id}`);
  }

  /**
   * Crear nuevo servicio
   * @param {Object} serviceData - Datos del servicio
   * @returns {Promise<Object>}
   */
  async createService(serviceData) {
    if (this.isUsingMockData) {
      return mockServicesService.createService(serviceData);
    }

    return this.post('', serviceData);
  }

  /**
   * Actualizar servicio
   * @param {string} id - ID del servicio
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateService(id, updateData) {
    if (this.isUsingMockData) {
      return mockServicesService.updateService(id, updateData);
    }

    return this.put(`/${id}`, updateData);
  }

  /**
   * Actualizar estado del servicio
   * @param {string} id - ID del servicio
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>}
   */
  async updateServiceStatus(id, status) {
    if (this.isUsingMockData) {
      return mockServicesService.updateServiceStatus(id, status);
    }

    return this.put(`/${id}/status`, { status });
  }

  /**
   * Actualizar ubicación del servicio
   * @param {string} id - ID del servicio
   * @param {Object} location - Nueva ubicación {lat, lng}
   * @returns {Promise<Object>}
   */
  async updateServiceLocation(id, location) {
    if (this.isUsingMockData) {
      return mockServicesService.updateServiceLocation(id, location);
    }

    return this.put(`/${id}/location`, location);
  }

  /**
   * Actualizar ubicación del guía
   * @param {string} guideId - ID del guía
   * @param {Object} location - Nueva ubicación {lat, lng}
   * @returns {Promise<Object>}
   */
  async updateGuideLocation(guideId, location) {
    if (this.isUsingMockData) {
      return mockServicesService.updateGuideLocation(guideId, location);
    }

    return this.put(`/guide/${guideId}/location`, location);
  }

  /**
   * Eliminar servicio
   * @param {string} id - ID del servicio
   * @returns {Promise<Object>}
   */
  async deleteService(id) {
    if (this.isUsingMockData) {
      return mockServicesService.deleteService(id);
    }

    return this.delete(`/${id}`);
  }

  /**
   * Obtener estadísticas de servicios
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getStatistics(filters = {}) {
    if (this.isUsingMockData) {
      return mockServicesService.getStatistics(filters);
    }

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
    if (this.isUsingMockData) {
      return mockServicesService.rateService(id, rating, feedback);
    }

    return this.post(`/${id}/rate`, { rating, feedback });
  }

  /**
   * Obtener tipos de servicio disponibles
   * @returns {Promise<Object>}
   */
  async getServiceTypes() {
    if (this.isUsingMockData) {
      return mockServicesService.getServiceTypes();
    }

    return this.get('/types');
  }

  /**
   * Iniciar servicio
   * @param {string} id - ID del servicio
   * @returns {Promise<Object>}
   */
  async startService(id) {
    if (this.isUsingMockData) {
      return mockServicesService.updateServiceStatus(id, 'ON_WAY');
    }

    return this.post(`/${id}/start`);
  }

  /**
   * Pausar servicio
   * @param {string} id - ID del servicio
   * @param {string} reason - Razón de la pausa
   * @returns {Promise<Object>}
   */
  async pauseService(id, reason = '') {
    if (this.isUsingMockData) {
      return mockServicesService.updateService(id, {
        status: 'PAUSED',
        pauseReason: reason,
        pausedAt: new Date().toISOString()
      });
    }

    return this.post(`/${id}/pause`, { reason });
  }

  /**
   * Reanudar servicio pausado
   * @param {string} id - ID del servicio
   * @returns {Promise<Object>}
   */
  async resumeService(id) {
    if (this.isUsingMockData) {
      return mockServicesService.updateServiceStatus(id, 'IN_SERVICE');
    }

    return this.post(`/${id}/resume`);
  }

  /**
   * Finalizar servicio
   * @param {string} id - ID del servicio
   * @param {Object} completionData - Datos de finalización
   * @returns {Promise<Object>}
   */
  async finishService(id, completionData = {}) {
    if (this.isUsingMockData) {
      return mockServicesService.updateService(id, {
        status: 'FINISHED',
        completedAt: new Date().toISOString(),
        ...completionData
      });
    }

    return this.post(`/${id}/finish`, completionData);
  }

  /**
   * Cancelar servicio
   * @param {string} id - ID del servicio
   * @param {string} reason - Razón de cancelación
   * @returns {Promise<Object>}
   */
  async cancelService(id, reason) {
    if (this.isUsingMockData) {
      return mockServicesService.updateService(id, {
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledAt: new Date().toISOString()
      });
    }

    return this.post(`/${id}/cancel`, { reason });
  }

  /**
   * Obtener historial de ubicaciones de un servicio
   * @param {string} id - ID del servicio
   * @returns {Promise<Object>}
   */
  async getLocationHistory(id) {
    if (this.isUsingMockData) {
      // Mock: generar historial simulado
      const service = await mockServicesService.getServiceById(id);
      if (!service.success) return service;

      const history = [];
      const startTime = new Date(service.data.createdAt);
      const now = new Date();
      const interval = 5 * 60 * 1000; // 5 minutos

      let currentTime = startTime;
      while (currentTime < now) {
        history.push({
          timestamp: currentTime.toISOString(),
          location: {
            lat: service.data.pickupCoordinates.lat + (Math.random() - 0.5) * 0.01,
            lng: service.data.pickupCoordinates.lng + (Math.random() - 0.5) * 0.01
          }
        });
        currentTime = new Date(currentTime.getTime() + interval);
      }

      return {
        success: true,
        data: history
      };
    }

    return this.get(`/${id}/location-history`);
  }

  /**
   * Asignar guía a servicio
   * @param {string} serviceId - ID del servicio
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async assignGuide(serviceId, guideId) {
    if (this.isUsingMockData) {
      // Mock: obtener datos del guía y actualizar servicio
      const guides = [
        { id: 'guide-001', name: 'Carlos Mendoza', phone: '+51 123456789' },
        { id: 'guide-002', name: 'Ana Rivera', phone: '+51 987654321' },
        { id: 'guide-003', name: 'Miguel Torres', phone: '+51 876543210' }
      ];

      const guide = guides.find(g => g.id === guideId) || guides[0];
      
      return mockServicesService.updateService(serviceId, {
        guide,
        assignedAt: new Date().toISOString()
      });
    }

    return this.post(`/${serviceId}/assign-guide`, { guideId });
  }

  /**
   * Obtener servicios por guía
   * @param {string} guideId - ID del guía
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getServicesByGuide(guideId, filters = {}) {
    if (this.isUsingMockData) {
      return mockServicesService.getServices({ ...filters, guideId });
    }

    return this.get(`/guide/${guideId}`, filters);
  }

  /**
   * Iniciar actualizaciones en tiempo real
   * @param {Function} callback - Función a ejecutar con las actualizaciones
   * @returns {number} ID del intervalo
   */
  startRealtimeUpdates(callback) {
    if (this.isUsingMockData) {
      this.realtimeInterval = mockServicesService.startRealtimeUpdates(callback);
      return this.realtimeInterval;
    }

    // En producción, esto sería una conexión WebSocket
    console.log('Realtime updates would be handled via WebSocket in production');
    return null;
  }

  /**
   * Detener actualizaciones en tiempo real
   */
  stopRealtimeUpdates() {
    if (this.realtimeInterval) {
      if (this.isUsingMockData) {
        mockServicesService.stopRealtimeUpdates(this.realtimeInterval);
      }
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
    if (this.isUsingMockData) {
      return {
        success: true,
        data: {
          alertId: `alert-${Date.now()}`,
          serviceId,
          ...emergencyData,
          sentAt: new Date().toISOString()
        }
      };
    }

    return this.post(`/${serviceId}/emergency`, emergencyData);
  }

  /**
   * Obtener ruta óptima para el servicio
   * @param {string} serviceId - ID del servicio
   * @returns {Promise<Object>}
   */
  async getOptimalRoute(serviceId) {
    if (this.isUsingMockData) {
      const service = await mockServicesService.getServiceById(serviceId);
      if (!service.success) return service;

      // Mock: generar ruta simple
      return {
        success: true,
        data: {
          distance: '5.2 km',
          duration: '15 minutos',
          polyline: 'encoded_polyline_string',
          steps: [
            { instruction: 'Dirígete hacia el norte por Av. Arequipa', distance: '2.1 km' },
            { instruction: 'Gira a la derecha en Av. Javier Prado', distance: '1.5 km' },
            { instruction: 'Continúa recto hasta el destino', distance: '1.6 km' }
          ]
        }
      };
    }

    return this.get(`/${serviceId}/route`);
  }
}

export const servicesService = new ServicesService();
export default servicesService;