/**
 * Servicio de monitoreo
 * Maneja el monitoreo en tiempo real de tours, fotos y actividad
 */

import BaseService from './baseService';

class MonitoringService extends BaseService {
  constructor() {
    super('/monitoring');
  }

  /**
   * Obtener fotos de tours
   * @param {Object} filters - Filtros opcionales
   * @param {string} filters.date - Fecha (YYYY-MM-DD)
   * @param {string} filters.guideId - ID del guía
   * @param {string} filters.tourId - ID del tour
   * @param {string} filters.agencyId - ID de la agencia
   * @returns {Promise<Object>}
   */
  async getPhotos(filters = {}) {
    const params = {};
    if (filters.date) params.date = filters.date;
    if (filters.guideId) params.guideId = filters.guideId;
    if (filters.tourId) params.tourId = filters.tourId;
    if (filters.agencyId) params.agencyId = filters.agencyId;

    return this.get('/photos', params);
  }

  /**
   * Subir nueva foto de tour
   * @param {Object} photoData - Datos de la foto
   * @param {string} photoData.tourId - ID del tour
   * @param {string} photoData.guideId - ID del guía
   * @param {string} photoData.photoUrl - URL de la foto
   * @param {string} photoData.stopName - Nombre del punto de control
   * @param {string} photoData.comment - Comentario opcional
   * @returns {Promise<Object>}
   */
  async uploadPhoto(photoData) {
    return this.post('/photos', photoData);
  }

  /**
   * Eliminar foto de tour
   * @param {string} photoId - ID de la foto
   * @returns {Promise<Object>}
   */
  async deletePhoto(photoId) {
    return this.delete(`/photos/${photoId}`);
  }

  /**
   * Obtener tours activos en tiempo real
   * @returns {Promise<Object>}
   */
  async getActiveTours() {
    return this.get('/active-tours');
  }
}

export default new MonitoringService();
