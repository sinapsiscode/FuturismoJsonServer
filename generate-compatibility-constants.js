/**
 * Script para generar archivos de compatibilidad de constantes
 *
 * Este script crea archivos en frontend_futurismo/src/constants/
 * que re-exportan constantes desde los hooks del backend,
 * manteniendo compatibilidad con código existente.
 */

const fs = require('fs');
const path = require('path');

const CONSTANTS_DIR = path.join(__dirname, 'frontend_futurismo', 'src', 'constants');

// Plantilla base para archivos de compatibilidad
const createCompatibilityFile = (moduleName, configName, exports) => {
  return `/**
 * COMPATIBILITY LAYER - ${moduleName}
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * RECOMENDADO: Migrar a use${configName}Config() para uso en componentes.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const get${configName}Config = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.${moduleName.toLowerCase()} || {};
};

${exports}

// Export default
export default {
${exports.split('\n')
  .filter(line => line.startsWith('export const'))
  .map(line => line.match(/export const (\w+)/)?.[1])
  .filter(Boolean)
  .map(name => `  ${name}`)
  .join(',\n')}
};
`;
};

// Definiciones de constantes por módulo
const modules = {
  feedback: {
    configName: 'Feedback',
    exports: `
export const SERVICE_AREAS = (() => {
  const config = getFeedbackConfig();
  return config.serviceAreas || [];
})();

export const STATUS_TYPES = (() => {
  const config = getFeedbackConfig();
  return config.statusTypes || [];
})();

export const FEEDBACK_TYPES = (() => {
  const config = getFeedbackConfig();
  return config.feedbackTypes || [];
})();

export const PRIORITY_LEVELS = (() => {
  const config = getFeedbackConfig();
  return config.priorityLevels || [];
})();

export const FEEDBACK_CATEGORIES = (() => {
  const config = getFeedbackConfig();
  return config.feedbackCategories || [];
})();
`
  },

  guides: {
    configName: 'Guides',
    exports: `
export const FORM_TABS = [
  { id: 'personal', label: 'Información Personal' },
  { id: 'languages', label: 'Idiomas' },
  { id: 'museums', label: 'Museos' }
];

export const LEVEL_OPTIONS = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
  { value: 'native', label: 'Nativo' }
];

export const GUIDE_TYPES = {
  PLANT: 'plant',
  FREELANCE: 'freelance'
};
`
  },

  marketplace: {
    configName: 'Marketplace',
    exports: `
export const LANGUAGES = (() => {
  const config = getMarketplaceConfig();
  return config.languages || [];
})();

export const SORT_OPTIONS = [
  { value: 'rating', label: 'Calificación' },
  { value: 'price', label: 'Precio' },
  { value: 'experience', label: 'Experiencia' }
];

export const PRICE_RANGE_CONFIG = (() => {
  const config = getMarketplaceConfig();
  return config.priceRangeConfig || { min: 0, max: 500 };
})();

export const RATING_OPTIONS = [
  { value: 5, label: '5 estrellas' },
  { value: 4, label: '4+ estrellas' },
  { value: 3, label: '3+ estrellas' }
];

export const WORK_ZONES = (() => {
  const config = getMarketplaceConfig();
  return config.workZones || [];
})();

export const TOUR_TYPES = (() => {
  const config = getMarketplaceConfig();
  return config.tourTypes || [];
})();
`
  },

  monitoring: {
    configName: 'Monitoring',
    exports: `
export const GUIDE_STATUS = (() => {
  const config = getMonitoringConfig();
  return config.guideStatus || [];
})();

export const TOUR_STATUS = (() => {
  const config = getMonitoringConfig();
  return config.tourStatus || [];
})();

export const TABS = [
  { id: 'map', label: 'Mapa', icon: '🗺️' },
  { id: 'info', label: 'Información', icon: 'ℹ️' },
  { id: 'chat', label: 'Chat', icon: '💬' }
];

export const PROGRESS_CIRCLE = {
  size: 120,
  strokeWidth: 8
};

export const MAP_MOBILE_HEIGHT = '400px';

export const MAX_PHOTOS_PER_STOP = 5;
`
  },

  providers: {
    configName: 'Providers',
    exports: `
export const PROVIDER_CATEGORIES = (() => {
  const config = getProvidersConfig();
  return config.providerCategories || [];
})();

export const PRICING_TYPES = (() => {
  const config = getProvidersConfig();
  return config.pricingTypes || [];
})();

export const CURRENCIES = (() => {
  const config = getProvidersConfig();
  return config.currencies || [];
})();

export const SERVICE_TYPES = (() => {
  const config = getProvidersConfig();
  return config.serviceTypes || {};
})();

export const RATING_RANGE = (() => {
  const config = getProvidersConfig();
  return config.ratingRange || { min: 1, max: 5 };
})();
`
  },

  ratings: {
    configName: 'Ratings',
    exports: `
export const FEEDBACK_TYPES = [
  { value: 'positive', label: 'Positivo' },
  { value: 'negative', label: 'Negativo' },
  { value: 'suggestion', label: 'Sugerencia' }
];

export const RATING_STEPS = [
  { id: 1, title: 'Calificación General' },
  { id: 2, title: 'Detalles' },
  { id: 3, title: 'Comentarios' }
];

export const UI_DELAYS = {
  toast: 3000,
  transition: 300
};

export const TOURIST_RATING_VALUES = [1, 2, 3, 4, 5];

export const RATING_ASPECTS = (() => {
  const config = getRatingsConfig();
  return config.ratingAspects || [];
})();

export const EVALUATION_CRITERIA = (() => {
  const config = getRatingsConfig();
  return config.evaluationCriteria || [];
})();
`
  },

  settings: {
    configName: 'Settings',
    exports: `
export const VALIDATION_PATTERNS = {
  email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
  phone: /^9\\d{8}$/,
  url: /^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$/
};

export const FORM_LIMITS = {
  maxLength: 255,
  minLength: 3
};

export const NOTIFICATION_CHANNELS = (() => {
  const config = getSettingsConfig();
  return config.notificationChannels || [];
})();

export const NOTIFICATION_TYPES = (() => {
  const config = getSettingsConfig();
  return config.notificationTypes || [];
})();

export const CHANNEL_COLORS = {
  email: 'blue',
  sms: 'green',
  push: 'purple',
  whatsapp: 'green'
};

export const TOUR_LIMITS = (() => {
  const config = getSettingsConfig();
  return config.tourLimits || {};
})();

export const DEFAULT_VALUES = {
  maxParticipants: 20,
  duration: 4
};
`
  },

  users: {
    configName: 'Auth',
    exports: `
export const USER_STATUS = (() => {
  const config = getAuthConfig();
  return config.userStatus || [];
})();

export const USER_ROLES = (() => {
  const config = getAuthConfig();
  return config.userRoles || [];
})();

export const DEPARTMENTS = [
  { value: 'cusco', label: 'Cusco' },
  { value: 'lima', label: 'Lima' },
  { value: 'arequipa', label: 'Arequipa' }
];
`
  }
};

// Generar archivos
console.log('🚀 Generando archivos de compatibilidad...\n');

Object.entries(modules).forEach(([moduleName, config]) => {
  const fileName = `${moduleName}Constants.js`;
  const filePath = path.join(CONSTANTS_DIR, fileName);

  const content = createCompatibilityFile(
    moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
    config.configName,
    config.exports
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Creado: ${fileName}`);
});

console.log('\n✨ Archivos de compatibilidad generados exitosamente!');
console.log('\n📝 Nota: Estos archivos son temporales.');
console.log('   Recomendado: Migrar componentes para usar hooks directamente.\n');
