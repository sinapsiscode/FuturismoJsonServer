/**
 * Servicio de mensajes/chat
 * Maneja toda la lógica de mensajería con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';


class MessagesService extends BaseService {
  constructor() {
    super('/messages');
  }

  /**
   * Obtener todas las conversaciones del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getConversations(userId) {
return this.get('/conversations', { userId });
  }

  /**
   * Obtener mensajes de una conversación
   * @param {string} conversationId - ID de la conversación
   * @param {Object} filters - Filtros opcionales (page, limit)
   * @returns {Promise<Object>}
   */
  async getMessages(conversationId, filters = {}) {
return this.get(`/conversation/${conversationId}`, filters);
  }

  /**
   * Enviar mensaje
   * @param {Object} messageData - Datos del mensaje
   * @returns {Promise<Object>}
   */
  async sendMessage(messageData) {
return this.post('', messageData);
  }

  /**
   * Marcar mensajes como leídos
   * @param {string} conversationId - ID de la conversación
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async markAsRead(conversationId, userId) {
return this.put(`/conversation/${conversationId}/read`, { userId });
  }

  /**
   * Eliminar mensaje
   * @param {string} messageId - ID del mensaje
   * @returns {Promise<Object>}
   */
  async deleteMessage(messageId) {
return this.delete(`/${messageId}`);
  }

  /**
   * Buscar mensajes
   * @param {string} searchTerm - Término de búsqueda
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async searchMessages(searchTerm, userId) {
return this.get('/search', { q: searchTerm, userId });
  }

  /**
   * Crear conversación grupal
   * @param {Object} groupData - Datos del grupo
   * @returns {Promise<Object>}
   */
  async createGroupConversation(groupData) {
return this.post('/conversations/group', groupData);
  }

  /**
   * Añadir participante a conversación grupal
   * @param {string} conversationId - ID de la conversación
   * @param {string} participantId - ID del participante
   * @returns {Promise<Object>}
   */
  async addParticipant(conversationId, participantId) {
return this.post(`/conversation/${conversationId}/participants`, { participantId });
  }

  /**
   * Eliminar participante de conversación grupal
   * @param {string} conversationId - ID de la conversación
   * @param {string} participantId - ID del participante
   * @returns {Promise<Object>}
   */
  async removeParticipant(conversationId, participantId) {
return this.delete(`/conversation/${conversationId}/participants/${participantId}`);
  }

  /**
   * Establecer estado de typing
   * @param {string} conversationId - ID de la conversación
   * @param {string} userId - ID del usuario
   * @param {boolean} isTyping - Estado de typing
   * @returns {Promise<Object>}
   */
  async setTypingStatus(conversationId, userId, isTyping) {
return this.post(`/conversation/${conversationId}/typing`, { userId, isTyping });
  }

  /**
   * Subir archivo adjunto
   * @param {File} file - Archivo a subir
   * @returns {Promise<Object>}
   */
  async uploadAttachment(file) {
const formData = new FormData();
    formData.append('file', file);
    
    return this.post('/attachments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Obtener contador de mensajes no leídos
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getUnreadCount(userId) {

return this.get('/unread-count', { userId });
  }

  /**
   * Archivar conversación
   * @param {string} conversationId - ID de la conversación
   * @returns {Promise<Object>}
   */
  async archiveConversation(conversationId) {

return this.put(`/conversation/${conversationId}/archive`);
  }

  /**
   * Desarchivar conversación
   * @param {string} conversationId - ID de la conversación
   * @returns {Promise<Object>}
   */
  async unarchiveConversation(conversationId) {

return this.put(`/conversation/${conversationId}/unarchive`);
  }

  /**
   * Obtener conversaciones archivadas
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getArchivedConversations(userId) {

return this.get('/conversations/archived', { userId });
  }

  /**
   * Configurar notificaciones de conversación
   * @param {string} conversationId - ID de la conversación
   * @param {boolean} muted - Estado de silenciado
   * @returns {Promise<Object>}
   */
  async setConversationNotifications(conversationId, muted) {

return this.put(`/conversation/${conversationId}/notifications`, { muted });
  }

  /**
   * Reenviar mensaje
   * @param {string} messageId - ID del mensaje a reenviar
   * @param {string} conversationId - ID de la conversación destino
   * @returns {Promise<Object>}
   */
  async forwardMessage(messageId, conversationId) {

return this.post(`/${messageId}/forward`, { conversationId });
  }

  /**
   * Obtener información de estado de conexión
   * @param {string[]} userIds - IDs de usuarios
   * @returns {Promise<Object>}
   */
  async getUsersStatus(userIds) {

return this.post('/users/status', { userIds });
  }
}

export const messagesService = new MessagesService();
export default messagesService;