/**
 * Servicio de notificaciones
 * Maneja toda la lógica de notificaciones con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockNotificationsService } from './mockNotificationsService';

class NotificationsService extends BaseService {
  constructor() {
    super('/notifications');
  }

  /**
   * Obtener notificaciones del usuario
   * @param {string} userId - ID del usuario
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getNotifications(userId, filters = {}) {
    if (this.isUsingMockData) {
      return mockNotificationsService.getNotifications(userId, filters);
    }

    return this.get(`/user/${userId}`, filters);
  }

  /**
   * Obtener notificación por ID
   * @param {string} id - ID de la notificación
   * @returns {Promise<Object>}
   */
  async getNotificationById(id) {
    if (this.isUsingMockData) {
      return mockNotificationsService.getNotificationById(id);
    }

    return this.get(`/${id}`);
  }

  /**
   * Crear nueva notificación
   * @param {Object} notificationData - Datos de la notificación
   * @returns {Promise<Object>}
   */
  async createNotification(notificationData) {
    if (this.isUsingMockData) {
      return mockNotificationsService.createNotification(notificationData);
    }

    return this.post('', notificationData);
  }

  /**
   * Marcar notificación como leída
   * @param {string} id - ID de la notificación
   * @returns {Promise<Object>}
   */
  async markAsRead(id) {
    if (this.isUsingMockData) {
      return mockNotificationsService.markAsRead(id);
    }

    return this.put(`/${id}/read`);
  }

  /**
   * Marcar todas las notificaciones como leídas
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async markAllAsRead(userId) {
    if (this.isUsingMockData) {
      return mockNotificationsService.markAllAsRead(userId);
    }

    return this.put(`/user/${userId}/read-all`);
  }

  /**
   * Eliminar notificación
   * @param {string} id - ID de la notificación
   * @returns {Promise<Object>}
   */
  async deleteNotification(id) {
    if (this.isUsingMockData) {
      return mockNotificationsService.deleteNotification(id);
    }

    return this.delete(`/${id}`);
  }

  /**
   * Limpiar todas las notificaciones del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async clearAll(userId) {
    if (this.isUsingMockData) {
      return mockNotificationsService.clearAll(userId);
    }

    return this.delete(`/user/${userId}/clear-all`);
  }

  /**
   * Obtener preferencias de notificación del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getUserPreferences(userId) {
    if (this.isUsingMockData) {
      return mockNotificationsService.getUserPreferences(userId);
    }

    return this.get(`/user/${userId}/preferences`);
  }

  /**
   * Actualizar preferencias de notificación del usuario
   * @param {string} userId - ID del usuario
   * @param {Object} preferences - Nuevas preferencias
   * @returns {Promise<Object>}
   */
  async updateUserPreferences(userId, preferences) {
    if (this.isUsingMockData) {
      return mockNotificationsService.updateUserPreferences(userId, preferences);
    }

    return this.put(`/user/${userId}/preferences`, preferences);
  }

  /**
   * Obtener plantillas de notificación
   * @returns {Promise<Object>}
   */
  async getNotificationTemplates() {
    if (this.isUsingMockData) {
      return mockNotificationsService.getNotificationTemplates();
    }

    return this.get('/templates');
  }

  /**
   * Crear notificación desde plantilla
   * @param {string} templateId - ID de la plantilla
   * @param {Object} params - Parámetros para la plantilla
   * @returns {Promise<Object>}
   */
  async createFromTemplate(templateId, params = {}) {
    if (this.isUsingMockData) {
      return mockNotificationsService.createFromTemplate(templateId, params);
    }

    return this.post(`/templates/${templateId}`, params);
  }

  /**
   * Obtener estadísticas de notificaciones
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getNotificationStats(userId) {
    if (this.isUsingMockData) {
      return mockNotificationsService.getNotificationStats(userId);
    }

    return this.get(`/user/${userId}/stats`);
  }

  /**
   * Suscribirse a notificaciones push
   * @param {string} userId - ID del usuario
   * @param {Object} subscription - Datos de suscripción push
   * @returns {Promise<Object>}
   */
  async subscribeToPush(userId, subscription) {
    if (this.isUsingMockData) {
      return mockNotificationsService.subscribeToPush(userId, subscription);
    }

    return this.post(`/user/${userId}/push-subscribe`, subscription);
  }

  /**
   * Desuscribirse de notificaciones push
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async unsubscribeFromPush(userId) {
    if (this.isUsingMockData) {
      return mockNotificationsService.unsubscribeFromPush(userId);
    }

    return this.delete(`/user/${userId}/push-unsubscribe`);
  }

  /**
   * Enviar notificación masiva (admin)
   * @param {Object} notificationData - Datos de la notificación
   * @param {Array<string>} userIds - IDs de usuarios destinatarios
   * @returns {Promise<Object>}
   */
  async sendBulkNotification(notificationData, userIds) {
    if (this.isUsingMockData) {
      return mockNotificationsService.sendBulkNotification(notificationData, userIds);
    }

    return this.post('/bulk', {
      notification: notificationData,
      recipients: userIds
    });
  }

  /**
   * Enviar notificación de prueba
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async sendTestNotification(userId) {
    if (this.isUsingMockData) {
      return mockNotificationsService.createFromTemplate('systemMaintenance', {
        userId,
        date: new Date().toLocaleDateString(),
        startTime: '10:00 PM',
        endTime: '11:00 PM'
      });
    }

    return this.post(`/user/${userId}/test`);
  }

  /**
   * Obtener categorías de notificación disponibles
   * @returns {Promise<Object>}
   */
  async getNotificationCategories() {
    if (this.isUsingMockData) {
      return {
        success: true,
        data: [
          'reservations',
          'marketplace', 
          'documents',
          'payments',
          'reports',
          'system'
        ]
      };
    }

    return this.get('/categories');
  }

  /**
   * Buscar notificaciones
   * @param {string} userId - ID del usuario
   * @param {string} query - Texto de búsqueda
   * @returns {Promise<Object>}
   */
  async searchNotifications(userId, query) {
    if (this.isUsingMockData) {
      // Usar el método getNotifications con filtros de búsqueda simulados
      const allNotifications = await mockNotificationsService.getNotifications(userId);
      if (!allNotifications.success) return allNotifications;

      const filtered = allNotifications.data.notifications.filter(n => 
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.message.toLowerCase().includes(query.toLowerCase())
      );

      return {
        success: true,
        data: {
          notifications: filtered,
          total: filtered.length
        }
      };
    }

    return this.get(`/user/${userId}/search`, { q: query });
  }

  /**
   * Archivar notificación
   * @param {string} id - ID de la notificación
   * @returns {Promise<Object>}
   */
  async archiveNotification(id) {
    if (this.isUsingMockData) {
      // Mock: marcar como archivada (simulado con actualización)
      const notification = await mockNotificationsService.getNotificationById(id);
      if (!notification.success) return notification;

      return {
        success: true,
        data: {
          ...notification.data,
          archived: true,
          archivedAt: new Date().toISOString()
        }
      };
    }

    return this.put(`/${id}/archive`);
  }

  /**
   * Obtener notificaciones archivadas
   * @param {string} userId - ID del usuario
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getArchivedNotifications(userId, filters = {}) {
    if (this.isUsingMockData) {
      // Mock: filtrar notificaciones archivadas
      return mockNotificationsService.getNotifications(userId, {
        ...filters,
        archived: true
      });
    }

    return this.get(`/user/${userId}/archived`, filters);
  }
}

export const notificationsService = new NotificationsService();
export default notificationsService;