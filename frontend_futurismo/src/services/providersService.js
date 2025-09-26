/**
 * Servicio de proveedores
 * Maneja toda la lógica de proveedores con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockProvidersService } from './mockProvidersService';

class ProvidersService extends BaseService {
  constructor() {
    super('/providers');
  }

  /**
   * Obtener todas las ubicaciones
   * @returns {Promise<Object>}
   */
  async getLocations() {
    if (this.isUsingMockData) {
      return mockProvidersService.getLocations();
    }

    return this.get('/locations');
  }

  /**
   * Obtener todas las categorías
   * @returns {Promise<Object>}
   */
  async getCategories() {
    if (this.isUsingMockData) {
      return mockProvidersService.getCategories();
    }

    return this.get('/categories');
  }

  /**
   * Obtener todos los proveedores
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getProviders(filters = {}) {
    if (this.isUsingMockData) {
      return mockProvidersService.getProviders(filters);
    }

    return this.get('', filters);
  }

  /**
   * Obtener proveedor por ID
   * @param {string} id - ID del proveedor
   * @returns {Promise<Object>}
   */
  async getProviderById(id) {
    if (this.isUsingMockData) {
      return mockProvidersService.getProviderById(id);
    }

    return this.get(`/${id}`);
  }

  /**
   * Crear nuevo proveedor
   * @param {Object} providerData - Datos del proveedor
   * @returns {Promise<Object>}
   */
  async createProvider(providerData) {
    if (this.isUsingMockData) {
      return mockProvidersService.createProvider(providerData);
    }

    return this.post('', providerData);
  }

  /**
   * Actualizar proveedor
   * @param {string} id - ID del proveedor
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateProvider(id, updateData) {
    if (this.isUsingMockData) {
      return mockProvidersService.updateProvider(id, updateData);
    }

    return this.put(`/${id}`, updateData);
  }

  /**
   * Eliminar proveedor (soft delete)
   * @param {string} id - ID del proveedor
   * @returns {Promise<Object>}
   */
  async deleteProvider(id) {
    if (this.isUsingMockData) {
      return mockProvidersService.deleteProvider(id);
    }

    return this.delete(`/${id}`);
  }

  /**
   * Cambiar estado del proveedor
   * @param {string} id - ID del proveedor
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>}
   */
  async toggleProviderStatus(id, status) {
    if (this.isUsingMockData) {
      return mockProvidersService.toggleProviderStatus(id, status);
    }

    return this.patch(`/${id}/status`, { status });
  }

  /**
   * Buscar proveedores
   * @param {string} query - Término de búsqueda
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise<Object>}
   */
  async searchProviders(query, filters = {}) {
    if (this.isUsingMockData) {
      return mockProvidersService.searchProviders(query, filters);
    }

    return this.get('/search', { q: query, ...filters });
  }

  /**
   * Obtener proveedores por ubicación y categoría
   * @param {string} locationId - ID de la ubicación
   * @param {string} categoryId - ID de la categoría (opcional)
   * @returns {Promise<Object>}
   */
  async getProvidersByLocationAndCategory(locationId, categoryId = null) {
    if (this.isUsingMockData) {
      return mockProvidersService.getProvidersByLocationAndCategory(locationId, categoryId);
    }

    const params = { location: locationId };
    if (categoryId) {
      params.category = categoryId;
    }

    return this.get('', params);
  }

  /**
   * Obtener asignaciones
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getAssignments(filters = {}) {
    if (this.isUsingMockData) {
      return mockProvidersService.getAssignments(filters);
    }

    return this.get('/assignments', filters);
  }

  /**
   * Obtener asignación por ID
   * @param {string} id - ID de la asignación
   * @returns {Promise<Object>}
   */
  async getAssignmentById(id) {
    if (this.isUsingMockData) {
      return mockProvidersService.getAssignmentById(id);
    }

    return this.get(`/assignments/${id}`);
  }

  /**
   * Crear nueva asignación
   * @param {Object} assignmentData - Datos de la asignación
   * @returns {Promise<Object>}
   */
  async createAssignment(assignmentData) {
    if (this.isUsingMockData) {
      return mockProvidersService.createAssignment(assignmentData);
    }

    return this.post('/assignments', assignmentData);
  }

  /**
   * Actualizar asignación
   * @param {string} id - ID de la asignación
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateAssignment(id, updateData) {
    if (this.isUsingMockData) {
      return mockProvidersService.updateAssignment(id, updateData);
    }

    return this.put(`/assignments/${id}`, updateData);
  }

  /**
   * Confirmar asignación
   * @param {string} id - ID de la asignación
   * @returns {Promise<Object>}
   */
  async confirmAssignment(id) {
    if (this.isUsingMockData) {
      return mockProvidersService.confirmAssignment(id);
    }

    return this.post(`/assignments/${id}/confirm`);
  }

  /**
   * Cancelar asignación
   * @param {string} id - ID de la asignación
   * @param {string} reason - Razón de cancelación
   * @returns {Promise<Object>}
   */
  async cancelAssignment(id, reason = '') {
    if (this.isUsingMockData) {
      return mockProvidersService.cancelAssignment(id, reason);
    }

    return this.post(`/assignments/${id}/cancel`, { reason });
  }

  /**
   * Verificar disponibilidad de proveedor
   * @param {string} providerId - ID del proveedor
   * @param {string} date - Fecha
   * @param {string} startTime - Hora de inicio
   * @param {string} endTime - Hora de fin
   * @returns {Promise<Object>}
   */
  async checkProviderAvailability(providerId, date, startTime, endTime) {
    if (this.isUsingMockData) {
      return mockProvidersService.checkProviderAvailability(providerId, date, startTime, endTime);
    }

    return this.post(`/${providerId}/check-availability`, {
      date,
      startTime,
      endTime
    });
  }

  /**
   * Obtener estadísticas de proveedores
   * @returns {Promise<Object>}
   */
  async getProvidersStats() {
    if (this.isUsingMockData) {
      return mockProvidersService.getProvidersStats();
    }

    return this.get('/stats');
  }

  /**
   * Exportar asignación como PDF
   * @param {string} assignmentId - ID de la asignación
   * @returns {Promise<Object>}
   */
  async exportAssignmentPDF(assignmentId) {
    if (this.isUsingMockData) {
      return mockProvidersService.exportAssignmentPDF(assignmentId);
    }

    const filename = `assignment_${assignmentId}_${new Date().toISOString().split('T')[0]}.pdf`;
    return this.download(`/assignments/${assignmentId}/export/pdf`, filename);
  }

  /**
   * Importar proveedores desde archivo
   * @param {File} file - Archivo a importar
   * @param {Function} onProgress - Callback de progreso
   * @returns {Promise<Object>}
   */
  async importProviders(file, onProgress = null) {
    if (this.isUsingMockData) {
      return mockProvidersService.importProviders(file);
    }

    return this.upload('/import', file, onProgress);
  }

  /**
   * Exportar proveedores
   * @param {Object} filters - Filtros de exportación
   * @param {string} format - Formato de exportación (csv, excel, pdf)
   * @returns {Promise<Object>}
   */
  async exportProviders(filters = {}, format = 'excel') {
    if (this.isUsingMockData) {
      return mockProvidersService.exportProviders(filters, format);
    }

    const filename = `providers_${new Date().toISOString().split('T')[0]}.${format}`;
    return this.download('/export', filename, { ...filters, format });
  }

  /**
   * Calificar proveedor
   * @param {string} providerId - ID del proveedor
   * @param {Object} ratingData - Datos de calificación
   * @returns {Promise<Object>}
   */
  async rateProvider(providerId, ratingData) {
    if (this.isUsingMockData) {
      // Mock: actualizar rating del proveedor
      const provider = await mockProvidersService.getProviderById(providerId);
      if (provider.success) {
        const currentRating = provider.data.rating || 0;
        const newRating = (currentRating + ratingData.rating) / 2;
        return mockProvidersService.updateProvider(providerId, { rating: newRating });
      }
      return provider;
    }

    return this.post(`/${providerId}/rate`, ratingData);
  }

  /**
   * Obtener historial de asignaciones de un proveedor
   * @param {string} providerId - ID del proveedor
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getProviderAssignmentHistory(providerId, filters = {}) {
    if (this.isUsingMockData) {
      const allAssignments = await mockProvidersService.getAssignments(filters);
      if (allAssignments.success) {
        const providerAssignments = allAssignments.data.assignments.filter(a =>
          a.providers.some(p => p.providerId === providerId)
        );
        return {
          success: true,
          data: {
            assignments: providerAssignments,
            total: providerAssignments.length
          }
        };
      }
      return allAssignments;
    }

    return this.get(`/${providerId}/assignments`, filters);
  }

  /**
   * Clonar proveedor
   * @param {string} providerId - ID del proveedor a clonar
   * @param {Object} overrides - Datos a sobrescribir
   * @returns {Promise<Object>}
   */
  async cloneProvider(providerId, overrides = {}) {
    if (this.isUsingMockData) {
      const provider = await mockProvidersService.getProviderById(providerId);
      if (provider.success) {
        const clonedData = {
          ...provider.data,
          ...overrides,
          name: overrides.name || `${provider.data.name} (Copia)`,
          id: undefined
        };
        delete clonedData.id;
        delete clonedData.createdAt;
        delete clonedData.updatedAt;
        return mockProvidersService.createProvider(clonedData);
      }
      return provider;
    }

    return this.post(`/${providerId}/clone`, overrides);
  }
}

export const providersService = new ProvidersService();
export default providersService;