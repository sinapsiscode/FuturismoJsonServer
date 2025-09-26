import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarDaysIcon,
  ViewColumnsIcon 
} from '@heroicons/react/24/outline';
import { getMonthName } from '../../utils/dateHelpers';

const CalendarHeader = ({ 
  currentDate, 
  viewMode, 
  onViewModeChange, 
  onNavigate 
}) => {
  const { t } = useTranslation();
  const monthYear = getMonthName(currentDate);
  
  const handlePrevious = () => {
    const increment = viewMode === 'week' ? -7 : -30;
    onNavigate(increment);
  };
  
  const handleNext = () => {
    const increment = viewMode === 'week' ? 7 : 30;
    onNavigate(increment);
  };
  
  const handleToday = () => {
    onNavigate('today');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800" id="calendar-title">
          {monthYear}
        </h2>
        <button
          onClick={handleToday}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          aria-label={t('agenda.goToToday')}
        >
          {t('agenda.today')}
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        {/* View Mode Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1" role="group" aria-label={t('agenda.viewMode')}>
          <button
            onClick={() => onViewModeChange('week')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${
              viewMode === 'week' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-pressed={viewMode === 'week'}
          >
            <ViewColumnsIcon className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium">{t('agenda.week')}</span>
          </button>
          <button
            onClick={() => onViewModeChange('month')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${
              viewMode === 'month' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-pressed={viewMode === 'month'}
          >
            <CalendarDaysIcon className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium">{t('agenda.month')}</span>
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={viewMode === 'week' ? t('agenda.previousWeek') : t('agenda.previousMonth')}
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={viewMode === 'week' ? t('agenda.nextWeek') : t('agenda.nextMonth')}
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

CalendarHeader.propTypes = {
  currentDate: PropTypes.string.isRequired,
  viewMode: PropTypes.oneOf(['week', 'month']).isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default CalendarHeader;