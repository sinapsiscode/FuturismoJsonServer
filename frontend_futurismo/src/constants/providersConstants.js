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
  return config.providerCategories || [];
})();

export const PRICING_TYPES = (() => {
  const config = getProvidersConfig();
  return config.pricingTypes || [];
})();

export const CURRENCIES = (() => {
  const config = getProvidersConfig();
  return config.currencies || [];
})();

export const SERVICE_TYPES = (() => {
  const config = getProvidersConfig();
  return config.serviceTypes || {};
})();

export const RATING_RANGE = (() => {
  const config = getProvidersConfig();
  return config.ratingRange || { min: 1, max: 5 };
})();


// Export default para compatibilidad
export default {
  PROVIDER_CATEGORIES,
  PRICING_TYPES,
  CURRENCIES,
  SERVICE_TYPES,
  RATING_RANGE
};
