/**
 * Servicio de marketplace
 * Maneja toda la lógica del marketplace de guías con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockMarketplaceService } from './mockMarketplaceService';

class MarketplaceService extends BaseService {
  constructor() {
    super('/marketplace');
  }

  /**
   * Obtener guías freelance disponibles
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Object>}
   */
  async getFreelanceGuides(filters = {}) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.getFreelanceGuides(filters);
    }

    return this.get('/guides', filters);
  }

  /**
   * Obtener perfil completo de un guía
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async getGuideProfile(guideId) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.getGuideProfile(guideId);
    }

    return this.get(`/guides/${guideId}`);
  }

  /**
   * Obtener disponibilidad de un guía
   * @param {string} guideId - ID del guía
   * @param {Object} params - { startDate, endDate }
   * @returns {Promise<Object>}
   */
  async getGuideAvailability(guideId, params = {}) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.getGuideAvailability(guideId, params);
    }

    return this.get(`/guides/${guideId}/availability`, params);
  }

  /**
   * Actualizar disponibilidad de un guía
   * @param {string} guideId - ID del guía
   * @param {Object} availability - Datos de disponibilidad
   * @returns {Promise<Object>}
   */
  async updateGuideAvailability(guideId, availability) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.updateGuideAvailability(guideId, availability);
    }

    return this.put(`/guides/${guideId}/availability`, availability);
  }

  /**
   * Obtener reseñas de un guía
   * @param {string} guideId - ID del guía
   * @param {Object} params - Parámetros de paginación
   * @returns {Promise<Object>}
   */
  async getGuideReviews(guideId, params = {}) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.getGuideReviews(guideId, params);
    }

    return this.get(`/guides/${guideId}/reviews`, params);
  }

  /**
   * Crear solicitud de servicio
   * @param {Object} requestData - Datos de la solicitud
   * @returns {Promise<Object>}
   */
  async createServiceRequest(requestData) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.createServiceRequest(requestData);
    }

    return this.post('/service-requests', requestData);
  }

  /**
   * Obtener solicitudes de servicio
   * @param {Object} filters - Filtros
   * @returns {Promise<Object>}
   */
  async getServiceRequests(filters = {}) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.getServiceRequests(filters);
    }

    return this.get('/service-requests', filters);
  }

  /**
   * Obtener solicitud de servicio por ID
   * @param {string} requestId - ID de la solicitud
   * @returns {Promise<Object>}
   */
  async getServiceRequestById(requestId) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.getServiceRequestById(requestId);
    }

    return this.get(`/service-requests/${requestId}`);
  }

  /**
   * Actualizar solicitud de servicio
   * @param {string} requestId - ID de la solicitud
   * @param {Object} updates - Actualizaciones
   * @returns {Promise<Object>}
   */
  async updateServiceRequest(requestId, updates) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.updateServiceRequest(requestId, updates);
    }

    return this.patch(`/service-requests/${requestId}`, updates);
  }

  /**
   * Responder a solicitud de servicio (guía)
   * @param {string} requestId - ID de la solicitud
   * @param {Object} response - { accepted, message, proposedRate }
   * @returns {Promise<Object>}
   */
  async respondToServiceRequest(requestId, response) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.respondToServiceRequest(requestId, response);
    }

    return this.post(`/service-requests/${requestId}/respond`, response);
  }

  /**
   * Cancelar solicitud de servicio
   * @param {string} requestId - ID de la solicitud
   * @param {string} reason - Razón de cancelación
   * @returns {Promise<Object>}
   */
  async cancelServiceRequest(requestId, reason) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.cancelServiceRequest(requestId, reason);
    }

    return this.post(`/service-requests/${requestId}/cancel`, { reason });
  }

  /**
   * Completar servicio
   * @param {string} requestId - ID de la solicitud
   * @param {Object} completionData - Datos de finalización
   * @returns {Promise<Object>}
   */
  async completeService(requestId, completionData) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.completeService(requestId, completionData);
    }

    return this.post(`/service-requests/${requestId}/complete`, completionData);
  }

  /**
   * Crear reseña
   * @param {Object} reviewData - Datos de la reseña
   * @returns {Promise<Object>}
   */
  async createReview(reviewData) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.createReview(reviewData);
    }

    return this.post('/reviews', reviewData);
  }

  /**
   * Responder a reseña (guía)
   * @param {string} reviewId - ID de la reseña
   * @param {string} response - Respuesta del guía
   * @returns {Promise<Object>}
   */
  async respondToReview(reviewId, response) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.respondToReview(reviewId, response);
    }

    return this.post(`/reviews/${reviewId}/respond`, { response });
  }

  /**
   * Marcar reseña como útil
   * @param {string} reviewId - ID de la reseña
   * @returns {Promise<Object>}
   */
  async markReviewHelpful(reviewId) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.markReviewHelpful(reviewId);
    }

    return this.post(`/reviews/${reviewId}/helpful`);
  }

  /**
   * Obtener estadísticas del marketplace
   * @returns {Promise<Object>}
   */
  async getMarketplaceStats() {
    if (this.isUsingMockData) {
      return mockMarketplaceService.getMarketplaceStats();
    }

    return this.get('/stats');
  }

  /**
   * Obtener estadísticas de un guía
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async getGuideStats(guideId) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.getGuideStats(guideId);
    }

    return this.get(`/guides/${guideId}/stats`);
  }

  /**
   * Actualizar perfil de marketplace del guía
   * @param {string} guideId - ID del guía
   * @param {Object} profileData - Datos del perfil
   * @returns {Promise<Object>}
   */
  async updateGuideMarketplaceProfile(guideId, profileData) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.updateGuideMarketplaceProfile(guideId, profileData);
    }

    return this.put(`/guides/${guideId}/profile`, profileData);
  }

  /**
   * Actualizar tarifas del guía
   * @param {string} guideId - ID del guía
   * @param {Object} pricing - Datos de tarifas
   * @returns {Promise<Object>}
   */
  async updateGuidePricing(guideId, pricing) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.updateGuidePricing(guideId, pricing);
    }

    return this.put(`/guides/${guideId}/pricing`, pricing);
  }

  /**
   * Verificar guía
   * @param {string} guideId - ID del guía
   * @param {Object} verificationData - Datos de verificación
   * @returns {Promise<Object>}
   */
  async verifyGuide(guideId, verificationData) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.verifyGuide(guideId, verificationData);
    }

    return this.post(`/guides/${guideId}/verify`, verificationData);
  }

  /**
   * Suspender guía del marketplace
   * @param {string} guideId - ID del guía
   * @param {Object} suspensionData - { reason, until }
   * @returns {Promise<Object>}
   */
  async suspendGuide(guideId, suspensionData) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.suspendGuide(guideId, suspensionData);
    }

    return this.post(`/guides/${guideId}/suspend`, suspensionData);
  }

  /**
   * Reactivar guía en marketplace
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async reactivateGuide(guideId) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.reactivateGuide(guideId);
    }

    return this.post(`/guides/${guideId}/reactivate`);
  }

  /**
   * Obtener guías destacados
   * @returns {Promise<Object>}
   */
  async getFeaturedGuides() {
    if (this.isUsingMockData) {
      return mockMarketplaceService.getFeaturedGuides();
    }

    return this.get('/guides/featured');
  }

  /**
   * Buscar guías por competencias
   * @param {Object} requirements - { museums, languages, tourTypes, etc }
   * @returns {Promise<Object>}
   */
  async searchGuidesByCompetencies(requirements) {
    if (this.isUsingMockData) {
      return mockMarketplaceService.searchGuidesByCompetencies(requirements);
    }

    return this.post('/guides/search-competencies', requirements);
  }
}

export const marketplaceService = new MarketplaceService();
export default marketplaceService;