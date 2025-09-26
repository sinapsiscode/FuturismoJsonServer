/**
 * Servicio base para todos los servicios de la aplicación
 * Proporciona funcionalidad común para llamadas API
 */

import axios from 'axios';
import { APP_CONFIG } from '../config/app.config';

class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
    // En desarrollo usar URL relativa para que funcione el proxy de Vite
    const isDevelopment = import.meta.env.MODE === 'development';
    this.baseURL = isDevelopment ? '/api' : APP_CONFIG.api.baseUrl;
    this.isUsingMockData = APP_CONFIG.features.mockData;

    // Configurar axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: APP_CONFIG.api.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para agregar token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Simular delay de red para mock services
   * @param {number} delay - Milisegundos de delay (por defecto 300-800ms)
   * @returns {Promise<void>}
   */
  async simulateNetworkDelay(delay = null) {
    if (!this.isUsingMockData) return;
    
    const actualDelay = delay || Math.random() * 500 + 300; // 300-800ms
    return new Promise(resolve => setTimeout(resolve, actualDelay));
  }

  /**
   * Formatear respuesta exitosa para mock services
   * @param {*} data - Datos a retornar
   * @returns {Object}
   */
  success(data) {
    return {
      success: true,
      data
    };
  }

  /**
   * Formatear respuesta de error para mock services
   * @param {string} message - Mensaje de error
   * @param {*} details - Detalles adicionales del error
   * @returns {Object}
   */
  error(message, details = null) {
    return {
      success: false,
      error: message,
      details
    };
  }

  /**
   * Obtener token de autenticación
   * @returns {string|null}
   */
  getAuthToken() {
    // Obtener token del store de auth (zustand persist)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        return state?.token || null;
      } catch (error) {
        console.error('Error parsing auth storage:', error);
      }
    }
    return null;
  }

  /**
   * Manejar error 401
   */
  handleUnauthorized() {
    // Emitir evento para que el authStore maneje el logout
    window.dispatchEvent(new CustomEvent('auth:session:expired'));
  }

  /**
   * GET request genérico
   * @param {string} path - Ruta relativa al endpoint
   * @param {Object} params - Parámetros de query
   * @returns {Promise<Object>}
   */
  async get(path = '', params = {}) {
    try {
      const response = await this.api.get(`${this.endpoint}${path}`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request genérico
   * @param {string} path - Ruta relativa al endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>}
   */
  async post(path = '', data = {}) {
    try {
      const response = await this.api.post(`${this.endpoint}${path}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request genérico
   * @param {string} path - Ruta relativa al endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>}
   */
  async put(path = '', data = {}) {
    try {
      const response = await this.api.put(`${this.endpoint}${path}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PATCH request genérico
   * @param {string} path - Ruta relativa al endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>}
   */
  async patch(path = '', data = {}) {
    try {
      const response = await this.api.patch(`${this.endpoint}${path}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request genérico
   * @param {string} path - Ruta relativa al endpoint
   * @returns {Promise<Object>}
   */
  async delete(path = '') {
    try {
      const response = await this.api.delete(`${this.endpoint}${path}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Manejar errores de forma consistente
   * @param {Error} error
   * @returns {Object}
   */
  handleError(error) {
    const errorResponse = {
      success: false,
      error: 'Error desconocido'
    };

    if (error.response) {
      // El servidor respondió con un código de error
      errorResponse.error = error.response.data?.message || 
                           error.response.data?.error || 
                           `Error ${error.response.status}`;
      errorResponse.status = error.response.status;
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      errorResponse.error = 'No se pudo conectar con el servidor';
      errorResponse.networkError = true;
    } else {
      // Error al configurar la petición
      errorResponse.error = error.message;
    }

    if (APP_CONFIG.features.debugMode) {
      console.error(`[${this.endpoint}] Error:`, error);
    }

    return errorResponse;
  }

  /**
   * Upload de archivos
   * @param {string} path - Ruta relativa al endpoint
   * @param {File|FormData} file - Archivo o FormData
   * @param {Function} onProgress - Callback para progreso
   * @returns {Promise<Object>}
   */
  async upload(path, file, onProgress = null) {
    try {
      const formData = file instanceof FormData ? file : new FormData();
      if (file instanceof File) {
        formData.append('file', file);
      }

      const response = await this.api.post(`${this.endpoint}${path}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Descargar archivo
   * @param {string} path - Ruta relativa al endpoint
   * @param {string} filename - Nombre del archivo
   * @returns {Promise<Object>}
   */
  async download(path, filename) {
    try {
      const response = await this.api.get(`${this.endpoint}${path}`, {
        responseType: 'blob'
      });

      // Crear link de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return {
        success: true
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default BaseService;