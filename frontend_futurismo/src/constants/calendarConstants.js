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

export const CALENDAR_COLORS = {
  tour: '#3B82F6',
  meeting: '#8B5CF6',
  training: '#10B981',
  maintenance: '#F59E0B',
  personal: '#6B7280',
  holiday: '#EF4444'
};

// Event status colors
export const EVENT_STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

// Days of week
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' }
];

// Time formats
export const TIME_FORMATS = {
  HOUR_12: 'h:mm a',
  HOUR_24: 'HH:mm',
  DATE: 'DD/MM/YYYY',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  MONTH_YEAR: 'MMMM YYYY'
};

// Calendar view modes
export const CALENDAR_VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  AGENDA: 'agenda'
};

// Availability status
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  TENTATIVE: 'tentative',
  OUT_OF_OFFICE: 'out_of_office'
};

// Calendar messages
export const CALENDAR_MESSAGES = {
  EVENT_CREATED: 'Evento creado exitosamente',
  EVENT_UPDATED: 'Evento actualizado exitosamente',
  EVENT_DELETED: 'Evento eliminado exitosamente',
  EVENT_ERROR: 'Error al procesar evento',
  CONFLICT_DETECTED: 'Conflicto detectado con otro evento',
  FETCH_ERROR: 'Error al cargar calendario'
};

// Calendar filters
export const CALENDAR_FILTERS = {
  SHOW_TOURS: 'showTours',
  SHOW_MEETINGS: 'showMeetings',
  SHOW_TRAINING: 'showTraining',
  SHOW_MAINTENANCE: 'showMaintenance',
  SHOW_PERSONAL: 'showPersonal',
  SHOW_HOLIDAYS: 'showHolidays'
};

// Default calendar filters
export const DEFAULT_CALENDAR_FILTERS = {
  showTours: true,
  showMeetings: true,
  showTraining: true,
  showMaintenance: true,
  showPersonal: true,
  showHolidays: true
};

// Time filters
export const TIME_FILTERS = {
  ALL: 'all',
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  UPCOMING: 'upcoming',
  PAST: 'past'
};


// Export default para compatibilidad
export default {
  VIEW_OPTIONS,
  EVENT_TYPES,
  EVENT_STATUS,
  TIME_SLOTS,
  DEFAULT_EVENT_DURATION,
  CALENDAR_COLORS,
  EVENT_STATUS_COLORS,
  DAYS_OF_WEEK,
  TIME_FORMATS,
  CALENDAR_VIEWS,
  AVAILABILITY_STATUS,
  CALENDAR_MESSAGES,
  CALENDAR_FILTERS,
  DEFAULT_CALENDAR_FILTERS,
  TIME_FILTERS
};
