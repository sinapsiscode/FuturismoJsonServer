/**
 * COMPATIBILITY LAYER - Export
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useExportConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getExportConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.export || {};
};


// Formatos de exportación
export const EXPORT_FORMATS = (() => {
  const config = getExportConfig();
  return config.exportFormats || {
    EXCEL: 'excel',
    PDF: 'pdf'
  };
})();

// Extensiones de archivo
export const FILE_EXTENSIONS = (() => {
  const config = getExportConfig();
  return config.fileExtensions || {
    [EXPORT_FORMATS.EXCEL]: '.xlsx',
    [EXPORT_FORMATS.PDF]: '.pdf'
  };
})();

// Colores para gradientes de formato (Tailwind)
export const FORMAT_COLORS = (() => {
  const config = getExportConfig();
  return config.formatColors || {
    [EXPORT_FORMATS.EXCEL]: 'from-green-500 to-green-600',
    [EXPORT_FORMATS.PDF]: 'from-red-500 to-red-600'
  };
})();

// Límites para recomendaciones
export const EXPORT_RECOMMENDATIONS = (() => {
  const config = getExportConfig();
  return config.exportRecommendations || {
    EXCEL_MIN_RECORDS: 20,
    PDF_MAX_RECORDS: 100
  };
})();

// Timeouts de exportación
export const EXPORT_TIMEOUTS = (() => {
  const config = getExportConfig();
  return config.exportTimeouts || {
    PROCESS_DELAY: 1000,
    SUCCESS_NOTIFICATION: 3000,
    ERROR_NOTIFICATION: 5000
  };
})();

// Estados de exportación
export const EXPORT_STATES = (() => {
  const config = getExportConfig();
  return config.exportStates || {
    IDLE: 'idle',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    ERROR: 'error'
  };
})();

// Configuración de exportación por formato
export const EXPORT_CONFIG = (() => {
  const config = getExportConfig();
  return config.exportConfig || {
    [EXPORT_FORMATS.EXCEL]: {
      includeHeaders: true,
      includeFilters: true,
      includeCharts: true,
      sheetName: 'Datos'
    },
    [EXPORT_FORMATS.PDF]: {
      orientation: 'portrait',
      pageSize: 'A4',
      includeHeader: true,
      includeFooter: true,
      includePageNumbers: true
    }
  };
})();

// Mensajes de estado de exportación (keys para i18n)
export const EXPORT_STATUS_KEYS = (() => {
  const config = getExportConfig();
  return config.exportStatusKeys || {
    all: 'common.export.status.all',
    pending: 'common.export.status.pending',
    confirmed: 'common.export.status.confirmed',
    cancelled: 'common.export.status.cancelled',
    completed: 'common.export.status.completed',
    filtered: 'common.export.status.filtered'
  };
})();

// Tamaños máximos de archivo (en bytes)
export const MAX_EXPORT_SIZES = (() => {
  const config = getExportConfig();
  return config.maxExportSizes || {
    [EXPORT_FORMATS.EXCEL]: 10 * 1024 * 1024, // 10MB
    [EXPORT_FORMATS.PDF]: 25 * 1024 * 1024 // 25MB
  };
})();

// Export default para compatibilidad
export default {
  EXPORT_FORMATS,
  FILE_EXTENSIONS,
  FORMAT_COLORS,
  EXPORT_RECOMMENDATIONS,
  EXPORT_TIMEOUTS,
  EXPORT_STATES,
  EXPORT_CONFIG,
  EXPORT_STATUS_KEYS,
  MAX_EXPORT_SIZES
};
