/**
 * Servicio de autenticación
 * Maneja toda la lógica de autenticación con el backend
 */

import axios from 'axios';
import { APP_CONFIG } from '../config/app.config';
import { mockAuthService } from './mockAuthService';

class AuthService {
  constructor() {
    this.baseURL = APP_CONFIG.api.baseUrl;
    this.isUsingMockData = APP_CONFIG.features.mockData;
  }

  /**
   * Iniciar sesión
   * @param {Object} credentials - { email, password, rememberMe }
   * @returns {Promise<Object>} - { success, data: { token, user } }
   */
  async login(credentials) {
    console.log('🔐 AuthService.login called with mockData:', this.isUsingMockData);
    console.log('🔗 Base URL:', this.baseURL);

    if (this.isUsingMockData) {
      console.log('📱 Using MOCK auth service');
      return mockAuthService.login(credentials);
    }

    console.log('🌐 Using REAL API call to:', `${this.baseURL}/auth/login`);
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, {
        email: credentials.email,
        password: credentials.password
      }, {
        timeout: APP_CONFIG.api.timeout
      });

      console.log('✅ Login response:', response.data);

      return {
        success: true,
        data: {
          token: response.data.data.token,
          user: response.data.data.user
        }
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);

      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || error.message || 'Error al iniciar sesión'
      };
    }
  }

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} - { success, data: { token, user } }
   */
  async register(userData) {
    if (this.isUsingMockData) {
      return mockAuthService.register(userData);
    }

    try {
      const response = await axios.post(`${this.baseURL}/auth/register`, userData, {
        timeout: APP_CONFIG.api.timeout
      });

      return {
        success: true,
        data: {
          token: response.data.token,
          user: response.data.user
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario'
      };
    }
  }

  /**
   * Verificar token
   * @param {string} token - Token JWT
   * @returns {Promise<Object>} - { valid, user }
   */
  async verifyToken(token) {
    if (this.isUsingMockData) {
      return mockAuthService.verifyToken(token);
    }

    try {
      const response = await axios.get(`${this.baseURL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: APP_CONFIG.api.timeout
      });

      return {
        valid: true,
        user: response.data.data
      };
    } catch (error) {
      return {
        valid: false,
        error: error.response?.data?.message || 'Token inválido'
      };
    }
  }

  /**
   * Renovar token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} - { success, data: { token } }
   */
  async refreshToken(refreshToken) {
    if (this.isUsingMockData) {
      return mockAuthService.refreshToken(refreshToken);
    }

    try {
      const response = await axios.post(`${this.baseURL}/auth/refresh`, {
        refreshToken
      }, {
        timeout: APP_CONFIG.api.timeout
      });

      return {
        success: true,
        data: {
          token: response.data.token
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al renovar token'
      };
    }
  }

  /**
   * Actualizar perfil de usuario
   * @param {string} userId - ID del usuario
   * @param {Object} profileData - Datos del perfil
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} - { success, data: { user } }
   */
  async updateProfile(userId, profileData, token) {
    if (this.isUsingMockData) {
      return mockAuthService.updateProfile(userId, profileData);
    }

    try {
      const response = await axios.put(`${this.baseURL}/users/${userId}`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: APP_CONFIG.api.timeout
      });

      return {
        success: true,
        data: {
          user: response.data.user
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar perfil'
      };
    }
  }

  /**
   * Cambiar contraseña
   * @param {string} userId - ID del usuario
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} - { success }
   */
  async changePassword(userId, passwordData, token) {
    if (this.isUsingMockData) {
      return mockAuthService.changePassword(userId, passwordData);
    }

    try {
      await axios.post(`${this.baseURL}/users/${userId}/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: APP_CONFIG.api.timeout
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cambiar contraseña'
      };
    }
  }

  /**
   * Solicitar recuperación de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} - { success }
   */
  async requestPasswordReset(email) {
    if (this.isUsingMockData) {
      return mockAuthService.requestPasswordReset(email);
    }

    try {
      await axios.post(`${this.baseURL}/auth/forgot-password`, { email }, {
        timeout: APP_CONFIG.api.timeout
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al solicitar recuperación'
      };
    }
  }

  /**
   * Resetear contraseña
   * @param {string} token - Token de reset
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} - { success }
   */
  async resetPassword(token, newPassword) {
    if (this.isUsingMockData) {
      return mockAuthService.resetPassword(token, newPassword);
    }

    try {
      await axios.post(`${this.baseURL}/auth/reset-password`, {
        token,
        newPassword
      }, {
        timeout: APP_CONFIG.api.timeout
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al resetear contraseña'
      };
    }
  }

  /**
   * Cerrar sesión
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} - { success }
   */
  async logout(token) {
    if (this.isUsingMockData) {
      return { success: true };
    }

    try {
      await axios.post(`${this.baseURL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: APP_CONFIG.api.timeout
      });

      return { success: true };
    } catch (error) {
      // Aunque falle el logout en el servidor, localmente cerramos sesión
      return { success: true };
    }
  }
}

export const authService = new AuthService();
export default authService;