/**
 * Servicio de configuraciones del sistema
 * Maneja toda la lógica de configuraciones con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockSettingsService } from './mockSettingsService';

class SettingsService extends BaseService {
  constructor() {
    super('/settings');
  }

  /**
   * Obtener todas las configuraciones
   * @returns {Promise<Object>}
   */
  async getSettings() {
    if (this.isUsingMockData) {
      return mockSettingsService.getSettings();
    }

    return this.get('');
  }

  /**
   * Obtener configuración por categoría
   * @param {string} category - Categoría de configuración
   * @returns {Promise<Object>}
   */
  async getSettingsByCategory(category) {
    if (this.isUsingMockData) {
      return mockSettingsService.getSettingsByCategory(category);
    }

    return this.get(`/category/${category}`);
  }

  /**
   * Actualizar configuraciones
   * @param {Object} updates - Objeto con las actualizaciones por categoría
   * @returns {Promise<Object>}
   */
  async updateSettings(updates) {
    if (this.isUsingMockData) {
      return mockSettingsService.updateSettings(updates);
    }

    return this.put('', updates);
  }

  /**
   * Actualizar configuración de una categoría específica
   * @param {string} category - Categoría de configuración
   * @param {Object} settings - Nuevas configuraciones
   * @returns {Promise<Object>}
   */
  async updateCategorySettings(category, settings) {
    if (this.isUsingMockData) {
      return mockSettingsService.updateCategorySettings(category, settings);
    }

    return this.put(`/category/${category}`, settings);
  }

  /**
   * Restablecer configuraciones por defecto
   * @param {string|null} category - Categoría específica o null para todas
   * @returns {Promise<Object>}
   */
  async resetSettings(category = null) {
    if (this.isUsingMockData) {
      return mockSettingsService.resetSettings(category);
    }

    if (category) {
      return this.post(`/category/${category}/reset`);
    }
    
    return this.post('/reset');
  }

  /**
   * Obtener historial de cambios de configuración
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getSettingsHistory(filters = {}) {
    if (this.isUsingMockData) {
      return mockSettingsService.getSettingsHistory(filters);
    }

    return this.get('/history', filters);
  }

  /**
   * Exportar configuraciones
   * @param {string} format - Formato de exportación (json, csv)
   * @returns {Promise<Object>}
   */
  async exportSettings(format = 'json') {
    if (this.isUsingMockData) {
      return mockSettingsService.exportSettings(format);
    }

    return this.get('/export', { format });
  }

  /**
   * Importar configuraciones
   * @param {string|Object} data - Datos a importar
   * @param {string} format - Formato de los datos
   * @returns {Promise<Object>}
   */
  async importSettings(data, format = 'json') {
    if (this.isUsingMockData) {
      return mockSettingsService.importSettings(data, format);
    }

    return this.post('/import', { data, format });
  }

  /**
   * Validar configuraciones
   * @param {Object|null} settings - Configuraciones a validar o null para las actuales
   * @returns {Promise<Object>}
   */
  async validateSettings(settings = null) {
    if (this.isUsingMockData) {
      return mockSettingsService.validateSettings(settings);
    }

    if (settings) {
      return this.post('/validate', settings);
    }
    
    return this.get('/validate');
  }

  /**
   * Obtener opciones disponibles para configuración
   * @returns {Promise<Object>}
   */
  async getAvailableOptions() {
    if (this.isUsingMockData) {
      return mockSettingsService.getAvailableOptions();
    }

    return this.get('/options');
  }

  /**
   * Obtener configuración específica
   * @param {string} path - Ruta de la configuración (ej: 'general.companyName')
   * @returns {Promise<Object>}
   */
  async getSettingByPath(path) {
    if (this.isUsingMockData) {
      const parts = path.split('.');
      const category = parts[0];
      const key = parts.slice(1).join('.');
      
      const categoryData = await mockSettingsService.getSettingsByCategory(category);
      if (!categoryData.success) return categoryData;
      
      // Navegar por la ruta
      let value = categoryData.data;
      for (const part of key.split('.')) {
        value = value?.[part];
        if (value === undefined) {
          return {
            success: false,
            error: `Configuración no encontrada: ${path}`
          };
        }
      }
      
      return {
        success: true,
        data: { path, value }
      };
    }

    return this.get(`/path/${path}`);
  }

  /**
   * Actualizar configuración específica
   * @param {string} path - Ruta de la configuración
   * @param {any} value - Nuevo valor
   * @returns {Promise<Object>}
   */
  async updateSettingByPath(path, value) {
    if (this.isUsingMockData) {
      const parts = path.split('.');
      const category = parts[0];
      const keys = parts.slice(1);
      
      // Construir objeto de actualización
      const update = {};
      let current = update;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      return mockSettingsService.updateCategorySettings(category, update);
    }

    return this.put(`/path/${path}`, { value });
  }

  /**
   * Buscar configuraciones
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Object>}
   */
  async searchSettings(query) {
    if (this.isUsingMockData) {
      // Búsqueda simple en mock
      const allSettings = await mockSettingsService.getSettings();
      if (!allSettings.success) return allSettings;
      
      const results = [];
      const searchInObject = (obj, path = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (key.toLowerCase().includes(query.toLowerCase()) ||
              (typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase()))) {
            results.push({
              path: currentPath,
              key,
              value,
              category: currentPath.split('.')[0]
            });
          }
          
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            searchInObject(value, currentPath);
          }
        });
      };
      
      searchInObject(allSettings.data);
      
      return {
        success: true,
        data: results
      };
    }

    return this.get('/search', { q: query });
  }

  /**
   * Obtener configuraciones de backup
   * @returns {Promise<Object>}
   */
  async getBackups() {
    if (this.isUsingMockData) {
      // Mock: simular backups disponibles
      return {
        success: true,
        data: [
          {
            id: 'backup-001',
            name: 'Backup automático',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            size: '45 KB',
            type: 'auto'
          },
          {
            id: 'backup-002',
            name: 'Backup manual - Antes de actualización',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            size: '43 KB',
            type: 'manual'
          }
        ]
      };
    }

    return this.get('/backups');
  }

  /**
   * Crear backup de configuraciones
   * @param {string} name - Nombre del backup
   * @returns {Promise<Object>}
   */
  async createBackup(name) {
    if (this.isUsingMockData) {
      const settings = await mockSettingsService.getSettings();
      if (!settings.success) return settings;
      
      return {
        success: true,
        data: {
          id: `backup-${Date.now()}`,
          name,
          createdAt: new Date().toISOString(),
          size: '45 KB',
          type: 'manual',
          settings: settings.data
        }
      };
    }

    return this.post('/backups', { name });
  }

  /**
   * Restaurar backup
   * @param {string} backupId - ID del backup a restaurar
   * @returns {Promise<Object>}
   */
  async restoreBackup(backupId) {
    if (this.isUsingMockData) {
      // Mock: simular restauración
      return {
        success: true,
        message: 'Backup restaurado exitosamente'
      };
    }

    return this.post(`/backups/${backupId}/restore`);
  }

  /**
   * Verificar estado del sistema
   * @returns {Promise<Object>}
   */
  async checkSystemStatus() {
    if (this.isUsingMockData) {
      return {
        success: true,
        data: {
          status: 'healthy',
          database: 'connected',
          cache: 'active',
          storage: {
            used: '2.3 GB',
            total: '10 GB',
            percentage: 23
          },
          lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          configVersion: '1.2.0',
          uptime: '15 days, 4 hours'
        }
      };
    }

    return this.get('/status');
  }
}

export const settingsService = new SettingsService();
export default settingsService;