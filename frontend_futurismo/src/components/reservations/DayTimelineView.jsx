import { useState } from 'react';
import { ClockIcon, UserGroupIcon, MapPinIcon, PhoneIcon, EyeIcon } from '@heroicons/react/24/outline';
import { format, addHours, startOfDay, isSameHour } from 'date-fns';
import { es } from 'date-fns/locale';
import { TIMELINE_CONFIG } from '../../constants/reservationConstants';

const DayTimelineView = ({ date, reservations, onViewReservation }) => {
  const [selectedHour, setSelectedHour] = useState(null);

  // Generar las horas del día
  const hours = Array.from({ length: TIMELINE_CONFIG.HOURS_COUNT }, (_, i) => i + TIMELINE_CONFIG.START_HOUR);
  
  // Agrupar reservas por hora
  const reservationsByHour = reservations.reduce((acc, reservation) => {
    const hour = parseInt(reservation.time.split(':')[0]);
    if (!acc[hour]) {
      acc[hour] = [];
    }
    acc[hour].push(reservation);
    return acc;
  }, {});

  // Obtener la hora actual
  const currentHour = new Date().getHours();

  const getReservationStyle = (reservation) => {
    const duration = reservation.duration || TIMELINE_CONFIG.DEFAULT_DURATION;
    const height = duration * TIMELINE_CONFIG.HOUR_HEIGHT_PX;
    
    return {
      height: `${height}px`,
      backgroundColor: reservation.color + '20',
      borderLeftColor: reservation.color,
      borderLeftWidth: '4px',
      borderLeftStyle: 'solid'
    };
  };

  return (
    <div className="h-full flex">
      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {/* Línea de tiempo actual */}
          {date && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
            <div
              className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
              style={{ top: `${(currentHour - TIMELINE_CONFIG.START_HOUR) * TIMELINE_CONFIG.HOUR_HEIGHT_PX + (new Date().getMinutes())}px` }}
            >
              <div className="absolute -left-2 -top-2 w-4 h-4 bg-red-500 rounded-full" />
            </div>
          )}

          {/* Horas del día */}
          {hours.map((hour) => {
            const hourReservations = reservationsByHour[hour] || [];
            const isCurrentHour = currentHour === hour && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <div key={hour} className="relative">
                <div className="flex border-t border-gray-200">
                  {/* Hora */}
                  <div className={`py-2 px-4 text-sm font-medium ${
                    isCurrentHour ? 'text-red-600' : 'text-gray-600'
                  }`} style={{ width: `${TIMELINE_CONFIG.HOUR_WIDTH_PX}px` }}>
                    {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 py-2 px-4 relative" style={{ minHeight: TIMELINE_CONFIG.MIN_HOUR_HEIGHT }}>
                    {hourReservations.map((reservation, index) => (
                      <div
                        key={reservation.id}
                        className="absolute left-4 right-4 p-3 rounded-lg cursor-pointer hover:shadow-md transition-all"
                        style={{
                          ...getReservationStyle(reservation),
                          top: `${index * TIMELINE_CONFIG.RESERVATION_OFFSET_PX}px`, // Offset para reservas múltiples
                          zIndex: hourReservations.length - index
                        }}
                        onClick={() => onViewReservation(reservation)}
                      >
                        <div className="h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm" style={{ color: reservation.color }}>
                                {reservation.time} - {reservation.tourName}
                              </h4>
                              <EyeIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-700 font-medium mb-2">
                              {reservation.clientName}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <UserGroupIcon className="w-3 h-3" />
                                {reservation.adults + (reservation.children || 0)} pax
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPinIcon className="w-3 h-3" />
                                {reservation.pickup || 'Por definir'}
                              </span>
                              {reservation.guide && (
                                <span className="flex items-center gap-1">
                                  Guía: {reservation.guide}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`badge ${
                              reservation.status === 'confirmada' ? 'badge-green' :
                              reservation.status === 'pendiente' ? 'badge-yellow' :
                              'badge-red'
                            }`}>
                              {reservation.status}
                            </span>
                            {reservation.phone && (
                              <button className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                                <PhoneIcon className="w-3 h-3" />
                                Contactar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel lateral de resumen */}
      <div className="w-80 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
        <h3 className="font-semibold text-gray-900 mb-4">
          {format(date, "EEEE, d 'de' MMMM", { locale: es })}
        </h3>

        {/* Estadísticas del día */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {reservations.length}
            </div>
            <div className="text-sm text-gray-600">Tours totales</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {reservations.reduce((total, r) => total + r.adults + (r.children || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Turistas</div>
          </div>
        </div>

        {/* Lista de tours por hora */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Cronograma</h4>
          {Object.entries(reservationsByHour)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([hour, hourReservations]) => (
              <div key={hour} className="bg-white p-3 rounded-lg">
                <div className="font-medium text-sm mb-2">
                  {format(new Date().setHours(parseInt(hour), 0, 0, 0), 'HH:mm')}
                </div>
                {hourReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="text-sm text-gray-600 pl-4 py-1 border-l-2 hover:text-gray-900 cursor-pointer"
                    style={{ borderLeftColor: reservation.color }}
                    onClick={() => onViewReservation(reservation)}
                  >
                    {reservation.tourName} ({reservation.adults + (reservation.children || 0)} pax)
                  </div>
                ))}
              </div>
            ))}
        </div>

        {/* Guías asignados */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-3">Guías del día</h4>
          <div className="space-y-2">
            {Array.from(new Set(reservations.map(r => r.guide).filter(Boolean))).map((guide) => {
              const guideReservations = reservations.filter(r => r.guide === guide);
              return (
                <div key={guide} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{guide}</span>
                  <span className="font-medium">{guideReservations.length} tours</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayTimelineView;