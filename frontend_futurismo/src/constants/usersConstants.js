/**
 * COMPATIBILITY LAYER - Users
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
  return state.modules?.users || {};
};


export const USER_STATUS = (() => {
  const config = getAuthConfig();
  return config.userStatus || [];
})();

export const USER_ROLES = (() => {
  const config = getAuthConfig();
  return config.userRoles || [];
})();

export const GUIDE_TYPES = (() => {
  const config = getAuthConfig();
  return config.guideTypes || [];
})();

export const DEPARTMENTS = [
  { value: 'cusco', label: 'Cusco' },
  { value: 'lima', label: 'Lima' },
  { value: 'arequipa', label: 'Arequipa' }
];


// Export default para compatibilidad
export default {
  USER_STATUS,
  USER_ROLES,
  GUIDE_TYPES,
  DEPARTMENTS
};
