/**
 * Servicio centralizado que obtiene TODAS las configuraciones del servidor
 * Reemplaza hardcodeo del frontend
 */

import { APP_CONFIG } from '../config/app.config.js';

class ServerConfigService {
  constructor() {
    this.baseUrl = APP_CONFIG.api.baseUrl;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // Cache con timeout
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCached(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Método genérico para hacer requests
  async fetchFromServer(endpoint, useCache = true) {
    if (useCache) {
      const cached = this.getCached(endpoint);
      if (cached) return cached;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const data = result.success ? result.data : result;

      if (useCache) {
        this.setCached(endpoint, data);
      }

      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // ===== REEMPLAZOS DE CONSTANTES =====

  // Obtener todas las constantes del servidor
  async getConstants() {
    return await this.fetchFromServer('/config/constants');
  }

  // Obtener roles de usuario del servidor
  async getUserRoles() {
    const constants = await this.getConstants();
    return constants.USER_ROLES;
  }

  // Obtener estados de servicio del servidor
  async getServiceStatus() {
    const constants = await this.getConstants();
    return constants.RESERVATION_STATUS;
  }

  // Obtener tipos de servicio del servidor
  async getServiceCategories() {
    const constants = await this.getConstants();
    return constants.SERVICE_CATEGORIES;
  }

  // Obtener tipos de tour del servidor
  async getTourTypes() {
    return await this.fetchFromServer('/config/tour-types');
  }

  // Obtener tipos de grupo del servidor
  async getGroupTypes() {
    return await this.fetchFromServer('/config/group-types');
  }

  // Obtener idiomas del servidor
  async getLanguages() {
    return await this.fetchFromServer('/config/languages');
  }

  // Obtener zonas de trabajo del servidor
  async getWorkZones() {
    return await this.fetchFromServer('/config/work-zones');
  }

  // Obtener configuraciones de la app del servidor
  async getAppSettings() {
    return await this.fetchFromServer('/config/settings');
  }

  // ===== VALIDACIONES DEL SERVIDOR =====

  // Validar email
  async validateEmail(email) {
    const response = await fetch(`${this.baseUrl}/validators/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    return result.data;
  }

  // Validar teléfono
  async validatePhone(phone, country = 'PE') {
    const response = await fetch(`${this.baseUrl}/validators/phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, country })
    });
    const result = await response.json();
    return result.data;
  }

  // Validar datos de reservación
  async validateReservation(reservationData) {
    const response = await fetch(`${this.baseUrl}/validators/reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationData)
    });
    const result = await response.json();
    return result.data;
  }

  // Validar datos de usuario
  async validateUserRegistration(userData) {
    const response = await fetch(`${this.baseUrl}/validators/user-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const result = await response.json();
    return result.data;
  }

  // ===== UTILIDADES DEL SERVIDOR =====

  // Formatear moneda
  async formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    const response = await fetch(`${this.baseUrl}/utils/format-currency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, locale })
    });
    const result = await response.json();
    return result.data;
  }

  // Formatear fecha
  async formatDate(date, format = 'DD/MM/YYYY', timezone = 'America/Lima') {
    const response = await fetch(`${this.baseUrl}/utils/format-date`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, format, timezone })
    });
    const result = await response.json();
    return result.data;
  }

  // Calcular precios
  async calculatePrice(priceData) {
    const response = await fetch(`${this.baseUrl}/utils/calculate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(priceData)
    });
    const result = await response.json();
    return result.data;
  }

  // Generar ID único
  async generateId(prefix = 'item') {
    return await this.fetchFromServer(`/utils/generate-id/${prefix}`, false);
  }

  // Calcular distancia
  async calculateDistance(lat1, lon1, lat2, lon2, unit = 'km') {
    const response = await fetch(`${this.baseUrl}/utils/calculate-distance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat1, lon1, lat2, lon2, unit })
    });
    const result = await response.json();
    return result.data;
  }

  // Obtener clima
  async getWeather(location = 'Lima') {
    return await this.fetchFromServer(`/utils/weather/${location}`, false);
  }

  // ===== INICIALIZACIÓN COMPLETA =====

  // Obtener datos de inicialización por rol
  async getAppInitData(role, userId) {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (userId) params.append('userId', userId);

    return await this.fetchFromServer(`/app/init?${params.toString()}`, false);
  }

  // Obtener datos específicos por rol
  async getRoleData(role, userId) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);

    return await this.fetchFromServer(`/app/role-data/${role}?${params.toString()}`, false);
  }

  // ===== MÉTODOS PARA REEMPLAZAR HARDCODEO =====

  // Reemplaza: import { USER_ROLES } from '../constants'
  static async getUserRolesStatic() {
    const service = new ServerConfigService();
    return await service.getUserRoles();
  }

  // Reemplaza: import { SERVICE_STATUS } from '../constants'
  static async getServiceStatusStatic() {
    const service = new ServerConfigService();
    return await service.getServiceStatus();
  }

  // Reemplaza: formatCurrency local functions
  static async formatCurrencyStatic(amount, currency, locale) {
    const service = new ServerConfigService();
    return await service.formatCurrency(amount, currency, locale);
  }

  // Reemplaza: validateEmail local functions
  static async validateEmailStatic(email) {
    const service = new ServerConfigService();
    return await service.validateEmail(email);
  }

  // Limpia cache
  clearCache() {
    this.cache.clear();
  }

  // Precargar datos comunes
  async preloadCommonData() {
    try {
      await Promise.all([
        this.getConstants(),
        this.getTourTypes(),
        this.getLanguages(),
        this.getWorkZones(),
        this.getAppSettings()
      ]);
      console.log('✅ Server config data preloaded');
    } catch (error) {
      console.error('❌ Error preloading server config:', error);
    }
  }
}

// Crear instancia global
const serverConfigService = new ServerConfigService();

// Exportaciones
export default serverConfigService;
export { ServerConfigService };

// Para facilitar la migración, exportar métodos estáticos
export const {
  getUserRolesStatic: getUserRoles,
  getServiceStatusStatic: getServiceStatus,
  formatCurrencyStatic: formatCurrency,
  validateEmailStatic: validateEmail
} = ServerConfigService;