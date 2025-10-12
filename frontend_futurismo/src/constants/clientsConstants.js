/**
 * COMPATIBILITY LAYER - Clients
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useClientsConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getClientsConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.clients || {};
};


export const CLIENT_TYPES = (() => {
  const config = getClientsConfig();
  return config.clientTypes || [];
})();

export const CLIENT_STATUS = (() => {
  const config = getClientsConfig();
  return config.clientStatus || [];
})();

export const NATIONALITY_OPTIONS = (() => {
  const config = getClientsConfig();
  return config.nationalities || [];
})();

export const IDENTIFICATION_TYPES = (() => {
  const config = getClientsConfig();
  return config.identificationTypes || [];
})();


// Export default para compatibilidad
export default {
  CLIENT_TYPES,
  CLIENT_STATUS,
  NATIONALITY_OPTIONS,
  IDENTIFICATION_TYPES
};
