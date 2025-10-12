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

export const TABS = [
  { id: 'map', label: 'Mapa', icon: '🗺️' },
  { id: 'info', label: 'Información', icon: 'ℹ️' },
  { id: 'chat', label: 'Chat', icon: '💬' }
];

export const PROGRESS_CIRCLE = {
  size: 120,
  strokeWidth: 8
};

export const MAP_MOBILE_HEIGHT = '400px';

export const MAX_PHOTOS_PER_STOP = 5;


// Export default para compatibilidad
export default {
  GUIDE_STATUS,
  TOUR_STATUS,
  TABS,
  PROGRESS_CIRCLE,
  MAP_MOBILE_HEIGHT,
  MAX_PHOTOS_PER_STOP
};
