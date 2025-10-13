/**
 * COMPATIBILITY LAYER - ReservationFilters
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useReservationsConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getReservationsConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.reservationfilters || {};
};


// Default filter values
export const DEFAULT_FILTER_VALUES = (() => {
  const config = getReservationsConfig();
  return config.defaultFilterValues || {
    SEARCH_TERM: '',
    STATUS: 'all',
    DATE_FROM: '',
    DATE_TO: '',
    CUSTOMER: '',
    MIN_PASSENGERS: '',
    MAX_PASSENGERS: '',
    CURRENT_PAGE: 1
  };
})();

// Filter limits
export const FILTER_LIMITS = (() => {
  const config = getReservationsConfig();
  return config.filterLimits || {
    MAX_PASSENGERS: 100,
    MIN_PASSENGERS: 1,
    MAX_SEARCH_LENGTH: 100
  };
})();

// Pagination config
export const PAGINATION_CONFIG = (() => {
  const config = getReservationsConfig();
  return config.paginationConfig || {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
  };
})();

// Status options
export const STATUS_OPTIONS = {
  ALL: 'all',
  PENDING: 'pendiente',
  CONFIRMED: 'confirmada',
  CANCELLED: 'cancelada',
  COMPLETED: 'completada'
};

// Date configuration
export const DATE_CONFIG = {
  END_OF_DAY_HOURS: 23,
  END_OF_DAY_MINUTES: 59,
  END_OF_DAY_SECONDS: 59,
  END_OF_DAY_MILLISECONDS: 999
};


// Export default para compatibilidad
export default {
  DEFAULT_FILTER_VALUES,
  FILTER_LIMITS,
  PAGINATION_CONFIG,
  STATUS_OPTIONS,
  DATE_CONFIG
};
