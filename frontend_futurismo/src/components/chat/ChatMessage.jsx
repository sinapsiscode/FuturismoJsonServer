import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MapPinIcon, DocumentTextIcon, CheckIcon } from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';
import { useExternalServicesConfig } from '../../contexts/ConfigContext';

const ChatMessage = ({ message, isCurrentUser, isGroup }) => {
  const { t } = useTranslation();
  const externalServices = useExternalServicesConfig();
  const isSystemMessage = message.type === 'system';

  if (isSystemMessage) {
    return (
      <div className="flex justify-center mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 max-w-md">
          <p className="text-sm text-blue-800 text-center">
            {message.contentData 
              ? t(message.content, message.contentData)
              : t(message.content)
            }
          </p>
          <div className="text-xs text-blue-600 text-center mt-1">
            {formatters.formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
        {!isCurrentUser && isGroup && (
          <p className="text-xs text-gray-500 mb-1 ml-2">{message.senderName}</p>
        )}
        
        <div className={`relative rounded-lg px-4 py-2 ${
          isCurrentUser 
            ? 'bg-primary-500 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {message.type === 'text' && (
            <p className="text-sm">
              {message.content.startsWith('chat.') 
                ? t(message.content) 
                : message.content
              }
            </p>
          )}

          {message.type === 'location' && (
            <div className="cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <MapPinIcon className="w-4 h-4" />
                <span className="font-medium text-sm">{message.location.name}</span>
              </div>
              <p className="text-xs opacity-90">{message.location.address}</p>
              <div className="mt-2 h-32 bg-gray-200 rounded overflow-hidden">
                <img
                  src={externalServices.google_maps_api
                    ? `https://maps.googleapis.com/maps/api/staticmap?center=${message.location.lat},${message.location.lng}&zoom=15&size=300x150&markers=${message.location.lat},${message.location.lng}&key=${externalServices.google_maps_api}`
                    : `https://via.placeholder.com/300x150/e5e7eb/9ca3af?text=${encodeURIComponent(t('chat.mapNotAvailable') || 'Mapa no disponible')}`
                  }
                  alt={t('chat.map')}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {message.type === 'document' && (
            <div className="flex items-center gap-3 cursor-pointer">
              <DocumentTextIcon className="w-8 h-8" />
              <div>
                <p className="text-sm font-medium">{message.document.name}</p>
                <p className="text-xs opacity-90">{message.document.size}</p>
              </div>
            </div>
          )}

          {message.type === 'image' && (
            <div className="cursor-pointer">
              <img 
                src={message.image.url} 
                alt={t('chat.image')} 
                className="rounded max-w-full"
              />
            </div>
          )}

          <div className={`flex items-center gap-1 mt-1 ${
            isCurrentUser ? 'justify-end' : 'justify-start'
          }`}>
            <span className="text-xs opacity-75">
              {formatters.formatTime(message.timestamp)}
            </span>
            {isCurrentUser && (
              <span className="ml-1">
                {message.status === 'sent' && <CheckIcon className="w-3 h-3" />}
                {message.status === 'delivered' && <CheckIcon className="w-3 h-3" />}
                {message.status === 'read' && <CheckIcon className="w-3 h-3 text-blue-300" />}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    senderId: PropTypes.string.isRequired,
    senderName: PropTypes.string.isRequired,
    content: PropTypes.string,
    contentData: PropTypes.object,
    timestamp: PropTypes.instanceOf(Date).isRequired,
    type: PropTypes.oneOf(['text', 'image', 'document', 'location', 'system']).isRequired,
    status: PropTypes.oneOf(['sent', 'delivered', 'read']),
    location: PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number
    }),
    document: PropTypes.shape({
      name: PropTypes.string,
      size: PropTypes.string
    }),
    image: PropTypes.shape({
      url: PropTypes.string
    })
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  isGroup: PropTypes.bool.isRequired
};

export default ChatMessage;