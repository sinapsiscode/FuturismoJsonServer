import { GUIDE_TYPES as SHARED_GUIDE_TYPES } from './sharedConstants';

// Re-export guide types from shared constants
export const GUIDE_TYPES = SHARED_GUIDE_TYPES;

export const LEVEL_OPTIONS = [
  { value: 'principiante', label: 'guides.levels.beginner' },
  { value: 'intermedio', label: 'guides.levels.intermediate' },
  { value: 'avanzado', label: 'guides.levels.advanced' },
  { value: 'experto', label: 'guides.levels.expert' },
  { value: 'nativo', label: 'guides.levels.native' }
];

export const LEVEL_COLORS = {
  principiante: 'bg-yellow-100 text-yellow-800',
  intermedio: 'bg-blue-100 text-blue-800',
  avanzado: 'bg-green-100 text-green-800',
  experto: 'bg-purple-100 text-purple-800',
  nativo: 'bg-indigo-100 text-indigo-800'
};

export const GUIDE_STATUS = {
  active: 'active',
  inactive: 'inactive'
};

export const FORM_TABS = [
  { id: 'personal', label: 'guides.form.tabs.personal' },
  { id: 'languages', label: 'guides.form.tabs.languages' },
  { id: 'museums', label: 'guides.form.tabs.museums' }
];

import { VALIDATION_PATTERNS } from './sharedConstants';

// Re-export validation patterns from shared constants
export const DNI_REGEX = VALIDATION_PATTERNS.DNI;
export const EMAIL_REGEX = VALIDATION_PATTERNS.EMAIL;

// Catálogo de idiomas disponibles
export const AVAILABLE_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'Inglés', flag: '🇺🇸' },
  { code: 'fr', name: 'Francés', flag: '🇫🇷' },
  { code: 'de', name: 'Alemán', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portugués', flag: '🇵🇹' },
  { code: 'ja', name: 'Japonés', flag: '🇯🇵' },
  { code: 'ko', name: 'Coreano', flag: '🇰🇷' },
  { code: 'zh', name: 'Chino Mandarín', flag: '🇨🇳' },
  { code: 'ru', name: 'Ruso', flag: '🇷🇺' }
];

// Niveles de idioma
export const LANGUAGE_LEVELS = {
  NATIVE: 'nativo',
  EXPERT: 'experto',
  ADVANCED: 'avanzado',
  INTERMEDIATE: 'intermedio',
  BEGINNER: 'principiante'
};

// Niveles de expertise
export const EXPERTISE_LEVELS = {
  EXPERT: 'experto',
  ADVANCED: 'avanzado',
  INTERMEDIATE: 'intermedio',
  BEGINNER: 'principiante'
};

// Estados de guía
export const GUIDE_STATUS_VALUES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

// Tipos de disponibilidad
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  UNAVAILABLE: 'unavailable'
};

// Configuración de agenda
export const AGENDA_CONFIG = {
  WORK_START_TIME: '08:00',
  WORK_END_TIME: '18:00',
  SLOT_DURATION_MINUTES: 60,
  LUNCH_START: '13:00',
  LUNCH_END: '14:00'
};

// Valores por defecto para stats
export const DEFAULT_STATS = {
  toursCompleted: 0,
  yearsExperience: 0,
  rating: 0,
  certifications: 0
};

// Configuración de filtros
export const FILTER_TYPES = {
  TYPE: 'tipo',
  LANGUAGE: 'language',
  MUSEUM: 'museum',
  STATUS: 'status',
  RATING: 'rating'
};

// Museos comunes (para ejemplo/mock)
export const COMMON_MUSEUMS = [
  'Museo Larco',
  'Museo del Oro',
  'Museo Nacional de Antropología',
  'Museo de Arte de Lima',
  'Museo Pedro de Osma',
  'Museo de la Nación',
  'Museo de Sitio Pachacamac'
];

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  GUIDE_NOT_FOUND: 'Guía no encontrado',
  NO_GUIDES_FOUND: 'No se encontraron guías con los filtros aplicados',
  INVALID_GUIDE_TYPE: 'Tipo de guía inválido',
  INVALID_LANGUAGE: 'Idioma inválido',
  INVALID_LEVEL: 'Nivel inválido'
};

// Tiempos de simulación (ms)
export const API_DELAYS = {
  LOAD_GUIDES: 500,
  SAVE_GUIDE: 1000,
  DELETE_GUIDE: 800,
  UPDATE_GUIDE: 1000
};