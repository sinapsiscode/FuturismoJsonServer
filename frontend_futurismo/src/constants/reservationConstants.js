/**
 * COMPATIBILITY LAYER - Reservations
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useReservationsConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getReservationsConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.reservations || {};
};

// Badge colors for reservation status
export const STATUS_BADGE_COLORS = (() => {
  const config = getReservationsConfig();
  return config.statusBadgeColors || {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmada: 'bg-green-100 text-green-800',
    cancelada: 'bg-red-100 text-red-800',
    completada: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };
})();

// Badge colors for payment status
export const PAYMENT_BADGE_COLORS = (() => {
  const config = getReservationsConfig();
  return config.paymentBadgeColors || {
    pendiente: 'bg-yellow-100 text-yellow-800',
    pagado: 'bg-green-100 text-green-800',
    reembolsado: 'bg-purple-100 text-purple-800',
    default: 'bg-gray-100 text-gray-800'
  };
})();

// Pagination settings
export const PAGINATION = (() => {
  const config = getReservationsConfig();
  return config.pagination || {
    DEFAULT_ITEMS_PER_PAGE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
  };
})();

export default {
  STATUS_BADGE_COLORS,
  PAYMENT_BADGE_COLORS,
  PAGINATION
};
