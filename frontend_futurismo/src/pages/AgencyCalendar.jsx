import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlusIcon,
  EyeIcon,
  FunnelIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import useAgencyStore from '../stores/agencyStore';

const AgencyCalendar = () => {
  const { t } = useTranslation();
  const { actions } = useAgencyStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [filterStatus, setFilterStatus] = useState('all');
  const [calendarData, setCalendarData] = useState({});

  // Obtener datos del calendario para el mes actual
  useEffect(() => {
    const fetchData = async () => {
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      try {
        const data = await actions.fetchCalendarData(start, end);
        setCalendarData(data || {});
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setCalendarData({});
      }
    };
    
    fetchData();
  }, [currentDate, actions]);

  // Generar días del calendario
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    // Agregar días del mes anterior para completar la semana
    const startDay = getDay(start);
    const prevDays = [];
    for (let i = startDay - 1; i >= 0; i--) {
      const day = new Date(start);
      day.setDate(day.getDate() - (i + 1));
      prevDays.push(day);
    }
    
    // Agregar días del mes siguiente para completar la semana
    const endDay = getDay(end);
    const nextDays = [];
    for (let i = 1; i <= (6 - endDay); i++) {
      const day = new Date(end);
      day.setDate(day.getDate() + i);
      nextDays.push(day);
    }
    
    return [...prevDays, ...days, ...nextDays];
  }, [currentDate]);

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(prev => subMonths(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateKey = format(date, 'yyyy-MM-dd');
    if (calendarData[dateKey]) {
      // Aquí podrías abrir un modal con los detalles del día
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="w-3 h-3" />;
      case 'pending':
        return <ExclamationTriangleIcon className="w-3 h-3" />;
      case 'cancelled':
        return <XCircleIcon className="w-3 h-3" />;
      default:
        return <ClockIcon className="w-3 h-3" />;
    }
  };

  const filteredReservations = (reservations) => {
    if (filterStatus === 'all') return reservations;
    return reservations.filter(res => res.status === filterStatus);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="w-8 h-8 mr-3 text-blue-500" />
            Calendario de Reservas
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus reservas y espacios disponibles
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">Todos los estados</option>
              <option value="confirmed">Confirmadas</option>
              <option value="pending">Pendientes</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowReservationModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Nueva Reserva</span>
          </button>
        </div>
      </div>

      {/* Navegación del calendario */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>

        {/* Calendario */}
        <div className="p-4">
          {/* Encabezados de días */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Días del calendario */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const dayData = calendarData[dateKey];
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateKey;
              const reservations = dayData?.reservations || [];
              const filteredRes = filteredReservations(reservations);

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`
                    min-h-24 p-1 border border-gray-200 cursor-pointer transition-all duration-200
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isToday(date) ? 'ring-2 ring-blue-500' : ''}
                    ${isSelected ? 'bg-blue-50' : ''}
                    hover:bg-gray-50
                  `}
                >
                  {/* Número del día */}
                  <div className={`
                    text-sm font-medium mb-1
                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${isToday(date) ? 'text-blue-600 font-bold' : ''}
                  `}>
                    {format(date, 'd')}
                  </div>

                  {/* Reservas del día */}
                  {isCurrentMonth && filteredRes.length > 0 && (
                    <div className="space-y-1">
                      {filteredRes.slice(0, 2).map((reservation, idx) => (
                        <div
                          key={idx}
                          className={`
                            text-xs p-1 rounded border truncate
                            ${getStatusColor(reservation.status)}
                          `}
                          title={`${reservation.serviceType} - ${reservation.clientName}`}
                        >
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(reservation.status)}
                            <span className="truncate">{reservation.serviceType}</span>
                          </div>
                        </div>
                      ))}
                      {filteredRes.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{filteredRes.length - 2} más
                        </div>
                      )}
                    </div>
                  )}

                  {/* Indicador de ingresos */}
                  {isCurrentMonth && dayData?.totalRevenue > 0 && (
                    <div className="mt-1 text-xs text-green-600 font-medium">
                      S/. {dayData.totalRevenue}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resumen del mes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(calendarData).reduce((sum, day) => sum + day.reservations.length, 0)}
              </p>
              <p className="text-sm text-gray-600">{t('dashboard.totalReservations')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                S/. {Object.values(calendarData).reduce((sum, day) => sum + day.totalRevenue, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">{t('dashboard.incomeByMonth')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(calendarData).reduce((sum, day) => sum + day.totalParticipants, 0)}
              </p>
              <p className="text-sm text-gray-600">{t('dashboard.totalTourists')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(calendarData).reduce((sum, day) => 
                  sum + day.reservations.filter(r => r.status === 'confirmed').length, 0
                )}
              </p>
              <p className="text-sm text-gray-600">Confirmadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de reservas del día seleccionado */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Reservas del {format(selectedDate, 'd \'de\' MMMM \'de\' yyyy', { locale: es })}
            </h3>
          </div>
          
          <div className="p-6">
            {(() => {
              const dateKey = format(selectedDate, 'yyyy-MM-dd');
              const dayReservations = filteredReservations(calendarData[dateKey]?.reservations || []);
              
              if (dayReservations.length === 0) {
                return (
                  <div className="text-center py-8">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No hay reservas para este día
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Puedes crear una nueva reserva para esta fecha.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {dayReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {reservation.serviceType}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(reservation.status)}`}>
                              {reservation.status === 'confirmed' ? 'Confirmada' : 
                               reservation.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <UserGroupIcon className="w-4 h-4" />
                              <span>{reservation.clientName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="w-4 h-4" />
                              <span>{reservation.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <UserGroupIcon className="w-4 h-4" />
                              <span>{reservation.participants} personas</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CurrencyDollarIcon className="w-4 h-4" />
                              <span>S/. {reservation.totalAmount}</span>
                            </div>
                          </div>
                          
                          {reservation.guideAssigned && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Guía asignado:</span> {reservation.guideAssigned}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyCalendar;