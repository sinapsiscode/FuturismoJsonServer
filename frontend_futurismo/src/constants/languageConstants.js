/**
 * Constantes para funcionalidades de idioma
 */

// Idiomas disponibles en la aplicación
export const AVAILABLE_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es-ES' },
  { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en-US' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', locale: 'pt-PT' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', locale: 'fr-FR' }
];

// Idioma por defecto
export const DEFAULT_LANGUAGE = 'es';

// Key para localStorage
export const LANGUAGE_STORAGE_KEY = 'preferredLanguage';

// Configuración de detección automática
export const LANGUAGE_DETECTION_CONFIG = {
  // Detectar desde navegador
  lookupFromNavigator: true,
  // Detectar desde localStorage
  lookupLocalStorage: LANGUAGE_STORAGE_KEY,
  // Detectar desde cookie
  lookupCookie: 'i18next',
  // Orden de detección
  order: ['localStorage', 'navigator', 'cookie'],
  // Cache user language
  caches: ['localStorage']
};

// Direcciones de texto por idioma
export const TEXT_DIRECTIONS = {
  es: 'ltr',
  en: 'ltr',
  pt: 'ltr',
  fr: 'ltr',
  ar: 'rtl', // Ejemplo para árabe
  he: 'rtl'  // Ejemplo para hebreo
};

// Formatos de fecha por idioma
export const DATE_LOCALE_FORMATS = {
  es: 'dd/MM/yyyy',
  en: 'MM/dd/yyyy',
  pt: 'dd/MM/yyyy',
  fr: 'dd/MM/yyyy'
};

// Configuración de momentjs/date-fns por idioma
export const LOCALE_CONFIG = {
  es: {
    firstDayOfWeek: 1, // Lunes
    weekendDays: [0, 6] // Domingo y Sábado
  },
  en: {
    firstDayOfWeek: 0, // Domingo
    weekendDays: [0, 6]
  },
  pt: {
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  },
  fr: {
    firstDayOfWeek: 1,
    weekendDays: [0, 6]
  }
};