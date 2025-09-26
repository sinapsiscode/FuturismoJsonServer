/**
 * Constantes para filtros de reservas
 */

// Valores por defecto de filtros
export const DEFAULT_FILTER_VALUES = {
  SEARCH_TERM: '',
  STATUS: 'all',
  DATE_FROM: '',
  DATE_TO: '',
  CUSTOMER: '',
  MIN_PASSENGERS: '',
  MAX_PASSENGERS: '',
  CURRENT_PAGE: 1
};

// Opciones de estado
export const STATUS_OPTIONS = {
  ALL: 'all',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Configuración de fechas
export const DATE_CONFIG = {
  END_OF_DAY_HOURS: 23,
  END_OF_DAY_MINUTES: 59,
  END_OF_DAY_SECONDS: 59,
  END_OF_DAY_MILLISECONDS: 999
};

// Límites de filtros
export const FILTER_LIMITS = {
  MIN_PASSENGERS: 1,
  MAX_PASSENGERS: 100,
  MIN_SEARCH_LENGTH: 2
};

// Configuración de paginación (si no está ya en reservationConstants)
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 10,
  MAX_PAGE_BUTTONS: 5
};