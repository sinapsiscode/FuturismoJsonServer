import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ClockIcon } from '@heroicons/react/24/outline';

const TimeSlotModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingSlot = null,
  selectedDate 
}) => {
  const { t } = useTranslation();
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingSlot?.timeSlot) {
      const [start, end] = editingSlot.timeSlot.split('-');
      setStartTime(start || '09:00');
      setEndTime(end || '17:00');
    } else {
      setStartTime('09:00');
      setEndTime('17:00');
    }
    setError('');
  }, [editingSlot]);

  const validateTimeSlot = () => {
    if (!startTime || !endTime) {
      setError(t('agenda.errors.requiredTimes'));
      return false;
    }

    if (startTime >= endTime) {
      setError(t('agenda.errors.invalidTimeRange'));
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateTimeSlot()) return;

    const timeSlot = `${startTime}-${endTime}`;
    onSave(timeSlot);
    handleClose();
  };

  const handleClose = () => {
    setStartTime('09:00');
    setEndTime('17:00');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeslot-modal-title"
    >
      <div 
        className="modal-content p-6 w-96 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="w-5 h-5 text-blue-600" aria-hidden="true" />
          <h3 id="timeslot-modal-title" className="text-lg font-semibold">
            {editingSlot ? t('agenda.editTimeSlot') : t('agenda.addTimeSlot')}
          </h3>
        </div>
        
        {selectedDate && (
          <p className="text-sm text-gray-600 mb-4">
            {t('agenda.forDate', { date: new Date(selectedDate).toLocaleDateString() })}
          </p>
        )}
        
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="start-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t('agenda.startTime')}
            </label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setError('');
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-describedby={error ? 'time-error' : undefined}
            />
          </div>
          
          <div>
            <label 
              htmlFor="end-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t('agenda.endTime')}
            </label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setError('');
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-describedby={error ? 'time-error' : undefined}
            />
          </div>
          
          {error && (
            <p id="time-error" className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingSlot ? t('common.update') : t('common.add')}
          </button>
        </div>
      </div>
    </div>
  );
};

TimeSlotModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editingSlot: PropTypes.shape({
    date: PropTypes.string,
    index: PropTypes.number,
    timeSlot: PropTypes.string
  }),
  selectedDate: PropTypes.string
};

export default TimeSlotModal;