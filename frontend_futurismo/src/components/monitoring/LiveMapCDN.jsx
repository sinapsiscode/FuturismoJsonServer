import { useState, useEffect, useRef } from 'react';
import { MapPinIcon, UserGroupIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useServicesStore } from '../../stores/servicesStore';

const LiveMapCDN = ({ filters, onServiceSelect }) => {
  const { activeServices, initializeMockData } = useServicesStore();
  const [selectedService, setSelectedService] = useState(null);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef({});

  // Cargar Leaflet desde CDN
  useEffect(() => {
    // Solo cargar si no está ya cargado
    if (window.L) {
      initializeMap();
      return;
    }

    // Cargar CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Cargar JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      // Fix para iconos por defecto
      delete window.L.Icon.Default.prototype._getIconUrl;
      window.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      
      initializeMap();
    };
    document.head.appendChild(script);

    return () => {
      // Limpiar al desmontar
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Inicializar datos mock
  useEffect(() => {
    if (activeServices.length === 0) {
      initializeMockData();
    }
  }, [activeServices.length, initializeMockData]);

  // Actualizar marcadores cuando cambien los servicios
  useEffect(() => {
    if (leafletMapRef.current && window.L) {
      updateMarkers();
    }
  }, [activeServices]);

  const initializeMap = () => {
    if (!mapRef.current || !window.L || leafletMapRef.current) return;

    // Limpiar el contenedor si tiene contenido previo
    mapRef.current.innerHTML = '';

    // Crear mapa
    const map = window.L.map(mapRef.current).setView([-12.0464, -77.0428], 13);

    // Agregar tiles de OpenStreetMap
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    leafletMapRef.current = map;
    
    // Actualizar marcadores
    updateMarkers();
  };

  const updateMarkers = () => {
    if (!leafletMapRef.current || !window.L) return;

    // Limpiar marcadores existentes
    Object.values(markersRef.current).forEach(marker => {
      leafletMapRef.current.removeLayer(marker);
    });
    markersRef.current = {};

    // Agregar nuevos marcadores
    activeServices.forEach(service => {
      if (!service.currentLocation) return;

      const marker = createCustomMarker(service);
      marker.addTo(leafletMapRef.current);
      markersRef.current[service.id] = marker;
    });
  };

  const createCustomMarker = (service) => {
    const color = getStatusColor(service.status);
    
    // Crear icono personalizado usando divIcon
    const customIcon = window.L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 30px; 
          height: 30px; 
          background-color: ${color}; 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">
          ${service.code.slice(-1)}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = window.L.marker(
      [service.currentLocation.lat, service.currentLocation.lng],
      { icon: customIcon }
    );

    // Crear popup con información
    const popupContent = `
      <div style="min-width: 200px; padding: 8px;">
        <div style="margin-bottom: 8px;">
          <h4 style="margin: 0; font-weight: bold;">${service.guide?.name || 'Guía no asignado'}</h4>
          <p style="margin: 4px 0; color: #666; font-size: 14px;">${service.destination}</p>
        </div>
        <div style="font-size: 13px; line-height: 1.4;">
          <div style="margin-bottom: 4px;">
            <strong>Código:</strong> ${service.code}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Cliente:</strong> ${service.client?.name}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Inicio:</strong> ${service.startTime}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Recogida:</strong> ${service.pickupLocation}
          </div>
          <div>
            <span style="
              background-color: ${getStatusBgColor(service.status)};
              color: ${getStatusTextColor(service.status)};
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 500;
            ">
              ${getStatusText(service.status)}
            </span>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    
    // Evento click
    marker.on('click', () => {
      setSelectedService(service);
      if (onServiceSelect) {
        onServiceSelect(service);
      }
    });

    return marker;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_curso': return '#10b981';   // verde
      case 'programado': return '#3b82f6'; // azul
      case 'pausado': return '#f59e0b';    // amarillo
      case 'completado': return '#6b7280'; // gris
      case 'cancelado': return '#ef4444';  // rojo
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'en_curso': return '#dcfce7';
      case 'programado': return '#dbeafe';
      case 'pausado': return '#fef3c7';
      case 'completado': return '#f3f4f6';
      case 'cancelado': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'en_curso': return '#166534';
      case 'programado': return '#1e40af';
      case 'pausado': return '#92400e';
      case 'completado': return '#374151';
      case 'cancelado': return '#991b1b';
      default: return '#374151';
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

  const handleServiceClick = (service) => {
    setSelectedService(service);
    if (onServiceSelect) {
      onServiceSelect(service);
    }

    // Centrar mapa en el servicio
    if (leafletMapRef.current && service.currentLocation) {
      leafletMapRef.current.setView(
        [service.currentLocation.lat, service.currentLocation.lng], 
        16
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header del mapa */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              Mapa en Tiempo Real (Leaflet CDN)
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
        {/* Mapa con Leaflet CDN */}
        <div className="flex-1 relative">
          <div 
            ref={mapRef} 
            className="h-96 w-full"
            style={{ minHeight: '400px' }}
          />
          
          {/* Loading indicator */}
          {!window.L && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-blue-600 font-medium">Cargando mapa...</p>
              </div>
            </div>
          )}
        </div>

        {/* Panel lateral con detalles */}
        <div className="w-80 border-l border-gray-200 bg-gray-50">
          {selectedService ? (
            <div className="p-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Detalles del Servicio</h4>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getStatusColor(selectedService.status) }}
                  >
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
                    <span>{selectedService.pickupLocation}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    <span>{selectedService.startTime}</span>
                  </div>

                  {selectedService.guide && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Guía Asignado</p>
                      <p className="text-sm text-blue-700">{selectedService.guide.name}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <button 
                      onClick={() => handleServiceClick(selectedService)}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Centrar en mapa →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <MapPinIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">Haz clic en un marcador para ver detalles</p>
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
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(service.status) }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {service.startTime}
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

export default LiveMapCDN;