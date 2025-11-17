/**
 * Servicio de agencias
 * Maneja toda la lógica de agencias con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';


class AgencyService extends BaseService {
  constructor() {
    super('/agencies');
  }

  /**
   * Obtener todas las agencias
   * @returns {Promise<Object>}
   */
  async getAgencies() {
return this.get('');
  }

  /**
   * Obtener agencia por ID
   * @param {string} id - ID de la agencia
   * @returns {Promise<Object>}
   */
  async getAgencyById(id) {
return this.get(`/${id}`);
  }

  /**
   * Actualizar datos de agencia
   * @param {string} id - ID de la agencia
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateAgency(id, updateData) {
return this.put(`/${id}`, updateData);
  }

  /**
   * Obtener reservaciones de una agencia
   * @param {string} agencyId - ID de la agencia
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getReservations(agencyId, filters = {}) {
return this.get(`/${agencyId}/reservations`, filters);
  }

  /**
   * Obtener reservación por ID
   * @param {string} id - ID de la reservación
   * @returns {Promise<Object>}
   */
  async getReservationById(id) {
return this.get(`/reservations/${id}`);
  }

  /**
   * Crear nueva reservación
   * @param {Object} reservationData - Datos de la reservación
   * @returns {Promise<Object>}
   */
  async createReservation(reservationData) {
    // Use this.api directly to avoid the /agencies prefix
    try {
      const response = await this.api.post('/reservations', reservationData);

      // If response already has the {success, data} format, return it
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        return response.data;
      }

      // Otherwise, wrap it
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Actualizar reservación
   * @param {string} id - ID de la reservación
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateReservation(id, updateData) {
return this.put(`/reservations/${id}`, updateData);
  }

  /**
   * Eliminar reservación
   * @param {string} id - ID de la reservación
   * @returns {Promise<Object>}
   */
  async deleteReservation(id) {
return this.delete(`/reservations/${id}`);
  }

  /**
   * Obtener transacciones de puntos
   * @param {string} agencyId - ID de la agencia
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getPointsTransactions(agencyId, filters = {}) {
return this.get(`/${agencyId}/points/transactions`, filters);
  }

  /**
   * Crear transacción de puntos
   * @param {Object} transactionData - Datos de la transacción
   * @returns {Promise<Object>}
   */
  async createPointsTransaction(transactionData) {
return this.post('/points/transactions', transactionData);
  }

  /**
   * Obtener balance de puntos
   * @param {string} agencyId - ID de la agencia
   * @returns {Promise<Object>}
   */
  async getPointsBalance(agencyId) {
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
return this.get(`/${agencyId}/reports/monthly`, { year, month });
  }

  /**
   * Obtener comparación anual
   * @param {string} agencyId - ID de la agencia
   * @param {number} year - Año
   * @returns {Promise<Object>}
   */
  async getYearlyComparison(agencyId, year) {
return this.get(`/${agencyId}/reports/yearly`, { year });
  }

  /**
   * Obtener slots disponibles
   * @param {string} agencyId - ID de la agencia
   * @param {string} date - Fecha
   * @returns {Promise<Object>}
   */
  async getAvailableSlots(agencyId, date) {
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
return this.post(`/${agencyId}/availability`, { date, slots });
  }

  /**
   * Obtener estadísticas de agencia
   * @param {string} agencyId - ID de la agencia
   * @returns {Promise<Object>}
   */
  async getAgencyStats(agencyId) {
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
return this.get(`/${agencyId}/calendar`, { startDate, endDate });
  }

  /**
   * Confirmar reservación
   * @param {string} id - ID de la reservación
   * @returns {Promise<Object>}
   */
  async confirmReservation(id) {
return this.post(`/reservations/${id}/confirm`);
  }

  /**
   * Cancelar reservación
   * @param {string} id - ID de la reservación
   * @param {string} reason - Razón de cancelación
   * @returns {Promise<Object>}
   */
  async cancelReservation(id, reason = '') {

return this.post(`/reservations/${id}/cancel`, { reason });
  }

  /**
   * Asignar guía a reservación
   * @param {string} reservationId - ID de la reservación
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async assignGuideToReservation(reservationId, guideId) {

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
return this.post(`/${agencyId}/points/redeem`, redemptionData);
  }

  /**
   * Calcular puntos para reservación
   * @param {Object} reservation - Datos de la reservación
   * @returns {Promise<Object>}
   */
  async calculatePoints(reservation) {

return this.post('/points/calculate', reservation);
  }
}

export const agencyService = new AgencyService();
export default agencyService;