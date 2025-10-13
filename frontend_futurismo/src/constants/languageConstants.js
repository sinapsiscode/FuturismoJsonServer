/**
 * COMPATIBILITY LAYER - Language
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useLanguageConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getLanguageConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.language || {};
};


// Idiomas disponibles en la aplicación
export const AVAILABLE_LANGUAGES = (() => {
  const config = getLanguageConfig();
  return config.availableLanguages || [
    { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es-ES' },
    { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en-US' },
    { code: 'pt', name: 'Português', flag: '🇵🇹', locale: 'pt-PT' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', locale: 'fr-FR' }
  ];
})();

// Idioma por defecto
export const DEFAULT_LANGUAGE = (() => {
  const config = getLanguageConfig();
  return config.defaultLanguage || 'es';
})();

// Key para localStorage
export const LANGUAGE_STORAGE_KEY = (() => {
  const config = getLanguageConfig();
  return config.languageStorageKey || 'preferredLanguage';
})();

// Configuración de detección automática
export const LANGUAGE_DETECTION_CONFIG = (() => {
  const config = getLanguageConfig();
  const storageKey = LANGUAGE_STORAGE_KEY;
  return config.languageDetectionConfig || {
    // Detectar desde navegador
    lookupFromNavigator: true,
    // Detectar desde localStorage
    lookupLocalStorage: storageKey,
    // Detectar desde cookie
    lookupCookie: 'i18next',
    // Orden de detección
    order: ['localStorage', 'navigator', 'cookie'],
    // Cache user language
    caches: ['localStorage']
  };
})();

// Direcciones de texto por idioma
export const TEXT_DIRECTIONS = (() => {
  const config = getLanguageConfig();
  return config.textDirections || {
    es: 'ltr',
    en: 'ltr',
    pt: 'ltr',
    fr: 'ltr',
    ar: 'rtl', // Ejemplo para árabe
    he: 'rtl'  // Ejemplo para hebreo
  };
})();

// Formatos de fecha por idioma
export const DATE_LOCALE_FORMATS = (() => {
  const config = getLanguageConfig();
  return config.dateLocaleFormats || {
    es: 'dd/MM/yyyy',
    en: 'MM/dd/yyyy',
    pt: 'dd/MM/yyyy',
    fr: 'dd/MM/yyyy'
  };
})();

// Configuración de momentjs/date-fns por idioma
export const LOCALE_CONFIG = (() => {
  const config = getLanguageConfig();
  return config.localeConfig || {
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
})();

// Export default para compatibilidad
export default {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGE_DETECTION_CONFIG,
  TEXT_DIRECTIONS,
  DATE_LOCALE_FORMATS,
  LOCALE_CONFIG
};
