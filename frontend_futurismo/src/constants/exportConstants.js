/**
 * Constantes para funcionalidades de exportación
 */

// Formatos de exportación
export const EXPORT_FORMATS = {
  EXCEL: 'excel',
  PDF: 'pdf'
};

// Extensiones de archivo
export const FILE_EXTENSIONS = {
  [EXPORT_FORMATS.EXCEL]: '.xlsx',
  [EXPORT_FORMATS.PDF]: '.pdf'
};

// Colores para gradientes de formato (Tailwind)
export const FORMAT_COLORS = {
  [EXPORT_FORMATS.EXCEL]: 'from-green-500 to-green-600',
  [EXPORT_FORMATS.PDF]: 'from-red-500 to-red-600'
};

// Límites para recomendaciones
export const EXPORT_RECOMMENDATIONS = {
  EXCEL_MIN_RECORDS: 20,
  PDF_MAX_RECORDS: 100
};

// Timeouts de exportación
export const EXPORT_TIMEOUTS = {
  PROCESS_DELAY: 1000,
  SUCCESS_NOTIFICATION: 3000,
  ERROR_NOTIFICATION: 5000
};

// Estados de exportación
export const EXPORT_STATES = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Configuración de exportación por formato
export const EXPORT_CONFIG = {
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

// Mensajes de estado de exportación (keys para i18n)
export const EXPORT_STATUS_KEYS = {
  all: 'common.export.status.all',
  pending: 'common.export.status.pending',
  confirmed: 'common.export.status.confirmed',
  cancelled: 'common.export.status.cancelled',
  completed: 'common.export.status.completed',
  filtered: 'common.export.status.filtered'
};

// Tamaños máximos de archivo (en bytes)
export const MAX_EXPORT_SIZES = {
  [EXPORT_FORMATS.EXCEL]: 10 * 1024 * 1024, // 10MB
  [EXPORT_FORMATS.PDF]: 25 * 1024 * 1024 // 25MB
};