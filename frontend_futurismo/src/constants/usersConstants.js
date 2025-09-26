// User status
export const USER_STATUS = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENCY: 'agency',
  GUIDE_PLANTA: 'guide-planta',
  GUIDE_FREELANCE: 'guide-freelance'
};

import { GUIDE_TYPES as SHARED_GUIDE_TYPES } from './sharedConstants';

// Legacy guide types for backward compatibility
// TODO: Migrate to English values from sharedConstants
export const GUIDE_TYPES = {
  PLANT: 'planta',
  FREELANCE: 'freelance'
};

// Departments - TODO: Move to i18n translations
export const DEPARTMENTS = [
  'users.departments.administration',
  'users.departments.operations',
  'users.departments.sales',
  'users.departments.finance',
  'users.departments.customerService',
  'users.departments.marketing',
  'users.departments.humanResources',
  'users.departments.it'
];

import { LANGUAGES as SHARED_LANGUAGES } from './sharedConstants';

// User module language list - TODO: Use shared languages
export const USER_LANGUAGES = SHARED_LANGUAGES
  .filter(lang => ['es', 'en', 'fr', 'pt', 'de', 'it', 'ja', 'zh'].includes(lang.code))
  .map(lang => lang.localKey);

// Specialties - TODO: Move to i18n translations
export const SPECIALTIES = [
  'users.specialties.history',
  'users.specialties.archaeology',
  'users.specialties.culture',
  'users.specialties.gastronomy',
  'users.specialties.nature',
  'users.specialties.adventure',
  'users.specialties.art',
  'users.specialties.photography',
  'users.specialties.ecotourism',
  'users.specialties.religion',
  'users.specialties.museums'
];

// Default permissions by role
export const DEFAULT_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'users.create', 'users.read', 'users.update', 'users.delete',
    'reservations.manage', 'guides.manage', 'reports.view', 'system.admin'
  ],
  [USER_ROLES.AGENCY]: [
    'reservations.create', 'reservations.read', 'reservations.update',
    'clients.manage', 'guides.read', 'reports.basic'
  ],
  [USER_ROLES.GUIDE_PLANTA]: [
    'reservations.read', 'guides.read', 'agenda.view', 'chat.access'
  ],
  [USER_ROLES.GUIDE_FREELANCE]: [
    'reservations.read', 'marketplace.view', 'agenda.view', 'chat.access'
  ]
};

// Form validation limits
export const FORM_LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 50,
  NAME_MIN: 2,
  NAME_MAX: 100,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 128,
  PHONE_MIN: 7,
  PHONE_MAX: 20,
  RUC_LENGTH: 11,
  ADDRESS_MAX: 200,
  POSITION_MAX: 100,
  COMPANY_MAX: 150
};

// Date format constants
export const DATE_FORMATS = {
  LOCALE: 'es-PE',
  DATE_TIME_FORMAT: {
    hour: '2-digit',
    minute: '2-digit'
  }
};

// Default values
export const DEFAULT_VALUES = {
  TEMPORARY_PASSWORD: 'temporal123',
  AVATAR_PLACEHOLDER: 'https://ui-avatars.com/api/?name=',
  CREDIT_LIMIT: 10000,
  EXPERIENCE_MIN: 0,
  EXPERIENCE_MAX: 50
};

import { VALIDATION_PATTERNS as SHARED_VALIDATION_PATTERNS } from './sharedConstants';

// Re-export validation patterns from shared constants
export const VALIDATION_PATTERNS = {
  USERNAME: SHARED_VALIDATION_PATTERNS.USERNAME,
  EMAIL: SHARED_VALIDATION_PATTERNS.EMAIL,
  PHONE: SHARED_VALIDATION_PATTERNS.PHONE,
  RUC: SHARED_VALIDATION_PATTERNS.RUC
};

// Tab configurations
export const USER_TABS = [
  { id: 'basic', name: 'Información Básica', icon: 'UserIcon' },
  { id: 'permissions', name: 'Permisos', icon: 'KeyIcon' }
];

// Role colors for badges
export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: 'red',
  [USER_ROLES.AGENCY]: 'blue',
  [USER_ROLES.GUIDE_PLANTA]: 'green',
  [USER_ROLES.GUIDE_FREELANCE]: 'teal'
};

// Status colors
export const STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: {
    bg: 'bg-green-100',
    text: 'text-green-800'
  },
  [USER_STATUS.INACTIVE]: {
    bg: 'bg-red-100',
    text: 'text-red-800'
  }
};

// Statistics card icons
export const STAT_ICONS = {
  TOTAL: { letter: '', color: 'blue' },
  ADMIN: { letter: 'A', color: 'red' },
  AGENCY: { letter: 'Ag', color: 'blue' },
  GUIDE: { letter: 'G', color: 'green' }
};

// Default user preferences
export const DEFAULT_PREFERENCES = {
  language: 'es',
  timezone: 'America/Lima',
  notifications: {
    email: true,
    push: true,
    sms: false
  }
};