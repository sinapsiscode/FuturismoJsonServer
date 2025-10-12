/**
 * COMPATIBILITY LAYER - Shared
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useSystemConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getSystemConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.shared || {};
};


export const CURRENCIES = (() => {
  const config = getSystemConfig();
  return config.currencies || [];
})();

export const LANGUAGES = (() => {
  const config = getSystemConfig();
  return config.languages || [];
})();

export const GUIDE_TYPES = (() => {
  const config = getSystemConfig();
  return config.guideTypes || [];
})();

export const VALIDATION_PATTERNS = (() => {
  const config = getSystemConfig();
  return config.validationPatterns || {};
})();

export const STATUS_VALUES = (() => {
  const config = getSystemConfig();
  return config.statusValues || [];
})();

export const PRIORITY_LEVELS = (() => {
  const config = getSystemConfig();
  return config.priorityLevels || [];
})();

export const DATE_FORMATS = (() => {
  const config = getSystemConfig();
  return config.dateFormats || {};
})();

export const STATUS_COLORS = (() => {
  const config = getSystemConfig();
  return config.statusColors || {};
})();

export const PRIORITY_COLORS = (() => {
  const config = getSystemConfig();
  return config.priorityColors || {};
})();

export const TIME_CONSTANTS = (() => {
  const config = getSystemConfig();
  return config.timeConstants || {};
})();

export const PAGINATION_DEFAULTS = (() => {
  const config = getSystemConfig();
  return config.paginationDefaults || { pageSize: 10 };
})();

export const RATING_SCALE = (() => {
  const config = getSystemConfig();
  return config.ratingScale || { min: 1, max: 5 };
})();


// Export default para compatibilidad
export default {
  CURRENCIES,
  LANGUAGES,
  GUIDE_TYPES,
  VALIDATION_PATTERNS,
  STATUS_VALUES,
  PRIORITY_LEVELS,
  DATE_FORMATS,
  STATUS_COLORS,
  PRIORITY_COLORS,
  TIME_CONSTANTS,
  PAGINATION_DEFAULTS,
  RATING_SCALE
};
