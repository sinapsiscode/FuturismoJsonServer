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

export const GROUP_TYPES = (() => {
  const config = getMarketplaceConfig();
  return config.groupTypes || [
    { value: 'individual', label: 'Individual' },
    { value: 'small', label: 'Grupo pequeño (2-6)' },
    { value: 'medium', label: 'Grupo mediano (7-15)' },
    { value: 'large', label: 'Grupo grande (16+)' }
  ];
})();

// Default filters for marketplace search
export const DEFAULT_FILTERS = {
  languages: [],
  workZones: [],
  tourTypes: [],
  groupTypes: [],
  priceRange: { min: 0, max: 500 },
  minRating: 0,
  verified: false,
  availability: 'all' // all, available, unavailable
};

// Marketplace view modes
export const MARKETPLACE_VIEWS = {
  GRID: 'grid',
  LIST: 'list',
  MAP: 'map'
};

// Request status values
export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Marketplace messages for toast notifications
export const MARKETPLACE_MESSAGES = {
  FETCH_ERROR: 'Error al cargar guías del marketplace',
  REQUEST_CREATED: 'Solicitud de servicio creada exitosamente',
  REQUEST_ERROR: 'Error al crear solicitud',
  RESPONSE_SENT: 'Respuesta enviada exitosamente',
  RESPONSE_ERROR: 'Error al enviar respuesta',
  REVIEW_CREATED: 'Reseña publicada exitosamente',
  REVIEW_ERROR: 'Error al publicar reseña'
};


// Export default para compatibilidad
export default {
  LANGUAGES,
  SORT_OPTIONS,
  PRICE_RANGE_CONFIG,
  RATING_OPTIONS,
  WORK_ZONES,
  TOUR_TYPES,
  GROUP_TYPES,
  DEFAULT_FILTERS,
  MARKETPLACE_VIEWS,
  REQUEST_STATUS,
  MARKETPLACE_MESSAGES
};
