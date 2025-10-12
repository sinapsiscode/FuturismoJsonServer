/**
 * COMPATIBILITY LAYER - Rewards
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useRewardsConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getRewardsConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.rewards || {};
};


export const SERVICE_POINTS = (() => {
  const config = getRewardsConfig();
  return config.servicePoints || {};
})();

export const REWARD_CATEGORIES = (() => {
  const config = getRewardsConfig();
  return config.rewardCategories || [];
})();

export const REDEMPTION_STATUS = (() => {
  const config = getRewardsConfig();
  return config.redemptionStatus || [];
})();

export const POINTS_LIMITS = (() => {
  const config = getRewardsConfig();
  return config.pointsLimits || {};
})();

export const TIER_LEVELS = (() => {
  const config = getRewardsConfig();
  return config.tierLevels || [];
})();


// Export default para compatibilidad
export default {
  SERVICE_POINTS,
  REWARD_CATEGORIES,
  REDEMPTION_STATUS,
  POINTS_LIMITS,
  TIER_LEVELS
};
