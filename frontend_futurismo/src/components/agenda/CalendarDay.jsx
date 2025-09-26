import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { isToday, isPastDate } from '../../utils/dateHelpers';

const CalendarDay = ({
  date,
  availability,
  viewMode,
  isCurrentMonth = true,
  onToggleDay,
  onAddTimeSlot,
  onEditTimeSlot,
  onRemoveTimeSlot
}) => {
  const { t } = useTranslation();
  const dayNumber = new Date(date).getDate();
  const isAvailable = availability.disponible;
  const isPast = isPastDate(date);
  const isTodayDate = isToday(date);

  const getDayClasses = () => {
    const baseClasses = 'border border-gray-200 rounded-lg p-2 transition-all';
    const heightClass = viewMode === 'week' ? 'min-h-[150px]' : 'min-h-[100px]';
    
    let bgClass = 'bg-white hover:bg-gray-50';
    if (!isCurrentMonth) bgClass = 'bg-gray-50';
    if (isPast) bgClass = 'bg-gray-100';
    if (isTodayDate) bgClass = 'bg-blue-50';
    if (isAvailable && !isPast) bgClass = 'bg-green-50 hover:bg-green-100';
    
    return `${baseClasses} ${heightClass} ${bgClass}`;
  };

  const handleToggle = () => {
    if (!isPast && onToggleDay) {
      onToggleDay(date);
    }
  };

  const handleAddSlot = (e) => {
    e.stopPropagation();
    if (onAddTimeSlot) {
      onAddTimeSlot(date);
    }
  };

  const handleEditSlot = (index, timeSlot) => {
    if (onEditTimeSlot) {
      onEditTimeSlot(date, index, timeSlot);
    }
  };

  const handleRemoveSlot = (index) => {
    if (onRemoveTimeSlot) {
      onRemoveTimeSlot(date, index);
    }
  };

  return (
    <div 
      className={getDayClasses()}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleToggle();
        }
      }}
      aria-label={t('agenda.dayAriaLabel', { 
        date: new Date(date).toLocaleDateString(),
        status: isAvailable ? t('agenda.available') : t('agenda.notAvailable')
      })}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-medium ${
          isTodayDate ? 'text-blue-600' : 
          !isCurrentMonth ? 'text-gray-400' : 
          'text-gray-700'
        }`}>
          {dayNumber}
        </span>
        
        {!isPast && (
          <div className="flex items-center gap-1">
            {isAvailable ? (
              <CheckCircleIcon 
                className="w-5 h-5 text-green-600" 
                aria-label={t('agenda.available')}
              />
            ) : (
              <XCircleIcon 
                className="w-5 h-5 text-gray-400" 
                aria-label={t('agenda.notAvailable')}
              />
            )}
            
            {isAvailable && viewMode === 'week' && (
              <button
                onClick={handleAddSlot}
                className="p-1 hover:bg-white rounded transition-colors"
                title={t('agenda.addTimeSlot')}
                aria-label={t('agenda.addTimeSlot')}
              >
                <PlusIcon className="w-4 h-4 text-blue-600" />
              </button>
            )}
          </div>
        )}
      </div>

      {viewMode === 'week' && isAvailable && availability.horarios && (
        <div className="space-y-1">
          {availability.horarios.map((horario, index) => (
            <div
              key={index}
              className="bg-blue-100 rounded px-2 py-1 text-xs flex justify-between items-center group"
              role="listitem"
            >
              <span className="text-blue-800">{horario}</span>
              {!isPast && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSlot(index, horario);
                    }}
                    className="p-0.5 hover:bg-blue-200 rounded"
                    title={t('common.edit')}
                    aria-label={t('agenda.editTimeSlot')}
                  >
                    <PencilIcon className="w-3 h-3 text-blue-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSlot(index);
                    }}
                    className="p-0.5 hover:bg-red-200 rounded"
                    title={t('common.delete')}
                    aria-label={t('agenda.removeTimeSlot')}
                  >
                    <TrashIcon className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {viewMode === 'month' && isAvailable && availability.horarios?.length > 0 && (
        <div className="mt-1">
          <span className="text-xs text-green-600 font-medium">
            {availability.horarios.length} {t('agenda.slots')}
          </span>
        </div>
      )}
    </div>
  );
};

CalendarDay.propTypes = {
  date: PropTypes.string.isRequired,
  availability: PropTypes.shape({
    disponible: PropTypes.bool,
    horarios: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  viewMode: PropTypes.oneOf(['week', 'month']).isRequired,
  isCurrentMonth: PropTypes.bool,
  onToggleDay: PropTypes.func,
  onAddTimeSlot: PropTypes.func,
  onEditTimeSlot: PropTypes.func,
  onRemoveTimeSlot: PropTypes.func
};

export default CalendarDay;