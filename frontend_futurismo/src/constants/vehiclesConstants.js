/**
 * COMPATIBILITY LAYER - Vehicles
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useVehiclesConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getVehiclesConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.vehicles || {};
};


export const VEHICLE_TYPES = (() => {
  const config = getVehiclesConfig();
  return config.vehicleTypes || [];
})();

export const VEHICLE_STATUS = (() => {
  const config = getVehiclesConfig();
  return config.vehicleStatus || [];
})();

export const FUEL_TYPES = (() => {
  const config = getVehiclesConfig();
  return config.fuelTypes || [];
})();

export const CAPACITY_RANGES = (() => {
  const config = getVehiclesConfig();
  return config.capacityRanges || [];
})();

export const MAINTENANCE_TYPES = (() => {
  const config = getVehiclesConfig();
  return config.maintenanceTypes || [];
})();


// Export default para compatibilidad
export default {
  VEHICLE_TYPES,
  VEHICLE_STATUS,
  FUEL_TYPES,
  CAPACITY_RANGES,
  MAINTENANCE_TYPES
};
