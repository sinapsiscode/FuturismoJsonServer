import { useState, useEffect, useRef } from 'react';
import { MapPinIcon, UserGroupIcon, ClockIcon, ExclamationTriangleIcon, PlusIcon, MinusIcon, ViewfinderCircleIcon } from '@heroicons/react/24/outline';
import useServicesStore from '../../stores/servicesStore';
import { useLayout } from '../../contexts/LayoutContext';

const LiveMapResponsive = ({ filters, onServiceSelect }) => {
  const { activeServices, loadServices } = useServicesStore();
  const { viewport, sidebarOpen } = useLayout();
  const [selectedService, setSelectedService] = useState(null);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef({});
  const resizeTimeoutRef = useRef(null);

  // Calcular altura dinámica según viewport
  const getMapHeight = () => {
    if (viewport.isMobile) {
      return 'calc(100vh - 10rem)';
    } else if (viewport.isTablet) {
      return 'calc(70vh - 4rem)';
    } else {
      return 'calc(100vh - 14rem)';
    }
  };

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

  // Inicializar el mapa
  const initializeMap = () => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Crear mapa con configuración responsive
    const map = window.L.map(mapRef.current, {
      center: [-12.0464, -77.0428], // Lima, Perú
      zoom: viewport.isMobile ? 11 : 12,
      zoomControl: false, // Controles personalizados
      attributionControl: viewport.isDesktop,
      tap: true,
      touchZoom: true,
      dragging: true,
      doubleClickZoom: !viewport.isMobile
    });

    // Agregar capa de mapa
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: viewport.isMobile ? 10 : 8
    }).addTo(map);

    leafletMapRef.current = map;

    // Cargar servicios si es necesario
    if (activeServices.length === 0) {
      loadServices();
    }
  };

  // Manejar cambios en el sidebar - redimensionar mapa
  useEffect(() => {
    if (!leafletMapRef.current) return;

    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      leafletMapRef.current.invalidateSize({
        animate: true,
        duration: 0.25
      });
    }, 350);
  }, [sidebarOpen, viewport]);

  // Actualizar marcadores
  useEffect(() => {
    if (!leafletMapRef.current || !window.L) return;

    // Limpiar marcadores antiguos
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    markersRef.current = {};

    // Crear icono personalizado para servicios
    const createServiceIcon = (service) => {
      const statusColors = {
        'enroute': 'bg-green-500',
        'stopped': 'bg-yellow-500',
        'delayed': 'bg-red-500'
      };

      return window.L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative">
            <div class="absolute -top-1 -right-1 w-3 h-3 ${statusColors[service.status]} rounded-full animate-pulse"></div>
            <div class="bg-white rounded-full p-2 shadow-lg border-2 border-gray-200">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
    };

    // Agregar marcadores para cada servicio
    if (Array.isArray(activeServices)) {
      activeServices.forEach(service => {
      if (!service.currentLocation?.lat || !service.currentLocation?.lng) return;

      const marker = window.L.marker(
        [service.currentLocation.lat, service.currentLocation.lng],
        { icon: createServiceIcon(service) }
      ).addTo(leafletMapRef.current);

      // Popup responsive
      const popupContent = `
        <div class="${viewport.isMobile ? 'text-sm' : ''} p-2">
          <h3 class="font-bold text-gray-900">${service.tourName}</h3>
          <p class="text-gray-600 text-xs mt-1">
            <span class="inline-flex items-center">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              ${service.guideName}
            </span>
          </p>
          <p class="text-xs text-gray-500 mt-1">${service.tourists} turistas</p>
          <div class="mt-2 flex items-center justify-between">
            <span class="text-xs px-2 py-1 rounded-full ${
              service.status === 'enroute' ? 'bg-green-100 text-green-700' :
              service.status === 'stopped' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }">
              ${service.status === 'enroute' ? 'En ruta' : 
                service.status === 'stopped' ? 'Detenido' : 'Retrasado'}
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: !viewport.isMobile,
        maxWidth: viewport.isMobile ? 200 : 300,
        className: 'custom-popup'
      });

      marker.on('click', () => {
        setSelectedService(service);
        if (onServiceSelect) {
          onServiceSelect(service);
        }
      });

      markersRef.current[service.id] = marker;
      });
    }

    // Auto-ajustar vista si hay marcadores - Deshabilitado temporalmente por problemas de bounds
    // El mapa se mantendrá centrado en Lima por defecto
    if (leafletMapRef.current && leafletMapRef.current._loaded) {
      // Solo centrar si no hay servicios o en caso de error
      if (!Array.isArray(activeServices) || activeServices.length === 0) {
        leafletMapRef.current.setView([-12.0464, -77.0428], viewport.isMobile ? 11 : 12);
      }
    }
  }, [activeServices, viewport]);

  // Funciones de control
  const handleZoom = (direction) => {
    if (!leafletMapRef.current) return;
    const currentZoom = leafletMapRef.current.getZoom();
    leafletMapRef.current.setZoom(currentZoom + direction);
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation || !leafletMapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Agregar marcador de ubicación
        window.L.marker([latitude, longitude], {
          icon: window.L.divIcon({
            className: 'user-location',
            html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
            iconSize: [16, 16]
          })
        }).addTo(leafletMapRef.current);

        leafletMapRef.current.setView([latitude, longitude], 14);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
      }
    );
  };

  return (
    <div className="relative w-full" style={{ height: getMapHeight() }}>
      <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-inner h-full">
        <div ref={mapRef} className="w-full h-full" style={{ position: 'relative', zIndex: 1 }} />
        
        {/* Controles personalizados para móvil */}
        <div className="absolute top-4 right-4 z-[10] flex flex-col gap-2">
          {/* Zoom */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => handleZoom(1)}
              className="p-2 hover:bg-gray-50 transition-colors touch-manipulation"
              aria-label="Acercar"
            >
              <PlusIcon className="w-5 h-5 text-gray-700" />
            </button>
            <div className="border-t border-gray-200" />
            <button
              onClick={() => handleZoom(-1)}
              className="p-2 hover:bg-gray-50 transition-colors touch-manipulation"
              aria-label="Alejar"
            >
              <MinusIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Mi ubicación */}
          <button
            onClick={handleLocateUser}
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors touch-manipulation"
            aria-label="Mi ubicación"
          >
            <ViewfinderCircleIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Info panel para móvil */}
        {viewport.isMobile && selectedService && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[10]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedService.tourName}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedService.guideName}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <UserGroupIcon className="w-4 h-4" />
                    {selectedService.tourists}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {selectedService.startTime}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {(!Array.isArray(activeServices) || activeServices.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-[5]">
            <div className="text-center">
              <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2 animate-bounce" />
              <p className="text-gray-500">Cargando servicios activos...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMapResponsive;