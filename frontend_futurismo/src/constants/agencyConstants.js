/**
 * Constantes para el store de agencias
 */

// Tipos de servicio
export const SERVICE_TYPES = [
  'City Tour',
  'Machu Picchu',
  'Valle Sagrado',
  'Islas Ballestas',
  'Nazca Lines'
];

// Nombres de clientes mock
export const MOCK_CLIENT_NAMES = [
  'Familia García',
  'Sr. Johnson',
  'Pareja López',
  'Grupo Estudiantes',
  'Sra. Williams'
];

// Nombres de guías mock
export const MOCK_GUIDE_NAMES = [
  'Carlos Mendoza',
  'María Torres',
  'Ana Quispe'
];

// Estados de reserva
export const RESERVATION_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// Tipos de transacción de puntos
export const POINTS_TRANSACTION_TYPES = {
  EARNED: 'earned',
  REDEEMED: 'redeemed'
};

// Razones de transacción
export const TRANSACTION_REASONS = [
  'Reserva confirmada',
  'Tour completado',
  'Bonus mensual',
  'Canje descuento',
  'Promoción especial'
];

// Horarios disponibles
export const AVAILABLE_TIMES = ['08:00', '09:00', '14:00', '15:00'];

// Niveles de membresía
export const MEMBERSHIP_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
};

// Configuración de generación de datos mock
export const MOCK_DATA_CONFIG = {
  DAYS_PAST: 30,
  DAYS_FUTURE: 30,
  MAX_RESERVATIONS_PER_DAY: 3,
  MIN_PARTICIPANTS: 1,
  MAX_PARTICIPANTS: 8,
  MIN_AMOUNT: 50,
  MAX_AMOUNT: 300,
  MIN_DURATION_HOURS: 2,
  MAX_DURATION_HOURS: 8,
  MIN_COMMISSION: 10,
  MAX_COMMISSION: 50,
  MIN_POINTS: 5,
  MAX_POINTS: 20,
  TRANSACTION_PROBABILITY: 0.2,
  RESERVATION_PROBABILITY: 0.3,
  GUIDE_ASSIGNMENT_PROBABILITY: 0.5
};

// Configuración de puntos
export const POINTS_CONFIG = {
  MIN_TRANSACTION_AMOUNT: 5,
  MAX_TRANSACTION_AMOUNT: 50,
  POINTS_PER_DOLLAR: 1,
  MIN_REDEMPTION: 100,
  EXPIRATION_MONTHS: 12
};

// Formatos de fecha
export const DATE_FORMATS = {
  DATE_KEY: 'yyyy-MM-dd',
  DISPLAY_DATE: 'dd/MM/yyyy',
  MONTH_YEAR: 'MMMM yyyy'
};

// Límites de búsqueda
export const SEARCH_LIMITS = {
  MAX_DATE_RANGE_DAYS: 365,
  DEFAULT_RESULTS_LIMIT: 100
};

// Estados de disponibilidad
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  BLOCKED: 'blocked'
};

// Configuración por defecto de agencia
export const DEFAULT_AGENCY = {
  ID: 'agency1',
  NAME: 'Turismo Aventura S.A.C.',
  EMAIL: 'agencia@test.com',
  PHONE: '+51 987 654 321',
  ADDRESS: 'Av. Sol 123, Cusco',
  INITIAL_POINTS: 450,
  TOTAL_EARNED: 1250,
  TOTAL_REDEEMED: 800,
  MEMBER_SINCE: '2022-01-15',
  TIER: MEMBERSHIP_TIERS.GOLD
};

// Prefijos de ID
export const ID_PREFIXES = {
  RESERVATION: 'res_',
  POINTS_TRANSACTION: 'pt_',
  AGENCY: 'agency_'
};

// Sistema de procesamiento
export const PROCESSING_SYSTEM = {
  SYSTEM: 'system',
  MANUAL: 'manual',
  AUTOMATIC: 'automatic'
};

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  RESERVATION_NOT_FOUND: 'Reserva no encontrada',
  INVALID_DATE_RANGE: 'Rango de fechas inválido',
  INSUFFICIENT_POINTS: 'Puntos insuficientes',
  INVALID_STATUS: 'Estado inválido',
  AGENCY_NOT_FOUND: 'Agencia no encontrada'
};

// Configuración de almacenamiento
export const STORAGE_CONFIG = {
  KEY: 'agency-store',
  VERSION: 1
};