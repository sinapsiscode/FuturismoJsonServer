import { useState } from 'react';

const useChatList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock chat data
  const mockChats = [
    {
      id: '1',
      type: 'guide',
      name: 'Carlos Mendoza',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'chat.messages.leavingHotel',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      online: true,
      typing: false
    },
    {
      id: '2',
      type: 'guide',
      name: 'María García',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastMessage: 'chat.messages.seeTomorrow',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      online: true,
      typing: false
    },
    {
      id: '3',
      type: 'client',
      name: 'Juan Pérez',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'chat.messages.includeLunch',
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 1,
      online: false,
      typing: false
    },
    {
      id: '4',
      type: 'group',
      name: 'Grupo Tour Machu Picchu',
      avatar: null,
      members: 8,
      lastMessage: 'chat.messages.thanksInfo',
      lastMessageTime: new Date(Date.now() - 14400000),
      unreadCount: 5,
      online: true,
      typing: true,
      typingUser: 'chat.typing.pedro'
    },
    {
      id: '5',
      type: 'guide',
      name: 'Pedro Sánchez',
      avatar: 'https://i.pravatar.cc/150?img=5',
      lastMessage: 'chat.messages.tourCompleted',
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 0,
      online: false,
      typing: false
    }
  ];

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
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