/**
 * Constantes para el store de reservaciones
 */

// Estado inicial del formulario
export const INITIAL_FORM_DATA = {
  serviceType: '',
  date: '',
  time: '',
  touristsCount: 1,
  tourists: [],
  // Campos específicos por tipo de servicio
  origin: '',
  destination: '',
  flightNumber: '',
  tourName: '',
  duration: 1,
  pickupLocation: '',
  includesLunch: false,
  packageName: '',
  days: 2,
  accommodation: '',
  mealPlan: '',
  specialRequirements: ''
};

// Pasos del formulario
export const FORM_STEPS = {
  SERVICE: 1,
  TOURISTS: 2,
  CONFIRMATION: 3,
  MIN_STEP: 1,
  MAX_STEP: 3
};

// Estados de reservación
export const RESERVATION_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  SERVICE_TYPE_REQUIRED: 'Selecciona un tipo de servicio',
  DATE_REQUIRED: 'La fecha es requerida',
  TIME_REQUIRED: 'La hora es requerida',
  ORIGIN_REQUIRED: 'El origen es requerido',
  DESTINATION_REQUIRED: 'El destino es requerido',
  TOUR_NAME_REQUIRED: 'El nombre del tour es requerido',
  PICKUP_LOCATION_REQUIRED: 'El lugar de recojo es requerido',
  PACKAGE_NAME_REQUIRED: 'El nombre del paquete es requerido',
  ACCOMMODATION_REQUIRED: 'El alojamiento es requerido',
  TOURISTS_REQUIRED: 'Agrega al menos un turista',
  TOURISTS_COUNT_MISMATCH: 'Debes agregar {count} turista(s)',
  TOURIST_NAME_REQUIRED: 'El nombre es requerido',
  TOURIST_PASSPORT_REQUIRED: 'El pasaporte es requerido',
  TOURIST_EMAIL_REQUIRED: 'El email es requerido'
};

// Prefijos y formatos
export const RESERVATION_FORMATS = {
  ID_PREFIX: 'DRAFT-',
  CODE_PREFIX: 'FT',
  CODE_LENGTH: 6
};

// Tiempos de simulación (ms)
export const SIMULATION_DELAYS = {
  SUBMIT_RESERVATION: 2000,
  RESET_FORM: 3000
};

// Configuración de turistas
export const TOURIST_CONFIG = {
  MIN_COUNT: 1,
  DEFAULT_COUNT: 1,
  MAX_COUNT: 50
};

// Configuración de duración
export const DURATION_CONFIG = {
  MIN_HOURS: 1,
  DEFAULT_HOURS: 1,
  MAX_HOURS: 24,
  MIN_DAYS: 2,
  DEFAULT_DAYS: 2,
  MAX_DAYS: 30
};