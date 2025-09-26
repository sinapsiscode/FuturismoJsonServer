import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import useChatWindow from '../../hooks/useChatWindow';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatWindow = ({ chat, onClose }) => {
  const { t } = useTranslation();
  const {
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
    emojis
  } = useChatWindow(chat);


  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t('chat.selectToStart')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader 
        chat={chat} 
        canMakeCalls={canMakeCalls} 
        onClose={onClose} 
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isCurrentUser={msg.senderId === 'current-user'}
            isGroup={chat.type === 'group'}
          />
        ))}
        
        {chat.typing && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        message={message}
        setMessage={setMessage}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        emojis={emojis}
        fileInputRef={fileInputRef}
        onSendMessage={handleSendMessage}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};

ChatWindow.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['guide', 'client', 'group']).isRequired,
    avatar: PropTypes.string,
    online: PropTypes.bool,
    typing: PropTypes.bool,
    typingUser: PropTypes.string,
    isFromAgenda: PropTypes.bool,
    lastMessageTime: PropTypes.instanceOf(Date),
    members: PropTypes.number
  }),
  onClose: PropTypes.func.isRequired
};

export default ChatWindow;