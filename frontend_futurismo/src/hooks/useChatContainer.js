import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const useChatContainer = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (window.innerWidth < 1024) {
      setIsMobileView(true);
    }
  };

  const handleCloseChat = () => {
    setIsMobileView(false);
    // Clear URL parameters when closing chat
    setSearchParams({});
  };

  // Effect to handle URL parameters (when coming from agenda)
  useEffect(() => {
    const guideId = searchParams.get('guide');
    const guideName = searchParams.get('name');
    
    if (guideId && guideName) {
      // Create a temporary chat for the guide (in a real app, this would come from backend)
      const guideChat = {
        id: `guide-${guideId}`,
        type: 'guide',
        name: decodeURIComponent(guideName),
        avatar: `https://i.pravatar.cc/150?img=${parseInt(guideId)}`,
        lastMessage: 'chat.fromAgenda',
        lastMessageTime: new Date(),
        unreadCount: 0,
        online: true,
        typing: false,
        isFromAgenda: true // Mark that it comes from agenda
      };
      
      setSelectedChat(guideChat);
      if (window.innerWidth < 1024) {
        setIsMobileView(true);
      }
    }
  }, [searchParams]);

  return {
    selectedChat,
    isMobileView,
    handleSelectChat,
    handleCloseChat
  };
};

export default useChatContainer;