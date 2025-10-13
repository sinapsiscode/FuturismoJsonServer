import { useState, useEffect } from 'react';

const useChatList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState([]);

  // TODO: Cargar chats desde la API /api/conversations o /api/messages/conversations
  useEffect(() => {
    const loadChats = async () => {
      try {
        // Por ahora retorna array vacío
        // En el futuro: const response = await fetch('/api/conversations');
        // const result = await response.json();
        // setChats(result.data || []);
        setChats([]);
      } catch (error) {
        console.error('Error loading chats:', error);
        setChats([]);
      }
    };

    loadChats();
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (chat) => {
    if (chat.type === 'group') return null;
    return chat.online;
  };

  const getMessageStatus = (chat) => {
    if (chat.unreadCount > 0) return null;
    if (chat.type === 'client' || chat.type === 'group') return null;
    
    // Simulate sent/read message status
    const isRead = Math.random() > 0.5;
    return isRead ? 'read' : 'delivered';
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredChats,
    getStatusIcon,
    getMessageStatus
  };
};

export default useChatList;