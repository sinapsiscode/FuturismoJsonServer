/**
 * Constantes para formularios de eventos
 */

// Estados iniciales del formulario
export const INITIAL_EVENT_FORM_STATE = {
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  allDay: false,
  category: 'personal',
  recurring: false,
  reminder: '15',
  priority: 'medium',
  visibility: 'private',
  attendees: [],
  tags: []
};

// Categorías de eventos
export const EVENT_CATEGORIES = {
  PERSONAL: 'personal',
  WORK: 'work',
  COMPANY_TOUR: 'companyTour',
  MEETING: 'meeting',
  OCCUPIED: 'occupied'
};

// Niveles de prioridad
export const EVENT_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Visibilidad de eventos
export const EVENT_VISIBILITY = {
  PRIVATE: 'private',
  PUBLIC: 'public',
  COMPANY: 'company',
  TEAM: 'team'
};

// Recordatorios (en minutos)
export const EVENT_REMINDERS = {
  NONE: '0',
  FIVE_MINUTES: '5',
  FIFTEEN_MINUTES: '15',
  THIRTY_MINUTES: '30',
  ONE_HOUR: '60',
  TWO_HOURS: '120',
  ONE_DAY: '1440'
};

// Límites de validación
export const EVENT_VALIDATION_LIMITS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  LOCATION_MAX_LENGTH: 200,
  MAX_ATTENDEES: 50,
  MAX_TAGS: 10,
  TAG_MAX_LENGTH: 20
};

// Horarios por defecto
export const DEFAULT_EVENT_TIMES = {
  START: '09:00',
  END: '10:00',
  DURATION: 60 // minutos
};

// Patrones de recurrencia
export const RECURRENCE_PATTERNS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CUSTOM: 'custom'
};

// Errores de validación (keys para i18n)
export const EVENT_ERROR_KEYS = {
  TITLE_REQUIRED: 'calendar.errors.titleRequired',
  TITLE_TOO_LONG: 'calendar.errors.titleTooLong',
  DATE_REQUIRED: 'calendar.errors.dateRequired',
  START_TIME_REQUIRED: 'calendar.errors.startTimeRequired',
  END_TIME_REQUIRED: 'calendar.errors.endTimeRequired',
  INVALID_TIME_RANGE: 'calendar.errors.invalidTimeRange',
  DESCRIPTION_TOO_LONG: 'calendar.errors.descriptionTooLong',
  LOCATION_TOO_LONG: 'calendar.errors.locationTooLong',
  TOO_MANY_ATTENDEES: 'calendar.errors.tooManyAttendees',
  INVALID_EMAIL: 'calendar.errors.invalidEmail',
  DUPLICATE_ATTENDEE: 'calendar.errors.duplicateAttendee'
};