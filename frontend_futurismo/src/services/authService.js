/**
 * Servicio de autenticación CORREGIDO
 * Usa fetch en lugar de axios para evitar problemas de CORS
 */

import { APP_CONFIG } from '../config/app.config';

class AuthService {
  constructor() {
    // En desarrollo usar URL relativa para que funcione el proxy de Vite
    const isDevelopment = import.meta.env.MODE === 'development';
    this.baseURL = isDevelopment ? '/api' : APP_CONFIG.api.baseUrl;
    this.isUsingMockData = APP_CONFIG.features.mockData;
  }

  /**
   * Iniciar sesión
   * @param {Object} credentials - { email, password, rememberMe }
   * @returns {Promise<Object>} - { success, data: { token, user } }
   */
  async login(credentials) {
    console.log('🔐 AuthService.login called');
    console.log('🔗 Base URL:', this.baseURL);

    const url = `${this.baseURL}/auth/login`;
    console.log('🌐 Using REAL API call to:', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      console.log('🔄 Response status:', response.status);
      console.log('🔄 Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Response not OK:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Login response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Login failed');
      }

      return {
        success: true,
        data: {
          token: data.data.token,
          user: data.data.user
        }
      };

    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);

      return {
        success: false,
        error: error.message || 'Error al iniciar sesión'
      };
    }
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('✅ Logout response:', data);

      return { success: true };

    } catch (error) {
      console.error('❌ Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener usuario actual
   */
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Current user response:', data);

      return {
        success: true,
        data: data.data
      };

    } catch (error) {
      console.error('❌ Get current user error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar si el token es válido
   */
  async verifyToken(token) {
    try {
      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: response.ok,
        valid: response.ok
      };

    } catch (error) {
      console.error('❌ Token verification error:', error);
      return {
        success: false,
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Refrescar token
   */
  async refreshToken(token) {
    // Por ahora, simplemente verificar el token existente
    return this.verifyToken(token);
  }
}

// Crear y exportar instancia
const authService = new AuthService();
export default authService;