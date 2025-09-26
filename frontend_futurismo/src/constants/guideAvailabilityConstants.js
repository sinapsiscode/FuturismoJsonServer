/**
 * Constantes para disponibilidad de guías
 */

// Configuración de horarios
export const TIME_SLOT_CONFIG = {
  PATTERN: /^\d{2}:\d{2}-\d{2}:\d{2}$/,
  DEFAULT_SLOT: '09:00-17:00',
  DEFAULT_START: '09:00',
  DEFAULT_END: '17:00'
};

// Estados de slots
export const SLOT_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OCCUPIED: 'occupied',
  BLOCKED: 'blocked'
};

// Tipos de guía
export const GUIDE_TYPES = {
  PLANTA: 'planta',
  FREELANCE: 'freelance'
};

// Límites de visualización
export const DISPLAY_LIMITS = {
  MAX_LANGUAGES: 5,
  MAX_MUSEUMS: 2,
  MAX_SPECIALTIES: 7
};

// Configuración de navegación de fecha
export const DATE_NAVIGATION = {
  DAYS_FORWARD: 1,
  DAYS_BACKWARD: -1,
  WEEK_FORWARD: 7,
  WEEK_BACKWARD: -7
};