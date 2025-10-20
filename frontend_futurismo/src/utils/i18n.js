import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar directamente las traducciones
import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';

const detectLanguage = () => {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'es' ? 'es' : 'en';
};

const resources = {
  es: { translation: esTranslations },
  en: { translation: enTranslations }
};

// Limpiar caché viejo SOLO SI EXISTE
try {
  const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('i18next'));
  if (cacheKeys.length > 0) {
    console.log('🗑️ Limpiando caché i18next antiguo...', cacheKeys);
    cacheKeys.forEach(key => localStorage.removeItem(key));
  }
} catch (error) {
  console.warn('No se pudo limpiar el caché:', error);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['navigator'],
      caches: []
    },
    debug: true, // Activar modo debug temporalmente
    react: {
      useSuspense: false
    }
  })
  .then(() => {
    console.log('✅ i18n inicializado correctamente');
    console.log('📍 Idioma detectado:', i18n.language);
    console.log('🔍 Traducción de navigation.clients:', i18n.t('navigation.clients'));
  })
  .catch((error) => {
    console.error('❌ Error al inicializar i18n:', error);
  });

export default i18n;
