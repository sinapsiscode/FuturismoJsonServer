/**
 * Servicio para la gestión de vehículos
 */

import BaseService from './BaseService';
import mockVehiclesService from './mockVehiclesService';
import { APP_CONFIG } from '../config/app.config';

class VehiclesService extends BaseService {
  constructor() {
    super('/vehicles');
  }

  /**
   * Obtener lista de vehículos
   * @param {Object} params - Parámetros de búsqueda y paginación
   * @returns {Promise<Object>}
   */
  async getVehicles(params = {}) {
    if (this.isUsingMockData) {
      return mockVehiclesService.getVehicles(params);
    }
    return this.get('', params);
  }

  /**
   * Obtener un vehículo por ID
   * @param {string} id - ID del vehículo
   * @returns {Promise<Object>}
   */
  async getVehicleById(id) {
    if (this.isUsingMockData) {
      return mockVehiclesService.getVehicleById(id);
    }
    return this.get(`/${id}`);
  }

  /**
   * Crear un nuevo vehículo
   * @param {Object} vehicleData - Datos del vehículo
   * @returns {Promise<Object>}
   */
  async createVehicle(vehicleData) {
    if (this.isUsingMockData) {
      return mockVehiclesService.createVehicle(vehicleData);
    }
    return this.post('', vehicleData);
  }

  /**
   * Actualizar un vehículo
   * @param {string} id - ID del vehículo
   * @param {Object} vehicleData - Datos actualizados
   * @returns {Promise<Object>}
   */
  async updateVehicle(id, vehicleData) {
    if (this.isUsingMockData) {
      return mockVehiclesService.updateVehicle(id, vehicleData);
    }
    return this.put(`/${id}`, vehicleData);
  }

  /**
   * Eliminar un vehículo
   * @param {string} id - ID del vehículo
   * @returns {Promise<Object>}
   */
  async deleteVehicle(id) {
    if (this.isUsingMockData) {
      return mockVehiclesService.deleteVehicle(id);
    }
    return this.delete(`/${id}`);
  }

  /**
   * Verificar disponibilidad de un vehículo
   * @param {string} vehicleId - ID del vehículo
   * @param {string} date - Fecha a verificar
   * @param {number} passengers - Número de pasajeros
   * @returns {Promise<Object>}
   */
  async checkAvailability(vehicleId, date, passengers = 1) {
    if (this.isUsingMockData) {
      return mockVehiclesService.checkAvailability(vehicleId, date, passengers);
    }
    return this.post(`/${vehicleId}/availability`, { date, passengers });
  }

  /**
   * Obtener vehículos disponibles para una fecha
   * @param {string} date - Fecha
   * @param {number} minCapacity - Capacidad mínima requerida
   * @param {string} vehicleType - Tipo de vehículo (opcional)
   * @returns {Promise<Object>}
   */
  async getAvailableVehicles(date, minCapacity = 1, vehicleType = null) {
    if (this.isUsingMockData) {
      return mockVehiclesService.getAvailableVehicles(date, minCapacity, vehicleType);
    }
    return this.get('/available', { date, minCapacity, vehicleType });
  }

  /**
   * Asignar vehículo a un tour/servicio
   * @param {string} vehicleId - ID del vehículo
   * @param {Object} assignmentData - Datos de la asignación
   * @returns {Promise<Object>}
   */
  async assignVehicle(vehicleId, assignmentData) {
    if (this.isUsingMockData) {
      return mockVehiclesService.assignVehicle(vehicleId, assignmentData);
    }
    return this.post(`/${vehicleId}/assignments`, assignmentData);
  }

  /**
   * Registrar mantenimiento
   * @param {string} vehicleId - ID del vehículo
   * @param {Object} maintenanceData - Datos del mantenimiento
   * @returns {Promise<Object>}
   */
  async registerMaintenance(vehicleId, maintenanceData) {
    if (this.isUsingMockData) {
      return mockVehiclesService.registerMaintenance(vehicleId, maintenanceData);
    }
    return this.post(`/${vehicleId}/maintenance`, maintenanceData);
  }

  /**
   * Obtener estadísticas de vehículos
   * @returns {Promise<Object>}
   */
  async getVehiclesStatistics() {
    if (this.isUsingMockData) {
      return mockVehiclesService.getVehiclesStatistics();
    }
    return this.get('/statistics');
  }

  /**
   * Obtener vehículos que requieren mantenimiento
   * @returns {Promise<Object>}
   */
  async getMaintenanceRequired() {
    if (this.isUsingMockData) {
      return mockVehiclesService.getMaintenanceRequired();
    }
    return this.get('/maintenance-required');
  }

  /**
   * Actualizar documentos del vehículo
   * @param {string} vehicleId - ID del vehículo
   * @param {Object} documents - Documentos actualizados
   * @returns {Promise<Object>}
   */
  async updateDocuments(vehicleId, documents) {
    if (this.isUsingMockData) {
      return mockVehiclesService.updateVehicle(vehicleId, { documents });
    }
    return this.patch(`/${vehicleId}/documents`, documents);
  }

  /**
   * Obtener historial de mantenimiento
   * @param {string} vehicleId - ID del vehículo
   * @param {Object} params - Parámetros de búsqueda
   * @returns {Promise<Object>}
   */
  async getMaintenanceHistory(vehicleId, params = {}) {
    if (this.isUsingMockData) {
      // En mock, retornamos el historial del vehículo
      const vehicle = await mockVehiclesService.getVehicleById(vehicleId);
      if (vehicle.success) {
        return {
          success: true,
          data: vehicle.data.maintenanceHistory || []
        };
      }
      return vehicle;
    }
    return this.get(`/${vehicleId}/maintenance`, params);
  }

  /**
   * Obtener historial de asignaciones
   * @param {string} vehicleId - ID del vehículo
   * @param {Object} params - Parámetros de búsqueda
   * @returns {Promise<Object>}
   */
  async getAssignmentHistory(vehicleId, params = {}) {
    if (this.isUsingMockData) {
      // En mock, retornamos las asignaciones actuales
      const vehicle = await mockVehiclesService.getVehicleById(vehicleId);
      if (vehicle.success) {
        return {
          success: true,
          data: vehicle.data.currentAssignments || []
        };
      }
      return vehicle;
    }
    return this.get(`/${vehicleId}/assignments`, params);
  }

  /**
   * Subir fotos del vehículo
   * @param {string} vehicleId - ID del vehículo
   * @param {string} photoType - Tipo de foto (exterior, interior, documents)
   * @param {File} file - Archivo de imagen
   * @param {Function} onProgress - Callback de progreso
   * @returns {Promise<Object>}
   */
  async uploadPhoto(vehicleId, photoType, file, onProgress) {
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
                photoUrl: URL.createObjectURL(file),
                photoType
              }
            });
          }
        }, 200);
      });
    }
    
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('photoType', photoType);
    
    return this.upload(`/${vehicleId}/photos`, formData, onProgress);
  }

  /**
   * Generar reporte de vehículo
   * @param {string} vehicleId - ID del vehículo
   * @param {string} reportType - Tipo de reporte
   * @returns {Promise<Object>}
   */
  async generateReport(vehicleId, reportType = 'full') {
    if (this.isUsingMockData) {
      // En mock, simulamos la generación del reporte
      return {
        success: true,
        data: {
          reportUrl: `/reports/vehicles/${vehicleId}_${reportType}_${Date.now()}.pdf`
        }
      };
    }
    return this.post(`/${vehicleId}/reports`, { reportType });
  }
}

export default new VehiclesService();