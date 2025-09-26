import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  FaceSmileIcon 
} from '@heroicons/react/24/outline';

const ChatInput = ({ 
  message, 
  setMessage, 
  showEmojiPicker, 
  setShowEmojiPicker, 
  emojis,
  fileInputRef,
  onSendMessage, 
  onFileSelect 
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSendMessage} className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-end gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label={t('chat.attachFile')}
        >
          <PaperClipIcon className="w-5 h-5" />
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onFileSelect}
          aria-label={t('chat.selectFile')}
        />

        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('chat.typeMessage')}
            className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 bg-white rounded-lg shadow-lg p-2 grid grid-cols-5 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setMessage(message + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label={t('chat.toggleEmojis')}
        >
          <FaceSmileIcon className="w-5 h-5" />
        </button>

        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('chat.sendMessage')}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

ChatInput.propTypes = {
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  showEmojiPicker: PropTypes.bool.isRequired,
  setShowEmojiPicker: PropTypes.func.isRequired,
  emojis: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileInputRef: PropTypes.object.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  onFileSelect: PropTypes.func.isRequired
};

export default ChatInput;