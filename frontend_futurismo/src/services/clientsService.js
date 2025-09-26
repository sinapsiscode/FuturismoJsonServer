/**
 * Servicio de clientes
 * Maneja toda la lógica de clientes con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockClientsService } from './mockClientsService';

class ClientsService extends BaseService {
  constructor() {
    super('/clients');
  }

  /**
   * Obtener todos los clientes
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getClients(filters = {}) {
    if (this.isUsingMockData) {
      return mockClientsService.getClients(filters);
    }

    return this.get('', filters);
  }

  /**
   * Obtener cliente por ID
   * @param {string} id - ID del cliente
   * @returns {Promise<Object>}
   */
  async getClientById(id) {
    if (this.isUsingMockData) {
      return mockClientsService.getClientById(id);
    }

    return this.get(`/${id}`);
  }

  /**
   * Crear nuevo cliente
   * @param {Object} clientData - Datos del cliente
   * @returns {Promise<Object>}
   */
  async createClient(clientData) {
    if (this.isUsingMockData) {
      return mockClientsService.createClient(clientData);
    }

    return this.post('', clientData);
  }

  /**
   * Actualizar cliente
   * @param {string} id - ID del cliente
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateClient(id, updateData) {
    if (this.isUsingMockData) {
      return mockClientsService.updateClient(id, updateData);
    }

    return this.put(`/${id}`, updateData);
  }

  /**
   * Eliminar cliente
   * @param {string} id - ID del cliente
   * @returns {Promise<Object>}
   */
  async deleteClient(id) {
    if (this.isUsingMockData) {
      return mockClientsService.deleteClient(id);
    }

    return this.delete(`/${id}`);
  }

  /**
   * Cambiar estado del cliente
   * @param {string} id - ID del cliente
   * @returns {Promise<Object>}
   */
  async toggleClientStatus(id) {
    if (this.isUsingMockData) {
      return mockClientsService.toggleClientStatus(id);
    }

    return this.put(`/${id}/toggle-status`);
  }

  /**
   * Obtener tipos de cliente
   * @returns {Promise<Object>}
   */
  async getClientTypes() {
    if (this.isUsingMockData) {
      return mockClientsService.getClientTypes();
    }

    return this.get('/types');
  }

  /**
   * Obtener estadísticas de clientes
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    if (this.isUsingMockData) {
      return mockClientsService.getStatistics();
    }

    return this.get('/statistics');
  }

  /**
   * Obtener historial de reservas del cliente
   * @param {string} clientId - ID del cliente
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getClientBookings(clientId, filters = {}) {
    if (this.isUsingMockData) {
      return mockClientsService.getClientBookings(clientId, filters);
    }

    return this.get(`/${clientId}/bookings`, filters);
  }

  /**
   * Actualizar crédito del cliente
   * @param {string} id - ID del cliente
   * @param {Object} creditData - Datos del crédito
   * @returns {Promise<Object>}
   */
  async updateClientCredit(id, creditData) {
    if (this.isUsingMockData) {
      return mockClientsService.updateClientCredit(id, creditData);
    }

    return this.put(`/${id}/credit`, creditData);
  }

  /**
   * Registrar nueva reserva para el cliente
   * @param {string} clientId - ID del cliente
   * @param {number} amount - Monto de la reserva
   * @returns {Promise<Object>}
   */
  async registerBooking(clientId, amount) {
    if (this.isUsingMockData) {
      return mockClientsService.registerBooking(clientId, amount);
    }

    return this.post(`/${clientId}/booking`, { amount });
  }

  /**
   * Buscar clientes por tipo de preferencia
   * @param {string} preference - Preferencia a buscar
   * @returns {Promise<Object>}
   */
  async getClientsByPreference(preference) {
    if (this.isUsingMockData) {
      return mockClientsService.getClientsByPreference(preference);
    }

    return this.get('/by-preference', { preference });
  }

  /**
   * Validar RUC del cliente
   * @param {string} ruc - RUC a validar
   * @returns {Promise<Object>}
   */
  async validateRUC(ruc) {
    if (this.isUsingMockData) {
      // Mock: validación simple
      return {
        success: true,
        data: {
          valid: ruc.length === 11 && /^\d+$/.test(ruc),
          exists: this.clients?.some(c => c.ruc === ruc) || false
        }
      };
    }

    return this.post('/validate-ruc', { ruc });
  }

  /**
   * Obtener clientes con crédito disponible
   * @returns {Promise<Object>}
   */
  async getClientsWithCredit() {
    if (this.isUsingMockData) {
      return mockClientsService.getClients({
        type: 'agency',
        hasCredit: true
      });
    }

    return this.get('/with-credit');
  }

  /**
   * Exportar clientes
   * @param {Object} filters - Filtros para exportación
   * @returns {Promise<Blob>}
   */
  async exportClients(filters = {}) {
    if (this.isUsingMockData) {
      // Mock: generar CSV simulado
      const clients = await mockClientsService.getClients(filters);
      const csv = this.generateCSV(clients.data);
      return new Blob([csv], { type: 'text/csv' });
    }

    const response = await this.get('/export', filters, {
      responseType: 'blob'
    });

    return response.data;
  }

  // Método auxiliar para generar CSV
  generateCSV(clients) {
    const headers = ['Nombre', 'Tipo', 'Email', 'Teléfono', 'Estado', 'Total Reservas', 'Total Ingresos'];
    const rows = clients.map(client => [
      client.name,
      client.type,
      client.email,
      client.phone,
      client.status,
      client.totalBookings,
      client.totalRevenue
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Importar clientes desde archivo
   * @param {File} file - Archivo a importar
   * @returns {Promise<Object>}
   */
  async importClients(file) {
    if (this.isUsingMockData) {
      // Mock: simular importación exitosa
      return {
        success: true,
        data: {
          imported: 3,
          failed: 0,
          errors: []
        }
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    
    return this.post('/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Fusionar clientes duplicados
   * @param {string} primaryId - ID del cliente principal
   * @param {string} secondaryId - ID del cliente a fusionar
   * @returns {Promise<Object>}
   */
  async mergeClients(primaryId, secondaryId) {
    if (this.isUsingMockData) {
      // Mock: simular fusión
      const primary = await mockClientsService.getClientById(primaryId);
      const secondary = await mockClientsService.getClientById(secondaryId);
      
      if (!primary.success || !secondary.success) {
        return {
          success: false,
          error: 'Uno o ambos clientes no encontrados'
        };
      }
      
      // Actualizar cliente principal con datos combinados
      const merged = {
        totalBookings: primary.data.totalBookings + secondary.data.totalBookings,
        totalRevenue: primary.data.totalRevenue + secondary.data.totalRevenue
      };
      
      await mockClientsService.updateClient(primaryId, merged);
      await mockClientsService.deleteClient(secondaryId);
      
      return {
        success: true,
        data: { ...primary.data, ...merged }
      };
    }

    return this.post('/merge', { primaryId, secondaryId });
  }
}

export const clientsService = new ClientsService();
export default clientsService;