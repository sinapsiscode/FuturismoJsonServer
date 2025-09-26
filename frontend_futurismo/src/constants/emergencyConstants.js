import { PRIORITY_COLORS as SHARED_PRIORITY_COLORS } from './sharedConstants';

// Legacy priority colors with Spanish keys for backward compatibility
// TODO: Migrate to English keys from sharedConstants
export const PRIORITY_COLORS = {
  alta: SHARED_PRIORITY_COLORS.HIGH.bg + ' ' + SHARED_PRIORITY_COLORS.HIGH.text + ' ' + SHARED_PRIORITY_COLORS.HIGH.border,
  media: SHARED_PRIORITY_COLORS.MEDIUM.bg + ' ' + SHARED_PRIORITY_COLORS.MEDIUM.text + ' ' + SHARED_PRIORITY_COLORS.MEDIUM.border,
  baja: SHARED_PRIORITY_COLORS.LOW.bg + ' ' + SHARED_PRIORITY_COLORS.LOW.text + ' ' + SHARED_PRIORITY_COLORS.LOW.border,
  default: SHARED_PRIORITY_COLORS.DEFAULT.bg + ' ' + SHARED_PRIORITY_COLORS.DEFAULT.text + ' ' + SHARED_PRIORITY_COLORS.DEFAULT.border
};

// Emergency-specific contact types
export const EMERGENCY_CONTACT_TYPES = {
  emergency: 'emergency',
  coordinator: 'coordinator',
  management: 'management',
  police: 'police',
  medical: 'medical',
  insurance: 'insurance',
  towing: 'towing',
  weather: 'weather',
  local: 'local',
  operations: 'operations'
};

// Alias for backward compatibility
export const CONTACT_TYPES = EMERGENCY_CONTACT_TYPES;

// Legacy priority levels with Spanish values for backward compatibility
// TODO: Migrate to English values from sharedConstants
export const PRIORITY_LEVELS = {
  alta: 'alta',
  media: 'media',
  baja: 'baja'
};

// Categorías de protocolos
export const PROTOCOL_CATEGORIES = {
  MEDICAL: 'medico',
  WEATHER: 'climatico',
  TRANSPORT: 'transporte',
  SECURITY: 'seguridad',
  COMMUNICATION: 'comunicacion',
  NATURAL_DISASTER: 'desastre_natural'
};

// Iconos de protocolos
export const PROTOCOL_ICONS = {
  [PROTOCOL_CATEGORIES.MEDICAL]: '🚑',
  [PROTOCOL_CATEGORIES.WEATHER]: '⛈️',
  [PROTOCOL_CATEGORIES.TRANSPORT]: '🚗',
  [PROTOCOL_CATEGORIES.SECURITY]: '🔍',
  [PROTOCOL_CATEGORIES.COMMUNICATION]: '📡',
  [PROTOCOL_CATEGORIES.NATURAL_DISASTER]: '🌋'
};

// Números de emergencia
export const EMERGENCY_NUMBERS = {
  GENERAL: '105',
  SENAMHI: '115',
  DEFENSA_CIVIL: '116',
  BOMBEROS: '116',
  SAMU: '106'
};

// Contactos mock para desarrollo
export const MOCK_CONTACTS = {
  COORDINATOR: '+51 999 888 777',
  MANAGEMENT: '+51 999 888 778',
  MANAGEMENT_24H: '+51 999 888 779',
  INSURANCE_MEDICAL: '+51 999 888 780',
  INSURANCE_VEHICLE: '+51 999 888 785',
  TOWING_SERVICE: '+51 999 888 786'
};

// Tipos de materiales
export const MATERIAL_TYPES = {
  MEDICAL: 'medical',
  COMMUNICATION: 'communication',
  SAFETY: 'safety',
  NAVIGATION: 'navigation',
  EMERGENCY: 'emergency'
};

// Estados de protocolos
export const PROTOCOL_STATUS = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
  UNDER_REVIEW: 'under_review'
};

// Configuración de protocolos
export const PROTOCOL_CONFIG = {
  MAX_STEPS: 20,
  MIN_STEPS: 3,
  MAX_CONTACTS: 10,
  MIN_CONTACTS: 2,
  MAX_MATERIALS: 15,
  MIN_MATERIALS: 1
};

// Materiales estándar de emergencia
export const STANDARD_MATERIALS = {
  MEDICAL: [
    'Botiquín de primeros auxilios',
    'Lista de contactos de emergencia',
    'Información médica de participantes',
    'Linterna y silbato',
    'Mantas térmicas'
  ],
  WEATHER: [
    'Radio de comunicación',
    'Impermeables de emergencia',
    'Brújula y GPS',
    'Linternas adicionales',
    'Silbato de emergencia'
  ],
  VEHICLE: [
    'Kit de herramientas básicas',
    'Triángulos de seguridad',
    'Chaleco reflectivo',
    'Extintor',
    'Botiquín vehicular'
  ],
  SECURITY: [
    'Lista actualizada de participantes',
    'Silbato de emergencia',
    'Linterna potente',
    'Radio de comunicación',
    'Fotografías del grupo'
  ],
  COMMUNICATION: [
    'Teléfono satelital',
    'Radio VHF',
    'Cargadores portátiles',
    'Panel solar portátil',
    'Números de emergencia impresos'
  ]
};

// Pasos estándar por tipo de emergencia
export const STANDARD_STEPS = {
  INITIAL_ASSESSMENT: 'Evaluar la situación y seguridad del entorno',
  CONTACT_EMERGENCY: 'Llamar inmediatamente a emergencias',
  CONTACT_COORDINATOR: 'Contactar coordinador de tours',
  DOCUMENT_INCIDENT: 'Documentar el incidente',
  SECURE_AREA: 'Asegurar la zona del incidente',
  GROUP_SAFETY: 'Mantener al resto del grupo seguro',
  COORDINATE_RESPONSE: 'Coordinar plan de contingencia'
};

// Tiempos de respuesta (minutos)
export const RESPONSE_TIMES = {
  IMMEDIATE: 0,
  URGENT: 5,
  HIGH_PRIORITY: 15,
  NORMAL: 30,
  LOW_PRIORITY: 60
};

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  PROTOCOL_NOT_FOUND: 'Protocolo no encontrado',
  INVALID_CATEGORY: 'Categoría inválida',
  MATERIAL_LIMIT_EXCEEDED: 'Límite de materiales excedido',
  CONTACT_REQUIRED: 'Al menos un contacto es requerido',
  STEPS_REQUIRED: 'Al menos tres pasos son requeridos'
};

// Configuración de almacenamiento
export const STORAGE_CONFIG = {
  KEY: 'emergency-protocols',
  VERSION: 1
};

// Simulación de delays (ms)
export const API_DELAYS = {
  LOAD_PROTOCOLS: 800,
  SAVE_PROTOCOL: 1000,
  DELETE_PROTOCOL: 600,
  UPDATE_PROTOCOL: 1000
};