/**
 * COMPATIBILITY LAYER - Calendar
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
  return state.modules?.calendar || {};
};


export const VIEW_OPTIONS = [
  { value: 'month', label: 'Mes' },
  { value: 'week', label: 'Semana' },
  { value: 'day', label: 'Día' }
];

export const EVENT_TYPES = (() => {
  const config = getCalendarConfig();
  return config.eventTypes || [];
})();

export const EVENT_STATUS = (() => {
  const config = getCalendarConfig();
  return config.eventStatus || [];
})();

export const TIME_SLOTS = (() => {
  const config = getCalendarConfig();
  return config.timeSlots || [];
})();

export const DEFAULT_EVENT_DURATION = 60;

export const CALENDAR_COLORS = (() => {
  const config = getCalendarConfig();
  return config.calendarColors || {};
})();


// Export default para compatibilidad
export default {
  VIEW_OPTIONS,
  EVENT_TYPES,
  EVENT_STATUS,
  TIME_SLOTS,
  DEFAULT_EVENT_DURATION,
  CALENDAR_COLORS
};
