import React, { useEffect, useState } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { NOTIFICATION_TYPES } from '../../utils/constants';

const getToastStyles = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return {
        bg: 'bg-green-50 border-green-200',
        icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
        text: 'text-green-800'
      };
    case NOTIFICATION_TYPES.WARNING:
      return {
        bg: 'bg-yellow-50 border-yellow-200',
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
        text: 'text-yellow-800'
      };
    case NOTIFICATION_TYPES.ERROR:
      return {
        bg: 'bg-red-50 border-red-200',
        icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
        text: 'text-red-800'
      };
    default:
      return {
        bg: 'bg-blue-50 border-blue-200',
        icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
        text: 'text-blue-800'
      };
  }
};

const NotificationToast = ({ 
  notification, 
  onClose, 
  duration = 5000,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const styles = getToastStyles(notification.type);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  const handleClick = () => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-50 max-w-sm w-full ${positionClasses[position]} transition-all duration-300 ${
        isExiting 
          ? 'opacity-0 translate-y-2 scale-95' 
          : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      <div
        className={`${styles.bg} border rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow`}
        onClick={handleClick}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {styles.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${styles.text}`}>
              {notification.title}
            </h4>
            <p className={`text-sm mt-1 ${styles.text} opacity-80`}>
              {notification.message}
            </p>
            
            {notification.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white bg-opacity-50 mt-2">
                {notification.category}
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className={`flex-shrink-0 p-1 rounded-lg hover:bg-white hover:bg-opacity-20 ${styles.text}`}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 w-full bg-white bg-opacity-20 rounded-full h-1">
          <div 
            className="bg-current h-1 rounded-full transition-all ease-linear"
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;