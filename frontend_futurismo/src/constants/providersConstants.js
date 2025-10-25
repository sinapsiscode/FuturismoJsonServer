/**
 * COMPATIBILITY LAYER - Providers
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useProvidersConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getProvidersConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.providers || {};
};


export const PROVIDER_CATEGORIES = (() => {
  const config = getProvidersConfig();
  return config.providerCategories || {
    RESTAURANT: 'restaurant',
    HOTEL: 'hotel',
    TRANSPORT: 'transport',
    GUIDE: 'guide',
    ACTIVITY: 'activity',
    ATTRACTION: 'attraction'
  };
})();

export const PRICING_TYPES = (() => {
  const config = getProvidersConfig();
  return config.pricingTypes || {
    PER_PERSON: 'per_person',
    PER_GROUP: 'per_group',
    FIXED: 'fixed',
    HOURLY: 'hourly'
  };
})();

export const CURRENCIES = (() => {
  const config = getProvidersConfig();
  return config.currencies || {
    USD: 'USD',
    PEN: 'PEN',
    EUR: 'EUR'
  };
})();

export const SERVICE_TYPES = (() => {
  const config = getProvidersConfig();
  return config.serviceTypes || {};
})();

export const RATING_RANGE = (() => {
  const config = getProvidersConfig();
  return config.ratingRange || {
    MIN: 1,
    MAX: 5
  };
})();

// Validation messages (i18n keys)
export const VALIDATION_MESSAGES = (() => {
  const config = getProvidersConfig();
  return config.validationMessages || {
    REQUIRED: 'validation.required',
    INVALID_EMAIL: 'validation.invalidEmail',
    POSITIVE_NUMBER: 'validation.positiveNumber',
    MIN_VALUE: 'validation.minValue',
    MAX_VALUE: 'validation.maxValue'
  };
})();

// Provider messages for toast notifications
export const PROVIDER_MESSAGES = (() => {
  const config = getProvidersConfig();
  return config.providerMessages || {
    FETCH_ERROR: 'Error al cargar proveedores',
    CREATE_SUCCESS: 'Proveedor creado exitosamente',
    CREATE_ERROR: 'Error al crear proveedor',
    UPDATE_SUCCESS: 'Proveedor actualizado exitosamente',
    UPDATE_ERROR: 'Error al actualizar proveedor',
    DELETE_SUCCESS: 'Proveedor eliminado exitosamente',
    DELETE_ERROR: 'Error al eliminar proveedor',
    NOT_FOUND: 'Proveedor no encontrado'
  };
})();


// Export default para compatibilidad
export default {
  PROVIDER_CATEGORIES,
  PRICING_TYPES,
  CURRENCIES,
  SERVICE_TYPES,
  RATING_RANGE,
  VALIDATION_MESSAGES,
  PROVIDER_MESSAGES
};
