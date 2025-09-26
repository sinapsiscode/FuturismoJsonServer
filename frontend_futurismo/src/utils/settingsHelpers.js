import { VALIDATION_PATTERNS, FORM_LIMITS, CURRENCIES, TIMEZONES, LANGUAGES, DATE_FORMATS, TIME_FORMATS, PRICE_RANGE_TYPES } from '../constants/settingsConstants';

// Currency options formatter
export const getCurrencyOptions = () => {
  return Object.entries(CURRENCIES).map(([key, value]) => ({
    value: value.value,
    label: `${key} (${value.symbol})`
  }));
};

// Timezone options formatter
export const getTimezoneOptions = () => {
  return Object.entries(TIMEZONES).map(([key, value]) => ({
    value: value.value,
    label: `${key} (${value.offset})`
  }));
};

// Language options formatter
export const getLanguageOptions = () => {
  return Object.entries(LANGUAGES).map(([key, value]) => ({
    value: value.value,
    label: value.name
  }));
};

// Date format options formatter
export const getDateFormatOptions = () => {
  return Object.values(DATE_FORMATS).map(format => ({
    value: format,
    label: format
  }));
};

// Time format options formatter
export const getTimeFormatOptions = () => {
  return [
    { value: TIME_FORMATS.H12, label: '12 horas (AM/PM)' },
    { value: TIME_FORMATS.H24, label: '24 horas' }
  ];
};

// Price range labels
export const getPriceRangeLabel = (range) => {
  const labels = {
    [PRICE_RANGE_TYPES.BUDGET]: 'Económico',
    [PRICE_RANGE_TYPES.STANDARD]: 'Estándar',
    [PRICE_RANGE_TYPES.PREMIUM]: 'Premium',
    [PRICE_RANGE_TYPES.LUXURY]: 'Lujo'
  };
  return labels[range] || range;
};

// Validation helpers
export const validateEmail = (email) => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

export const validatePhone = (phone) => {
  return VALIDATION_PATTERNS.PHONE.test(phone);
};

export const validateUrl = (url) => {
  return !url || VALIDATION_PATTERNS.URL.test(url);
};

export const validateCompanyName = (name) => {
  return name.trim().length >= FORM_LIMITS.COMPANY_NAME_MIN && 
         name.trim().length <= FORM_LIMITS.COMPANY_NAME_MAX;
};