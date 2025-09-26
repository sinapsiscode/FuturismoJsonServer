import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const DateNavigation = ({ selectedDate, onDateChange, onNavigate }) => {
  const { t, i18n } = useTranslation();

  const formatDate = (date) => {
    return date.toLocaleDateString(i18n.language === 'es' ? 'es-PE' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateMobile = (date) => {
    return date.toLocaleDateString(i18n.language === 'es' ? 'es-PE' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-lg shadow-sm border">
      {/* Mobile-first responsive navigation buttons */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-4">
        <button
          onClick={() => onNavigate(-1)}
          className="
            flex items-center justify-center
            p-2 sm:p-2
            hover:bg-gray-100 active:bg-gray-200
            rounded-lg 
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500
            touch-manipulation
          "
          aria-label={t('common.previousDay')}
        >
          <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>

        {/* Mobile-first responsive date display */}
        <div className="text-center flex-1 sm:flex-initial min-w-0">
          {/* Full date - hidden on mobile, shown on sm+ */}
          <h4 className="hidden sm:block text-base sm:text-lg font-medium text-gray-900 leading-tight">
            {formatDate(selectedDate)}
          </h4>
          
          {/* Compact date - shown on mobile only */}
          <h4 className="block sm:hidden text-sm font-medium text-gray-900">
            {formatDateMobile(selectedDate)}
          </h4>
          
          {/* Date picker input - mobile-first responsive */}
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="
              mt-1 sm:mt-2
              text-xs sm:text-sm 
              text-gray-600 
              border-none bg-transparent 
              text-center
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:rounded
              w-full sm:w-auto
              cursor-pointer
            "
            aria-label={t('common.selectDate')}
          />
        </div>

        <button
          onClick={() => onNavigate(1)}
          className="
            flex items-center justify-center
            p-2 sm:p-2
            hover:bg-gray-100 active:bg-gray-200
            rounded-lg 
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500
            touch-manipulation
          "
          aria-label={t('common.nextDay')}
        >
          <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

DateNavigation.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onDateChange: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default DateNavigation;