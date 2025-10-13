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

export const DEPARTMENTS = (() => {
  const config = getAuthConfig();
  return config.departments || [
    { value: 'cusco', label: 'Cusco' },
    { value: 'lima', label: 'Lima' },
    { value: 'arequipa', label: 'Arequipa' }
  ];
})();

// User status colors
export const USER_STATUS_COLORS = (() => {
  const config = getAuthConfig();
  return config.userStatusColors || {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };
})();

// User role labels
export const USER_ROLE_LABELS = (() => {
  const config = getAuthConfig();
  return config.userRoleLabels || {
    admin: 'Administrador',
    agency: 'Agencia',
    guide: 'Guía',
    client: 'Cliente',
    driver: 'Chofer'
  };
})();

// User role colors
export const USER_ROLE_COLORS = (() => {
  const config = getAuthConfig();
  return config.userRoleColors || {
    admin: 'bg-purple-100 text-purple-800',
    agency: 'bg-blue-100 text-blue-800',
    guide: 'bg-green-100 text-green-800',
    client: 'bg-yellow-100 text-yellow-800',
    driver: 'bg-orange-100 text-orange-800'
  };
})();

// Guide type labels
export const GUIDE_TYPE_LABELS = (() => {
  const config = getAuthConfig();
  return config.guideTypeLabels || {
    freelance: 'Freelance',
    plant: 'Planta',
    employed: 'Empleado'
  };
})();

// Validation rules
export const USER_VALIDATIONS = (() => {
  const config = getAuthConfig();
  return config.userValidations || {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^9\d{8}$/,
    DNI_LENGTH: 8,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 3
  };
})();

// User messages
export const USER_MESSAGES = (() => {
  const config = getAuthConfig();
  return config.userMessages || {
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
})();

// Default values
export const DEFAULT_VALUES = (() => {
  const config = getAuthConfig();
  return config.defaultValues || {
    TEMPORARY_PASSWORD: 'Temp123456',
    DEFAULT_AVATAR: 'https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff',
    DEFAULT_ROLE: 'client',
    DEFAULT_STATUS: 'active'
  };
})();

// Validation patterns
export const VALIDATION_PATTERNS = (() => {
  const config = getAuthConfig();
  return config.validationPatterns || {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^9\d{8}$/,
    RUC: /^\d{11}$/,
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
    DNI: /^\d{8}$/
  };
})();

// Form limits
export const FORM_LIMITS = (() => {
  const config = getAuthConfig();
  return config.formLimits || {
    USERNAME_MIN: 3,
    USERNAME_MAX: 20,
    NAME_MIN: 2,
    NAME_MAX: 50,
    PASSWORD_MIN: 8,
    PASSWORD_MAX: 50,
    BIO_MAX: 500
  };
})();

// Date formats
export const DATE_FORMATS = (() => {
  const config = getAuthConfig();
  return config.dateFormats || {
    LOCALE: 'es-PE',
    DATE_TIME_FORMAT: { hour: '2-digit', minute: '2-digit' }
  };
})();

// Role colors (alias para compatibilidad)
export const ROLE_COLORS = USER_ROLE_COLORS;

// Status colors (alias para compatibilidad)
export const STATUS_COLORS = USER_STATUS_COLORS;

// Stat icons (letras para las tarjetas de estadísticas)
export const STAT_ICONS = (() => {
  const config = getAuthConfig();
  return config.statIcons || {
    ADMIN: {
      letter: 'A',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    AGENCY: {
      letter: 'AG',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    GUIDE: {
      letter: 'G',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    CLIENT: {
      letter: 'C',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    DRIVER: {
      letter: 'D',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  };
})();

// Default permissions por rol
export const DEFAULT_PERMISSIONS = (() => {
  const config = getAuthConfig();
  return config.defaultPermissions || {
    admin: ['users.create', 'users.read', 'users.update', 'users.delete', 'tours.create', 'tours.read', 'tours.update', 'tours.delete', 'reservations.create', 'reservations.read', 'reservations.update', 'reservations.delete', 'reports.read', 'settings.update'],
    agency: ['tours.create', 'tours.read', 'tours.update', 'reservations.create', 'reservations.read', 'reservations.update', 'clients.create', 'clients.read', 'reports.read'],
    guide: ['tours.read', 'reservations.read', 'profile.update'],
    'guide-planta': ['tours.read', 'reservations.read', 'profile.update', 'availability.update'],
    'guide-freelance': ['tours.read', 'reservations.read', 'profile.update', 'availability.update', 'marketplace.read'],
    client: ['profile.update', 'reservations.read'],
    driver: ['tours.read', 'reservations.read', 'profile.update']
  };
})();

// Default preferences (preferencias por defecto del usuario)
export const DEFAULT_PREFERENCES = (() => {
  const config = getAuthConfig();
  return config.defaultPreferences || {
    language: 'es',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    theme: 'light',
    timezone: 'America/Lima'
  };
})();

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
  USER_MESSAGES,
  DEFAULT_VALUES,
  VALIDATION_PATTERNS,
  FORM_LIMITS,
  DATE_FORMATS,
  ROLE_COLORS,
  STATUS_COLORS,
  STAT_ICONS,
  DEFAULT_PERMISSIONS,
  DEFAULT_PREFERENCES
};
