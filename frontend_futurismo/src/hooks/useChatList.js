import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import chatService from '../services/chatService';

const useChatList = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadChats = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const response = await chatService.getConversations(user.id);

        // Transform conversations to chat format
        const transformedChats = response.data.map(conv => {
          // Get other participant (not current user)
          const otherParticipant = conv.participants?.find(p => p.user_id !== user.id);
          const participantUser = otherParticipant?.user;

          return {
            id: conv.id,
            name: conv.title || participantUser?.name || 'Usuario',
            type: conv.type === 'group' ? 'group' : (participantUser?.role === 'guide' ? 'guide' : 'client'),
            avatar: participantUser?.avatar || `https://ui-avatars.com/api/?name=${participantUser?.name || 'User'}&background=3B82F6&color=fff`,
            lastMessage: conv.last_message?.content || 'Sin mensajes',
            lastMessageTime: conv.last_message?.created_at ? new Date(conv.last_message.created_at) : new Date(conv.created_at),
            unreadCount: conv.unread_count || 0,
            online: false, // TODO: Implement online status with WebSocket
            typing: false,
            members: conv.type === 'group' ? conv.participants?.length : undefined,
            // Store original conversation data
            _conversationData: conv
          };
        });

        setChats(transformedChats);
      } catch (error) {
        console.error('Error loading chats:', error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [user?.id]);

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