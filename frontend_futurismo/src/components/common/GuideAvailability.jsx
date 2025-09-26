import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import useGuideAvailability from '../../hooks/useGuideAvailability';
import DateNavigation from './DateNavigation';
import TimeSlotList from './TimeSlotList';

const GuideAvailability = ({ guideId, viewMode = 'edit', onAvailabilityChange }) => {
  const { t } = useTranslation();
  const {
    selectedDate,
    setSelectedDate,
    availability,
    isLoading,
    addTimeSlot,
    removeTimeSlot,
    toggleAvailability,
    changeDate
  } = useGuideAvailability(guideId, onAvailabilityChange);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          {t('guides.availability.title')}
        </h3>
        {viewMode === 'edit' && (
          <button
            onClick={toggleAvailability}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              availability?.disponible
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {availability?.disponible 
              ? t('guides.availability.markUnavailable') 
              : t('guides.availability.markAvailable')
            }
          </button>
        )}
      </div>

      <DateNavigation
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onNavigate={changeDate}
      />

      {/* Estado de disponibilidad */}
      <div className="mb-6">
        <div className={`flex items-center p-4 rounded-lg ${
          availability?.disponible
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {availability?.disponible ? (
            <>
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                {t('guides.availability.available')}
              </span>
            </>
          ) : (
            <>
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">
                {t('guides.availability.notAvailable')}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Horarios disponibles */}
      {availability?.disponible && (
        <TimeSlotList
          timeSlots={availability.horarios}
          viewMode={viewMode}
          onAddSlot={addTimeSlot}
          onRemoveSlot={removeTimeSlot}
        />
      )}
    </div>
  );
};

GuideAvailability.propTypes = {
  guideId: PropTypes.string.isRequired,
  viewMode: PropTypes.oneOf(['edit', 'view']),
  onAvailabilityChange: PropTypes.func
};

export default GuideAvailability;