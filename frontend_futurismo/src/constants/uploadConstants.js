/**
 * COMPATIBILITY LAYER - Upload
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useUploadConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getUploadConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.upload || {};
};


export const ALLOWED_FILE_TYPES = (() => {
  const config = getUploadConfig();
  return config.allowedFileTypes || {};
})();

export const MAX_FILE_SIZE = (() => {
  const config = getUploadConfig();
  return config.maxFileSize || 5242880;
})();

export const MAX_TOTAL_SIZE = (() => {
  const config = getUploadConfig();
  return config.maxTotalSize || 52428800;
})();

export const UPLOAD_CATEGORIES = (() => {
  const config = getUploadConfig();
  return config.uploadCategories || [];
})();

export const IMAGE_CONSTRAINTS = (() => {
  const config = getUploadConfig();
  return config.imageConstraints || {};
})();

// Additional constants for useImageUpload hook
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

export const FILE_SIZE_LIMITS = {
  IMAGE: 5242880, // 5MB in bytes
  DOCUMENT: 10485760, // 10MB
  VIDEO: 52428800 // 50MB
};

export const UPLOAD_CONFIG = {
  UPLOAD_DELAY: 500, // milliseconds
  MAX_FILES: 10,
  CHUNK_SIZE: 1048576 // 1MB chunks for large files
};

export const UPLOAD_ERROR_KEYS = {
  INVALID_FORMAT: 'upload.errors.invalidFormat',
  FILE_TOO_LARGE: 'upload.errors.fileTooLarge',
  UPLOAD_ERROR: 'upload.errors.uploadError',
  TOO_MANY_FILES: 'upload.errors.tooManyFiles',
  NETWORK_ERROR: 'upload.errors.networkError'
};

// Export default para compatibilidad
export default {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  UPLOAD_CATEGORIES,
  IMAGE_CONSTRAINTS,
  ACCEPTED_IMAGE_TYPES,
  FILE_SIZE_LIMITS,
  UPLOAD_CONFIG,
  UPLOAD_ERROR_KEYS
};
