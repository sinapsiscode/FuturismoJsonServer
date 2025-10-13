/**
 * COMPATIBILITY LAYER - Guides
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useGuidesConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getGuidesConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.guides || {};
};


export const FORM_TABS = [
  { id: 'personal', label: 'Información Personal' },
  { id: 'languages', label: 'Idiomas' },
  { id: 'museums', label: 'Museos' }
];

export const LEVEL_OPTIONS = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
  { value: 'native', label: 'Nativo' }
];

export const GUIDE_TYPES = {
  PLANT: 'plant',
  FREELANCE: 'freelance'
};

export const GUIDE_STATUS = (() => {
  const config = getGuidesConfig();
  return config.guideStatus || [];
})();

// Available languages for guides
export const AVAILABLE_LANGUAGES = [
  { code: 'es', name: 'Español', nativeName: 'Español' },
  { code: 'en', name: 'Inglés', nativeName: 'English' },
  { code: 'fr', name: 'Francés', nativeName: 'Français' },
  { code: 'de', name: 'Alemán', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portugués', nativeName: 'Português' },
  { code: 'ja', name: 'Japonés', nativeName: '日本語' },
  { code: 'zh', name: 'Chino', nativeName: '中文' },
  { code: 'ko', name: 'Coreano', nativeName: '한국어' }
];

// Language proficiency levels
export const LANGUAGE_LEVELS = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
  { value: 'native', label: 'Nativo' }
];

// Level colors for UI badges
export const LEVEL_COLORS = {
  principiante: 'bg-blue-100 text-blue-800',
  basic: 'bg-blue-100 text-blue-800',
  basico: 'bg-blue-100 text-blue-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  intermedio: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-green-100 text-green-800',
  avanzado: 'bg-green-100 text-green-800',
  native: 'bg-purple-100 text-purple-800',
  nativo: 'bg-purple-100 text-purple-800',
  expert: 'bg-red-100 text-red-800',
  experto: 'bg-red-100 text-red-800'
};

// Expertise levels
export const EXPERTISE_LEVELS = [
  { value: 'junior', label: 'Junior (0-2 años)' },
  { value: 'intermediate', label: 'Intermedio (3-5 años)' },
  { value: 'senior', label: 'Senior (6-10 años)' },
  { value: 'expert', label: 'Experto (10+ años)' }
];

// Guide status values
export const GUIDE_STATUS_VALUES = [
  { value: 'active', label: 'Activo', color: 'green' },
  { value: 'inactive', label: 'Inactivo', color: 'gray' },
  { value: 'suspended', label: 'Suspendido', color: 'red' },
  { value: 'onVacation', label: 'De vacaciones', color: 'blue' }
];

// Availability status
export const AVAILABILITY_STATUS = [
  { value: 'available', label: 'Disponible', color: 'green' },
  { value: 'busy', label: 'Ocupado', color: 'yellow' },
  { value: 'unavailable', label: 'No disponible', color: 'red' }
];

// Common museums and tourist sites
export const COMMON_MUSEUMS = [
  { id: 'machu-picchu', name: 'Machu Picchu' },
  { id: 'museo-larco', name: 'Museo Larco' },
  { id: 'museo-oro', name: 'Museo de Oro' },
  { id: 'museo-nacion', name: 'Museo de la Nación' },
  { id: 'huaca-pucllana', name: 'Huaca Pucllana' },
  { id: 'centro-historico-lima', name: 'Centro Histórico de Lima' },
  { id: 'circuito-magico-agua', name: 'Circuito Mágico del Agua' },
  { id: 'sacsayhuaman', name: 'Sacsayhuamán' },
  { id: 'qorikancha', name: 'Qorikancha' },
  { id: 'valle-sagrado', name: 'Valle Sagrado' }
];

// Validation regex patterns
export const DNI_REGEX = /^\d{8}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^9\d{8}$/;

// Guide messages for toast notifications
export const GUIDE_MESSAGES = {
  FETCH_ERROR: 'Error al cargar guías',
  CREATE_SUCCESS: 'Guía creado exitosamente',
  CREATE_ERROR: 'Error al crear guía',
  UPDATE_SUCCESS: 'Guía actualizado exitosamente',
  UPDATE_ERROR: 'Error al actualizar guía',
  DELETE_SUCCESS: 'Guía eliminado exitosamente',
  DELETE_ERROR: 'Error al eliminar guía',
  ASSIGN_SUCCESS: 'Guía asignado exitosamente',
  ASSIGN_ERROR: 'Error al asignar guía',
  AVAILABILITY_ERROR: 'Error al verificar disponibilidad',
  NOT_FOUND: 'Guía no encontrado'
};

// Export default para compatibilidad
export default {
  FORM_TABS,
  LEVEL_OPTIONS,
  GUIDE_TYPES,
  GUIDE_STATUS,
  AVAILABLE_LANGUAGES,
  LANGUAGE_LEVELS,
  LEVEL_COLORS,
  EXPERTISE_LEVELS,
  GUIDE_STATUS_VALUES,
  AVAILABILITY_STATUS,
  COMMON_MUSEUMS,
  DNI_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  GUIDE_MESSAGES
};
