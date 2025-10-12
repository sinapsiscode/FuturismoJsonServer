/**
 * Servicio de configuraciones del sistema
 * Maneja toda la lógica de configuraciones con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';


class SettingsService extends BaseService {
  constructor() {
    super('/settings');
  }

  /**
   * Obtener todas las configuraciones
   * @returns {Promise<Object>}
   */
  async getSettings() {
return this.get('');
  }

  /**
   * Obtener configuración por categoría
   * @param {string} category - Categoría de configuración
   * @returns {Promise<Object>}
   */
  async getSettingsByCategory(category) {
return this.get(`/category/${category}`);
  }

  /**
   * Actualizar configuraciones
   * @param {Object} updates - Objeto con las actualizaciones por categoría
   * @returns {Promise<Object>}
   */
  async updateSettings(updates) {
return this.put('', updates);
  }

  /**
   * Actualizar configuración de una categoría específica
   * @param {string} category - Categoría de configuración
   * @param {Object} settings - Nuevas configuraciones
   * @returns {Promise<Object>}
   */
  async updateCategorySettings(category, settings) {
return this.put(`/category/${category}`, settings);
  }

  /**
   * Restablecer configuraciones por defecto
   * @param {string|null} category - Categoría específica o null para todas
   * @returns {Promise<Object>}
   */
  async resetSettings(category = null) {
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
return this.get('/history', filters);
  }

  /**
   * Exportar configuraciones
   * @param {string} format - Formato de exportación (json, csv)
   * @returns {Promise<Object>}
   */
  async exportSettings(format = 'json') {
return this.get('/export', { format });
  }

  /**
   * Importar configuraciones
   * @param {string|Object} data - Datos a importar
   * @param {string} format - Formato de los datos
   * @returns {Promise<Object>}
   */
  async importSettings(data, format = 'json') {
return this.post('/import', { data, format });
  }

  /**
   * Validar configuraciones
   * @param {Object|null} settings - Configuraciones a validar o null para las actuales
   * @returns {Promise<Object>}
   */
  async validateSettings(settings = null) {
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
return this.get('/options');
  }

  /**
   * Obtener configuración específica
   * @param {string} path - Ruta de la configuración (ej: 'general.companyName')
   * @returns {Promise<Object>}
   */
  async getSettingByPath(path) {

return this.get(`/path/${path}`);
  }

  /**
   * Actualizar configuración específica
   * @param {string} path - Ruta de la configuración
   * @param {any} value - Nuevo valor
   * @returns {Promise<Object>}
   */
  async updateSettingByPath(path, value) {

return this.put(`/path/${path}`, { value });
  }

  /**
   * Buscar configuraciones
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Object>}
   */
  async searchSettings(query) {

return this.get('/search', { q: query });
  }

  /**
   * Obtener configuraciones de backup
   * @returns {Promise<Object>}
   */
  async getBackups() {

return this.get('/backups');
  }

  /**
   * Crear backup de configuraciones
   * @param {string} name - Nombre del backup
   * @returns {Promise<Object>}
   */
  async createBackup(name) {

return this.post('/backups', { name });
  }

  /**
   * Restaurar backup
   * @param {string} backupId - ID del backup a restaurar
   * @returns {Promise<Object>}
   */
  async restoreBackup(backupId) {

return this.post(`/backups/${backupId}/restore`);
  }

  /**
   * Verificar estado del sistema
   * @returns {Promise<Object>}
   */
  async checkSystemStatus() {

return this.get('/status');
  }
}

export const settingsService = new SettingsService();
export default settingsService;