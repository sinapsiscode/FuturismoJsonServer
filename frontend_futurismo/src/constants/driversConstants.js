/**
 * COMPATIBILITY LAYER - Drivers
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useDriversConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getDriversConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.drivers || {};
};


export const DRIVER_STATUS = (() => {
  const config = getDriversConfig();
  return config.driverStatus || [];
})();

export const LICENSE_TYPES = (() => {
  const config = getDriversConfig();
  return config.licenseTypes || [];
})();

export const EMPLOYMENT_TYPES = (() => {
  const config = getDriversConfig();
  return config.employmentTypes || [];
})();

export const VEHICLE_CATEGORIES = (() => {
  const config = getDriversConfig();
  return config.vehicleCategories || [];
})();


// Export default para compatibilidad
export default {
  DRIVER_STATUS,
  LICENSE_TYPES,
  EMPLOYMENT_TYPES,
  VEHICLE_CATEGORIES
};
