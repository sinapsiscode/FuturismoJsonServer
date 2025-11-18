import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import chatService from '../services/chatService';
import {
  MESSAGE_TYPES,
  MESSAGE_STATUS,
  AVAILABLE_EMOJIS,
  FILE_CONFIG,
  CALL_PERMISSION_ROLES
} from '../constants/chatWindowConstants';

/**
 * Hook para manejar la ventana de chat
 * @param {Object} chat - Datos del chat activo
 * @returns {Object} Estado y funciones del chat
 */
const useChatWindow = (chat) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load messages from backend
  useEffect(() => {
    const loadMessages = async () => {
      if (!chat?.id) {
        setMessages([]);
        return;
      }

      setLoading(true);
      try {
        console.log('🔵 Cargando mensajes para conversación:', chat.id);
        const response = await chatService.getMessages(chat.id);

        // Transform messages to UI format
        const transformedMessages = response.data.map(msg => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.sender?.name || 'Usuario',
          content: msg.content,
          timestamp: new Date(msg.created_at),
          type: msg.message_type || MESSAGE_TYPES.TEXT,
          status: MESSAGE_STATUS.READ, // TODO: Implement real status
          metadata: msg.metadata,
          // Store original message data
          _originalData: msg
        }));

        setMessages(transformedMessages);
        console.log('✅ Mensajes cargados:', transformedMessages.length);

        // Mark messages as read
        if (transformedMessages.length > 0 && user?.id) {
          await chatService.markAsRead(chat.id, user.id);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chat?.id, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!message.trim() || !chat?.id || !user?.id || sending) return;

    const messageContent = message;
    setMessage(''); // Clear input immediately
    setSending(true);

    try {
      console.log('📤 Enviando mensaje a conversación:', chat.id);

      const response = await chatService.sendMessage(chat.id, {
        sender_id: user.id,
        content: messageContent,
        message_type: MESSAGE_TYPES.TEXT,
        metadata: {}
      });

      // Add new message to UI
      const newMessage = {
        id: response.data.id,
        senderId: response.data.sender_id,
        senderName: user.name || 'You',
        content: response.data.content,
        timestamp: new Date(response.data.created_at),
        type: response.data.message_type,
        status: MESSAGE_STATUS.SENT,
        metadata: response.data.metadata,
        _originalData: response.data
      };

      setMessages(prev => [...prev, newMessage]);
      console.log('✅ Mensaje enviado:', newMessage);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Restore message in input if failed
      setMessage(messageContent);
    } finally {
      setSending(false);
    }
  }, [message, chat?.id, user?.id, user?.name, sending]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file send
      // File handling would go here
    }
  }, []);

  const canMakeCalls = useMemo(
    () => CALL_PERMISSION_ROLES.includes(user?.role),
    [user?.role]
  );

  const emojis = useMemo(() => AVAILABLE_EMOJIS, []);

  return {
    message,
    setMessage,
    messages,
    showEmojiPicker,
    setShowEmojiPicker,
    messagesEndRef,
    fileInputRef,
    handleSendMessage,
    handleFileSelect,
    canMakeCalls,
    emojis,
    loading,
    sending,

    // Constantes
    MESSAGE_TYPES,
    MESSAGE_STATUS,
    FILE_CONFIG
  };
};

export default useChatWindow;