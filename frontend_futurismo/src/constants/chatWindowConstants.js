/**
 * Constantes para ventana de chat
 */

// Tipos de mensaje
export const MESSAGE_TYPES = {
  TEXT: 'text',
  SYSTEM: 'system',
  LOCATION: 'location',
  DOCUMENT: 'document',
  IMAGE: 'image',
  VOICE: 'voice'
};

// Estados de mensaje
export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  ERROR: 'error'
};

// IDs especiales
export const SENDER_IDS = {
  SYSTEM: 'system',
  CURRENT_USER: 'current-user'
};

// Tiempos de simulación (ms)
export const SIMULATION_DELAYS = {
  STATUS_TO_DELIVERED: 1000,
  STATUS_TO_READ: 2000,
  TYPING_INDICATOR: 3000
};

// Emojis disponibles
export const AVAILABLE_EMOJIS = ['😊', '👍', '❤️', '😂', '🎉', '👏', '🙏', '😍', '🤔', '👋'];

// Mensajes del sistema (keys para i18n)
export const SYSTEM_MESSAGE_KEYS = {
  COORDINATION_STARTED: 'chat.system.coordinationStarted',
  USER_JOINED: 'chat.system.userJoined',
  USER_LEFT: 'chat.system.userLeft'
};

// Mensajes predefinidos (keys para i18n)
export const DEFAULT_MESSAGE_KEYS = {
  HOW_IS_EVERYONE: 'chat.messages.howIsEveryone',
  READY_FOR_TOUR: 'chat.messages.readyForTour',
  MEETING_POINT: 'chat.messages.meetingPoint',
  UNDERSTOOD: 'chat.messages.understood',
  SHARE_ITINERARY: 'chat.messages.shareItinerary',
  LEAVING_HOTEL: 'chat.messages.leavingHotel'
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/*', 'application/pdf', '.doc', '.docx'],
  DOCUMENT_EXTENSIONS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
};

// Roles con permisos especiales
export const CALL_PERMISSION_ROLES = ['agency', 'admin'];

// Tiempos de mensaje mock (ms)
export const MOCK_MESSAGE_TIMES = {
  ONE_HOUR_AGO: 3600000,
  FIFTY_MINUTES_AGO: 3000000,
  FORTY_MINUTES_AGO: 2400000,
  THIRTY_NINE_MINUTES_AGO: 2340000,
  THIRTY_MINUTES_AGO: 1800000,
  TEN_MINUTES_AGO: 600000,
  NINE_MINUTES_AGO: 540000,
  FIVE_MINUTES_AGO: 300000
};