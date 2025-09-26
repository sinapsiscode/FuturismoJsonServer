// Notification channels
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  WHATSAPP: 'whatsapp'
};

// Notification types
export const NOTIFICATION_TYPES = {
  NEW_RESERVATION: 'newReservation',
  RESERVATION_CANCELLED: 'reservationCancelled',
  REMINDER_24H: 'reminder24h',
  REMINDER_2H: 'reminder2h',
  TOUR_COMPLETE: 'tourComplete',
  PAYMENT_RECEIVED: 'paymentReceived',
  NEW_MESSAGE: 'newMessage',
  GUIDE_ASSIGNMENT: 'guideAssignment',
  CANCELLATION: 'cancellation',
  LOW_CREDIT: 'lowCredit',
  SYSTEM_ALERTS: 'systemAlerts',
  EMERGENCY_ONLY: 'emergencyOnly'
};

import { CURRENCIES as SHARED_CURRENCIES } from './sharedConstants';

// Re-export currencies from shared constants
export const CURRENCIES = {
  PEN: { value: SHARED_CURRENCIES.PEN.value, symbol: SHARED_CURRENCIES.PEN.symbol },
  USD: { value: SHARED_CURRENCIES.USD.value, symbol: SHARED_CURRENCIES.USD.symbol },
  EUR: { value: SHARED_CURRENCIES.EUR.value, symbol: SHARED_CURRENCIES.EUR.symbol }
};

// Timezones
export const TIMEZONES = {
  LIMA: { value: 'America/Lima', offset: 'UTC-5' },
  NEW_YORK: { value: 'America/New_York', offset: 'UTC-5/UTC-4' },
  LONDON: { value: 'Europe/London', offset: 'UTC+0/UTC+1' }
};

// Languages
export const LANGUAGES = {
  ES: { value: 'es', name: 'Español' },
  EN: { value: 'en', name: 'English' },
  PT: { value: 'pt', name: 'Português' }
};

import { DATE_FORMATS as SHARED_DATE_FORMATS, VALIDATION_PATTERNS as SHARED_VALIDATION_PATTERNS } from './sharedConstants';

// Settings-specific date formats
export const DATE_FORMATS = {
  DD_MM_YYYY: SHARED_DATE_FORMATS.DEFAULT,
  MM_DD_YYYY: SHARED_DATE_FORMATS.US,
  YYYY_MM_DD: SHARED_DATE_FORMATS.ISO
};

// Settings-specific time formats
export const TIME_FORMATS = {
  H12: SHARED_DATE_FORMATS.TIME_12H,
  H24: SHARED_DATE_FORMATS.TIME_24H
};

// Tour settings limits
export const TOUR_LIMITS = {
  MIN_ADVANCE_BOOKING_HOURS: 0,
  MAX_ADVANCE_BOOKING_HOURS: 720, // 30 days
  MIN_CANCELLATION_HOURS: 0,
  MAX_CANCELLATION_HOURS: 168, // 7 days
  MIN_GROUP_SIZE: 1,
  MAX_GROUP_SIZE: 100,
  MIN_COMMISSION: 0,
  MAX_COMMISSION: 100,
  MIN_PRICE: 0,
  MAX_PRICE: 10000
};

// Working hours
export const WORKING_HOURS = {
  DEFAULT_START: '08:00',
  DEFAULT_END: '18:00',
  MIN_HOUR: '00:00',
  MAX_HOUR: '23:59'
};

// Price range categories
export const PRICE_CATEGORIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Settings sections
export const SETTINGS_SECTIONS = {
  GENERAL: 'general',
  NOTIFICATIONS: 'notifications',
  TOURS: 'tours',
  SECURITY: 'security',
  INTEGRATIONS: 'integrations'
};


// Re-export validation patterns from shared constants
export const VALIDATION_PATTERNS = SHARED_VALIDATION_PATTERNS;

// Form field limits
export const FORM_LIMITS = {
  COMPANY_NAME_MIN: 3,
  COMPANY_NAME_MAX: 100,
  PHONE_MIN: 7,
  PHONE_MAX: 20,
  ADDRESS_MAX: 200,
  URL_MAX: 255
};

// Notification channel colors
export const CHANNEL_COLORS = {
  EMAIL: 'blue',
  SMS: 'green',
  PUSH: 'purple',
  WHATSAPP: 'green'
};

// Price range types
export const PRICE_RANGE_TYPES = {
  BUDGET: 'budget',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  LUXURY: 'luxury'
};

// Default values
export const DEFAULT_VALUES = {
  DURATION_MIN: 0.5,
  DURATION_STEP: 0.5,
  ADVANCE_BOOKING_MIN: 1,
  ADVANCE_BOOKING_MAX_DAYS: 365,
  CANCELLATION_MIN: 0,
  MAX_CAPACITY_MIN: 1
};

// Información de la empresa por defecto
export const DEFAULT_COMPANY_INFO = {
  NAME: 'Futurismo Tours',
  PHONE: '+51 999 999 999',
  EMAIL: 'info@futurismo.com',
  ADDRESS: 'Av. Larco 123, Miraflores, Lima',
  WEBSITE: 'https://futurismo.com'
};

// Configuración de tours por defecto
export const DEFAULT_TOURS_CONFIG = {
  MAX_CAPACITY: 20,
  MIN_ADVANCE_BOOKING_HOURS: 24,
  MAX_ADVANCE_BOOKING_DAYS: 365,
  CANCELLATION_POLICY_HOURS: 24,
  DEFAULT_DURATION_HOURS: 4,
  WORKING_HOURS: {
    start: '06:00',
    end: '20:00'
  },
  PRICE_RANGES: {
    [PRICE_RANGE_TYPES.BUDGET]: { min: 0, max: 50 },
    [PRICE_RANGE_TYPES.STANDARD]: { min: 50, max: 100 },
    [PRICE_RANGE_TYPES.PREMIUM]: { min: 100, max: 200 },
    [PRICE_RANGE_TYPES.LUXURY]: { min: 200, max: 999 }
  }
};

// Configuración de agencias por defecto
export const DEFAULT_AGENCIES_CONFIG = {
  DEFAULT_CREDIT_LIMIT: 5000,
  COMMISSION_RATE_PERCENT: 10,
  PAYMENT_TERMS_DAYS: 30,
  MAX_ACTIVE_RESERVATIONS: 50
};

// Configuración de guías por defecto
export const DEFAULT_GUIDES_CONFIG = {
  MAX_TOURS_PER_DAY: 2,
  REST_TIME_BETWEEN_TOURS_HOURS: 2,
  EVALUATION_PERIOD_DAYS: 90,
  MIN_RATING_REQUIRED: 4.0
};

// Configuración de monitoreo por defecto
export const DEFAULT_MONITORING_CONFIG = {
  UPDATE_INTERVAL_SECONDS: 30,
  ALERT_RADIUS_METERS: 500,
  BATTERY_ALERT_THRESHOLD_PERCENT: 20
};

// Configuración de reportes por defecto
export const DEFAULT_REPORTS_CONFIG = {
  DAILY_REPORT_TIME: '18:00',
  WEEKLY_REPORT_DAY: 'monday',
  MONTHLY_REPORT_DAY: 1,
  RETENTION_PERIOD_MONTHS: 24
};

// Configuración de seguridad por defecto
export const DEFAULT_SECURITY_CONFIG = {
  SESSION_TIMEOUT_MINUTES: 120,
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  MIN_PASSWORD_LENGTH_VALIDATION: 6
};

// Tiempos de simulación (ms)
export const API_SIMULATION_DELAYS = {
  LOAD_SETTINGS: 1000,
  SAVE_SETTINGS: 1500
};

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  COMPANY_NAME_REQUIRED: 'El nombre de la empresa es requerido',
  INVALID_EMAIL: 'Email de empresa inválido',
  MIN_CAPACITY_ERROR: 'La capacidad máxima debe ser mayor a 0',
  MIN_ADVANCE_BOOKING_ERROR: 'El tiempo mínimo de reserva debe ser mayor a 0',
  PASSWORD_LENGTH_ERROR: 'La longitud mínima de contraseña debe ser al menos 6',
  INVALID_FILE_FORMAT: 'Formato de archivo inválido'
};

// Formato de exportación
export const EXPORT_CONFIG = {
  FILE_PREFIX: 'futurismo-settings-',
  FILE_EXTENSION: '.json',
  DATA_TYPE: 'application/json',
  CHARSET: 'utf-8'
};

// Números mínimos de validación
export const VALIDATION_MINIMUMS = {
  CAPACITY: 1,
  ADVANCE_BOOKING: 1,
  PASSWORD_LENGTH: 6
};