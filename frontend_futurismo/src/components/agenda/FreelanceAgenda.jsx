import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon } from '@heroicons/react/24/outline';

// Components
import CalendarHeader from './CalendarHeader';
import CalendarDay from './CalendarDay';
import TimeSlotModal from './TimeSlotModal';

// Hooks
import useFreelanceAgenda from '../../hooks/useFreelanceAgenda';

// Utils
import { 
  generateWeekDates, 
  generateMonthDates, 
  getDayNames,
  addDays,
  addWeeks,
  addMonths 
} from '../../utils/dateHelpers';

const FreelanceAgenda = () => {
  const { t, i18n } = useTranslation();
  const {
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    freelanceUser,
    isLoading,
    error,
    getAvailabilityForDate,
    toggleDayAvailability,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot
  } = useFreelanceAgenda();

  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  // Generar fechas según el modo de vista
  const weekDates = generateWeekDates(selectedDate);
  const monthDates = generateMonthDates(selectedDate);
  const currentDates = viewMode === 'week' ? weekDates : monthDates;
  const dayNames = getDayNames(i18n.language);

  // Navegación
  const handleNavigate = (direction) => {
    if (direction === 'today') {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    } else if (viewMode === 'week') {
      setSelectedDate(addDays(selectedDate, direction));
    } else {
      setSelectedDate(addMonths(selectedDate, direction > 0 ? 1 : -1));
    }
  };

  // Manejo de horarios
  const handleAddTimeSlot = (date) => {
    setSelectedDate(date);
    setEditingSlot(null);
    setShowModal(true);
  };

  const handleEditTimeSlot = (date, index, timeSlot) => {
    setEditingSlot({ date, index, timeSlot });
    setShowModal(true);
  };

  const handleSaveTimeSlot = async (timeSlot) => {
    if (editingSlot) {
      await updateTimeSlot(editingSlot.date, editingSlot.index, timeSlot);
    } else {
      await addTimeSlot(selectedDate, timeSlot);
    }
    setShowModal(false);
    setEditingSlot(null);
  };

  // Verificar si una fecha pertenece al mes actual
  const isCurrentMonth = (date) => {
    if (viewMode === 'week') return true;
    const dateObj = new Date(date);
    const selectedObj = new Date(selectedDate);
    return dateObj.getMonth() === selectedObj.getMonth();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">{t('common.loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{t('errors.loadingAgenda')}: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <CalendarIcon className="w-6 h-6 text-blue-600" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-800">
          {t('agenda.myAgenda')}
        </h1>
      </div>

      <CalendarHeader
        currentDate={selectedDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNavigate={handleNavigate}
      />

      {/* Días de la semana */}
      <div className={`grid grid-cols-7 gap-2 mb-2`}>
        {dayNames.map((day, index) => (
          <div 
            key={day} 
            className="text-center text-sm font-medium text-gray-600 py-2"
            aria-label={dayNames[index]}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div 
        className={`grid grid-cols-7 gap-2`}
        role="grid"
        aria-label={t('agenda.calendar')}
      >
        {currentDates.map((date) => (
          <CalendarDay
            key={date}
            date={date}
            availability={getAvailabilityForDate(date)}
            viewMode={viewMode}
            isCurrentMonth={isCurrentMonth(date)}
            onToggleDay={toggleDayAvailability}
            onAddTimeSlot={handleAddTimeSlot}
            onEditTimeSlot={handleEditTimeSlot}
            onRemoveTimeSlot={removeTimeSlot}
          />
        ))}
      </div>

      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-gray-600">{t('agenda.available')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <span className="text-gray-600">{t('agenda.notAvailable')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span className="text-gray-600">{t('agenda.today')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-gray-600">{t('agenda.past')}</span>
        </div>
      </div>

      {/* Modal de horarios */}
      <TimeSlotModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSlot(null);
        }}
        onSave={handleSaveTimeSlot}
        editingSlot={editingSlot}
        selectedDate={editingSlot?.date || selectedDate}
      />
    </div>
  );
};

export default FreelanceAgenda;