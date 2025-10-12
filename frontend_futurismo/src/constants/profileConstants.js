/**
 * COMPATIBILITY LAYER - Profile
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useProfileConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getProfileConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.profile || {};
};


export const PAYMENT_METHOD_TYPES = (() => {
  const config = getProfileConfig();
  return config.paymentMethodTypes || [];
})();

export const ACCOUNT_TYPES = (() => {
  const config = getProfileConfig();
  return config.accountTypes || [];
})();

export const CARD_TYPES = (() => {
  const config = getProfileConfig();
  return config.cardTypes || [];
})();

export const DOCUMENT_TYPES = (() => {
  const config = getProfileConfig();
  return config.documentTypes || [];
})();

export const DOCUMENT_STATUS = (() => {
  const config = getProfileConfig();
  return config.documentStatus || [];
})();

export const MAX_FILE_SIZE = (() => {
  const config = getProfileConfig();
  return config.maxFileSize || 5242880;
})();

export const ACCEPTED_FILE_TYPES = (() => {
  const config = getProfileConfig();
  return config.acceptedFileTypes || {};
})();

export const RATING_LEVELS = (() => {
  const config = getProfileConfig();
  return config.ratingLevels || [];
})();

export const CONTACT_TYPES = (() => {
  const config = getProfileConfig();
  return config.contactTypes || [];
})();


// Export default para compatibilidad
export default {
  PAYMENT_METHOD_TYPES,
  ACCOUNT_TYPES,
  CARD_TYPES,
  DOCUMENT_TYPES,
  DOCUMENT_STATUS,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
  RATING_LEVELS,
  CONTACT_TYPES
};
