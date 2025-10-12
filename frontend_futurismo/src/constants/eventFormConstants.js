/**
 * COMPATIBILITY LAYER - EventForm
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useCalendarConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getCalendarConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.eventform || {};
};


export const EVENT_PRIORITIES = (() => {
  const config = getCalendarConfig();
  return config.eventPriorities || [];
})();

export const EVENT_VISIBILITY = (() => {
  const config = getCalendarConfig();
  return config.eventVisibility || [];
})();

export const EVENT_REMINDERS = (() => {
  const config = getCalendarConfig();
  return config.eventReminders || [];
})();

export const RECURRENCE_PATTERNS = (() => {
  const config = getCalendarConfig();
  return config.recurrencePatterns || [];
})();

export const DEFAULT_EVENT_TIMES = (() => {
  const config = getCalendarConfig();
  return config.defaultEventTimes || { start: '09:00', end: '17:00' };
})();


// Export default para compatibilidad
export default {
  EVENT_PRIORITIES,
  EVENT_VISIBILITY,
  EVENT_REMINDERS,
  RECURRENCE_PATTERNS,
  DEFAULT_EVENT_TIMES
};
