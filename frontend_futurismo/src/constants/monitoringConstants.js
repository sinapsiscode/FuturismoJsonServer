/**
 * COMPATIBILITY LAYER - Monitoring
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useMonitoringConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getMonitoringConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.monitoring || {};
};


export const GUIDE_STATUS = (() => {
  const config = getMonitoringConfig();
  return config.guideStatus || [];
})();

export const TOUR_STATUS = (() => {
  const config = getMonitoringConfig();
  return config.tourStatus || [];
})();

export const TABS = (() => {
  const config = getMonitoringConfig();
  return config.tabs || [
    { id: 'map', label: 'Mapa', icon: '🗺️' },
    { id: 'info', label: 'Información', icon: 'ℹ️' },
    { id: 'chat', label: 'Chat', icon: '💬' }
  ];
})();

export const PROGRESS_CIRCLE = (() => {
  const config = getMonitoringConfig();
  return config.progressCircle || {
    size: 120,
    strokeWidth: 8
  };
})();

export const MAP_MOBILE_HEIGHT = (() => {
  const config = getMonitoringConfig();
  return config.mapMobileHeight || '400px';
})();

export const MAX_PHOTOS_PER_STOP = (() => {
  const config = getMonitoringConfig();
  return config.maxPhotosPerStop || 5;
})();

// Tour status colors
export const TOUR_STATUS_COLORS = (() => {
  const config = getMonitoringConfig();
  return config.tourStatusColors || {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    paused: 'bg-orange-100 text-orange-800'
  };
})();

// Guide status colors
export const GUIDE_STATUS_COLORS = (() => {
  const config = getMonitoringConfig();
  return config.guideStatusColors || {
    available: 'bg-green-100 text-green-800',
    busy: 'bg-yellow-100 text-yellow-800',
    offline: 'bg-gray-100 text-gray-800',
    emergency: 'bg-red-100 text-red-800'
  };
})();

// Alert types
export const ALERT_TYPES = (() => {
  const config = getMonitoringConfig();
  return config.alertTypes || {
    DELAY: 'delay',
    EMERGENCY: 'emergency',
    LOCATION_LOST: 'location_lost',
    LOW_BATTERY: 'low_battery',
    INFO: 'info'
  };
})();

// Map settings
export const MAP_SETTINGS = (() => {
  const config = getMonitoringConfig();
  return config.mapSettings || {
    DEFAULT_ZOOM: 13,
    DEFAULT_CENTER: [-12.0464, -77.0428],
    UPDATE_INTERVAL: 30000,
    MARKER_COLORS: {
      guide: '#3B82F6',
      tourist: '#10B981',
      waypoint: '#F59E0B',
      emergency: '#EF4444'
    }
  };
})();

// Monitoring messages
export const MONITORING_MESSAGES = (() => {
  const config = getMonitoringConfig();
  return config.monitoringMessages || {
    FETCH_ERROR: 'Error al cargar datos de monitoreo',
    UPDATE_SUCCESS: 'Estado actualizado exitosamente',
    UPDATE_ERROR: 'Error al actualizar estado',
    LOCATION_UPDATED: 'Ubicación actualizada',
    CONNECTION_LOST: 'Conexión perdida con el guía',
    CONNECTION_RESTORED: 'Conexión restaurada'
  };
})();


// Export default para compatibilidad
export default {
  GUIDE_STATUS,
  TOUR_STATUS,
  TABS,
  PROGRESS_CIRCLE,
  MAP_MOBILE_HEIGHT,
  MAX_PHOTOS_PER_STOP,
  TOUR_STATUS_COLORS,
  GUIDE_STATUS_COLORS,
  ALERT_TYPES,
  MAP_SETTINGS,
  MONITORING_MESSAGES
};
