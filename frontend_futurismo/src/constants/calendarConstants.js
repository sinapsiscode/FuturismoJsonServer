/**
 * Constantes para hooks relacionados con el calendario
 */

// Tipos de filtros de calendario
export const CALENDAR_FILTERS = {
  SHOW_WEEKENDS: 'showWeekends',
  SHOW_PERSONAL_EVENTS: 'showPersonalEvents',
  SHOW_COMPANY_TOURS: 'showCompanyTours',
  SHOW_OCCUPIED_TIME: 'showOccupiedTime',
  WORKING_HOURS_ONLY: 'workingHoursOnly',
  SHOW_PAST_EVENTS: 'showPastEvents'
};

// Valores por defecto de filtros
export const DEFAULT_CALENDAR_FILTERS = {
  [CALENDAR_FILTERS.SHOW_WEEKENDS]: true,
  [CALENDAR_FILTERS.SHOW_PERSONAL_EVENTS]: true,
  [CALENDAR_FILTERS.SHOW_COMPANY_TOURS]: true,
  [CALENDAR_FILTERS.SHOW_OCCUPIED_TIME]: true,
  [CALENDAR_FILTERS.WORKING_HOURS_ONLY]: false,
  [CALENDAR_FILTERS.SHOW_PAST_EVENTS]: false
};

// Filtros de tiempo
export const TIME_FILTERS = {
  ALL: 'all',
  TODAY: 'today',
  THIS_WEEK: 'thisWeek',
  THIS_MONTH: 'thisMonth',
  THIS_YEAR: 'thisYear'
};

// Vistas de calendario
export const CALENDAR_VIEWS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  AGENDA: 'agenda'
};

// Tipos de eventos
export const EVENT_TYPES = {
  PERSONAL: 'personal',
  COMPANY_TOUR: 'companyTour',
  OCCUPIED: 'occupied',
  MEETING: 'meeting',
  REMINDER: 'reminder'
};

// Colores de eventos por tipo
export const EVENT_COLORS = {
  [EVENT_TYPES.PERSONAL]: '#3B82F6', // blue-500
  [EVENT_TYPES.COMPANY_TOUR]: '#10B981', // green-500
  [EVENT_TYPES.OCCUPIED]: '#6B7280', // gray-500
  [EVENT_TYPES.MEETING]: '#8B5CF6', // purple-500
  [EVENT_TYPES.REMINDER]: '#F59E0B' // yellow-500
};

// Horario laboral por defecto
export const DEFAULT_WORKING_HOURS = {
  start: '08:00',
  end: '18:00'
};

// Días de la semana
export const WEEKDAYS = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0
};

// Configuración de calendario
export const CALENDAR_CONFIG = {
  WEEK_STARTS_ON: WEEKDAYS.MONDAY,
  TIME_SLOT_DURATION: 30, // minutos
  MIN_EVENT_DURATION: 15, // minutos
  DEFAULT_EVENT_DURATION: 60, // minutos
  MAX_EVENTS_PER_DAY: 20,
  SHOW_TIME_SLOTS: true,
  ENABLE_DRAG_DROP: true
};