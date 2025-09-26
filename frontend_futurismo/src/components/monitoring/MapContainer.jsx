import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import useLeafletMap from '../../hooks/useLeafletMap';
import { MAP_CONFIG } from '../../data/mockMonitoringData';
import { MAP_MOBILE_HEIGHT } from '../../constants/monitoringConstants';
import styles from '../../styles/layout.module.css';

const MapContainer = ({ onMapReady }) => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Usar el hook para manejar el responsive del mapa
  const { getMapContainerStyle, toggleFullscreen, isFullscreen } = useLeafletMap(
    mapInstanceRef.current,
    {
      maintainView: true,
      mobileHeight: MAP_MOBILE_HEIGHT
    }
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Inicializar el mapa
    const map = L.map(mapRef.current, {
      center: MAP_CONFIG.defaultCenter,
      zoom: MAP_CONFIG.defaultZoom,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer(MAP_CONFIG.tileLayerUrl, {
      attribution: MAP_CONFIG.attribution,
      maxZoom: MAP_CONFIG.maxZoom
    }).addTo(map);

    mapInstanceRef.current = map;

    if (onMapReady) {
      onMapReady(map);
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onMapReady]);

  return (
    <div className={styles.mapContainer} style={getMapContainerStyle()}>
      <div ref={mapRef} className={styles.leafletMap} />
      
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleFullscreen}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title={isFullscreen ? t('monitoring.map.exitFullscreen') : t('monitoring.map.enterFullscreen')}
        >
          {isFullscreen ? (
            <ArrowsPointingInIcon className="w-5 h-5 text-gray-700" />
          ) : (
            <ArrowsPointingOutIcon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>
    </div>
  );
};

MapContainer.propTypes = {
  onMapReady: PropTypes.func
};

export default MapContainer;