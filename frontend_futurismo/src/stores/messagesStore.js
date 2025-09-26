import { create } from 'zustand';
import { messagesService } from '../services/messagesService';

const useMessagesStore = create((set, get) => ({
  // Estado
  conversations: [],
  messages: {},
  selectedConversation: null,
  unreadCount: 0,
  typingUsers: {},
  isLoading: false,
  error: null,
  currentUserId: null,

  // Inicializar con ID de usuario
  initialize: async (userId) => {
    set({ currentUserId: userId });
    await get().loadConversations();
    await get().loadUnreadCount();
  },

  // Cargar conversaciones
  loadConversations: async () => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const result = await messagesService.getConversations(currentUserId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar conversaciones');
      }
      
      set({
        conversations: result.data,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Cargar mensajes de una conversación
  loadMessages: async (conversationId, page = 1) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await messagesService.getMessages(conversationId, { page, limit: 50 });
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar mensajes');
      }
      
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: {
            data: page === 1 ? result.data : [...(state.messages[conversationId]?.data || []), ...result.data],
            pagination: result.pagination
          }
        },
        isLoading: false
      }));
      
      // Marcar mensajes como leídos
      if (page === 1) {
        await get().markAsRead(conversationId);
      }
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Enviar mensaje
  sendMessage: async (messageData) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const fullMessageData = {
        ...messageData,
        senderId: currentUserId
      };
      
      const result = await messagesService.sendMessage(fullMessageData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al enviar mensaje');
      }
      
      // Agregar mensaje a la lista local
      set((state) => {
        const conversationId = result.data.conversationId;
        const currentMessages = state.messages[conversationId]?.data || [];
        
        return {
          messages: {
            ...state.messages,
            [conversationId]: {
              data: [...currentMessages, result.data],
              pagination: state.messages[conversationId]?.pagination
            }
          },
          isLoading: false
        };
      });
      
      // Actualizar conversación en la lista
      await get().loadConversations();
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Marcar mensajes como leídos
  markAsRead: async (conversationId) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    try {
      const result = await messagesService.markAsRead(conversationId, currentUserId);
      
      if (result.success) {
        // Actualizar contador de no leídos
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        }));
        
        await get().loadUnreadCount();
      }
    } catch (error) {
      console.error('Error al marcar como leído:', error);
    }
  },

  // Eliminar mensaje
  deleteMessage: async (messageId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await messagesService.deleteMessage(messageId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar mensaje');
      }
      
      // Eliminar mensaje de la lista local
      set((state) => {
        const updatedMessages = {};
        
        Object.keys(state.messages).forEach(convId => {
          updatedMessages[convId] = {
            ...state.messages[convId],
            data: state.messages[convId].data.filter(msg => msg.id !== messageId)
          };
        });
        
        return {
          messages: updatedMessages,
          isLoading: false
        };
      });
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Buscar mensajes
  searchMessages: async (searchTerm) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const result = await messagesService.searchMessages(searchTerm, currentUserId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al buscar mensajes');
      }
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Crear conversación grupal
  createGroupConversation: async (groupData) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const fullGroupData = {
        ...groupData,
        participants: [...groupData.participants, currentUserId]
      };
      
      const result = await messagesService.createGroupConversation(fullGroupData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear conversación grupal');
      }
      
      // Recargar conversaciones
      await get().loadConversations();
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Cargar contador de no leídos
  loadUnreadCount: async () => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    try {
      const result = await messagesService.getUnreadCount(currentUserId);
      
      if (result.success) {
        set({ unreadCount: result.data.totalUnread });
      }
    } catch (error) {
      console.error('Error al cargar contador de no leídos:', error);
    }
  },

  // Seleccionar conversación
  selectConversation: async (conversationId) => {
    set({ selectedConversation: conversationId });
    
    // Cargar mensajes si no están cargados
    const { messages } = get();
    if (!messages[conversationId]) {
      await get().loadMessages(conversationId);
    }
  },

  // Establecer estado de typing
  setTypingStatus: async (conversationId, isTyping) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    try {
      await messagesService.setTypingStatus(conversationId, currentUserId, isTyping);
    } catch (error) {
      console.error('Error al establecer estado de typing:', error);
    }
  },

  // Actualizar usuarios escribiendo
  updateTypingUsers: (conversationId, userId, isTyping) => {
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: isTyping
          ? [...(state.typingUsers[conversationId] || []), userId]
          : (state.typingUsers[conversationId] || []).filter(id => id !== userId)
      }
    }));
  },

  // Subir archivo adjunto
  uploadAttachment: async (file) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await messagesService.uploadAttachment(file);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al subir archivo');
      }
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Archivar conversación
  archiveConversation: async (conversationId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await messagesService.archiveConversation(conversationId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al archivar conversación');
      }
      
      // Recargar conversaciones
      await get().loadConversations();
      
      set({ isLoading: false });
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Configurar notificaciones de conversación
  setConversationNotifications: async (conversationId, muted) => {
    try {
      const result = await messagesService.setConversationNotifications(conversationId, muted);
      
      if (result.success) {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId ? { ...conv, muted } : conv
          )
        }));
      }
      
      return result.data;
    } catch (error) {
      console.error('Error al configurar notificaciones:', error);
      throw error;
    }
  },

  // Obtener mensajes de conversación actual
  getCurrentMessages: () => {
    const { selectedConversation, messages } = get();
    return selectedConversation ? messages[selectedConversation]?.data || [] : [];
  },

  // Obtener conversación actual
  getCurrentConversation: () => {
    const { selectedConversation, conversations } = get();
    return conversations.find(conv => conv.id === selectedConversation);
  },

  // Verificar si hay más mensajes para cargar
  hasMoreMessages: () => {
    const { selectedConversation, messages } = get();
    if (!selectedConversation || !messages[selectedConversation]) return false;
    
    const { pagination } = messages[selectedConversation];
    return pagination && pagination.page < pagination.totalPages;
  },

  // Cargar más mensajes
  loadMoreMessages: async () => {
    const { selectedConversation, messages } = get();
    if (!selectedConversation || !messages[selectedConversation]) return;
    
    const { pagination } = messages[selectedConversation];
    if (pagination && pagination.page < pagination.totalPages) {
      await get().loadMessages(selectedConversation, pagination.page + 1);
    }
  },

  // Limpiar mensajes de una conversación
  clearConversationMessages: (conversationId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: undefined
      }
    }));
  },

  // Establecer estado de carga
  setLoading: (isLoading) => set({ isLoading }),

  // Establecer error
  setError: (error) => set({ error }),

  // Limpiar error
  clearError: () => set({ error: null }),

  // Limpiar store
  clearStore: () => {
    set({
      conversations: [],
      messages: {},
      selectedConversation: null,
      unreadCount: 0,
      typingUsers: {},
      isLoading: false,
      error: null,
      currentUserId: null
    });
  }
}));

export { useMessagesStore };
export default useMessagesStore;