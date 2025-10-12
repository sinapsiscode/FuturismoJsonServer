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


export const DEFAULT_FILTER_VALUES = (() => {
  const config = getReservationsConfig();
  return config.defaultFilterValues || {};
})();

export const FILTER_LIMITS = (() => {
  const config = getReservationsConfig();
  return config.filterLimits || {};
})();

export const PAGINATION_CONFIG = (() => {
  const config = getReservationsConfig();
  return config.paginationConfig || { defaultPageSize: 10 };
})();


// Export default para compatibilidad
export default {
  DEFAULT_FILTER_VALUES,
  FILTER_LIMITS,
  PAGINATION_CONFIG
};
