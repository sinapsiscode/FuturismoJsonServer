import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import {
  MESSAGE_TYPES,
  MESSAGE_STATUS,
  SENDER_IDS,
  SIMULATION_DELAYS,
  AVAILABLE_EMOJIS,
  SYSTEM_MESSAGE_KEYS,
  DEFAULT_MESSAGE_KEYS,
  FILE_CONFIG,
  CALL_PERMISSION_ROLES,
  MOCK_MESSAGE_TIMES
} from '../constants/chatWindowConstants';

/**
 * Hook para manejar la ventana de chat
 * @param {Object} chat - Datos del chat activo
 * @returns {Object} Estado y funciones del chat
 */
const useChatWindow = (chat) => {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get initial messages based on chat type
  const getInitialMessages = useCallback(() => {
    if (chat?.isFromAgenda) {
      return [
        {
          id: '1',
          senderId: SENDER_IDS.SYSTEM,
          senderName: 'System',
          content: SYSTEM_MESSAGE_KEYS.COORDINATION_STARTED,
          contentData: { name: chat.name },
          timestamp: new Date(),
          type: MESSAGE_TYPES.SYSTEM,
          status: MESSAGE_STATUS.READ
        }
      ];
    }
    
    return [
      {
        id: '1',
        senderId: chat?.id,
        senderName: chat?.name,
        content: DEFAULT_MESSAGE_KEYS.HOW_IS_EVERYONE,
        timestamp: new Date(Date.now() - MOCK_MESSAGE_TIMES.ONE_HOUR_AGO),
        type: MESSAGE_TYPES.TEXT,
        status: MESSAGE_STATUS.READ
      },
      {
        id: '2',
        senderId: SENDER_IDS.CURRENT_USER,
        senderName: 'You',
        content: DEFAULT_MESSAGE_KEYS.READY_FOR_TOUR,
        timestamp: new Date(Date.now() - MOCK_MESSAGE_TIMES.FIFTY_MINUTES_AGO),
        type: MESSAGE_TYPES.TEXT,
        status: MESSAGE_STATUS.READ
      },
      {
        id: '3',
        senderId: chat?.id,
        senderName: chat?.name,
        content: DEFAULT_MESSAGE_KEYS.MEETING_POINT,
        timestamp: new Date(Date.now() - MOCK_MESSAGE_TIMES.FORTY_MINUTES_AGO),
        type: MESSAGE_TYPES.TEXT,
        status: MESSAGE_STATUS.READ
      },
      {
        id: '4',
        senderId: chat?.id,
        senderName: chat?.name,
        content: 'location',
        timestamp: new Date(Date.now() - MOCK_MESSAGE_TIMES.THIRTY_NINE_MINUTES_AGO),
        type: MESSAGE_TYPES.LOCATION,
        location: {
          name: 'Plaza de Armas de Lima',
          address: 'Cercado de Lima 15001',
          lat: -12.0464,
          lng: -77.0428
        },
        status: MESSAGE_STATUS.READ
      },
      {
        id: '5',
        senderId: SENDER_IDS.CURRENT_USER,
        senderName: 'You',
        content: DEFAULT_MESSAGE_KEYS.UNDERSTOOD,
        timestamp: new Date(Date.now() - MOCK_MESSAGE_TIMES.THIRTY_MINUTES_AGO),
        type: MESSAGE_TYPES.TEXT,
        status: MESSAGE_STATUS.DELIVERED
      },
      {
        id: '6',
        senderId: chat?.id,
        senderName: chat?.name,
        content: DEFAULT_MESSAGE_KEYS.SHARE_ITINERARY,
        timestamp: new Date(Date.now() - MOCK_MESSAGE_TIMES.TEN_MINUTES_AGO),
        type: MESSAGE_TYPES.TEXT,
        status: MESSAGE_STATUS.READ
      },
      {
        id: '7',
        senderId: chat?.id,
        senderName: chat?.name,
        content: 'document',
        timestamp: new Date(Date.now() - MOCK_MESSAGE_TIMES.NINE_MINUTES_AGO),
        type: MESSAGE_TYPES.DOCUMENT,
        document: {
          name: 'Itinerario_City_Tour_Lima.pdf',
          size: '2.5 MB'
        },
        status: MESSAGE_STATUS.READ
      },
      {
        id: '8',
        senderId: SENDER_IDS.CURRENT_USER,
        senderName: 'You',
        content: chat?.typing ? '' : DEFAULT_MESSAGE_KEYS.LEAVING_HOTEL,
        timestamp: new Date(Date.now() - MOCK_MESSAGE_TIMES.FIVE_MINUTES_AGO),
        type: MESSAGE_TYPES.TEXT,
        status: MESSAGE_STATUS.SENT
      }
    ];
  }, [chat]);

  const [messages, setMessages] = useState(() => getInitialMessages());

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      content: message,
      timestamp: new Date(),
      type: MESSAGE_TYPES.TEXT,
      status: MESSAGE_STATUS.SENT
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate message status change
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: MESSAGE_STATUS.DELIVERED } : msg
      ));
    }, SIMULATION_DELAYS.STATUS_TO_DELIVERED);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: MESSAGE_STATUS.READ } : msg
      ));
    }, SIMULATION_DELAYS.STATUS_TO_READ);
  }, [message, messages]);

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
    
    // Constantes
    MESSAGE_TYPES,
    MESSAGE_STATUS,
    FILE_CONFIG
  };
};

export default useChatWindow;