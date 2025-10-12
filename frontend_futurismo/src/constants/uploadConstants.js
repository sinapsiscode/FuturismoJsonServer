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


// Export default para compatibilidad
export default {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  UPLOAD_CATEGORIES,
  IMAGE_CONSTRAINTS
};
