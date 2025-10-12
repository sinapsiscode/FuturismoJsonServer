/**
 * COMPATIBILITY LAYER - Feedback
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useFeedbackConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getFeedbackConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.feedback || {};
};


export const SERVICE_AREAS = (() => {
  const config = getFeedbackConfig();
  return config.serviceAreas || [];
})();

export const STATUS_TYPES = (() => {
  const config = getFeedbackConfig();
  return config.statusTypes || [];
})();

export const FEEDBACK_TYPES = (() => {
  const config = getFeedbackConfig();
  return config.feedbackTypes || [];
})();

export const PRIORITY_LEVELS = (() => {
  const config = getFeedbackConfig();
  return config.priorityLevels || [];
})();

export const FEEDBACK_CATEGORIES = (() => {
  const config = getFeedbackConfig();
  return config.feedbackCategories || [];
})();


// Export default para compatibilidad
export default {
  SERVICE_AREAS,
  STATUS_TYPES,
  FEEDBACK_TYPES,
  PRIORITY_LEVELS,
  FEEDBACK_CATEGORIES
};
