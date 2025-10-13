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

// Vehicle document types
export const VEHICLE_DOCUMENTS = {
  SOAT: 'soat',
  TECHNICAL_REVIEW: 'technicalReview',
  OWNERSHIP_CARD: 'ownershipCard',
  CIRCULATION_PERMIT: 'circulationPermit'
};

// Vehicle document labels
export const VEHICLE_DOCUMENT_LABELS = {
  soat: 'SOAT (Seguro Obligatorio de Accidentes de Tránsito)',
  technicalReview: 'Revisión Técnica',
  ownershipCard: 'Tarjeta de Propiedad',
  circulationPermit: 'Permiso de Circulación'
};

// Vehicle messages for toast notifications
export const VEHICLE_MESSAGES = {
  FETCH_ERROR: 'Error al cargar vehículos',
  CREATE_SUCCESS: 'Vehículo creado exitosamente',
  CREATE_ERROR: 'Error al crear vehículo',
  UPDATE_SUCCESS: 'Vehículo actualizado exitosamente',
  UPDATE_ERROR: 'Error al actualizar vehículo',
  DELETE_SUCCESS: 'Vehículo eliminado exitosamente',
  DELETE_ERROR: 'Error al eliminar vehículo',
  ASSIGN_SUCCESS: 'Vehículo asignado exitosamente',
  ASSIGN_ERROR: 'Error al asignar vehículo',
  AVAILABILITY_ERROR: 'Error al verificar disponibilidad',
  NOT_FOUND: 'Vehículo no encontrado',
  MAINTENANCE_SUCCESS: 'Mantenimiento registrado exitosamente',
  MAINTENANCE_ERROR: 'Error al registrar mantenimiento'
};

// Export default para compatibilidad
export default {
  VEHICLE_TYPES,
  VEHICLE_STATUS,
  FUEL_TYPES,
  CAPACITY_RANGES,
  MAINTENANCE_TYPES,
  VEHICLE_DOCUMENTS,
  VEHICLE_DOCUMENT_LABELS,
  VEHICLE_MESSAGES
};
