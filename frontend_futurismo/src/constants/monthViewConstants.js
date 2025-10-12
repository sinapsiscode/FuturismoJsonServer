/**
 * COMPATIBILITY LAYER - MonthView
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
  return state.modules?.monthview || {};
};


export const MONTH_VIEW_CONFIG = (() => {
  const config = getCalendarConfig();
  return config.monthViewConfig || {};
})();

export const HOVER_CONFIG = (() => {
  const config = getCalendarConfig();
  return config.hoverConfig || {};
})();

export const EVENT_COLORS = (() => {
  const config = getCalendarConfig();
  return config.eventColors || {};
})();

export const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];


// Export default para compatibilidad
export default {
  MONTH_VIEW_CONFIG,
  HOVER_CONFIG,
  EVENT_COLORS,
  WEEKDAY_LABELS,
  MONTH_LABELS
};
