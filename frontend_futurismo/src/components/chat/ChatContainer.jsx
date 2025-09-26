import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import useChatContainer from '../../hooks/useChatContainer';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const ChatContainer = () => {
  const { t } = useTranslation();
  const {
    selectedChat,
    isMobileView,
    handleSelectChat,
    handleCloseChat
  } = useChatContainer();

  return (
    <div className="flex h-full bg-gray-50">
      {/* Chat list - hidden on mobile when chat is selected */}
      <div className={`w-full lg:w-80 ${isMobileView ? 'hidden lg:block' : 'block'}`}>
        <ChatList 
          onSelectChat={handleSelectChat} 
          selectedChatId={selectedChat?.id}
        />
      </div>

      {/* Chat window - visible on mobile when chat is selected */}
      <div className={`flex-1 ${!isMobileView && !selectedChat ? 'hidden lg:flex' : 'flex'}`}>
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat} 
            onClose={handleCloseChat}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('chat.welcome')}
              </h3>
              <p className="text-gray-500 max-w-sm">
                {t('chat.selectConversation')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ChatContainer.propTypes = {};

export default ChatContainer;