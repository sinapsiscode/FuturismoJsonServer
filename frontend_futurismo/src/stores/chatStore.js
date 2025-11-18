import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set, get) => ({
      // Estado
      conversations: {}, // { conversationId: { messages: [], lastUpdate: timestamp } }
      _updateTrigger: 0, // Trigger para forzar actualizaciones

      // Obtener mensajes de una conversación
      getMessages: (conversationId) => {
        const conversation = get().conversations[conversationId];
        return conversation?.messages || [];
      },

      // Agregar un mensaje a una conversación
      addMessage: (conversationId, message) => {
        console.log('💾 [chatStore] Guardando mensaje:', conversationId, message);
        set((state) => {
          const conversation = state.conversations[conversationId] || { messages: [] };
          const newConversations = {
            ...state.conversations,
            [conversationId]: {
              messages: [...conversation.messages, message],
              lastUpdate: new Date().toISOString()
            }
          };
          console.log('💾 [chatStore] Total de mensajes ahora:', newConversations[conversationId].messages.length);
          return {
            conversations: newConversations,
            _updateTrigger: state._updateTrigger + 1
          };
        });
      },

      // Actualizar un mensaje (para cambiar status, por ejemplo)
      updateMessage: (conversationId, messageId, updates) => {
        set((state) => {
          const conversation = state.conversations[conversationId];
          if (!conversation) return state;

          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conversation,
                messages: conversation.messages.map(msg =>
                  msg.id === messageId ? { ...msg, ...updates } : msg
                )
              }
            },
            _updateTrigger: state._updateTrigger + 1
          };
        });
      },

      // Inicializar conversación con mensajes por defecto (solo si no existe)
      initConversation: (conversationId, initialMessages) => {
        console.log('🆕 [chatStore] Inicializando conversación:', conversationId, 'con', initialMessages.length, 'mensajes');
        set((state) => {
          // Si ya existe la conversación, no la sobrescribir
          if (state.conversations[conversationId]) {
            console.log('⚠️ [chatStore] Conversación ya existe, no se sobrescribe');
            return state;
          }

          console.log('✅ [chatStore] Conversación creada');
          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                messages: initialMessages,
                lastUpdate: new Date().toISOString()
              }
            },
            _updateTrigger: state._updateTrigger + 1
          };
        });
      },

      // Limpiar una conversación
      clearConversation: (conversationId) => {
        set((state) => {
          const newConversations = { ...state.conversations };
          delete newConversations[conversationId];

          return {
            conversations: newConversations
          };
        });
      },

      // Limpiar todas las conversaciones
      clearAllConversations: () => {
        set({ conversations: {} });
      }
    }),
    {
      name: 'chat-storage', // nombre en localStorage
      partialize: (state) => ({
        conversations: state.conversations
      })
    }
  )
);

export default useChatStore;
