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


export const FEEDBACK_TYPES = (() => {
  const config = getRatingsConfig();
  return config.feedbackTypes || [
    { value: 'positive', label: 'Positivo' },
    { value: 'negative', label: 'Negativo' },
    { value: 'suggestion', label: 'Sugerencia' }
  ];
})();

export const RATING_STEPS = (() => {
  const config = getRatingsConfig();
  return config.ratingSteps || [
    { id: 1, title: 'Calificación General' },
    { id: 2, title: 'Detalles' },
    { id: 3, title: 'Comentarios' }
  ];
})();

export const UI_DELAYS = (() => {
  const config = getRatingsConfig();
  return config.uiDelays || {
    toast: 3000,
    transition: 300,
    API_SIMULATION: 1000
  };
})();

// Tourist rating values
export const TOURIST_RATING_VALUES = (() => {
  const config = getRatingsConfig();
  return config.touristRatingValues || {
    EXCELLENT: 'excellent',
    GOOD: 'good',
    POOR: 'poor'
  };
})();

// Rating icons (emojis)
export const RATING_ICONS = (() => {
  const config = getRatingsConfig();
  return config.ratingIcons || {
    EXCELLENT: '😊',
    GOOD: '👍',
    POOR: '☹️'
  };
})();

// Rating colors
export const RATING_COLORS = (() => {
  const config = getRatingsConfig();
  return config.ratingColors || {
    EXCELLENT: {
      text: 'text-green-600',
      bg: 'bg-green-50',
      selected: 'bg-green-500 border-green-600 text-white'
    },
    GOOD: {
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      selected: 'bg-blue-500 border-blue-600 text-white'
    },
    POOR: {
      text: 'text-red-600',
      bg: 'bg-red-50',
      selected: 'bg-red-500 border-red-600 text-white'
    }
  };
})();

// Rated by types
export const RATED_BY_TYPES = (() => {
  const config = getRatingsConfig();
  return config.ratedByTypes || {
    AGENCY: 'agency',
    GUIDE: 'guide',
    ADMIN: 'admin',
    SYSTEM: 'system'
  };
})();

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
  RATING_ICONS,
  RATING_COLORS,
  RATED_BY_TYPES,
  RATING_ASPECTS,
  EVALUATION_CRITERIA
};
