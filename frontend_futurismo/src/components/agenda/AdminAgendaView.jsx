import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  MapPinIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useUsersStore } from '../../stores/usersStoreSimple';

const AdminAgendaView = () => {
  const { getGuides } = useUsersStore();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('week'); // 'week', 'month'
  const [selectedGuides, setSelectedGuides] = useState([]);
  const [freelanceGuides, setFreelanceGuides] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const guides = getGuides('freelance');
    setFreelanceGuides(guides);
    setSelectedGuides(guides.map(guide => guide.id)); // Seleccionar todos por defecto
  }, []);

  const generateWeekDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate);
    const dayOfWeek = start.getDay();
    const monday = new Date(start);
    monday.setDate(start.getDate() - dayOfWeek + 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const generateMonthDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate);
    const year = start.getFullYear();
    const month = start.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startOfCalendar = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    startOfCalendar.setDate(firstDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startOfCalendar);
      date.setDate(startOfCalendar.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const weekDates = generateWeekDates(selectedDate);
  const monthDates = generateMonthDates(selectedDate);
  const currentDates = viewMode === 'week' ? weekDates : monthDates;
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const getAvailabilityForGuide = (guide, date) => {
    if (!guide?.agenda) return { disponible: false, horarios: [] };
    return guide.agenda[date] || { disponible: false, horarios: [] };
  };

  const getGuideStatusForDate = (guide, date) => {
    const availability = getAvailabilityForGuide(guide, date);
    if (!availability.disponible) return 'no-disponible';
    if (availability.horarios.length === 0) return 'disponible-sin-horario';
    return 'disponible-con-horario';
  };

  const toggleGuideSelection = (guideId) => {
    setSelectedGuides(prev => 
      prev.includes(guideId)
        ? prev.filter(id => id !== guideId)
        : [...prev, guideId]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible-con-horario': return 'bg-green-100 border-green-300 text-green-800';
      case 'disponible-sin-horario': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'no-disponible': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'disponible-con-horario': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'disponible-sin-horario': return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      case 'no-disponible': return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleSendMessage = (guide) => {
    // Redirigir al chat con el guía específico
    navigate(`/chat?guide=${guide.id}&name=${encodeURIComponent(guide.firstName + ' ' + guide.lastName)}`);
  };

  const handleViewGuide = (guide) => {
    // Aquí podrías abrir un modal con detalles del guía o redirigir a su perfil
    console.log('Ver detalles de:', guide);
  };


  const filteredGuides = freelanceGuides.filter(guide => selectedGuides.includes(guide.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Agenda de Guías Freelance
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filtros
            </button>
            
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="week">Vista Semanal</option>
              <option value="month">Vista Mensual</option>
            </select>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Seleccionar Guías:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {freelanceGuides.map((guide) => (
                <label key={guide.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGuides.includes(guide.id)}
                    onChange={() => toggleGuideSelection(guide.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                  />
                  <img
                    src={guide.avatar}
                    alt={guide.firstName}
                    className="h-8 w-8 rounded-full mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {guide.firstName} {guide.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Rating: {guide.rating} ⭐ • {guide.experience} años
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navegación de fecha */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                if (viewMode === 'week') {
                  newDate.setDate(newDate.getDate() - 7);
                } else {
                  newDate.setMonth(newDate.getMonth() - 1);
                }
                setSelectedDate(newDate.toISOString().split('T')[0]);
              }}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ←
            </button>
            
            <span className="text-lg font-medium text-gray-900">
              {viewMode === 'week' 
                ? `Semana del ${new Date(weekDates[0]).toLocaleDateString('es-PE')}` 
                : `${new Date(selectedDate).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}`
              }
            </span>
            
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                if (viewMode === 'week') {
                  newDate.setDate(newDate.getDate() + 7);
                } else {
                  newDate.setMonth(newDate.getMonth() + 1);
                }
                setSelectedDate(newDate.toISOString().split('T')[0]);
              }}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              →
            </button>
          </div>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
          >
            Hoy
          </button>
        </div>
      </div>

      {/* Guide List Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Guías Seleccionados ({filteredGuides.length})
            </h3>
            
            <div className="space-y-3">
              {filteredGuides.map((guide) => (
                <div key={guide.id} className="border rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <img
                      src={guide.avatar}
                      alt={guide.firstName}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {guide.firstName} {guide.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {guide.specialties.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center text-gray-600">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {guide.experience} años
                    </span>
                    <span className="flex items-center text-yellow-600">
                      ⭐ {guide.rating}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => handleViewGuide(guide)}
                      className="flex-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition-colors"
                      title="Ver detalles"
                    >
                      <EyeIcon className="h-3 w-3 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleSendMessage(guide)}
                      className="w-full px-2 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100 transition-colors"
                      title="Enviar mensaje"
                    >
                      <ChatBubbleLeftRightIcon className="h-3 w-3 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {viewMode === 'month' && (
              <div className="grid grid-cols-7 divide-x divide-gray-200 bg-gray-50">
                {dayNames.map((dayName) => (
                  <div key={dayName} className="p-3 text-center">
                    <div className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                      {dayName}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className={`grid grid-cols-7 divide-x divide-gray-200 ${viewMode === 'month' ? 'divide-y' : ''}`}>
              {currentDates.map((date, index) => {
                const isToday = date === new Date().toISOString().split('T')[0];
                const dayName = viewMode === 'week' ? dayNames[index] : dayNames[index % 7];
                const dayNumber = new Date(date).getDate();
                const currentMonth = new Date(selectedDate).getMonth();
                const dateMonth = new Date(date).getMonth();
                const isCurrentMonth = dateMonth === currentMonth;

                return (
                  <div key={date} className={`${viewMode === 'week' ? 'min-h-48' : 'min-h-36'} p-2 ${
                    viewMode === 'month' && !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                  }`}>
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-center">
                        {viewMode === 'week' && (
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            {dayName}
                          </div>
                        )}
                        <div className={`${viewMode === 'week' ? 'text-lg' : 'text-sm'} font-semibold ${
                          isToday ? 'text-blue-600' : (isCurrentMonth || viewMode === 'week' ? 'text-gray-900' : 'text-gray-400')
                        }`}>
                          {dayNumber}
                        </div>
                      </div>
                    </div>

                    {/* Guides for this day */}
                    <div className="space-y-1">
                      {filteredGuides.map((guide) => {
                        const availability = getAvailabilityForGuide(guide, date);
                        const status = getGuideStatusForDate(guide, date);
                        
                        return (
                          <div
                            key={guide.id}
                            className={`p-2 rounded border text-xs ${getStatusColor(status)}`}
                            title={`${guide.firstName} ${guide.lastName} - ${
                              status === 'disponible-con-horario' ? `Horarios: ${availability.horarios.join(', ')}` :
                              status === 'disponible-sin-horario' ? 'Disponible sin horarios específicos' :
                              'No disponible'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(status)}
                                <span className="font-medium truncate">
                                  {guide.firstName}
                                </span>
                              </div>
                            </div>
                            
                            {viewMode === 'week' && availability.horarios.length > 0 && (
                              <div className="mt-1 space-y-1">
                                {availability.horarios.slice(0, 3).map((horario, idx) => (
                                  <div key={idx} className="text-xs opacity-75">
                                    {horario}
                                  </div>
                                ))}
                                {availability.horarios.length > 3 && (
                                  <div className="text-xs opacity-60">
                                    +{availability.horarios.length - 3} más
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {viewMode === 'month' && availability.horarios.length > 0 && (
                              <div className="text-xs opacity-75 mt-1">
                                {availability.horarios.length} horario{availability.horarios.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen de Disponibilidad - {viewMode === 'week' ? 'Semana' : 'Mes'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {filteredGuides.length}
            </div>
            <div className="text-sm text-blue-700">Guías Monitoreados</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {currentDates.reduce((total, date) => {
                return total + filteredGuides.filter(guide => 
                  getGuideStatusForDate(guide, date) === 'disponible-con-horario'
                ).length;
              }, 0)}
            </div>
            <div className="text-sm text-green-700">Disponibilidades con Horario</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {currentDates.reduce((total, date) => {
                return total + filteredGuides.filter(guide => 
                  getGuideStatusForDate(guide, date) === 'disponible-sin-horario'
                ).length;
              }, 0)}
            </div>
            <div className="text-sm text-yellow-700">Disponibles sin Horario</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {currentDates.reduce((total, date) => {
                return total + filteredGuides.filter(guide => 
                  getGuideStatusForDate(guide, date) === 'no-disponible'
                ).length;
              }, 0)}
            </div>
            <div className="text-sm text-red-700">No Disponibles</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAgendaView;