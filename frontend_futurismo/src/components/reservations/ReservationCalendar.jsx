import { useState, useMemo } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, UserGroupIcon, ClockIcon, MapPinIcon, EyeIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, 
  endOfWeek, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatters } from '../../utils/formatters';
import ReservationDetail from './ReservationDetail';

const ReservationCalendar = ({ onNewReservation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [filters, setFilters] = useState({
    guide: 'all',
    tourType: 'all',
    status: 'all'
  });

  // Datos mock de reservas
  const mockReservations = [
    {
      id: 'RES001',
      tourName: 'City Tour Lima Histórica',
      clientName: 'Juan Pérez',
      date: new Date(2024, 1, 15),
      time: '09:00',
      adults: 2,
      children: 1,
      status: 'confirmada',
      guide: 'Carlos Mendoza',
      color: '#10b981'
    },
    {
      id: 'RES002',
      tourName: 'Tour Gastronómico',
      clientName: 'María García',
      date: new Date(2024, 1, 15),
      time: '14:00',
      adults: 4,
      status: 'pendiente',
      guide: 'Ana López',
      color: '#f59e0b'
    },
    {
      id: 'RES003',
      tourName: 'Islas Palomino',
      clientName: 'Carlos Rodríguez',
      date: new Date(2024, 1, 18),
      time: '06:00',
      adults: 3,
      children: 2,
      status: 'confirmada',
      guide: 'Pedro Sánchez',
      color: '#10b981'
    },
    {
      id: 'RES004',
      tourName: 'Pachacámac',
      clientName: 'Ana López',
      date: new Date(2024, 1, 20),
      time: '10:00',
      adults: 2,
      status: 'confirmada',
      guide: 'Carlos Mendoza',
      color: '#10b981'
    },
    {
      id: 'RES005',
      tourName: 'City Tour Lima',
      clientName: 'Luis Martínez',
      date: new Date(2024, 1, 22),
      time: '09:00',
      adults: 5,
      status: 'pendiente',
      guide: 'María García',
      color: '#f59e0b'
    }
  ];

  // Obtener días del mes
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  // Filtrar reservas
  const filteredReservations = useMemo(() => {
    return mockReservations.filter(reservation => {
      if (filters.guide !== 'all' && reservation.guide !== filters.guide) {
        return false;
      }
      if (filters.tourType !== 'all' && !reservation.tourName.toLowerCase().includes(filters.tourType.toLowerCase())) {
        return false;
      }
      if (filters.status !== 'all' && reservation.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Agrupar reservas por fecha
  const reservationsByDate = useMemo(() => {
    return filteredReservations.reduce((acc, reservation) => {
      const dateKey = format(reservation.date, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(reservation);
      return acc;
    }, {});
  }, [filteredReservations]);

  // Obtener listas únicas para filtros
  const uniqueGuides = Array.from(new Set(mockReservations.map(r => r.guide).filter(Boolean)));
  const uniqueTourTypes = Array.from(new Set(mockReservations.map(r => r.tourName)));

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayReservations = reservationsByDate[dateKey] || [];
    
    if (dayReservations.length === 1) {
      handleViewReservation(dayReservations[0]);
    }
  };

  const handleViewReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetail(true);
  };

  const getReservationsForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return reservationsByDate[dateKey] || [];
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
      {/* Header del calendario */}
      <div className="px-3 py-4 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex items-center justify-center gap-1 sm:justify-start">
              <button
                onClick={handlePreviousMonth}
                className="p-1.5 sm:p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1.5 sm:py-1 text-sm font-medium rounded hover:bg-gray-100 transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 sm:p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end">
            <button 
              onClick={onNewReservation}
              className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="sm:inline">Nueva Reserva</span>
            </button>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="mt-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          <div className="flex items-center gap-2 sm:flex-shrink-0">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 sm:flex-1">
            <select 
              value={filters.guide}
              onChange={(e) => setFilters({...filters, guide: e.target.value})}
              className="px-3 py-2 sm:py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:w-auto"
            >
              <option value="all">Todos los guías</option>
              {uniqueGuides.map(guide => (
                <option key={guide} value={guide}>{guide}</option>
              ))}
            </select>
            
            <select 
              value={filters.tourType}
              onChange={(e) => setFilters({...filters, tourType: e.target.value})}
              className="px-3 py-2 sm:py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:w-auto"
            >
              <option value="all">Todos los tours</option>
              {uniqueTourTypes.map(tour => (
                <option key={tour} value={tour}>{tour}</option>
              ))}
            </select>
            
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 sm:py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:w-auto"
            >
              <option value="all">Todos los estados</option>
              <option value="confirmada">Confirmadas</option>
              <option value="pendiente">Pendientes</option>
              <option value="cancelada">Canceladas</option>
            </select>
            
            {(filters.guide !== 'all' || filters.tourType !== 'all' || filters.status !== 'all') && (
              <button 
                onClick={() => setFilters({ guide: 'all', tourType: 'all', status: 'all' })}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium text-center sm:text-left"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="flex-1 p-3 sm:p-6">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-medium text-gray-600 py-1 sm:py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {calendarDays.map((day) => {
            const dayReservations = getReservationsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`
                  bg-white min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 cursor-pointer transition-colors
                  ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''}
                  ${isSelected ? 'ring-2 ring-primary-500' : ''}
                  ${isTodayDate ? 'bg-primary-50' : ''}
                  hover:bg-gray-50
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs sm:text-sm font-medium ${
                    isTodayDate ? 'text-primary-600' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayReservations.length > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-1 min-w-[16px] text-center">
                      {dayReservations.length}
                    </span>
                  )}
                </div>

                {/* Reservas del día - menos en móvil */}
                <div className="space-y-1">
                  {dayReservations.slice(0, 2).map((reservation) => (
                    <div
                      key={reservation.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewReservation(reservation);
                      }}
                      className={`
                        text-xs p-1 rounded truncate cursor-pointer
                        hover:opacity-80 transition-opacity
                      `}
                      style={{ backgroundColor: reservation.color + '20', color: reservation.color }}
                    >
                      <div className="font-medium truncate">
                        <span className="hidden sm:inline">{reservation.time} - </span>
                        {reservation.tourName}
                      </div>
                    </div>
                  ))}
                  {/* En desktop mostrar más reservas */}
                  <div className="hidden sm:block">
                    {dayReservations.slice(2, 3).map((reservation) => (
                      <div
                        key={reservation.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewReservation(reservation);
                        }}
                        className={`
                          text-xs p-1 rounded truncate cursor-pointer
                          hover:opacity-80 transition-opacity
                        `}
                        style={{ backgroundColor: reservation.color + '20', color: reservation.color }}
                      >
                        <div className="font-medium truncate">{reservation.time} - {reservation.tourName}</div>
                      </div>
                    ))}
                  </div>
                  {dayReservations.length > 2 && (
                    <div className="text-xs text-gray-500 text-center sm:hidden">
                      +{dayReservations.length - 2} más
                    </div>
                  )}
                  {dayReservations.length > 3 && (
                    <div className="text-xs text-gray-500 text-center hidden sm:block">
                      +{dayReservations.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen del día seleccionado */}
        {selectedDate && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
              {format(selectedDate, "d 'de' MMMM", { locale: es })}
            </h3>
            {getReservationsForDate(selectedDate).length === 0 ? (
              <p className="text-sm text-gray-500">No hay reservas para este día</p>
            ) : (
              <div className="space-y-2">
                {getReservationsForDate(selectedDate).map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: reservation.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{reservation.tourName}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {reservation.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <UserGroupIcon className="w-3 h-3" />
                            {reservation.adults + (reservation.children || 0)} pax
                          </span>
                          <span className="truncate">{reservation.clientName}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewReservation(reservation)}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      <EyeIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="px-3 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Confirmadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">Pendientes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Canceladas</span>
            </div>
          </div>
          <div className="text-sm text-gray-600 text-center sm:text-right">
            <span className="block sm:inline">Total del mes: {filteredReservations.filter(r => 
              isSameMonth(r.date, currentDate)
            ).length}</span>
            {(filters.guide !== 'all' || filters.tourType !== 'all' || filters.status !== 'all') && 
              <span className="text-xs text-gray-500 block sm:inline"> (filtrado)</span>
            }
          </div>
        </div>
      </div>

      {/* Modal de detalle */}
      {showDetail && selectedReservation && (
        <ReservationDetail
          reservation={selectedReservation}
          onClose={() => {
            setShowDetail(false);
            setSelectedReservation(null);
          }}
        />
      )}
    </div>
  );
};

export default ReservationCalendar;