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
  return config.defaultEventTimes || { START: '09:00', END: '17:00' };
})();

// Initial event form state
export const INITIAL_EVENT_FORM_STATE = {
  title: '',
  description: '',
  date: '',
  startTime: '09:00',
  endTime: '17:00',
  allDay: false,
  location: '',
  category: '',
  type: '',
  status: 'scheduled',
  priority: 'medium',
  visibility: 'public',
  attendees: [],
  tags: [],
  reminders: [],
  recurrence: null,
  color: '',
  notes: ''
};

// Event categories
export const EVENT_CATEGORIES = {
  TOUR: 'tour',
  MEETING: 'meeting',
  TRAINING: 'training',
  MAINTENANCE: 'maintenance',
  PERSONAL: 'personal',
  HOLIDAY: 'holiday',
  OTHER: 'other'
};

// Event validation limits
export const EVENT_VALIDATION_LIMITS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  LOCATION_MAX_LENGTH: 200,
  MIN_DURATION_MINUTES: 15,
  MAX_DURATION_HOURS: 24
};

// Event error keys for translations
export const EVENT_ERROR_KEYS = {
  TITLE_REQUIRED: 'event.errors.titleRequired',
  TITLE_TOO_LONG: 'event.errors.titleTooLong',
  DATE_REQUIRED: 'event.errors.dateRequired',
  START_TIME_REQUIRED: 'event.errors.startTimeRequired',
  END_TIME_REQUIRED: 'event.errors.endTimeRequired',
  INVALID_TIME_RANGE: 'event.errors.invalidTimeRange',
  DESCRIPTION_TOO_LONG: 'event.errors.descriptionTooLong',
  LOCATION_TOO_LONG: 'event.errors.locationTooLong',
  INVALID_CATEGORY: 'event.errors.invalidCategory',
  INVALID_PRIORITY: 'event.errors.invalidPriority',
  PAST_DATE: 'event.errors.pastDate',
  CONFLICT_DETECTED: 'event.errors.conflictDetected'
};


// Export default para compatibilidad
export default {
  EVENT_PRIORITIES,
  EVENT_VISIBILITY,
  EVENT_REMINDERS,
  RECURRENCE_PATTERNS,
  DEFAULT_EVENT_TIMES,
  INITIAL_EVENT_FORM_STATE,
  EVENT_CATEGORIES,
  EVENT_VALIDATION_LIMITS,
  EVENT_ERROR_KEYS
};
