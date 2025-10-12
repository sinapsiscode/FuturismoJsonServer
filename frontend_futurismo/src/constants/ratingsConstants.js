/**
 * COMPATIBILITY LAYER - Ratings
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useRatingsConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getRatingsConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.ratings || {};
};


export const FEEDBACK_TYPES = [
  { value: 'positive', label: 'Positivo' },
  { value: 'negative', label: 'Negativo' },
  { value: 'suggestion', label: 'Sugerencia' }
];

export const RATING_STEPS = [
  { id: 1, title: 'Calificación General' },
  { id: 2, title: 'Detalles' },
  { id: 3, title: 'Comentarios' }
];

export const UI_DELAYS = {
  toast: 3000,
  transition: 300
};

export const TOURIST_RATING_VALUES = [1, 2, 3, 4, 5];

export const RATING_ASPECTS = (() => {
  const config = getRatingsConfig();
  return config.ratingAspects || [];
})();

export const EVALUATION_CRITERIA = (() => {
  const config = getRatingsConfig();
  return config.evaluationCriteria || [];
})();


// Export default para compatibilidad
export default {
  FEEDBACK_TYPES,
  RATING_STEPS,
  UI_DELAYS,
  TOURIST_RATING_VALUES,
  RATING_ASPECTS,
  EVALUATION_CRITERIA
};
