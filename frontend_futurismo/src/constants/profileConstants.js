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


// Payment method types (as objects for component usage)
export const PAYMENT_METHOD_TYPES = {
  BANK_ACCOUNT: 'bank_account',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  WALLET: 'wallet'
};

// Account types (as objects for component usage)
export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CTS: 'cts'
};

// Card types (as objects for component usage)
export const CARD_TYPES = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMEX: 'amex',
  DINERS: 'diners'
};

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

// Currencies
export const CURRENCIES = {
  PEN: 'PEN',
  USD: 'USD',
  EUR: 'EUR'
};

// Profile validation rules
export const PROFILE_VALIDATIONS = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^9\d{8}$/,
  DNI_LENGTH: 8,
  RUC_LENGTH: 11,
  PASSWORD_MIN_LENGTH: 8,
  BIO_MAX_LENGTH: 500
};

// Profile messages
export const PROFILE_MESSAGES = {
  UPDATE_SUCCESS: 'Perfil actualizado exitosamente',
  UPDATE_ERROR: 'Error al actualizar perfil',
  PHOTO_UPLOAD_SUCCESS: 'Foto actualizada exitosamente',
  PHOTO_UPLOAD_ERROR: 'Error al subir foto',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
  PASSWORD_ERROR: 'Error al cambiar contraseña',
  DOCUMENT_UPLOADED: 'Documento subido exitosamente',
  DOCUMENT_ERROR: 'Error al subir documento',
  PAYMENT_METHOD_ADDED: 'Método de pago agregado',
  PAYMENT_METHOD_REMOVED: 'Método de pago eliminado',
  PAYMENT_METHOD_ERROR: 'Error al gestionar método de pago'
};


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
  CONTACT_TYPES,
  CURRENCIES,
  PROFILE_VALIDATIONS,
  PROFILE_MESSAGES
};
