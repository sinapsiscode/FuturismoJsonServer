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


// Export default para compatibilidad
export default {
  AGENCY_TYPES,
  AGENCY_STATUS,
  BUSINESS_CATEGORIES,
  SERVICE_AREAS
};
