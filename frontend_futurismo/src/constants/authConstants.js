/**
 * COMPATIBILITY LAYER - Auth
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useAuthConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getAuthConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.auth || {};
};


export const USER_ROLES = (() => {
  const config = getAuthConfig();
  return config.userRoles || [];
})();

export const GUIDE_TYPES = (() => {
  const config = getAuthConfig();
  return config.guideTypes || [];
})();

export const USER_STATUS = (() => {
  const config = getAuthConfig();
  return config.userStatus || [];
})();

export const AUTH_STATES = (() => {
  const config = getAuthConfig();
  return config.authStates || ['idle', 'loading', 'authenticated', 'unauthenticated', 'error'];
})();

export const SESSION_CONFIG = (() => {
  const config = getAuthConfig();
  return config.sessionConfig || {};
})();


// Export default para compatibilidad
export default {
  USER_ROLES,
  GUIDE_TYPES,
  USER_STATUS,
  AUTH_STATES,
  SESSION_CONFIG
};
