/**
 * COMPATIBILITY LAYER - Emergency
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useEmergencyConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getEmergencyConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.emergency || {};
};


export const EMERGENCY_TYPES = (() => {
  const config = getEmergencyConfig();
  return config.emergencyTypes || [];
})();

export const SEVERITY_LEVELS = (() => {
  const config = getEmergencyConfig();
  return config.severityLevels || [];
})();

export const PROTOCOL_CATEGORIES = (() => {
  const config = getEmergencyConfig();
  return config.protocolCategories || [];
})();

export const EMERGENCY_CONTACTS = (() => {
  const config = getEmergencyConfig();
  return config.emergencyContacts || [];
})();

export const RESPONSE_STATUS = (() => {
  const config = getEmergencyConfig();
  return config.responseStatus || [];
})();


// Export default para compatibilidad
export default {
  EMERGENCY_TYPES,
  SEVERITY_LEVELS,
  PROTOCOL_CATEGORIES,
  EMERGENCY_CONTACTS,
  RESPONSE_STATUS
};
