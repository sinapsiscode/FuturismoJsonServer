/**
 * COMPATIBILITY LAYER - Agency
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useAgenciesConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getAgenciesConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.agency || {};
};


export const AGENCY_TYPES = (() => {
  const config = getAgenciesConfig();
  return config.agencyTypes || [];
})();

export const AGENCY_STATUS = (() => {
  const config = getAgenciesConfig();
  return config.agencyStatus || [];
})();

export const BUSINESS_CATEGORIES = (() => {
  const config = getAgenciesConfig();
  return config.businessCategories || [];
})();

export const SERVICE_AREAS = (() => {
  const config = getAgenciesConfig();
  return config.serviceAreas || [];
})();

// Date formats for agency store
export const DATE_FORMATS = (() => {
  const config = getAgenciesConfig();
  return config.dateFormats || {
    DATE_KEY: 'yyyy-MM-dd',
    DISPLAY: 'dd/MM/yyyy',
    DISPLAY_LONG: 'dd MMMM yyyy',
    TIME: 'HH:mm',
    DATETIME: 'dd/MM/yyyy HH:mm'
  };
})();

// Default agency configuration
export const DEFAULT_AGENCY = (() => {
  const config = getAgenciesConfig();
  return config.defaultAgency || {
    ID: 'agency-1',
    NAME: 'Agencia Principal',
    INITIAL_POINTS: 0
  };
})();

// Storage configuration for persist middleware
export const STORAGE_CONFIG = (() => {
  const config = getAgenciesConfig();
  return config.storageConfig || {
    KEY: 'agency-storage',
    VERSION: 1
  };
})();

// Reservation status constants
export const RESERVATION_STATUS = (() => {
  const config = getAgenciesConfig();
  return config.reservationStatus || {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  };
})();

// Export default para compatibilidad
export default {
  AGENCY_TYPES,
  AGENCY_STATUS,
  BUSINESS_CATEGORIES,
  SERVICE_AREAS,
  DATE_FORMATS,
  DEFAULT_AGENCY,
  STORAGE_CONFIG,
  RESERVATION_STATUS
};
