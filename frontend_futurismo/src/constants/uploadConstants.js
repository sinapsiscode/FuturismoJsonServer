/**
 * Constantes para funcionalidades de carga de archivos
 */

// Tipos de archivo aceptados
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Tamaños máximos de archivo
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  VIDEO: 50 * 1024 * 1024, // 50MB
  AVATAR: 2 * 1024 * 1024 // 2MB
};

// Configuración de upload
export const UPLOAD_CONFIG = {
  UPLOAD_DELAY: 1000, // Simulación de delay de carga
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks para uploads grandes
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};

// Estados de upload
export const UPLOAD_STATES = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
  CANCELLED: 'cancelled'
};

// Formatos de imagen para preview
export const IMAGE_PREVIEW_CONFIG = {
  MAX_WIDTH: 800,
  MAX_HEIGHT: 600,
  QUALITY: 0.8,
  FORMAT: 'image/jpeg'
};

// Mensajes de error (keys para i18n)
export const UPLOAD_ERROR_KEYS = {
  INVALID_FORMAT: 'upload.invalidFormat',
  FILE_TOO_LARGE: 'upload.fileTooLarge',
  UPLOAD_ERROR: 'upload.uploadError',
  NETWORK_ERROR: 'upload.networkError',
  TIMEOUT_ERROR: 'upload.timeoutError'
};

// Estilos de drag & drop
export const DRAG_STYLES = {
  ACTIVE: 'border-blue-500 bg-blue-50',
  INACTIVE: 'border-gray-300',
  ERROR: 'border-red-500 bg-red-50'
};

// Configuración de thumbnails
export const THUMBNAIL_CONFIG = {
  WIDTH: 150,
  HEIGHT: 150,
  QUALITY: 0.7
};