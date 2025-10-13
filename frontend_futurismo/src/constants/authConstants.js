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

// Initial state for auth store
export const INITIAL_STATE = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  rememberMe: false
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  EMAIL_EXISTS: 'El email ya está registrado',
  UPDATE_PROFILE_ERROR: 'Error al actualizar el perfil',
  NETWORK_ERROR: 'Error de conexión',
  UNAUTHORIZED: 'No autorizado',
  SESSION_EXPIRED: 'Sesión expirada'
};

// Auth events for custom events
export const AUTH_EVENTS = {
  LOGIN_SUCCESS: 'auth:login:success',
  LOGIN_FAILURE: 'auth:login:failure',
  LOGOUT: 'auth:logout',
  SESSION_EXPIRED: 'auth:session:expired',
  TOKEN_REFRESHED: 'auth:token:refreshed'
};

// Export default para compatibilidad
export default {
  USER_ROLES,
  GUIDE_TYPES,
  USER_STATUS,
  AUTH_STATES,
  SESSION_CONFIG,
  INITIAL_STATE,
  ERROR_MESSAGES,
  AUTH_EVENTS
};
