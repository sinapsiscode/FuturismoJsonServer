// Constantes de la aplicación

// Estados del servicio según el archivo leer.md
export const SERVICE_STATUS = {
  PENDING: 'pending',
  ON_WAY: 'on_way',
  IN_SERVICE: 'in_service',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
};

// Colores de estados para el mapa y badges
export const STATUS_COLORS = {
  [SERVICE_STATUS.PENDING]: '#6B7280', // gris
  [SERVICE_STATUS.ON_WAY]: '#F59E0B', // amarillo
  [SERVICE_STATUS.IN_SERVICE]: '#10B981', // verde
  [SERVICE_STATUS.FINISHED]: '#1E40AF', // azul
  [SERVICE_STATUS.CANCELLED]: '#EF4444' // rojo
};

// Tipos de servicio
export const SERVICE_TYPES = {
  TRANSFER: 'transfer',
  TOUR: 'tour',
  PACKAGE: 'package',
  CUSTOM: 'custom'
};

// Tipos de usuario
export const USER_ROLES = {
  AGENCY: 'agency',
  GUIDE: 'guide',
  ADMIN: 'admin'
};

// Estados de formulario
export const FORM_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Configuración de exportación
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv'
};

// Formatos de fecha por defecto (pueden ser sobrescritos por configuración dinámica)
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm'
};

// Configuración del mapa
export const MAP_CONFIG = {
  DEFAULT_CENTER: [-13.5319, -71.9675], // Cusco, Perú
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Configuración de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Configuración de chat
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  TYPING_INDICATOR_DELAY: 1000,
  MESSAGE_BATCH_SIZE: 20
};

// Regex para validaciones
export const REGEX_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^9\d{8}$/,  // Exactamente 9 dígitos empezando con 9
  PASSPORT: /^[A-Z0-9]{6,20}$/i,
  SERVICE_CODE: /^[A-Z]{2}[0-9]{6}$/
};

// Configuración que debe ser obtenida dinámicamente desde el contexto
// Estas funciones acceden a la configuración dinámica
export const getApiConfig = () => {
  // Esta función será reemplazada por el hook useConfig
  const isDevelopment = import.meta.env.MODE === 'development';

  // Validar que las variables de entorno estén presentes
  if (!import.meta.env.VITE_API_URL) {
    console.warn('⚠️ VITE_API_URL no está definida en .env');
  }
  if (!import.meta.env.VITE_WS_URL) {
    console.warn('⚠️ VITE_WS_URL no está definida en .env');
  }

  return {
    BASE_URL: import.meta.env.VITE_API_URL || (isDevelopment ? '/api' : undefined),
    WS_URL: import.meta.env.VITE_WS_URL
  };
};

export const getLimitsConfig = () => {
  // Esta función será reemplazada por el hook useConfig
  return {
    MIN_TOURISTS: 1,
    MAX_TOURISTS: 50,
    MIN_SERVICE_DURATION: 1, // horas
    MAX_SERVICE_DURATION: 24, // horas
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    DEBOUNCE_DELAY: 300 // ms para búsquedas
  };
};

export const getIntervalsConfig = () => {
  // Esta función será reemplazada por el hook useConfig
  return {
    MAP_UPDATE: 30000, // 30 segundos
    NOTIFICATION_CHECK: 60000, // 1 minuto
    DASHBOARD_REFRESH: 300000 // 5 minutos
  };
};

export const getContactConfig = () => {
  // Esta función será reemplazada por el hook useConfig
  // Los valores deben venir de la configuración del servidor
  console.warn('⚠️ getContactConfig() debería obtener datos del servidor, no usar valores hardcodeados');

  return {
    WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || "+51999888777",
    WHATSAPP_MESSAGE: "Hola, necesito consultar disponibilidad para un tour fullday después de las 5 PM",
    CUTOFF_HOUR: parseInt(import.meta.env.VITE_WHATSAPP_CUTOFF_HOUR, 10) || 17 // 5 PM
  };
};

export const getExternalServicesConfig = () => {
  // Esta función será reemplazada por el hook useConfig
  return {
    TILE_LAYER_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    AVATARS_SERVICE: 'https://ui-avatars.com/api/',
    GOOGLE_MAPS_API: ''
  };
};

// Mensajes de error (deberían moverse a archivos de traducción)
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  GENERIC_ERROR: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  FILE_TOO_LARGE: 'El archivo es demasiado grande. Máximo 5MB.'
};

// DEPRECATED: Estas constantes han sido movidas a configuración dinámica
// Se mantienen solo para compatibilidad, usar los hooks de configuración
export const UPDATE_INTERVALS = getIntervalsConfig();
export const LIMITS = getLimitsConfig();
export const FULLDAY_CONFIG = getContactConfig();
export const API_ENDPOINTS = getApiConfig();