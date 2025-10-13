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

// User status colors
export const USER_STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

// User role labels
export const USER_ROLE_LABELS = {
  admin: 'Administrador',
  agency: 'Agencia',
  guide: 'Guía',
  client: 'Cliente',
  driver: 'Chofer'
};

// User role colors
export const USER_ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-800',
  agency: 'bg-blue-100 text-blue-800',
  guide: 'bg-green-100 text-green-800',
  client: 'bg-yellow-100 text-yellow-800',
  driver: 'bg-orange-100 text-orange-800'
};

// Guide type labels
export const GUIDE_TYPE_LABELS = {
  freelance: 'Freelance',
  plant: 'Planta',
  employed: 'Empleado'
};

// Validation rules
export const USER_VALIDATIONS = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^9\d{8}$/,
  DNI_LENGTH: 8,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 3
};

// User messages
export const USER_MESSAGES = {
  FETCH_ERROR: 'Error al cargar usuarios',
  CREATE_SUCCESS: 'Usuario creado exitosamente',
  CREATE_ERROR: 'Error al crear usuario',
  UPDATE_SUCCESS: 'Usuario actualizado exitosamente',
  UPDATE_ERROR: 'Error al actualizar usuario',
  DELETE_SUCCESS: 'Usuario eliminado exitosamente',
  DELETE_ERROR: 'Error al eliminar usuario',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
  PASSWORD_ERROR: 'Error al cambiar contraseña'
};


// Export default para compatibilidad
export default {
  USER_STATUS,
  USER_ROLES,
  GUIDE_TYPES,
  DEPARTMENTS,
  USER_STATUS_COLORS,
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  GUIDE_TYPE_LABELS,
  USER_VALIDATIONS,
  USER_MESSAGES
};
