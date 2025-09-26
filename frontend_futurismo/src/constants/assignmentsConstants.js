/**
 * Constantes para el hook useAssignments
 */

// Estados de asignación
export const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Tipos de documentos
export const DOCUMENT_TYPES = {
  DNI: 'DNI',
  PASSPORT: 'PASSPORT',
  CE: 'CE',
  RUC: 'RUC'
};

// Tipos de licencia de conducir
export const LICENSE_TYPES = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E'
};

// Tipos de vehículos
export const VEHICLE_TYPES = {
  CAR: 'car',
  VAN: 'van',
  MINIBUS: 'minibus',
  BUS: 'bus'
};

// Capacidades de vehículos
export const VEHICLE_CAPACITIES = {
  [VEHICLE_TYPES.CAR]: 4,
  [VEHICLE_TYPES.VAN]: 8,
  [VEHICLE_TYPES.MINIBUS]: 20,
  [VEHICLE_TYPES.BUS]: 50
};

// Formato de hora
export const TIME_FORMAT = 'HH:mm';
export const DATE_FORMAT = 'DD/MM/YYYY';

// Valores por defecto para nuevas asignaciones
export const DEFAULT_ASSIGNMENT = {
  status: ASSIGNMENT_STATUS.PENDING,
  tourists: [],
  notes: ''
};

// Límites
export const ASSIGNMENT_LIMITS = {
  MIN_GROUP_SIZE: 1,
  MAX_GROUP_SIZE: 50,
  MIN_ADVANCE_HOURS: 24,
  MAX_ADVANCE_DAYS: 365
};

// Idiomas disponibles para tours
export const TOUR_LANGUAGES = [
  'Español',
  'Inglés',
  'Francés',
  'Portugués',
  'Alemán',
  'Italiano',
  'Japonés',
  'Chino'
];

// Especialidades de guías
export const GUIDE_SPECIALTIES = [
  'Historia',
  'Naturaleza',
  'Cultura',
  'Gastronomía',
  'Arte',
  'Arqueología',
  'Aventura',
  'Fotografía'
];