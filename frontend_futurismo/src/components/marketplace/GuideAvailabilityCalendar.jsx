import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';

const GuideAvailabilityCalendar = ({ guide, selectedDate, onDateSelect, serviceDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState({});

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  useEffect(() => {
    // Simular carga de disponibilidad del guía
    generateMockAvailability();
  }, [currentMonth, guide]);

  const generateMockAvailability = () => {
    const availability = {};
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      // Verificar si el guía trabaja este día
      const worksThisDay = guide.availability.workingDays.includes(dayOfWeek);
      
      if (worksThisDay) {
        // Generar slots de disponibilidad
        availability[dateKey] = {
          available: true,
          slots: [
            { startTime: '08:00', endTime: '12:00', booked: Math.random() > 0.7 },
            { startTime: '14:00', endTime: '18:00', booked: Math.random() > 0.8 }
          ]
        };
      } else {
        availability[dateKey] = {
          available: false,
          slots: []
        };
      }
    }

    setAvailability(availability);
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const isDateAvailable = (day) => {
    if (!day) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateKey = date.toISOString().split('T')[0];
    const dayAvailability = availability[dateKey];
    
    // No permitir fechas pasadas
    if (date < new Date().setHours(0, 0, 0, 0)) return false;
    
    // No permitir reservar con menos días de anticipación de los requeridos
    const daysUntilService = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilService < guide.availability.advanceBooking) return false;
    
    return dayAvailability?.available && dayAvailability.slots.some(slot => !slot.booked);
  };

  const isDateSelected = (day) => {
    if (!day || !selectedDate) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (day) => {
    if (!isDateAvailable(day)) return;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(date);
  };

  const getDateClassName = (day) => {
    if (!day) return 'invisible';
    
    const baseClass = 'p-2 text-center rounded-lg cursor-pointer transition-colors';
    
    if (isDateSelected(day)) {
      return `${baseClass} bg-cyan-600 text-white hover:bg-cyan-700`;
    }
    
    if (isDateAvailable(day)) {
      return `${baseClass} bg-green-50 text-green-700 hover:bg-green-100 font-medium`;
    }
    
    return `${baseClass} bg-gray-50 text-gray-400 cursor-not-allowed`;
  };

  const days = getDaysInMonth();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Disponibilidad del Guía</h3>
      
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={currentMonth <= new Date()}
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        
        <h4 className="text-lg font-medium text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => day && handleDateClick(day)}
            className={getDateClassName(day)}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span className="text-gray-600">Disponible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-gray-600">No disponible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-cyan-600 rounded"></div>
            <span className="text-gray-600">Seleccionado</span>
          </div>
        </div>
      </div>

      {/* Horarios disponibles para la fecha seleccionada */}
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            Horarios disponibles
          </h4>
          {(() => {
            const dateKey = selectedDate.toISOString().split('T')[0];
            const dayAvailability = availability[dateKey];
            
            if (!dayAvailability || !dayAvailability.available) {
              return (
                <p className="text-sm text-gray-500">
                  No hay horarios disponibles para esta fecha.
                </p>
              );
            }
            
            return (
              <div className="space-y-2">
                {dayAvailability.slots.map((slot, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      slot.booked
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    {slot.booked ? (
                      <div className="flex items-center gap-1 text-gray-500">
                        <XCircleIcon className="h-4 w-4" />
                        <span className="text-sm">Ocupado</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span className="text-sm">Disponible</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-4 text-sm text-gray-600">
        <p className="flex items-center gap-1">
          <InformationCircleIcon className="h-4 w-4" />
          Reserva con mínimo {guide.availability.advanceBooking} días de anticipación
        </p>
      </div>
    </div>
  );
};

GuideAvailabilityCalendar.propTypes = {
  guide: PropTypes.object.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
  serviceDate: PropTypes.string
};

export default GuideAvailabilityCalendar;