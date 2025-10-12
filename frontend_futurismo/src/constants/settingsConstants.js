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


// Export default para compatibilidad
export default {
  VALIDATION_PATTERNS,
  FORM_LIMITS,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_TYPES,
  CHANNEL_COLORS,
  TOUR_LIMITS,
  DEFAULT_VALUES
};
