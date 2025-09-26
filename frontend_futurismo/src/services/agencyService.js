/**
 * Servicio de agencias
 * Maneja toda la lógica de agencias con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockAgencyService } from './mockAgencyService';

class AgencyService extends BaseService {
  constructor() {
    super('/agencies');
  }

  /**
   * Obtener todas las agencias
   * @returns {Promise<Object>}
   */
  async getAgencies() {
    if (this.isUsingMockData) {
      return mockAgencyService.getAgencies();
    }

    return this.get('');
  }

  /**
   * Obtener agencia por ID
   * @param {string} id - ID de la agencia
   * @returns {Promise<Object>}
   */
  async getAgencyById(id) {
    if (this.isUsingMockData) {
      return mockAgencyService.getAgencyById(id);
    }

    return this.get(`/${id}`);
  }

  /**
   * Actualizar datos de agencia
   * @param {string} id - ID de la agencia
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateAgency(id, updateData) {
    if (this.isUsingMockData) {
      return mockAgencyService.updateAgency(id, updateData);
    }

    return this.put(`/${id}`, updateData);
  }

  /**
   * Obtener reservaciones de una agencia
   * @param {string} agencyId - ID de la agencia
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getReservations(agencyId, filters = {}) {
    if (this.isUsingMockData) {
      return mockAgencyService.getReservations(agencyId, filters);
    }

    return this.get(`/${agencyId}/reservations`, filters);
  }

  /**
   * Obtener reservación por ID
   * @param {string} id - ID de la reservación
   * @returns {Promise<Object>}
   */
  async getReservationById(id) {
    if (this.isUsingMockData) {
      return mockAgencyService.getReservationById(id);
    }

    return this.get(`/reservations/${id}`);
  }

  /**
   * Crear nueva reservación
   * @param {Object} reservationData - Datos de la reservación
   * @returns {Promise<Object>}
   */
  async createReservation(reservationData) {
    if (this.isUsingMockData) {
      return mockAgencyService.createReservation(reservationData);
    }

    return this.post('/reservations', reservationData);
  }

  /**
   * Actualizar reservación
   * @param {string} id - ID de la reservación
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateReservation(id, updateData) {
    if (this.isUsingMockData) {
      return mockAgencyService.updateReservation(id, updateData);
    }

    return this.put(`/reservations/${id}`, updateData);
  }

  /**
   * Eliminar reservación
   * @param {string} id - ID de la reservación
   * @returns {Promise<Object>}
   */
  async deleteReservation(id) {
    if (this.isUsingMockData) {
      return mockAgencyService.deleteReservation(id);
    }

    return this.delete(`/reservations/${id}`);
  }

  /**
   * Obtener transacciones de puntos
   * @param {string} agencyId - ID de la agencia
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getPointsTransactions(agencyId, filters = {}) {
    if (this.isUsingMockData) {
      return mockAgencyService.getPointsTransactions(agencyId, filters);
    }

    return this.get(`/${agencyId}/points/transactions`, filters);
  }

  /**
   * Crear transacción de puntos
   * @param {Object} transactionData - Datos de la transacción
   * @returns {Promise<Object>}
   */
  async createPointsTransaction(transactionData) {
    if (this.isUsingMockData) {
      return mockAgencyService.createPointsTransaction(transactionData);
    }

    return this.post('/points/transactions', transactionData);
  }

  /**
   * Obtener balance de puntos
   * @param {string} agencyId - ID de la agencia
   * @returns {Promise<Object>}
   */
  async getPointsBalance(agencyId) {
    if (this.isUsingMockData) {
      return mockAgencyService.getPointsBalance(agencyId);
    }

    return this.get(`/${agencyId}/points/balance`);
  }

  /**
   * Obtener reporte mensual
   * @param {string} agencyId - ID de la agencia
   * @param {number} year - Año
   * @param {number} month - Mes
   * @returns {Promise<Object>}
   */
  async getMonthlyReport(agencyId, year, month) {
    if (this.isUsingMockData) {
      return mockAgencyService.getMonthlyReport(agencyId, year, month);
    }

    return this.get(`/${agencyId}/reports/monthly`, { year, month });
  }

  /**
   * Obtener comparación anual
   * @param {string} agencyId - ID de la agencia
   * @param {number} year - Año
   * @returns {Promise<Object>}
   */
  async getYearlyComparison(agencyId, year) {
    if (this.isUsingMockData) {
      return mockAgencyService.getYearlyComparison(agencyId, year);
    }

    return this.get(`/${agencyId}/reports/yearly`, { year });
  }

  /**
   * Obtener slots disponibles
   * @param {string} agencyId - ID de la agencia
   * @param {string} date - Fecha
   * @returns {Promise<Object>}
   */
  async getAvailableSlots(agencyId, date) {
    if (this.isUsingMockData) {
      return mockAgencyService.getAvailableSlots(agencyId, date);
    }

    return this.get(`/${agencyId}/availability`, { date });
  }

  /**
   * Establecer slots disponibles
   * @param {string} agencyId - ID de la agencia
   * @param {string} date - Fecha
   * @param {Array} slots - Slots disponibles
   * @returns {Promise<Object>}
   */
  async setAvailableSlots(agencyId, date, slots) {
    if (this.isUsingMockData) {
      return mockAgencyService.setAvailableSlots(agencyId, date, slots);
    }

    return this.post(`/${agencyId}/availability`, { date, slots });
  }

  /**
   * Obtener estadísticas de agencia
   * @param {string} agencyId - ID de la agencia
   * @returns {Promise<Object>}
   */
  async getAgencyStats(agencyId) {
    if (this.isUsingMockData) {
      return mockAgencyService.getAgencyStats(agencyId);
    }

    return this.get(`/${agencyId}/stats`);
  }

  /**
   * Obtener datos de calendario
   * @param {string} agencyId - ID de la agencia
   * @param {string} startDate - Fecha inicio
   * @param {string} endDate - Fecha fin
   * @returns {Promise<Object>}
   */
  async getCalendarData(agencyId, startDate, endDate) {
    if (this.isUsingMockData) {
      return mockAgencyService.getCalendarData(agencyId, startDate, endDate);
    }

    return this.get(`/${agencyId}/calendar`, { startDate, endDate });
  }

  /**
   * Confirmar reservación
   * @param {string} id - ID de la reservación
   * @returns {Promise<Object>}
   */
  async confirmReservation(id) {
    if (this.isUsingMockData) {
      return mockAgencyService.updateReservation(id, { status: 'confirmed' });
    }

    return this.post(`/reservations/${id}/confirm`);
  }

  /**
   * Cancelar reservación
   * @param {string} id - ID de la reservación
   * @param {string} reason - Razón de cancelación
   * @returns {Promise<Object>}
   */
  async cancelReservation(id, reason = '') {
    if (this.isUsingMockData) {
      return mockAgencyService.updateReservation(id, { 
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date().toISOString()
      });
    }

    return this.post(`/reservations/${id}/cancel`, { reason });
  }

  /**
   * Asignar guía a reservación
   * @param {string} reservationId - ID de la reservación
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async assignGuideToReservation(reservationId, guideId) {
    if (this.isUsingMockData) {
      return mockAgencyService.updateReservation(reservationId, { 
        guideAssigned: guideId,
        guideAssignedAt: new Date().toISOString()
      });
    }

    return this.post(`/reservations/${reservationId}/assign-guide`, { guideId });
  }

  /**
   * Exportar reporte mensual
   * @param {string} agencyId - ID de la agencia
   * @param {number} year - Año
   * @param {number} month - Mes
   * @param {string} format - Formato de exportación
   * @returns {Promise<Object>}
   */
  async exportMonthlyReport(agencyId, year, month, format = 'pdf') {
    if (this.isUsingMockData) {
      // Mock: simular exportación
      return {
        success: true,
        message: 'Reporte exportado exitosamente'
      };
    }

    const filename = `report_${agencyId}_${year}_${month}.${format}`;
    return this.download(`/${agencyId}/reports/monthly/export`, filename, { year, month, format });
  }

  /**
   * Canjear puntos
   * @param {string} agencyId - ID de la agencia
   * @param {Object} redemptionData - Datos del canje
   * @returns {Promise<Object>}
   */
  async redeemPoints(agencyId, redemptionData) {
    if (this.isUsingMockData) {
      return mockAgencyService.createPointsTransaction({
        agencyId,
        type: 'redeemed',
        ...redemptionData
      });
    }

    return this.post(`/${agencyId}/points/redeem`, redemptionData);
  }

  /**
   * Calcular puntos para reservación
   * @param {Object} reservation - Datos de la reservación
   * @returns {Promise<Object>}
   */
  async calculatePoints(reservation) {
    if (this.isUsingMockData) {
      const points = mockAgencyService.calculatePointsForReservation(reservation);
      return {
        success: true,
        data: { points }
      };
    }

    return this.post('/points/calculate', reservation);
  }
}

export const agencyService = new AgencyService();
export default agencyService;