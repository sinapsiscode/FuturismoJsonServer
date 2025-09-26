import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  PhoneIcon, 
  VideoCameraIcon, 
  InformationCircleIcon, 
  XMarkIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';

const ChatHeader = ({ chat, canMakeCalls, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        {chat.type === 'group' ? (
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <UserGroupIcon className="w-5 h-5 text-primary-600" />
          </div>
        ) : (
          <div className="relative">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full"
            />
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{chat.name}</h3>
            {chat.isFromAgenda && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                {t('chat.coordination')}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {chat.isFromAgenda ? (
              t('chat.fromAgendaDescription')
            ) : chat.typing && chat.typingUser ? (
              <span className="text-primary-600">{t(chat.typingUser)}</span>
            ) : chat.online ? (
              t('chat.online')
            ) : (
              t('chat.lastSeen', { time: formatters.formatRelativeTime(chat.lastMessageTime) })
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Only agencies and admins can make calls */}
        {canMakeCalls && (
          <>
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label={t('chat.makeCall')}
            >
              <PhoneIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label={t('chat.makeVideoCall')}
            >
              <VideoCameraIcon className="w-5 h-5" />
            </button>
          </>
        )}
        <button 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label={t('chat.showInfo')}
        >
          <InformationCircleIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={onClose}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
          aria-label={t('chat.close')}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

ChatHeader.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['guide', 'client', 'group']).isRequired,
    avatar: PropTypes.string,
    online: PropTypes.bool,
    typing: PropTypes.bool,
    typingUser: PropTypes.string,
    isFromAgenda: PropTypes.bool,
    lastMessageTime: PropTypes.instanceOf(Date)
  }).isRequired,
  canMakeCalls: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ChatHeader;