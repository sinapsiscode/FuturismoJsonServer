import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { MapPinIcon, UserGroupIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useServicesStore } from '../../stores/servicesStore';
import { formatters } from '../../utils/formatters';
import 'leaflet/dist/leaflet.css';

// Fix para el icono de marcador predeterminado de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Iconos personalizados para diferentes tipos de marcadores
const createCustomIcon = (color, iconContent) => {
  const iconHtml = `
    <div style="width: 40px; height: 40px; position: relative;">
      <div style="width: 36px; height: 36px; background-color: ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid white;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${iconContent}
        </svg>
      </div>
      <div style="position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid ${color};"></div>
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-div-icon',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -40]
  });
};

const LiveMap = () => {
  const { activeServices, setServices, initializeMockData } = useServicesStore();
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [mapCenter, setMapCenter] = useState([-12.0464, -77.0428]); // Lima, Perú
  const [zoom, setZoom] = useState(13);
  const mapRef = useRef(null);

  // Inicializar con datos mock
  useEffect(() => {
    if (activeServices.length === 0) {
      initializeMockData();
    }
  }, [activeServices.length, initializeMockData]);

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Actualizar posiciones de guías (mock)
      if (activeServices.length > 0) {
        const randomGuide = activeServices[Math.floor(Math.random() * activeServices.length)];
        if (randomGuide && randomGuide.guideLocation) {
          useServicesStore.getState().updateGuidePosition(
            randomGuide.guideId,
            {
              lat: randomGuide.guideLocation.lat + (Math.random() - 0.5) * 0.002,
              lng: randomGuide.guideLocation.lng + (Math.random() - 0.5) * 0.002,
              timestamp: new Date()
            }
          );
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeServices]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_curso': return '#10b981';
      case 'programado': return '#3b82f6';
      case 'pausado': return '#f59e0b';
      case 'completado': return '#6b7280';
      case 'cancelado': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'en_curso': return 'En Curso';
      case 'programado': return 'Programado';
      case 'pausado': return 'Pausado';
      case 'completado': return 'Completado';
      case 'cancelado': return 'Cancelado';
      default: return 'Inactivo';
    }
  };

  const navigationIcon = '<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>';

  const centerOnGuide = (guideId, location) => {
    if (mapRef.current && location) {
      mapRef.current.setView([location.lat, location.lng], 16);
      setSelectedGuide(guideId);
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Mapa */}
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {activeServices.map((service) => {
            if (!service.currentLocation) return null;

            const isSelected = selectedGuide === service.guide?.name;
            
            return (
              <Marker
                key={service.id}
                position={[service.currentLocation.lat, service.currentLocation.lng]}
                icon={createCustomIcon(getStatusColor(service.status), navigationIcon)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="mb-2">
                      <h4 className="font-semibold">{service.guide?.name || 'Guía no asignado'}</h4>
                      <p className="text-sm text-gray-600">{service.destination}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Código:</span>
                        <span>{service.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-500" />
                        <span>{service.client?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        <span>Inicio: {service.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-500" />
                        <span>{service.pickupLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          service.status === 'en_curso' ? 'bg-green-100 text-green-800' :
                          service.status === 'programado' ? 'bg-blue-100 text-blue-800' :
                          service.status === 'pausado' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusText(service.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Panel lateral con lista de guías activos */}
      <div className="w-80 bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Guías Activos</h3>
        
        {activeServices.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay servicios activos en este momento
          </p>
        ) : (
          <div className="space-y-3">
            {activeServices.map((service) => (
              <div
                key={service.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedGuide === service.guideId
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => centerOnGuide(service.guideId, service.guideLocation)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{service.guideName}</h4>
                  <span className={`badge ${
                    service.status === 'IN_SERVICE' ? 'badge-green' :
                    service.status === 'ON_WAY' ? 'badge-yellow' :
                    service.status === 'DELAYED' ? 'badge-red' : 'badge-gray'
                  }`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{service.tourName}</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{service.tourists} turistas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leyenda */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Leyenda</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">En Servicio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">En Camino</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Retrasado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Pendiente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;