/**
 * Servicio de perfil
 * Maneja los datos de perfil, métodos de pago, documentos, etc.
 */

import BaseService from './baseService';

class ProfileService extends BaseService {
  constructor() {
    super('/profile');
  }

  /**
   * Obtener métodos de pago
   * @returns {Promise<Object>}
   */
  async getPaymentMethods() {
    try {
      const result = await this.get('/payment-methods');
      return result;
    } catch (error) {
      console.warn('Error fetching payment methods, using fallback:', error);
      return {
        success: true,
        data: []
      };
    }
  }

  /**
   * Agregar método de pago
   * @param {Object} paymentMethod - Datos del método de pago
   * @returns {Promise<Object>}
   */
  async addPaymentMethod(paymentMethod) {
    try {
      const result = await this.post('/payment-methods', paymentMethod);
      return result;
    } catch (error) {
      console.error('Error adding payment method:', error);
      return {
        success: false,
        error: 'Error al agregar método de pago'
      };
    }
  }

  /**
   * Obtener datos de empresa
   * @returns {Promise<Object>}
   */
  async getCompanyData() {
    try {
      const result = await this.get('/company-data');
      return result;
    } catch (error) {
      console.warn('Error fetching company data, using fallback:', error);
      return {
        success: true,
        data: {}
      };
    }
  }

  /**
   * Actualizar datos de empresa
   * @param {Object} companyData - Datos de la empresa
   * @returns {Promise<Object>}
   */
  async updateCompanyData(companyData) {
    try {
      const result = await this.put('/company-data', companyData);
      return result;
    } catch (error) {
      console.error('Error updating company data:', error);
      return {
        success: false,
        error: 'Error al actualizar datos de empresa'
      };
    }
  }

  /**
   * Obtener datos de contacto
   * @returns {Promise<Object>}
   */
  async getContactData() {
    try {
      const result = await this.get('/contact-data');
      return result;
    } catch (error) {
      console.warn('Error fetching contact data, using fallback:', error);
      return {
        success: true,
        data: {}
      };
    }
  }

  /**
   * Obtener plantillas de documentos
   * @returns {Promise<Object>}
   */
  async getDocumentTemplates() {
    try {
      const result = await this.get('/document-templates');
      return result;
    } catch (error) {
      console.warn('Error fetching document templates, using fallback:', error);
      return {
        success: true,
        data: []
      };
    }
  }

  /**
   * Obtener datos de feedback
   * @returns {Promise<Object>}
   */
  async getFeedbackData() {
    try {
      const result = await this.get('/feedback-data');
      return result;
    } catch (error) {
      console.warn('Error fetching feedback data, using fallback:', error);
      return {
        success: true,
        data: {
          recentFeedback: [],
          stats: {},
          categoryBreakdown: {}
        }
      };
    }
  }
}

const profileService = new ProfileService();

export default profileService;