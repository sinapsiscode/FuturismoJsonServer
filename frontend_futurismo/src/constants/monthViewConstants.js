/**
 * Constantes para vista de mes
 */

// Tipos de eventos
export const EVENT_TYPES = {
  PERSONAL: 'personal',
  COMPANY_TOUR: 'company_tour',
  OCCUPIED: 'occupied',
  MEETING: 'meeting',
  REMINDER: 'reminder'
};

// Configuración de calendario
export const CALENDAR_CONFIG = {
  WEEK_START_DAY: 1, // Lunes
  DATE_FORMAT: 'yyyy-MM-dd',
  MONTH_FORMAT: 'MMMM yyyy',
  DAY_FORMAT: 'EEEE, d MMMM'
};

// Límites de visualización
export const VIEW_LIMITS = {
  MAX_EVENTS_PER_DAY: 3,
  MAX_INDICATORS: 5,
  TOOLTIP_DELAY: 500
};

// Colores de indicadores (para clases Tailwind)
export const EVENT_COLORS = {
  PERSONAL: 'blue',
  COMPANY_TOUR: 'green',
  OCCUPIED: 'red',
  AVAILABLE: 'emerald',
  MEETING: 'purple'
};

// Vistas disponibles
export const CALENDAR_VIEWS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

// Configuración de hover
export const HOVER_CONFIG = {
  DELAY_IN: 200,
  DELAY_OUT: 100,
  POSITION: 'bottom'
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  GUIDE: 'guide',
  AGENCY: 'agency'
};