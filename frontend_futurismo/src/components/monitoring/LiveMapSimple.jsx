import { useState, useEffect } from 'react';
import { MapPinIcon, UserGroupIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useServicesStore } from '../../stores/servicesStore';
import { formatters } from '../../utils/formatters';

const LiveMapSimple = ({ filters, onServiceSelect }) => {
  const { services, getActiveServices, initializeMockData } = useServicesStore();
  const [selectedService, setSelectedService] = useState(null);
  const [mockLocations] = useState([
    { id: 1, lat: -12.0464, lng: -77.0428, name: 'Centro Histórico' },
    { id: 2, lat: -12.1215, lng: -77.0298, name: 'Miraflores' },
    { id: 3, lat: -12.1533, lng: -77.0244, name: 'Barranco' },
    { id: 4, lat: -12.0956, lng: -77.0364, name: 'San Isidro' },
    { id: 5, lat: -12.0735, lng: -77.0826, name: 'Callao' }
  ]);

  useEffect(() => {
    // Inicializar datos mock si no hay servicios
    if (services.length === 0) {
      initializeMockData();
    }

    // Simular actualización cada 30 segundos
    const interval = setInterval(() => {
      // Aquí se actualizarían las posiciones reales
      console.log('Actualizando posiciones...');
    }, 30000);

    return () => clearInterval(interval);
  }, [services.length, initializeMockData]);

  const activeServices = getActiveServices(filters);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    onServiceSelect?.(service);
  };

  const getStatusColor = (status) => {
    const colors = {
      'en_curso': 'bg-green-500',
      'programado': 'bg-blue-500',
      'completado': 'bg-gray-500',
      'cancelado': 'bg-red-500',
      'pausado': 'bg-yellow-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    const texts = {
      'en_curso': 'En Curso',
      'programado': 'Programado',
      'completado': 'Completado',
      'cancelado': 'Cancelado',
      'pausado': 'Pausado'
    };
    return texts[status] || status;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header del mapa */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              Mapa en Tiempo Real
            </h3>
            <p className="text-blue-100 text-sm">
              {activeServices.length} servicios activos
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Última actualización</p>
            <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Área del mapa simulado */}
        <div className="flex-1 relative">
          <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
            {/* Fondo del mapa simulado */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 grid-rows-6 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>
            </div>

            {/* Ubicaciones simuladas */}
            {mockLocations.map((location, index) => {
              const service = activeServices[index];
              if (!service) return null;

              return (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${20 + (index * 15)}%`,
                    top: `${30 + (index * 10)}%`
                  }}
                  onClick={() => handleServiceClick(service)}
                >
                  {/* Marcador */}
                  <div className="relative">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(service.status)} border-2 border-white shadow-lg animate-pulse`}></div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                      {service.client?.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Mensaje de mapa */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
              <p className="text-gray-600">📍 Vista simulada de Lima, Perú</p>
              <p className="text-gray-500 text-xs">Haz clic en los puntos para ver detalles</p>
            </div>

            {/* Leyenda */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Estados</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>En Curso</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Programado</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Pausado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral con detalles */}
        <div className="w-80 border-l border-gray-200 bg-gray-50">
          {selectedService ? (
            <div className="p-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Detalles del Servicio</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(selectedService.status)}`}>
                    {getStatusText(selectedService.status)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <UserGroupIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{selectedService.client?.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{selectedService.pickupLocation || 'Lima Centro'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    <span>{formatters.formatTime(selectedService.startTime)}</span>
                  </div>

                  {selectedService.guide && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Guía Asignado</p>
                      <p className="text-sm text-blue-700">{selectedService.guide.name}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Ver detalles completos →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <MapPinIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">Selecciona un servicio en el mapa para ver sus detalles</p>
            </div>
          )}

          {/* Lista de servicios activos */}
          <div className="border-t border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Servicios Activos</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {activeServices.slice(0, 5).map((service) => (
                <div
                  key={service.id}
                  className="p-2 bg-white rounded border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {service.client?.name}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`}></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatters.formatTime(service.startTime)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMapSimple;