/**
 * COMPATIBILITY LAYER - Marketplace
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useMarketplaceConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getMarketplaceConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.marketplace || {};
};


export const LANGUAGES = (() => {
  const config = getMarketplaceConfig();
  return config.languages || [];
})();

export const SORT_OPTIONS = [
  { value: 'rating', label: 'Calificación' },
  { value: 'price', label: 'Precio' },
  { value: 'experience', label: 'Experiencia' }
];

export const PRICE_RANGE_CONFIG = (() => {
  const config = getMarketplaceConfig();
  return config.priceRangeConfig || { min: 0, max: 500 };
})();

export const RATING_OPTIONS = [
  { value: 5, label: '5 estrellas' },
  { value: 4, label: '4+ estrellas' },
  { value: 3, label: '3+ estrellas' }
];

export const WORK_ZONES = (() => {
  const config = getMarketplaceConfig();
  return config.workZones || [];
})();

export const TOUR_TYPES = (() => {
  const config = getMarketplaceConfig();
  return config.tourTypes || [];
})();


// Export default para compatibilidad
export default {
  LANGUAGES,
  SORT_OPTIONS,
  PRICE_RANGE_CONFIG,
  RATING_OPTIONS,
  WORK_ZONES,
  TOUR_TYPES
};
