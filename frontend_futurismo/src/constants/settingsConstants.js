/**
 * COMPATIBILITY LAYER - Settings
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useSettingsConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getSettingsConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.settings || {};
};


export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^9\d{8}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
};

export const FORM_LIMITS = {
  maxLength: 255,
  minLength: 3
};

export const NOTIFICATION_CHANNELS = (() => {
  const config = getSettingsConfig();
  return config.notificationChannels || [];
})();

export const NOTIFICATION_TYPES = (() => {
  const config = getSettingsConfig();
  return config.notificationTypes || [];
})();

export const CHANNEL_COLORS = {
  email: 'blue',
  sms: 'green',
  push: 'purple',
  whatsapp: 'green'
};

export const TOUR_LIMITS = (() => {
  const config = getSettingsConfig();
  return config.tourLimits || {};
})();

export const DEFAULT_VALUES = {
  maxParticipants: 20,
  duration: 4
};

// Setting categories
export const SETTING_CATEGORIES = {
  GENERAL: 'general',
  NOTIFICATIONS: 'notifications',
  PRIVACY: 'privacy',
  APPEARANCE: 'appearance',
  LANGUAGE: 'language',
  SECURITY: 'security'
};

// Theme options
export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'en', label: 'English', flag: '🇺🇸' }
];

// Notification settings
export const NOTIFICATION_SETTINGS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  WHATSAPP: 'whatsapp'
};

// Privacy settings
export const PRIVACY_SETTINGS = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  FRIENDS: 'friends',
  CUSTOM: 'custom'
};

// Settings messages
export const SETTINGS_MESSAGES = {
  FETCH_ERROR: 'Error al cargar configuración',
  UPDATE_SUCCESS: 'Configuración actualizada exitosamente',
  UPDATE_ERROR: 'Error al actualizar configuración',
  RESET_SUCCESS: 'Configuración restablecida',
  RESET_ERROR: 'Error al restablecer configuración',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
  PASSWORD_ERROR: 'Error al cambiar contraseña',
  THEME_CHANGED: 'Tema actualizado',
  LANGUAGE_CHANGED: 'Idioma actualizado'
};


// Export default para compatibilidad
export default {
  VALIDATION_PATTERNS,
  FORM_LIMITS,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_TYPES,
  CHANNEL_COLORS,
  TOUR_LIMITS,
  DEFAULT_VALUES,
  SETTING_CATEGORIES,
  THEME_OPTIONS,
  LANGUAGE_OPTIONS,
  NOTIFICATION_SETTINGS,
  PRIVACY_SETTINGS,
  SETTINGS_MESSAGES
};
