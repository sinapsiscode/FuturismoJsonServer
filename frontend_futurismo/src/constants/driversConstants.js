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

// License categories (Peru driver's license categories)
export const LICENSE_CATEGORIES = {
  A_I: 'A-I',
  A_IIA: 'A-IIA',
  A_IIB: 'A-IIB',
  A_IIIA: 'A-IIIA',
  A_IIIB: 'A-IIIB',
  A_IIIC: 'A-IIIC',
  B_I: 'B-I',
  B_IIA: 'B-IIA',
  B_IIB: 'B-IIB',
  B_IIC: 'B-IIC'
};

// License category labels for display
export const LICENSE_CATEGORY_LABELS = {
  'A-I': 'A-I (Motocicletas)',
  'A-IIA': 'A-IIA (Vehículos ligeros)',
  'A-IIB': 'A-IIB (Taxis y remises)',
  'A-IIIA': 'A-IIIA (Transporte pesado)',
  'A-IIIB': 'A-IIIB (Buses)',
  'A-IIIC': 'A-IIIC (Transporte especial)',
  'B-I': 'B-I (Particular motocicleta)',
  'B-IIA': 'B-IIA (Particular automóvil)',
  'B-IIB': 'B-IIB (Particular pesado)',
  'B-IIC': 'B-IIC (Particular especial)'
};

// Driver validation rules
export const DRIVER_VALIDATIONS = {
  DNI_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  PHONE_LENGTH: 9,
  LICENSE_MIN_LENGTH: 5
};

// Driver messages for toast notifications
export const DRIVER_MESSAGES = {
  FETCH_ERROR: 'Error al cargar choferes',
  CREATE_SUCCESS: 'Chofer creado exitosamente',
  CREATE_ERROR: 'Error al crear chofer',
  UPDATE_SUCCESS: 'Chofer actualizado exitosamente',
  UPDATE_ERROR: 'Error al actualizar chofer',
  DELETE_SUCCESS: 'Chofer eliminado exitosamente',
  DELETE_ERROR: 'Error al eliminar chofer',
  ASSIGN_SUCCESS: 'Chofer asignado exitosamente',
  ASSIGN_ERROR: 'Error al asignar chofer',
  AVAILABILITY_ERROR: 'Error al verificar disponibilidad',
  NOT_FOUND: 'Chofer no encontrado'
};

// Export default para compatibilidad
export default {
  DRIVER_STATUS,
  LICENSE_TYPES,
  EMPLOYMENT_TYPES,
  VEHICLE_CATEGORIES,
  LICENSE_CATEGORIES,
  LICENSE_CATEGORY_LABELS,
  DRIVER_VALIDATIONS,
  DRIVER_MESSAGES
};
