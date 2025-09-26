/**
 * Servicio mock de mensajes/chat
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';

// Base de datos mock de mensajes
const MOCK_MESSAGES_DB = [
  {
    id: '1',
    conversationId: 'conv-1',
    senderId: 'guide-1',
    senderName: 'Carlos Mendoza',
    senderAvatar: 'https://i.pravatar.cc/150?img=1',
    recipientId: 'admin',
    content: 'Ya estamos saliendo del hotel con el grupo',
    timestamp: new Date(Date.now() - 300000),
    type: 'text',
    status: 'delivered',
    attachments: []
  },
  {
    id: '2',
    conversationId: 'conv-1',
    senderId: 'admin',
    senderName: 'Admin',
    recipientId: 'guide-1',
    content: 'Perfecto Carlos, manténnos informados',
    timestamp: new Date(Date.now() - 240000),
    type: 'text',
    status: 'read',
    attachments: []
  },
  {
    id: '3',
    conversationId: 'conv-2',
    senderId: 'client-1',
    senderName: 'Ana López',
    senderAvatar: 'https://i.pravatar.cc/150?img=5',
    recipientId: 'admin',
    content: '¿Podrían confirmar la reserva para mañana?',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text',
    status: 'read',
    attachments: []
  }
];

// Base de datos mock de conversaciones
const MOCK_CONVERSATIONS_DB = [
  {
    id: 'conv-1',
    participants: ['guide-1', 'admin'],
    lastMessage: {
      content: 'Perfecto Carlos, manténnos informados',
      timestamp: new Date(Date.now() - 240000),
      senderId: 'admin'
    },
    unreadCount: 0,
    type: 'direct'
  },
  {
    id: 'conv-2',
    participants: ['client-1', 'admin'],
    lastMessage: {
      content: '¿Podrían confirmar la reserva para mañana?',
      timestamp: new Date(Date.now() - 3600000),
      senderId: 'client-1'
    },
    unreadCount: 0,
    type: 'direct'
  }
];

class MockMessagesService {
  constructor() {
    this.messages = [...MOCK_MESSAGES_DB];
    this.conversations = [...MOCK_CONVERSATIONS_DB];
    this.initializeStorage();
  }

  initializeStorage() {
    const messagesKey = `${APP_CONFIG.storage.prefix}mock_messages`;
    const conversationsKey = `${APP_CONFIG.storage.prefix}mock_conversations`;
    
    const storedMessages = localStorage.getItem(messagesKey);
    const storedConversations = localStorage.getItem(conversationsKey);
    
    if (storedMessages) {
      try {
        this.messages = JSON.parse(storedMessages);
      } catch (error) {
        console.warn('Error loading mock messages from storage:', error);
      }
    }
    
    if (storedConversations) {
      try {
        this.conversations = JSON.parse(storedConversations);
      } catch (error) {
        console.warn('Error loading mock conversations from storage:', error);
      }
    }
  }

  saveToStorage() {
    const messagesKey = `${APP_CONFIG.storage.prefix}mock_messages`;
    const conversationsKey = `${APP_CONFIG.storage.prefix}mock_conversations`;
    
    localStorage.setItem(messagesKey, JSON.stringify(this.messages));
    localStorage.setItem(conversationsKey, JSON.stringify(this.conversations));
  }

  async simulateDelay(ms = 300) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId() {
    return String(Date.now());
  }

  // Obtener todas las conversaciones
  async getConversations(userId) {
    await this.simulateDelay();
    
    const userConversations = this.conversations.filter(conv =>
      conv.participants.includes(userId)
    );
    
    // Enriquecer con información de participantes
    const enrichedConversations = userConversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p !== userId);
      const participant = this.getParticipantInfo(otherParticipant);
      
      return {
        ...conv,
        participant,
        lastMessage: {
          ...conv.lastMessage,
          isOwn: conv.lastMessage.senderId === userId
        }
      };
    });
    
    // Ordenar por último mensaje
    enrichedConversations.sort((a, b) => 
      new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    );
    
    return {
      success: true,
      data: enrichedConversations
    };
  }

  // Obtener mensajes de una conversación
  async getMessages(conversationId, filters = {}) {
    await this.simulateDelay();
    
    let messages = this.messages.filter(msg => msg.conversationId === conversationId);
    
    // Aplicar paginación
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedMessages = messages.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedMessages,
      pagination: {
        total: messages.length,
        page,
        limit,
        totalPages: Math.ceil(messages.length / limit)
      }
    };
  }

  // Enviar mensaje
  async sendMessage(messageData) {
    await this.simulateDelay();
    
    const newMessage = {
      id: this.generateId(),
      ...messageData,
      timestamp: new Date(),
      status: 'sent',
      attachments: messageData.attachments || []
    };
    
    this.messages.push(newMessage);
    
    // Actualizar conversación
    const conversationIndex = this.conversations.findIndex(
      conv => conv.id === messageData.conversationId
    );
    
    if (conversationIndex !== -1) {
      this.conversations[conversationIndex].lastMessage = {
        content: messageData.content,
        timestamp: newMessage.timestamp,
        senderId: messageData.senderId
      };
    } else {
      // Crear nueva conversación si no existe
      const newConversation = {
        id: messageData.conversationId || `conv-${this.generateId()}`,
        participants: [messageData.senderId, messageData.recipientId],
        lastMessage: {
          content: messageData.content,
          timestamp: newMessage.timestamp,
          senderId: messageData.senderId
        },
        unreadCount: 1,
        type: 'direct'
      };
      
      this.conversations.push(newConversation);
      newMessage.conversationId = newConversation.id;
    }
    
    this.saveToStorage();
    
    // Simular cambio de estado del mensaje
    setTimeout(() => {
      newMessage.status = 'delivered';
      this.saveToStorage();
    }, 1000);
    
    setTimeout(() => {
      newMessage.status = 'read';
      this.saveToStorage();
    }, 2000);
    
    return {
      success: true,
      data: newMessage
    };
  }

  // Marcar mensajes como leídos
  async markAsRead(conversationId, userId) {
    await this.simulateDelay();
    
    const messages = this.messages.filter(msg =>
      msg.conversationId === conversationId &&
      msg.recipientId === userId &&
      msg.status !== 'read'
    );
    
    messages.forEach(msg => {
      msg.status = 'read';
    });
    
    // Actualizar contador de no leídos
    const conversation = this.conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: { markedCount: messages.length }
    };
  }

  // Eliminar mensaje
  async deleteMessage(messageId) {
    await this.simulateDelay();
    
    const index = this.messages.findIndex(msg => msg.id === messageId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Mensaje no encontrado'
      };
    }
    
    this.messages.splice(index, 1);
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  // Buscar mensajes
  async searchMessages(searchTerm, userId) {
    await this.simulateDelay();
    
    const userConversations = this.conversations
      .filter(conv => conv.participants.includes(userId))
      .map(conv => conv.id);
    
    const searchResults = this.messages.filter(msg =>
      userConversations.includes(msg.conversationId) &&
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      success: true,
      data: searchResults
    };
  }

  // Obtener información del participante
  getParticipantInfo(participantId) {
    // Mock: información básica del participante
    const participants = {
      'guide-1': {
        id: 'guide-1',
        name: 'Carlos Mendoza',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'guide',
        status: 'online'
      },
      'guide-2': {
        id: 'guide-2',
        name: 'María García',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'guide',
        status: 'offline'
      },
      'client-1': {
        id: 'client-1',
        name: 'Ana López',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'client',
        status: 'online'
      },
      'admin': {
        id: 'admin',
        name: 'Administrador',
        avatar: 'https://i.pravatar.cc/150?img=8',
        role: 'admin',
        status: 'online'
      }
    };
    
    return participants[participantId] || {
      id: participantId,
      name: 'Usuario',
      avatar: 'https://i.pravatar.cc/150',
      role: 'user',
      status: 'offline'
    };
  }

  // Crear conversación grupal
  async createGroupConversation(groupData) {
    await this.simulateDelay();
    
    const newConversation = {
      id: `group-${this.generateId()}`,
      ...groupData,
      lastMessage: null,
      unreadCount: 0,
      type: 'group',
      createdAt: new Date().toISOString()
    };
    
    this.conversations.push(newConversation);
    this.saveToStorage();
    
    return {
      success: true,
      data: newConversation
    };
  }

  // Añadir participante a conversación grupal
  async addParticipant(conversationId, participantId) {
    await this.simulateDelay();
    
    const conversation = this.conversations.find(conv => conv.id === conversationId);
    
    if (!conversation) {
      return {
        success: false,
        error: 'Conversación no encontrada'
      };
    }
    
    if (conversation.type !== 'group') {
      return {
        success: false,
        error: 'Solo se pueden añadir participantes a conversaciones grupales'
      };
    }
    
    if (!conversation.participants.includes(participantId)) {
      conversation.participants.push(participantId);
      this.saveToStorage();
    }
    
    return {
      success: true,
      data: conversation
    };
  }

  // Eliminar participante de conversación grupal
  async removeParticipant(conversationId, participantId) {
    await this.simulateDelay();
    
    const conversation = this.conversations.find(conv => conv.id === conversationId);
    
    if (!conversation) {
      return {
        success: false,
        error: 'Conversación no encontrada'
      };
    }
    
    if (conversation.type !== 'group') {
      return {
        success: false,
        error: 'Solo se pueden eliminar participantes de conversaciones grupales'
      };
    }
    
    conversation.participants = conversation.participants.filter(p => p !== participantId);
    this.saveToStorage();
    
    return {
      success: true,
      data: conversation
    };
  }

  // Obtener estado de typing
  async setTypingStatus(conversationId, userId, isTyping) {
    // En una implementación real, esto se manejaría con WebSockets
    return {
      success: true,
      data: { conversationId, userId, isTyping }
    };
  }

  // Enviar archivo adjunto
  async uploadAttachment(file) {
    await this.simulateDelay(1000); // Simular tiempo de carga
    
    // Mock: simular URL del archivo cargado
    return {
      success: true,
      data: {
        id: this.generateId(),
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type
      }
    };
  }
}

export const mockMessagesService = new MockMessagesService();
export default mockMessagesService;