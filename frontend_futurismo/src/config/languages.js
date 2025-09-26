// Configuración centralizada de idiomas disponibles en el sistema
// Este archivo facilita la migración al backend - solo cambiar el origen de datos

export const AVAILABLE_LANGUAGES = [
  // Idiomas más comunes
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  
  // Idiomas asiáticos
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  
  // Otros idiomas europeos
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  
  // Idiomas adicionales
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' }
];

// Función helper para obtener idioma por código
export const getLanguageByCode = (code) => {
  return AVAILABLE_LANGUAGES.find(lang => lang.code === code);
};

// Función helper para obtener múltiples idiomas por códigos
export const getLanguagesByCodes = (codes) => {
  return codes.map(code => getLanguageByCode(code)).filter(Boolean);
};

// Función para formatear lista de idiomas
export const formatLanguageList = (codes) => {
  const languages = getLanguagesByCodes(codes);
  return languages.map(lang => `${lang.flag} ${lang.name}`).join(', ');
};

// Para futura integración con backend
export const fetchLanguagesFromAPI = async () => {
  // TODO: Implementar cuando el backend esté listo
  // return await api.get('/languages');
  return AVAILABLE_LANGUAGES;
};