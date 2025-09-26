/**
 * @fileoverview Shared constants used across multiple modules
 * This file consolidates common constants to avoid duplication
 * and maintain consistency throughout the application
 * @module constants/sharedConstants
 */

/**
 * Currency definitions used throughout the application
 * @constant {Object} CURRENCIES
 * @property {Object} PEN - Peruvian Sol
 * @property {Object} USD - US Dollar
 * @property {Object} EUR - Euro
 */
export const CURRENCIES = {
  PEN: { value: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
  USD: { value: 'USD', symbol: 'S/', name: 'Peruvian Sol' },
  EUR: { value: 'EUR', symbol: '€', name: 'Euro' }
};

/**
 * Languages supported by the system
 * @constant {Array<Object>} LANGUAGES
 * @property {string} code - ISO 639-1 language code
 * @property {string} name - English name of the language
 * @property {string} localKey - i18n translation key
 */
export const LANGUAGES = [
  { code: 'es', name: 'Spanish', localKey: 'languages.spanish' },
  { code: 'en', name: 'English', localKey: 'languages.english' },
  { code: 'fr', name: 'French', localKey: 'languages.french' },
  { code: 'de', name: 'German', localKey: 'languages.german' },
  { code: 'it', name: 'Italian', localKey: 'languages.italian' },
  { code: 'pt', name: 'Portuguese', localKey: 'languages.portuguese' },
  { code: 'ja', name: 'Japanese', localKey: 'languages.japanese' },
  { code: 'zh', name: 'Chinese', localKey: 'languages.chinese' },
  { code: 'ko', name: 'Korean', localKey: 'languages.korean' },
  { code: 'ru', name: 'Russian', localKey: 'languages.russian' }
];

/**
 * Types of tour guides in the system
 * @constant {Object} GUIDE_TYPES
 * @property {string} PLANT - In-house guide
 * @property {string} FREELANCE - Freelance guide
 */
export const GUIDE_TYPES = {
  PLANT: 'plant',
  FREELANCE: 'freelance'
};

/**
 * Regular expressions for common validation patterns
 * @constant {Object} VALIDATION_PATTERNS
 * @property {RegExp} EMAIL - Email validation
 * @property {RegExp} PHONE - International phone number validation
 * @property {RegExp} URL - URL validation
 * @property {RegExp} USERNAME - Username validation (alphanumeric + underscore)
 * @property {RegExp} DNI - Peruvian DNI validation (8 digits)
 * @property {RegExp} RUC - Peruvian RUC validation (11 digits)
 * @property {RegExp} TAX_ID - Tax ID validation (alias for RUC)
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^9\d{8}$/,  // Exactamente 9 dígitos empezando con 9
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  USERNAME: /^[a-zA-Z0-9_]+$/,
  DNI: /^\d{8}$/,
  RUC: /^[0-9]{11}$/,
  TAX_ID: /^[0-9]{11}$/ // RUC for Peru
};

/**
 * Common status values used across different modules
 * @constant {Object} STATUS_VALUES
 * @property {string} ACTIVE - Entity is active
 * @property {string} INACTIVE - Entity is inactive
 * @property {string} PENDING - Awaiting action or approval
 * @property {string} CONFIRMED - Confirmed state
 * @property {string} CANCELLED - Cancelled state
 * @property {string} COMPLETED - Completed state
 * @property {string} IN_PROGRESS - Currently in progress
 * @property {string} SUSPENDED - Temporarily suspended
 * @property {string} DRAFT - Draft state
 */
export const STATUS_VALUES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress',
  SUSPENDED: 'suspended',
  DRAFT: 'draft'
};

/**
 * Priority level definitions
 * @constant {Object} PRIORITY_LEVELS
 * @property {string} HIGH - High priority
 * @property {string} MEDIUM - Medium priority
 * @property {string} LOW - Low priority
 */
export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

/**
 * Standard date and time format strings
 * @constant {Object} DATE_FORMATS
 * @property {string} DEFAULT - Default date format (DD/MM/YYYY)
 * @property {string} ISO - ISO date format (YYYY-MM-DD)
 * @property {string} US - US date format (MM/DD/YYYY)
 * @property {string} TIME_12H - 12-hour time format
 * @property {string} TIME_24H - 24-hour time format
 * @property {string} DATETIME - Date and time format
 * @property {string} DATETIME_US - US date and time format
 */
export const DATE_FORMATS = {
  DEFAULT: 'DD/MM/YYYY',
  ISO: 'YYYY-MM-DD',
  US: 'MM/DD/YYYY',
  TIME_12H: '12h',
  TIME_24H: '24h',
  DATETIME: 'DD/MM/YYYY HH:mm',
  DATETIME_US: 'MM/DD/YYYY HH:mm'
};

/**
 * Maximum file size limits in bytes
 * @constant {Object} FILE_SIZE_LIMITS
 * @property {number} IMAGE - Max size for images (5MB)
 * @property {number} DOCUMENT - Max size for documents (10MB)
 * @property {number} VIDEO - Max size for videos (50MB)
 */
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  VIDEO: 50 * 1024 * 1024 // 50MB
};

/**
 * Accepted file type extensions for uploads
 * @constant {Object} ACCEPTED_FILE_TYPES
 * @property {string} IMAGES - Image file extensions
 * @property {string} DOCUMENTS - Document file extensions
 * @property {string} ALL - All accepted file extensions
 */
export const ACCEPTED_FILE_TYPES = {
  IMAGES: '.jpg,.jpeg,.png,.webp,.gif',
  DOCUMENTS: '.pdf,.doc,.docx,.xls,.xlsx',
  ALL: '.jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx,.xls,.xlsx'
};

/**
 * Tailwind CSS color schemes for status badges
 * @constant {Object} STATUS_COLORS
 * @property {Object} ACTIVE - Green color scheme
 * @property {Object} CONFIRMED - Green color scheme
 * @property {Object} COMPLETED - Blue color scheme
 * @property {Object} PAID - Green color scheme
 * @property {Object} PENDING - Yellow color scheme
 * @property {Object} IN_PROGRESS - Orange color scheme
 * @property {Object} PARTIAL - Orange color scheme
 * @property {Object} INACTIVE - Red color scheme
 * @property {Object} CANCELLED - Red color scheme
 * @property {Object} SUSPENDED - Red color scheme
 * @property {Object} DRAFT - Gray color scheme
 * @property {Object} DEFAULT - Gray color scheme
 */
export const STATUS_COLORS = {
  // Success states
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  PAID: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  
  // Warning states
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  IN_PROGRESS: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  PARTIAL: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  
  // Error states
  INACTIVE: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  SUSPENDED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  
  // Neutral states
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  DEFAULT: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
};

/**
 * Tailwind CSS color schemes for priority badges
 * @constant {Object} PRIORITY_COLORS
 * @property {Object} HIGH - Red color scheme
 * @property {Object} MEDIUM - Yellow color scheme
 * @property {Object} LOW - Green color scheme
 * @property {Object} DEFAULT - Gray color scheme
 */
export const PRIORITY_COLORS = {
  HIGH: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  LOW: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  DEFAULT: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
};

/**
 * Common time-related constants
 * @constant {Object} TIME_CONSTANTS
 * @property {number} SECONDS_IN_MINUTE - 60
 * @property {number} MINUTES_IN_HOUR - 60
 * @property {number} HOURS_IN_DAY - 24
 * @property {number} DAYS_IN_WEEK - 7
 * @property {number} MONTHS_IN_YEAR - 12
 * @property {number} MILLISECONDS_IN_SECOND - 1000
 * @property {number} DEFAULT_TIMEOUT - Default timeout in ms (30s)
 * @property {number} API_TIMEOUT - API timeout in ms (60s)
 */
export const TIME_CONSTANTS = {
  SECONDS_IN_MINUTE: 60,
  MINUTES_IN_HOUR: 60,
  HOURS_IN_DAY: 24,
  DAYS_IN_WEEK: 7,
  MONTHS_IN_YEAR: 12,
  MILLISECONDS_IN_SECOND: 1000,
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  API_TIMEOUT: 60000 // 60 seconds
};

/**
 * Default pagination settings
 * @constant {Object} PAGINATION_DEFAULTS
 * @property {number} PAGE_SIZE - Default items per page
 * @property {Array<number>} PAGE_SIZE_OPTIONS - Available page size options
 * @property {number} DEFAULT_PAGE - Default starting page
 */
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  DEFAULT_PAGE: 1
};

/**
 * Rating scale configuration
 * @constant {Object} RATING_SCALE
 * @property {number} MIN - Minimum rating value
 * @property {number} MAX - Maximum rating value
 * @property {number} DEFAULT - Default rating value
 * @property {number} STEP - Rating increment step
 */
export const RATING_SCALE = {
  MIN: 0,
  MAX: 5,
  DEFAULT: 0,
  STEP: 0.5
};

/**
 * Available export format types
 * @constant {Object} EXPORT_FORMATS
 * @property {string} PDF - PDF format
 * @property {string} EXCEL - Excel format
 */
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel'
};

/**
 * Types of identification and legal documents
 * @constant {Object} DOCUMENT_TYPES
 * @property {string} DNI - Peruvian national ID
 * @property {string} PASSPORT - Passport
 * @property {string} RUC - Peruvian tax ID
 * @property {string} CE - Foreign resident card
 * @property {string} LICENSE - Professional license
 * @property {string} CERTIFICATE - Certificate
 * @property {string} CONTRACT - Contract
 * @property {string} INSURANCE - Insurance document
 */
export const DOCUMENT_TYPES = {
  DNI: 'dni',
  PASSPORT: 'passport',
  RUC: 'ruc',
  CE: 'ce',
  LICENSE: 'license',
  CERTIFICATE: 'certificate',
  CONTRACT: 'contract',
  INSURANCE: 'insurance'
};

/**
 * Types of contact information
 * @constant {Object} CONTACT_TYPES
 * @property {string} MAIN - Main contact
 * @property {string} BILLING - Billing contact
 * @property {string} EMERGENCY - Emergency contact
 * @property {string} OPERATIONS - Operations contact
 * @property {string} COORDINATOR - Coordinator contact
 * @property {string} MANAGEMENT - Management contact
 */
export const CONTACT_TYPES = {
  MAIN: 'main',
  BILLING: 'billing',
  EMERGENCY: 'emergency',
  OPERATIONS: 'operations',
  COORDINATOR: 'coordinator',
  MANAGEMENT: 'management'
};

/**
 * Service areas for feedback and ratings
 * @constant {Object} SERVICE_AREAS
 * @property {string} CUSTOMER_SERVICE - Customer service area
 * @property {string} OPERATIONS - Operations area
 * @property {string} PUNCTUALITY - Punctuality aspect
 * @property {string} COMMUNICATION - Communication aspect
 * @property {string} LOGISTICS - Logistics area
 * @property {string} SAFETY - Safety aspect
 */
export const SERVICE_AREAS = {
  CUSTOMER_SERVICE: 'customerService',
  OPERATIONS: 'operations',
  PUNCTUALITY: 'punctuality',
  COMMUNICATION: 'communication',
  LOGISTICS: 'logistics',
  SAFETY: 'safety'
};