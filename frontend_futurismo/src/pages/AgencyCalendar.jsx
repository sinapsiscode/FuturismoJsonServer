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
import useGuidesStore from '../stores/guidesStore';
import NewReservationModal from '../components/agency/NewReservationModal';

const AgencyCalendar = () => {
  const { t } = useTranslation();
  const { currentAgency, isLoading, actions } = useAgencyStore();
  const { guides, fetchGuides } = useGuidesStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showReservationDetail, setShowReservationDetail] = useState(false);
  const [showGuideSelector, setShowGuideSelector] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState('');
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [filterStatus, setFilterStatus] = useState('all');
  const [calendarData, setCalendarData] = useState({});
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);

  // Initialize agency if not already loaded
  useEffect(() => {
    if (!currentAgency) {
      actions.initialize('agency-001').catch(err => {
        console.error('Error initializing agency:', err);
      });
    }
  }, [currentAgency, actions]);

  // Load guides list
  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  // Obtener datos del calendario para el mes actual
  useEffect(() => {
    if (!currentAgency) {
      console.log('Waiting for agency to be initialized...');
      return; // Don't fetch if agency not loaded yet
    }

    const fetchData = async () => {
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      console.log('Fetching calendar data for:', currentAgency.id, 'from', start, 'to', end);
      setIsLoadingCalendar(true);
      try {
        const data = await actions.fetchCalendarData(start, end);
        console.log('Calendar data received:', data);
        console.log('Number of days with reservations:', Object.keys(data || {}).length);
        setCalendarData(data || {});
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setCalendarData({});
      } finally {
        setIsLoadingCalendar(false);
      }
    };

    fetchData();
  }, [currentDate, currentAgency, actions]);

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

  const handleReservationClick = (e, reservation) => {
    e.stopPropagation(); // Evitar que se dispare el click del día
    setSelectedReservation(reservation);
    setShowReservationDetail(true);
  };

  const handleAssignGuide = async () => {
    if (!selectedGuideId || !selectedReservation) return;

    try {
      // Aquí llamarías al endpoint para actualizar la reserva
      await actions.updateReservation(selectedReservation.id, {
        guide_id: selectedGuideId
      });

      // Recargar datos del calendario
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      await actions.fetchCalendarData(start, end);

      // Cerrar modales
      setShowGuideSelector(false);
      setShowReservationDetail(false);
      setSelectedGuideId('');

      alert('Guía asignado exitosamente');
    } catch (error) {
      console.error('Error asignando guía:', error);
      alert('Error al asignar guía');
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

  // Mostrar loading mientras se inicializa la agencia
  if (!currentAgency && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando informacion de la agencia...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no hay agencia
  if (!currentAgency) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se pudo cargar la informacion de la agencia</h3>
          <p className="text-gray-500">Por favor, intenta recargar la pagina</p>
        </div>
      </div>
    );
  }

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
          {/* Loading indicator */}
          {isLoadingCalendar && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <span className="text-gray-600">Cargando reservas...</span>
            </div>
          )}

          {/* Encabezados de días */}
          {!isLoadingCalendar && <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>}

          {/* Días del calendario */}
          {!isLoadingCalendar && <div className="grid grid-cols-7 gap-1">
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
                          onClick={(e) => handleReservationClick(e, reservation)}
                          className={`
                            text-xs p-1 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity
                            ${getStatusColor(reservation.status)}
                          `}
                          title={`${reservation.serviceType} - ${reservation.clientName} - Click para ver detalles`}
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
          </div>}
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

      {/* Modal de Nueva Reserva */}
      <NewReservationModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        selectedDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null}
      />

      {/* Modal de Detalle de Reserva */}
      {showReservationDetail && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Detalle de Reserva</h2>
              <button
                onClick={() => setShowReservationDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                  <p className="text-gray-900">{selectedReservation.serviceType || selectedReservation.service_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <p className="text-gray-900">{selectedReservation.clientName || selectedReservation.client_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <p className="text-gray-900">{selectedReservation.time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Participantes</label>
                  <p className="text-gray-900">{selectedReservation.participants}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto Total</label>
                  <p className="text-gray-900">S/. {selectedReservation.totalAmount || selectedReservation.total_amount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                    selectedReservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    selectedReservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedReservation.status}
                  </span>
                </div>
              </div>

              {selectedReservation.guideAssigned ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900">
                    Guía asignado: {selectedReservation.guideAssigned}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-900">
                    ⚠️ Sin guía asignado
                  </p>

                  {!showGuideSelector ? (
                    <button
                      onClick={() => setShowGuideSelector(true)}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Asignar Guía
                    </button>
                  ) : (
                    <div className="mt-3 space-y-3">
                      <select
                        value={selectedGuideId}
                        onChange={(e) => setSelectedGuideId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccionar guía...</option>
                        {guides.map(guide => (
                          <option key={guide.id} value={guide.id}>
                            {guide.name || `${guide.first_name} ${guide.last_name}`}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAssignGuide}
                          disabled={!selectedGuideId}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => {
                            setShowGuideSelector(false);
                            setSelectedGuideId('');
                          }}
                          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowReservationDetail(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyCalendar;