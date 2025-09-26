import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ClockIcon } from '@heroicons/react/24/outline';

const TimeSlotList = ({ timeSlots, viewMode, onAddSlot, onRemoveSlot }) => {
  const { t } = useTranslation();
  const [newSlot, setNewSlot] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddSlot = () => {
    if (!showInput) {
      setShowInput(true);
      return;
    }

    if (newSlot && /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(newSlot)) {
      const success = onAddSlot(newSlot);
      if (success) {
        setNewSlot('');
        setShowInput(false);
      }
    }
  };

  const handleCancel = () => {
    setNewSlot('');
    setShowInput(false);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Mobile-first responsive header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h5 className="text-sm sm:text-base font-medium text-gray-900 flex items-center">
          <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-600 flex-shrink-0" />
          <span className="leading-tight">{t('guides.availability.timeSlots')}</span>
        </h5>
        {viewMode === 'edit' && !showInput && (
          <button
            onClick={handleAddSlot}
            className="
              px-3 sm:px-4 py-2 sm:py-2
              bg-blue-600 text-white 
              text-xs sm:text-sm font-medium
              rounded-lg 
              hover:bg-blue-700 active:bg-blue-800
              transition-colors duration-200
              touch-manipulation
              flex items-center justify-center
              w-full sm:w-auto
            "
          >
            + {t('guides.availability.addSlot')}
          </button>
        )}
      </div>

      {/* Mobile-first responsive input form */}
      {showInput && (
        <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            {t('guides.availability.enterTimeSlot')}
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              placeholder="09:00-13:00"
              className="
                flex-1 px-3 py-2.5 sm:py-2
                text-sm sm:text-base
                border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors
              "
              autoFocus
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleAddSlot}
                className="
                  flex-1 sm:flex-initial
                  px-4 py-2.5 sm:py-2
                  bg-blue-600 text-white 
                  text-sm font-medium
                  rounded-lg 
                  hover:bg-blue-700 active:bg-blue-800
                  transition-colors duration-200
                  touch-manipulation
                "
              >
                {t('common.add')}
              </button>
              <button
                onClick={handleCancel}
                className="
                  flex-1 sm:flex-initial
                  px-4 py-2.5 sm:py-2
                  bg-gray-200 text-gray-700 
                  text-sm font-medium
                  rounded-lg 
                  hover:bg-gray-300 active:bg-gray-400
                  transition-colors duration-200
                  touch-manipulation
                "
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xs text-gray-600 leading-relaxed">
            {t('guides.availability.slotFormat')}
          </p>
        </div>
      )}

      {/* Mobile-first responsive time slots list */}
      <div className="space-y-2 sm:space-y-3">
        {timeSlots?.length > 0 ? (
          timeSlots.map((slot, index) => (
            <div
              key={index}
              className="
                flex items-center justify-between 
                p-3 sm:p-4 
                bg-gray-50 rounded-lg border
                transition-colors hover:bg-gray-100
              "
            >
              <span className="text-gray-700 font-medium text-sm sm:text-base">{slot}</span>
              {viewMode === 'edit' && (
                <button
                  onClick={() => onRemoveSlot(index)}
                  className="
                    text-red-600 hover:text-red-800 active:text-red-900
                    text-xs sm:text-sm font-medium
                    px-2 py-1 rounded
                    hover:bg-red-50
                    transition-all duration-200
                    touch-manipulation
                  "
                >
                  {t('common.remove')}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 sm:p-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              {t('guides.availability.noSlots')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

TimeSlotList.propTypes = {
  timeSlots: PropTypes.arrayOf(PropTypes.string),
  viewMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  onAddSlot: PropTypes.func.isRequired,
  onRemoveSlot: PropTypes.func.isRequired
};

export default TimeSlotList;