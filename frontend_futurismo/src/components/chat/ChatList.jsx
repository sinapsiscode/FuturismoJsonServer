import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, ChatBubbleLeftRightIcon, CheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';
import useChatList from '../../hooks/useChatList';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const { t } = useTranslation();
  const {
    searchTerm,
    setSearchTerm,
    filteredChats,
    getStatusIcon,
    getMessageStatus
  } = useChatList();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Search header */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('chat.searchConversation')}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>{t('chat.noConversations')}</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedChatId === chat.id ? 'bg-primary-50 border-l-4 border-primary-500' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {chat.type === 'group' ? (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-primary-600" />
                  </div>
                ) : (
                  <>
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {getStatusIcon(chat) && (
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        getStatusIcon(chat) ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    )}
                  </>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 truncate">
                    {chat.name}
                    {chat.type === 'group' && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({t('chat.members', { count: chat.members })})
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-2">
                    {getMessageStatus(chat) === 'read' && (
                      <CheckIcon className="w-4 h-4 text-blue-500" />
                    )}
                    {getMessageStatus(chat) === 'delivered' && (
                      <CheckIcon className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500">
                      {formatters.formatRelativeTime(chat.lastMessageTime)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {chat.typing && chat.typingUser ? (
                      <span className="text-primary-600 italic">{t(chat.typingUser)}</span>
                    ) : (
                      t(chat.lastMessage)
                    )}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with statistics */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{t('chat.conversationCount', { count: filteredChats.length })}</span>
          <span>
            {t('chat.unreadCount', { count: filteredChats.filter(c => c.unreadCount > 0).length })}
          </span>
        </div>
      </div>
    </div>
  );
};

ChatList.propTypes = {
  onSelectChat: PropTypes.func.isRequired,
  selectedChatId: PropTypes.string
};

export default ChatList;