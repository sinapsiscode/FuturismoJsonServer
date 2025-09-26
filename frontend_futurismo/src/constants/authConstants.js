/**
 * Constantes para el store de autenticación
 */

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENCY: 'agency',
  GUIDE: 'guide'
};

// Tipos de guía
export const GUIDE_TYPES = {
  PLANTA: 'planta',
  FREELANCE: 'freelance'
};

// Estados de usuario
export const USER_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

// Estados de autenticación
export const AUTH_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};

// Eventos de autenticación
export const AUTH_EVENTS = {
  LOGIN_SUCCESS: 'auth:login:success',
  LOGIN_FAILURE: 'auth:login:failure',
  LOGOUT: 'auth:logout',
  SESSION_EXPIRED: 'auth:session:expired',
  TOKEN_REFRESHED: 'auth:token:refreshed'
};

// Mensajes de error
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  EMAIL_EXISTS: 'Este email ya está registrado',
  UPDATE_PROFILE_ERROR: 'Error al actualizar perfil',
  SESSION_RECOVERY_ERROR: 'Error al recuperar sesión guardada:',
  SESSION_INIT_ERROR: 'Error al inicializar sesión:'
};

// Tipos de autenticación soportados
export const AUTH_TYPES = {
  LOCAL: 'local',
  OAUTH: 'oauth',
  SSO: 'sso'
};

// Configuración de sesión
export const SESSION_CONFIG = {
  CHECK_INTERVAL: 60000, // 1 minuto
  WARNING_BEFORE_EXPIRY: 300000, // 5 minutos antes de expirar
  ACTIVITY_EVENTS: ['mousedown', 'keydown', 'scroll', 'touchstart']
};

// Estado inicial
export const INITIAL_STATE = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  rememberMe: false
};