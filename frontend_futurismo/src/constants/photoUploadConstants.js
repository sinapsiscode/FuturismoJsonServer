/**
 * Constantes para carga de fotos
 */

// Configuración de fotos
export const PHOTO_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  DEFAULT_MAX_PHOTOS: 5,
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

// Estados de carga
export const UPLOAD_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  ERROR: 'error'
};

// Límites de validación
export const PHOTO_VALIDATION = {
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,
  MAX_WIDTH: 4096,
  MAX_HEIGHT: 4096,
  MIN_SIZE: 1024, // 1KB
  MAX_NAME_LENGTH: 255
};

// Configuración de preview
export const PREVIEW_CONFIG = {
  THUMBNAIL_WIDTH: 150,
  THUMBNAIL_HEIGHT: 150,
  QUALITY: 0.8
};

// Mensajes de error (keys para i18n)
export const PHOTO_ERROR_KEYS = {
  INVALID_TYPE: 'upload.photos.invalidType',
  TOO_LARGE: 'upload.photos.tooLarge',
  MAX_EXCEEDED: 'upload.photos.maxExceeded',
  UPLOAD_ERROR: 'upload.photos.error',
  INVALID_DIMENSIONS: 'upload.photos.invalidDimensions'
};

// Mensajes de éxito (keys para i18n)
export const PHOTO_SUCCESS_KEYS = {
  UPLOAD_SUCCESS: 'upload.photos.success',
  REMOVED: 'upload.photos.removed'
};