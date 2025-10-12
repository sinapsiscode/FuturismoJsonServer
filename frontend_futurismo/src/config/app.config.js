/**
 * Configuración central de la aplicación
 * Centraliza todas las configuraciones y evita hardcodeo
 */

// Helper para obtener variables de entorno con valores por defecto
const getEnvVar = (key, defaultValue) => {
  return import.meta.env[key] || defaultValue;
};

// Helper para parsear booleanos desde env
const getEnvBoolean = (key, defaultValue = false) => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === true;
};

// Helper para parsear números desde env
const getEnvNumber = (key, defaultValue) => {
  const value = import.meta.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

export const APP_CONFIG = {
  // Información de la aplicación
  app: {
    name: 'Futurismo',
    version: '25.07.0001',
    environment: getEnvVar('VITE_APP_ENV', 'development'),
    isDevelopment: getEnvVar('VITE_APP_ENV', 'development') === 'development',
    isProduction: getEnvVar('VITE_APP_ENV', 'development') === 'production'
  },

  // Configuración de API
  api: {
    baseUrl: getEnvVar('VITE_API_URL', import.meta.env.DEV ? '/api' : 'http://localhost:4050/api'),
    timeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Configuración de WebSocket
  websocket: {
    url: getEnvVar('VITE_WS_URL', 'http://localhost:3000'),
    enabled: getEnvBoolean('VITE_ENABLE_WEBSOCKET', false),
    reconnectDelay: getEnvNumber('VITE_WS_RECONNECT_DELAY', 5000),
    maxReconnectAttempts: 10
  },

  // Feature flags
  features: {
    mockData: false, // MIGRACIÓN: Deshabilitado - usar API real
    debugMode: getEnvBoolean('VITE_ENABLE_DEBUG_MODE', true), // Habilitado para debugging
    analytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', false),
    maintenance: getEnvBoolean('VITE_MAINTENANCE_MODE', false)
  },

  // Seguridad
  security: {
    tokenExpiryHours: getEnvNumber('VITE_TOKEN_EXPIRY_HOURS', 24),
    maxLoginAttempts: getEnvNumber('VITE_MAX_LOGIN_ATTEMPTS', 5),
    sessionTimeout: getEnvNumber('VITE_SESSION_TIMEOUT', 1800000), // 30 minutos
    passwordMinLength: 8,
    requireStrongPassword: true
  },

  // Storage
  storage: {
    prefix: getEnvVar('VITE_STORAGE_PREFIX', 'futurismo_'),
    keys: {
      authToken: 'auth_token',
      authUser: 'auth_user',
      language: 'language',
      theme: 'theme',
      preferences: 'preferences'
    }
  },

  // Servicios externos
  external: {
    avatarServiceUrl: getEnvVar('VITE_AVATAR_SERVICE_URL', 'https://ui-avatars.com/api/'),
    mapTileUrl: getEnvVar('VITE_MAP_TILE_URL', 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    googleMapsApiKey: getEnvVar('VITE_GOOGLE_MAPS_API_KEY', '')
  },

  // Límites de la aplicación
  limits: {
    maxFileSize: getEnvNumber('VITE_MAX_FILE_SIZE_MB', 10) * 1024 * 1024, // Convertir a bytes
    allowedFileTypes: getEnvVar('VITE_ALLOWED_FILE_TYPES', 'jpg,jpeg,png,pdf,doc,docx').split(','),
    maxUploadFiles: 10,
    maxImageDimensions: { width: 4096, height: 4096 }
  },

  // Paginación
  pagination: {
    defaultPageSize: getEnvNumber('VITE_DEFAULT_PAGE_SIZE', 20),
    maxPageSize: getEnvNumber('VITE_MAX_PAGE_SIZE', 100),
    pageSizeOptions: [10, 20, 50, 100]
  },

  // Internacionalización
  i18n: {
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'en'],
    fallbackLanguage: 'es'
  },

  // Tema
  theme: {
    defaultTheme: 'light',
    availableThemes: ['light', 'dark']
  },

  // Timeouts y delays
  ui: {
    debounceDelay: 300,
    toastDuration: 4000,
    modalAnimationDuration: 200,
    notificationDuration: 5000
  },

  // Validaciones
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
    dni: /^[0-9]{8}[A-Z]$/,
    postalCode: /^[0-9]{5}$/
  }
};

// Función helper para obtener la clave completa de storage
export const getStorageKey = (key) => {
  return `${APP_CONFIG.storage.prefix}${APP_CONFIG.storage.keys[key] || key}`;
};

// Función para validar la configuración
export const validateConfig = () => {
  const errors = [];
  
  if (!APP_CONFIG.api.baseUrl) {
    errors.push('API base URL is required');
  }
  
  if (APP_CONFIG.security.passwordMinLength < 6) {
    errors.push('Password minimum length must be at least 6');
  }
  
  if (errors.length > 0) {
    console.error('Configuration errors:', errors);
    return false;
  }
  
  return true;
};

// Log de configuración en desarrollo
if (APP_CONFIG.app.isDevelopment && APP_CONFIG.features.debugMode) {
  console.log('App Configuration:', APP_CONFIG);
}

export default APP_CONFIG;