export const PAYMENT_METHOD_TYPES = {
  BANK_ACCOUNT: 'bank_account',
  CREDIT_CARD: 'credit_card'
};

export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CTS: 'cts'
};

import { CURRENCIES as SHARED_CURRENCIES } from './sharedConstants';

// Re-export currencies from shared constants (values only)
export const CURRENCIES = {
  PEN: SHARED_CURRENCIES.PEN.value,
  USD: SHARED_CURRENCIES.USD.value,
  EUR: SHARED_CURRENCIES.EUR.value
};

export const CARD_TYPES = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMEX: 'amex'
};

import { DOCUMENT_TYPES as SHARED_DOCUMENT_TYPES } from './sharedConstants';

// Profile-specific document types
export const PROFILE_DOCUMENT_TYPES = {
  RUC: SHARED_DOCUMENT_TYPES.RUC,
  DNI: SHARED_DOCUMENT_TYPES.DNI,
  LICENSE: SHARED_DOCUMENT_TYPES.LICENSE,
  CERTIFICATE: SHARED_DOCUMENT_TYPES.CERTIFICATE,
  CONTRACT: SHARED_DOCUMENT_TYPES.CONTRACT,
  INSURANCE: SHARED_DOCUMENT_TYPES.INSURANCE
};

export const DOCUMENT_STATUS = {
  VALID: 'valid',
  EXPIRED: 'expired',
  PENDING: 'pending',
  REJECTED: 'rejected'
};

export const FEEDBACK_CATEGORIES = {
  SERVICE: 'service',
  GUIDES: 'guides',
  TRANSPORT: 'transport',
  ACCOMMODATION: 'accommodation',
  COMMUNICATION: 'communication',
  OTHER: 'other'
};

export const RATING_LEVELS = {
  EXCELLENT: 5,
  VERY_GOOD: 4,
  GOOD: 3,
  REGULAR: 2,
  BAD: 1
};

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

import { CONTACT_TYPES as SHARED_CONTACT_TYPES } from './sharedConstants';

// Re-export contact types from shared constants
export const CONTACT_TYPES = {
  MAIN: SHARED_CONTACT_TYPES.MAIN,
  BILLING: SHARED_CONTACT_TYPES.BILLING,
  EMERGENCY: SHARED_CONTACT_TYPES.EMERGENCY,
  OPERATIONS: SHARED_CONTACT_TYPES.OPERATIONS
};

export const CARD_NUMBER_MASK_PATTERN = /(\d{4})(\d+)(\d{4})/;

export const DATE_FORMATS = {
  EXPIRY: 'MM/YYYY',
  DOCUMENT: 'DD/MM/YYYY'
};

import { FILE_SIZE_LIMITS } from './sharedConstants';

// Re-export file size limit from shared constants
export const MAX_FILE_SIZE = FILE_SIZE_LIMITS.IMAGE;

import { ACCEPTED_FILE_TYPES as SHARED_FILE_TYPES } from './sharedConstants';

// Profile-specific accepted file types
export const ACCEPTED_FILE_TYPES = {
  documents: SHARED_FILE_TYPES.ALL,
  images: SHARED_FILE_TYPES.IMAGES
};