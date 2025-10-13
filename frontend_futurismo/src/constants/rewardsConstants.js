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

// Service type points mapping (alias for compatibility)
export const SERVICE_TYPE_POINTS = (() => {
  const config = getRewardsConfig();
  return config.serviceTypePoints || {
    city_tour: 100,
    museum: 80,
    adventure: 150,
    cultural: 120,
    gastronomic: 90,
    nature: 130,
    custom: 100
  };
})();

// Reward categories as object (for use in components)
export const REWARD_CATEGORIES = (() => {
  const config = getRewardsConfig();
  return config.rewardCategories || {
    ELECTRONICS: 'electronics',
    TRAVEL: 'travel',
    GIFT_CARDS: 'gift_cards',
    EXPERIENCES: 'experiences',
    MERCHANDISE: 'merchandise',
    SERVICES: 'services'
  };
})();

// Reward category labels
export const REWARD_CATEGORY_LABELS = (() => {
  const config = getRewardsConfig();
  return config.rewardCategoryLabels || {
    electronics: 'Electrónica',
    travel: 'Viajes',
    gift_cards: 'Tarjetas Regalo',
    experiences: 'Experiencias',
    merchandise: 'Merchandising',
    services: 'Servicios'
  };
})();

// Redemption status as object (for use in components)
export const REDEMPTION_STATUS = (() => {
  const config = getRewardsConfig();
  return config.redemptionStatus || {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  };
})();

// Redemption status labels
export const REDEMPTION_STATUS_LABELS = (() => {
  const config = getRewardsConfig();
  return config.redemptionStatusLabels || {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  };
})();

// Redemption status colors
export const REDEMPTION_STATUS_COLORS = (() => {
  const config = getRewardsConfig();
  return config.redemptionStatusColors || {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };
})();

export const POINTS_LIMITS = (() => {
  const config = getRewardsConfig();
  return config.pointsLimits || {
    min: 0,
    max: 100000,
    minRedemption: 1000
  };
})();

export const TIER_LEVELS = (() => {
  const config = getRewardsConfig();
  return config.tierLevels || [
    { name: 'Bronze', minPoints: 0, maxPoints: 5000 },
    { name: 'Silver', minPoints: 5001, maxPoints: 15000 },
    { name: 'Gold', minPoints: 15001, maxPoints: 50000 },
    { name: 'Platinum', minPoints: 50001, maxPoints: Infinity }
  ];
})();

// Rewards messages for toast notifications
export const REWARDS_MESSAGES = (() => {
  const config = getRewardsConfig();
  return config.rewardsMessages || {
    FETCH_ERROR: 'Error al cargar premios',
    CREATE_SUCCESS: 'Premio creado exitosamente',
    CREATE_ERROR: 'Error al crear premio',
    UPDATE_SUCCESS: 'Premio actualizado exitosamente',
    UPDATE_ERROR: 'Error al actualizar premio',
    DELETE_SUCCESS: 'Premio eliminado exitosamente',
    DELETE_ERROR: 'Error al eliminar premio',
    REDEMPTION_SUCCESS: 'Canje realizado exitosamente',
    REDEMPTION_ERROR: 'Error al realizar el canje',
    INSUFFICIENT_POINTS: 'Puntos insuficientes para este canje',
    OUT_OF_STOCK: 'Premio sin stock disponible'
  };
})();


// Export default para compatibilidad
export default {
  SERVICE_POINTS,
  SERVICE_TYPE_POINTS,
  REWARD_CATEGORIES,
  REWARD_CATEGORY_LABELS,
  REDEMPTION_STATUS,
  REDEMPTION_STATUS_LABELS,
  REDEMPTION_STATUS_COLORS,
  POINTS_LIMITS,
  TIER_LEVELS,
  REWARDS_MESSAGES
};
