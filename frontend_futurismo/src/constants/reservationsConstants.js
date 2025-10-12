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


export const RESERVATION_STATUS = (() => {
  const config = getReservationsConfig();
  return config.reservationStatus || [];
})();

export const PAYMENT_STATUS = (() => {
  const config = getReservationsConfig();
  return config.paymentStatus || [];
})();

export const PAYMENT_METHODS = (() => {
  const config = getReservationsConfig();
  return config.paymentMethods || [];
})();

export const BOOKING_TYPES = (() => {
  const config = getReservationsConfig();
  return config.bookingTypes || [];
})();

export const CANCELLATION_REASONS = (() => {
  const config = getReservationsConfig();
  return config.cancellationReasons || [];
})();


// Export default para compatibilidad
export default {
  RESERVATION_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  BOOKING_TYPES,
  CANCELLATION_REASONS
};
