/**
 * COMPATIBILITY LAYER - GuideAvailability
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useCalendarConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getCalendarConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.guideavailability || {};
};


export const SLOT_STATUS = (() => {
  const config = getCalendarConfig();
  return config.slotStatus || [];
})();

export const TIME_SLOT_CONFIG = (() => {
  const config = getCalendarConfig();
  return config.timeSlotConfig || {};
})();

export const DISPLAY_LIMITS = (() => {
  const config = getCalendarConfig();
  return config.displayLimits || { maxDays: 30 };
})();

export const DATE_NAVIGATION = (() => {
  const config = getCalendarConfig();
  return config.dateNavigation || {};
})();


// Export default para compatibilidad
export default {
  SLOT_STATUS,
  TIME_SLOT_CONFIG,
  DISPLAY_LIMITS,
  DATE_NAVIGATION
};
