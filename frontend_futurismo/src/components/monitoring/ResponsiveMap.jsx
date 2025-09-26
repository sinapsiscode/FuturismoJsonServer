import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLayout } from '../../contexts/LayoutContext';
import useLeafletMap from '../../hooks/useLeafletMap';
import { 
  MapPinIcon, 
  MinusIcon, 
  PlusIcon, 
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ViewfinderCircleIcon
} from '@heroicons/react/24/outline';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

const ResponsiveMap = ({ 
  onMapReady, 
  markers = [], 
  selectedGuide = null,
  height = 'dynamic' // 'dynamic', 'full', o un valor específico como '400px'
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const { viewport } = useLayout();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  
  // Hook para manejar el responsive del mapa
  const { invalidateMapSize } = useLeafletMap(mapRef.current);

  // Calcular altura dinámica según viewport
  const getMapHeight = () => {
    if (height !== 'dynamic') return height;
    
    if (viewport.isMobile) {
      // En móvil: toda la altura disponible menos header y padding
      return 'calc(100vh - 8rem)';
    } else if (viewport.isTablet) {
      // En tablet: 70% de la altura
      return 'calc(70vh - 4rem)';
    } else {
      // En desktop: altura completa del contenedor
      return 'calc(100vh - 12rem)';
    }
  };

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Crear mapa
    const map = L.map(mapContainerRef.current, {
      center: [-12.0464, -77.0428], // Lima
      zoom: viewport.isMobile ? 11 : 12,
      zoomControl: false, // Lo agregamos custom
      attributionControl: viewport.isDesktop,
      tap: true, // Mejor soporte táctil
      touchZoom: true,
      dragging: true,
      doubleClickZoom: !viewport.isMobile // Desactivar en móvil para evitar zoom accidental
    });

    // Agregar tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
      minZoom: viewport.isMobile ? 10 : 8
    }).addTo(map);

    mapRef.current = map;

    // Notificar que el mapa está listo
    if (onMapReady) {
      onMapReady(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Manejar marcadores
  useEffect(() => {
    if (!mapRef.current) return;

    // Limpiar marcadores antiguos
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    markersRef.current = {};

    // Agregar nuevos marcadores
    markers.forEach(markerData => {
      const marker = L.marker([markerData.lat, markerData.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="relative">
              <div class="absolute -top-8 -left-8 w-16 h-16 ${
                selectedGuide === markerData.id ? 'animate-pulse' : ''
              }">
                <div class="w-full h-full bg-primary-500 bg-opacity-20 rounded-full"></div>
              </div>
              <div class="relative bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                ${markerData.type === 'guide' ? '👤' : '📍'}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      }).addTo(mapRef.current);

      // Popup mejorado para móvil
      const popupContent = `
        <div class="${viewport.isMobile ? 'text-sm' : ''}">
          <h3 class="font-bold">${markerData.name}</h3>
          <p class="text-gray-600">${markerData.status || 'Activo'}</p>
          ${markerData.tour ? `<p class="text-xs mt-1">${markerData.tour}</p>` : ''}
        </div>
      `;
      
      marker.bindPopup(popupContent, {
        closeButton: viewport.isDesktop,
        maxWidth: viewport.isMobile ? 200 : 300
      });

      markersRef.current[markerData.id] = marker;
    });

    // Centrar en marcador seleccionado
    if (selectedGuide && markersRef.current[selectedGuide]) {
      const marker = markersRef.current[selectedGuide];
      mapRef.current.setView(marker.getLatLng(), 15, {
        animate: true,
        duration: 0.5
      });
      marker.openPopup();
    }
  }, [markers, selectedGuide, viewport]);

  // Obtener ubicación del usuario
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        if (mapRef.current) {
          // Agregar marcador de ubicación
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
              iconSize: [16, 16]
            })
          }).addTo(mapRef.current);

          // Centrar mapa
          mapRef.current.setView([latitude, longitude], 14);
        }
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        alert('No se pudo obtener tu ubicación');
      }
    );
  };

  // Manejar zoom
  const handleZoom = (direction) => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom();
    mapRef.current.setZoom(currentZoom + direction);
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await mapContainerRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
    
    // Redimensionar mapa después de cambiar fullscreen
    setTimeout(() => {
      invalidateMapSize();
    }, 100);
  };

  return (
    <div 
      className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg"
      style={{ height: getMapHeight() }}
    >
      {/* Mapa */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        style={{ touchAction: 'pan-x pan-y' }} // Mejor control táctil
      />

      {/* Controles personalizados */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Zoom */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => handleZoom(1)}
            className="p-2 hover:bg-gray-50 transition-colors"
            aria-label="Zoom in"
          >
            <PlusIcon className="w-5 h-5 text-gray-700" />
          </button>
          <div className="border-t border-gray-200" />
          <button
            onClick={() => handleZoom(-1)}
            className="p-2 hover:bg-gray-50 transition-colors"
            aria-label="Zoom out"
          >
            <MinusIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Ubicación actual */}
        <button
          onClick={getCurrentLocation}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Mi ubicación"
        >
          <ViewfinderCircleIcon className="w-5 h-5 text-gray-700" />
        </button>

        {/* Fullscreen */}
        {viewport.isDesktop && (
          <button
            onClick={toggleFullscreen}
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="w-5 h-5 text-gray-700" />
            ) : (
              <ArrowsPointingOutIcon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        )}
      </div>

      {/* Indicador de carga */}
      {markers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
          <div className="text-center">
            <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Cargando ubicaciones...</p>
          </div>
        </div>
      )}

      {/* Info overlay para móvil */}
      {viewport.isMobile && markers.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
          <p className="text-sm text-gray-600">
            {markers.length} {markers.length === 1 ? 'ubicación activa' : 'ubicaciones activas'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResponsiveMap;