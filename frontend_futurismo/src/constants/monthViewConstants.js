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

// Event types
export const EVENT_TYPES = {
  PERSONAL: 'personal',
  COMPANY_TOUR: 'company_tour',
  OCCUPIED: 'occupied',
  AVAILABLE: 'available',
  TOUR: 'tour',
  MEETING: 'meeting',
  TRAINING: 'training',
  MAINTENANCE: 'maintenance',
  HOLIDAY: 'holiday'
};

// Calendar configuration
export const CALENDAR_CONFIG = {
  WEEK_START_DAY: 0, // 0 = Sunday, 1 = Monday
  DATE_FORMAT: 'yyyy-MM-dd',
  DISPLAY_FORMAT: 'dd/MM/yyyy',
  MONTH_FORMAT: 'MMMM yyyy',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm'
};

// Calendar views
export const CALENDAR_VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  AGENDA: 'agenda'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENCY: 'agency',
  GUIDE: 'guide',
  CLIENT: 'client',
  DRIVER: 'driver'
};


// Export default para compatibilidad
export default {
  MONTH_VIEW_CONFIG,
  HOVER_CONFIG,
  EVENT_COLORS,
  WEEKDAY_LABELS,
  MONTH_LABELS,
  EVENT_TYPES,
  CALENDAR_CONFIG,
  CALENDAR_VIEWS,
  USER_ROLES
};
