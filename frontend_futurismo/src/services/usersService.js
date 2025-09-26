/**
 * Servicio de usuarios
 * Maneja toda la lógica de usuarios con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockUsersService } from './mockUsersService';

class UsersService extends BaseService {
  constructor() {
    super('/users');
  }

  /**
   * Obtener todos los usuarios
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getUsers(filters = {}) {
    if (this.isUsingMockData) {
      return mockUsersService.getUsers(filters);
    }

    return this.get('', filters);
  }

  /**
   * Obtener usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>}
   */
  async getUserById(id) {
    if (this.isUsingMockData) {
      return mockUsersService.getUserById(id);
    }

    return this.get(`/${id}`);
  }

  /**
   * Crear nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>}
   */
  async createUser(userData) {
    if (this.isUsingMockData) {
      return mockUsersService.createUser(userData);
    }

    return this.post('', userData);
  }

  /**
   * Actualizar usuario
   * @param {string} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateUser(id, updateData) {
    if (this.isUsingMockData) {
      return mockUsersService.updateUser(id, updateData);
    }

    return this.put(`/${id}`, updateData);
  }

  /**
   * Eliminar usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>}
   */
  async deleteUser(id) {
    if (this.isUsingMockData) {
      return mockUsersService.deleteUser(id);
    }

    return this.delete(`/${id}`);
  }

  /**
   * Cambiar estado del usuario (activar/desactivar)
   * @param {string} id - ID del usuario
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>}
   */
  async toggleUserStatus(id, status) {
    if (this.isUsingMockData) {
      return mockUsersService.toggleUserStatus(id, status);
    }

    return this.patch(`/${id}/status`, { status });
  }

  /**
   * Resetear contraseña de usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>}
   */
  async resetUserPassword(id) {
    if (this.isUsingMockData) {
      return mockUsersService.resetUserPassword(id);
    }

    return this.post(`/${id}/reset-password`);
  }

  /**
   * Cambiar contraseña de usuario
   * @param {string} id - ID del usuario
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise<Object>}
   */
  async changeUserPassword(id, passwordData) {
    if (this.isUsingMockData) {
      return mockUsersService.changeUserPassword(id, passwordData);
    }

    return this.post(`/${id}/change-password`, passwordData);
  }

  /**
   * Actualizar permisos del usuario
   * @param {string} id - ID del usuario
   * @param {Array} permissions - Lista de permisos
   * @returns {Promise<Object>}
   */
  async updateUserPermissions(id, permissions) {
    if (this.isUsingMockData) {
      return mockUsersService.updateUserPermissions(id, permissions);
    }

    return this.put(`/${id}/permissions`, { permissions });
  }

  /**
   * Actualizar rol del usuario
   * @param {string} id - ID del usuario
   * @param {string} roleId - ID del nuevo rol
   * @returns {Promise<Object>}
   */
  async updateUserRole(id, roleId) {
    if (this.isUsingMockData) {
      return mockUsersService.updateUserRole(id, roleId);
    }

    return this.put(`/${id}/role`, { roleId });
  }

  /**
   * Obtener roles disponibles
   * @returns {Promise<Object>}
   */
  async getRoles() {
    if (this.isUsingMockData) {
      return mockUsersService.getRoles();
    }

    return this.get('/roles');
  }

  /**
   * Obtener permisos del sistema
   * @returns {Promise<Object>}
   */
  async getPermissions() {
    if (this.isUsingMockData) {
      return mockUsersService.getPermissions();
    }

    return this.get('/permissions');
  }

  /**
   * Buscar usuarios
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Object>}
   */
  async searchUsers(query) {
    if (this.isUsingMockData) {
      return mockUsersService.searchUsers(query);
    }

    return this.get('/search', { q: query });
  }

  /**
   * Obtener actividad del usuario
   * @param {string} id - ID del usuario
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise<Object>}
   */
  async getUserActivity(id, params = {}) {
    if (this.isUsingMockData) {
      return mockUsersService.getUserActivity(id, params);
    }

    return this.get(`/${id}/activity`, params);
  }

  /**
   * Obtener estadísticas de usuarios
   * @returns {Promise<Object>}
   */
  async getUsersStats() {
    if (this.isUsingMockData) {
      return mockUsersService.getUsersStats();
    }

    return this.get('/stats');
  }

  /**
   * Verificar email único
   * @param {string} email - Email a verificar
   * @param {string} excludeId - ID de usuario a excluir (para edición)
   * @returns {Promise<Object>}
   */
  async checkEmailUnique(email, excludeId = null) {
    if (this.isUsingMockData) {
      return mockUsersService.checkEmailUnique(email, excludeId);
    }

    return this.post('/check-email', { email, excludeId });
  }

  /**
   * Invitar usuario por email
   * @param {Object} inviteData - { email, role, permissions }
   * @returns {Promise<Object>}
   */
  async inviteUser(inviteData) {
    if (this.isUsingMockData) {
      return mockUsersService.inviteUser(inviteData);
    }

    return this.post('/invite', inviteData);
  }

  /**
   * Reenviar invitación
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async resendInvitation(userId) {
    if (this.isUsingMockData) {
      return mockUsersService.resendInvitation(userId);
    }

    return this.post(`/${userId}/resend-invitation`);
  }

  /**
   * Importar usuarios desde archivo
   * @param {File} file - Archivo a importar
   * @param {Function} onProgress - Callback de progreso
   * @returns {Promise<Object>}
   */
  async importUsers(file, onProgress = null) {
    if (this.isUsingMockData) {
      return mockUsersService.importUsers(file);
    }

    return this.upload('/import', file, onProgress);
  }

  /**
   * Exportar usuarios
   * @param {Object} filters - Filtros de exportación
   * @param {string} format - Formato de exportación (csv, excel, pdf)
   * @returns {Promise<Object>}
   */
  async exportUsers(filters = {}, format = 'excel') {
    if (this.isUsingMockData) {
      return mockUsersService.exportUsers(filters, format);
    }

    const filename = `users_${new Date().toISOString().split('T')[0]}.${format}`;
    return this.download('/export', filename, { ...filters, format });
  }

  /**
   * Obtener sesiones activas del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getUserSessions(userId) {
    if (this.isUsingMockData) {
      return mockUsersService.getUserSessions(userId);
    }

    return this.get(`/${userId}/sessions`);
  }

  /**
   * Terminar sesión específica del usuario
   * @param {string} userId - ID del usuario
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise<Object>}
   */
  async terminateUserSession(userId, sessionId) {
    if (this.isUsingMockData) {
      return mockUsersService.terminateUserSession(userId, sessionId);
    }

    return this.delete(`/${userId}/sessions/${sessionId}`);
  }

  /**
   * Terminar todas las sesiones del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async terminateAllUserSessions(userId) {
    if (this.isUsingMockData) {
      return mockUsersService.terminateAllUserSessions(userId);
    }

    return this.delete(`/${userId}/sessions`);
  }
}

export const usersService = new UsersService();
export default usersService;