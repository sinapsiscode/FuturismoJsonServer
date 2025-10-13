/**
 * COMPATIBILITY LAYER - Clients
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useClientsConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getClientsConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.clients || {};
};


export const CLIENT_TYPES = (() => {
  const config = getClientsConfig();
  return config.clientTypes || [];
})();

export const CLIENT_STATUS = (() => {
  const config = getClientsConfig();
  return config.clientStatus || [];
})();

export const NATIONALITY_OPTIONS = (() => {
  const config = getClientsConfig();
  return config.nationalities || [];
})();

export const IDENTIFICATION_TYPES = (() => {
  const config = getClientsConfig();
  return config.identificationTypes || [];
})();

// Client type labels for display
export const CLIENT_TYPE_LABELS = {
  agency: 'Agencia',
  company: 'Empresa',
  individual: 'Individual'
};

// Client status labels for display
export const CLIENT_STATUS_LABELS = {
  active: 'Activo',
  inactive: 'Inactivo',
  suspended: 'Suspendido',
  pending: 'Pendiente'
};

// Client status colors for UI
export const CLIENT_STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

// Document types
export const DOCUMENT_TYPES = {
  RUC: 'ruc',
  DNI: 'dni',
  CE: 'ce',
  PASSPORT: 'passport'
};

// Document type labels for display
export const DOCUMENT_TYPE_LABELS = {
  ruc: 'RUC',
  dni: 'DNI',
  ce: 'Carnet de Extranjería',
  passport: 'Pasaporte'
};

// Client validation rules
export const CLIENT_VALIDATIONS = {
  NAME_MIN_LENGTH: 3,
  RUC_LENGTH: 11,
  DNI_LENGTH: 8,
  PHONE_LENGTH: 9,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Client messages for toast notifications
export const CLIENT_MESSAGES = {
  FETCH_ERROR: 'Error al cargar clientes',
  CREATE_SUCCESS: 'Cliente creado exitosamente',
  CREATE_ERROR: 'Error al crear cliente',
  UPDATE_SUCCESS: 'Cliente actualizado exitosamente',
  UPDATE_ERROR: 'Error al actualizar cliente',
  DELETE_SUCCESS: 'Cliente eliminado exitosamente',
  DELETE_ERROR: 'Error al eliminar cliente',
  NOT_FOUND: 'Cliente no encontrado',
  DUPLICATE_DOCUMENT: 'Este documento ya está registrado'
};


// Export default para compatibilidad
export default {
  CLIENT_TYPES,
  CLIENT_STATUS,
  NATIONALITY_OPTIONS,
  IDENTIFICATION_TYPES,
  CLIENT_TYPE_LABELS,
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_COLORS,
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  CLIENT_VALIDATIONS,
  CLIENT_MESSAGES
};
