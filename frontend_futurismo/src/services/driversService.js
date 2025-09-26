/**
 * Servicio para la gestión de choferes
 */

import BaseService from './BaseService';
import mockDriversService from './mockDriversService';
import { APP_CONFIG } from '../config/app.config';

class DriversService extends BaseService {
  constructor() {
    super('/drivers');
  }

  /**
   * Obtener lista de choferes
   * @param {Object} params - Parámetros de búsqueda y paginación
   * @returns {Promise<Object>}
   */
  async getDrivers(params = {}) {
    if (this.isUsingMockData) {
      return mockDriversService.getDrivers(params);
    }
    return this.get('', params);
  }

  /**
   * Obtener un chofer por ID
   * @param {string} id - ID del chofer
   * @returns {Promise<Object>}
   */
  async getDriverById(id) {
    if (this.isUsingMockData) {
      return mockDriversService.getDriverById(id);
    }
    return this.get(`/${id}`);
  }

  /**
   * Crear un nuevo chofer
   * @param {Object} driverData - Datos del chofer
   * @returns {Promise<Object>}
   */
  async createDriver(driverData) {
    if (this.isUsingMockData) {
      return mockDriversService.createDriver(driverData);
    }
    return this.post('', driverData);
  }

  /**
   * Actualizar un chofer
   * @param {string} id - ID del chofer
   * @param {Object} driverData - Datos actualizados
   * @returns {Promise<Object>}
   */
  async updateDriver(id, driverData) {
    if (this.isUsingMockData) {
      return mockDriversService.updateDriver(id, driverData);
    }
    return this.put(`/${id}`, driverData);
  }

  /**
   * Eliminar un chofer
   * @param {string} id - ID del chofer
   * @returns {Promise<Object>}
   */
  async deleteDriver(id) {
    if (this.isUsingMockData) {
      return mockDriversService.deleteDriver(id);
    }
    return this.delete(`/${id}`);
  }

  /**
   * Verificar disponibilidad de un chofer
   * @param {string} driverId - ID del chofer
   * @param {string} date - Fecha a verificar
   * @param {number} duration - Duración en horas
   * @returns {Promise<Object>}
   */
  async checkAvailability(driverId, date, duration = 8) {
    if (this.isUsingMockData) {
      return mockDriversService.checkAvailability(driverId, date, duration);
    }
    return this.post(`/${driverId}/availability`, { date, duration });
  }

  /**
   * Obtener choferes disponibles para una fecha
   * @param {string} date - Fecha
   * @param {string} vehicleType - Tipo de vehículo (opcional)
   * @returns {Promise<Object>}
   */
  async getAvailableDrivers(date, vehicleType = null) {
    if (this.isUsingMockData) {
      return mockDriversService.getAvailableDrivers(date, vehicleType);
    }
    return this.get('/available', { date, vehicleType });
  }

  /**
   * Asignar chofer a un tour/servicio
   * @param {string} driverId - ID del chofer
   * @param {Object} assignmentData - Datos de la asignación
   * @returns {Promise<Object>}
   */
  async assignDriver(driverId, assignmentData) {
    if (this.isUsingMockData) {
      return mockDriversService.assignDriver(driverId, assignmentData);
    }
    return this.post(`/${driverId}/assignments`, assignmentData);
  }

  /**
   * Obtener estadísticas de choferes
   * @returns {Promise<Object>}
   */
  async getDriversStatistics() {
    if (this.isUsingMockData) {
      return mockDriversService.getDriversStatistics();
    }
    return this.get('/statistics');
  }

  /**
   * Actualizar documentos del chofer
   * @param {string} driverId - ID del chofer
   * @param {Object} documents - Documentos actualizados
   * @returns {Promise<Object>}
   */
  async updateDocuments(driverId, documents) {
    if (this.isUsingMockData) {
      return mockDriversService.updateDriver(driverId, { documents });
    }
    return this.patch(`/${driverId}/documents`, documents);
  }

  /**
   * Obtener historial de asignaciones
   * @param {string} driverId - ID del chofer
   * @param {Object} params - Parámetros de búsqueda
   * @returns {Promise<Object>}
   */
  async getAssignmentHistory(driverId, params = {}) {
    if (this.isUsingMockData) {
      // En mock, retornamos las asignaciones actuales
      const driver = await mockDriversService.getDriverById(driverId);
      if (driver.success) {
        return {
          success: true,
          data: driver.data.currentAssignments || []
        };
      }
      return driver;
    }
    return this.get(`/${driverId}/assignments`, params);
  }

  /**
   * Subir foto del chofer
   * @param {string} driverId - ID del chofer
   * @param {File} file - Archivo de imagen
   * @param {Function} onProgress - Callback de progreso
   * @returns {Promise<Object>}
   */
  async uploadPhoto(driverId, file, onProgress) {
    if (this.isUsingMockData) {
      // Simular upload en mock
      return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          if (onProgress) onProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            resolve({
              success: true,
              data: {
                photoUrl: URL.createObjectURL(file)
              }
            });
          }
        }, 200);
      });
    }
    return this.upload(`/${driverId}/photo`, file, onProgress);
  }
}

export default new DriversService();