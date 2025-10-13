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

// Priority levels
export const PRIORITY_LEVELS = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
  default: 'Normal'
};

// Priority colors for UI
export const PRIORITY_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300',
  default: 'bg-gray-100 text-gray-800 border-gray-300'
};

// Contact types
export const CONTACT_TYPES = {
  police: 'Policía',
  medical: 'Médico',
  fire: 'Bomberos',
  embassy: 'Embajada',
  internal: 'Interno',
  emergency: 'Emergencia',
  support: 'Soporte',
  default: 'General'
};

// Emergency icons mapping
export const EMERGENCY_ICONS = {
  medical: '🏥',
  accident: '🚑',
  natural_disaster: '⚠️',
  security: '🚨',
  lost_tourist: '🔍',
  theft: '👮',
  default: '⚡'
};

// Emergency messages for toast notifications
export const EMERGENCY_MESSAGES = {
  FETCH_ERROR: 'Error al cargar protocolos de emergencia',
  CREATE_SUCCESS: 'Protocolo creado exitosamente',
  CREATE_ERROR: 'Error al crear protocolo',
  UPDATE_SUCCESS: 'Protocolo actualizado exitosamente',
  UPDATE_ERROR: 'Error al actualizar protocolo',
  DELETE_SUCCESS: 'Protocolo eliminado exitosamente',
  DELETE_ERROR: 'Error al eliminar protocolo',
  INCIDENT_REPORTED: 'Incidente reportado exitosamente',
  INCIDENT_ERROR: 'Error al reportar incidente'
};


// Export default para compatibilidad
export default {
  EMERGENCY_TYPES,
  SEVERITY_LEVELS,
  PROTOCOL_CATEGORIES,
  EMERGENCY_CONTACTS,
  RESPONSE_STATUS,
  PRIORITY_LEVELS,
  PRIORITY_COLORS,
  CONTACT_TYPES,
  EMERGENCY_ICONS,
  EMERGENCY_MESSAGES
};
