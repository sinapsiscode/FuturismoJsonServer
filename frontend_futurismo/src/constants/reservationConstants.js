export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIAL: 'partial',
  REFUNDED: 'refunded'
};

import { DOCUMENT_TYPES as SHARED_DOCUMENT_TYPES } from './sharedConstants';

// Reservation-specific document types
export const DOCUMENT_TYPES = {
  DNI: SHARED_DOCUMENT_TYPES.DNI,
  PASSPORT: SHARED_DOCUMENT_TYPES.PASSPORT,
  RUC: SHARED_DOCUMENT_TYPES.RUC,
  CE: SHARED_DOCUMENT_TYPES.CE
};

export const RESERVATION_ACTIONS = {
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete',
  EXPORT: 'export',
  RATE: 'rate',
  DUPLICATE: 'duplicate'
};

import { EXPORT_FORMATS as SHARED_EXPORT_FORMATS } from './sharedConstants';

// Re-export export formats from shared constants
export const EXPORT_FORMATS = {
  PDF: SHARED_EXPORT_FORMATS.PDF,
  EXCEL: SHARED_EXPORT_FORMATS.EXCEL
};

export const TOUR_TYPES = {
  CULTURAL: 'cultural',
  GASTRONOMIC: 'gastronomic',
  ADVENTURE: 'adventure',
  ECOLOGICAL: 'ecological',
  HISTORICAL: 'historical'
};

export const PASSENGER_TYPES = {
  ADULT: 'adult',
  CHILD: 'child',
  INFANT: 'infant',
  SENIOR: 'senior'
};

export const TIMELINE_INTERVALS = {
  THIRTY_MIN: 30,
  ONE_HOUR: 60,
  TWO_HOURS: 120
};

export const FILTER_OPTIONS = {
  DATE_RANGE: 'dateRange',
  STATUS: 'status',
  CUSTOMER: 'customer',
  PASSENGERS: 'passengers',
  TOUR_TYPE: 'tourType',
  PAYMENT_STATUS: 'paymentStatus'
};

export const SORT_OPTIONS = {
  DATE_ASC: 'dateAsc',
  DATE_DESC: 'dateDesc',
  NAME_ASC: 'nameAsc',
  NAME_DESC: 'nameDesc',
  STATUS: 'status',
  TOTAL: 'total'
};

import { PAGINATION_DEFAULTS } from './sharedConstants';

// Re-export pagination options from shared constants
export const ITEMS_PER_PAGE_OPTIONS = PAGINATION_DEFAULTS.PAGE_SIZE_OPTIONS;

export const DEFAULT_FILTERS = {
  status: 'all',
  dateFrom: '',
  dateTo: '',
  customer: '',
  minPassengers: '',
  maxPassengers: '',
  tourType: 'all',
  paymentStatus: 'all'
};

export const RATING_ASPECTS = {
  SERVICE: 'service',
  PUNCTUALITY: 'punctuality',
  QUALITY: 'quality',
  VALUE: 'value',
  GUIDE: 'guide'
};

// Re-export pagination settings from shared constants
export const PAGINATION = {
  DEFAULT_PAGE: PAGINATION_DEFAULTS.DEFAULT_PAGE,
  DEFAULT_ITEMS_PER_PAGE: PAGINATION_DEFAULTS.PAGE_SIZE
};

export const RESERVATION_STATUS_SPANISH = {
  confirmada: 'confirmada',
  pendiente: 'pendiente',
  cancelada: 'cancelada',
  completada: 'completada',
  en_proceso: 'en_proceso'
};

export const PAYMENT_STATUS_SPANISH = {
  pagado: 'pagado',
  pendiente: 'pendiente',
  parcial: 'parcial',
  reembolsado: 'reembolsado'
};

export const STATUS_BADGE_COLORS = {
  pendiente: 'badge-yellow',
  confirmada: 'badge-green',
  cancelada: 'badge-red',
  completada: 'badge-blue',
  en_proceso: 'badge-orange',
  default: 'badge-gray'
};

export const PAYMENT_BADGE_COLORS = {
  pendiente: 'badge-yellow',
  pagado: 'badge-green',
  parcial: 'badge-orange',
  reembolsado: 'badge-blue',
  default: 'badge-gray'
};

export const TIMELINE_CONFIG = {
  START_HOUR: 6,
  END_HOUR: 22,
  HOURS_COUNT: 17,
  DEFAULT_DURATION: 2,
  HOUR_HEIGHT_PX: 60,
  RESERVATION_OFFSET_PX: 10,
  HOUR_WIDTH_PX: 80,
  MIN_HOUR_HEIGHT: '60px'
};

export const WIZARD_STEPS = {
  SERVICE: 1,
  DETAILS: 2,
  CONFIRMATION: 3
};

export const SERVICE_TYPES = {
  TOUR: 'tour',
  TRANSFER: 'transfer',
  CUSTOM: 'custom'
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer'
};

export const MAX_COMPANIONS_PER_GROUP = 50;