/**
 * Script Completo - Generar TODOS los archivos de compatibilidad (24 archivos)
 *
 * Este script crea todos los archivos de compatibilidad necesarios
 * para mantener funcionando los imports del frontend.
 */

const fs = require('fs');
const path = require('path');

const CONSTANTS_DIR = path.join(__dirname, 'frontend_futurismo', 'src', 'constants');

// Asegurar que el directorio existe
if (!fs.existsSync(CONSTANTS_DIR)) {
  fs.mkdirSync(CONSTANTS_DIR, { recursive: true });
}

// Plantilla base para archivos de compatibilidad
const createCompatibilityFile = (moduleName, configName, exports) => {
  return `/**
 * COMPATIBILITY LAYER - ${moduleName}
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a use${configName}Config() para uso en componentes React.
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

// Export default para compatibilidad
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

// Definiciones de TODOS los módulos (24 archivos)
const modules = {
  // === YA CREADOS (9) ===

  profile: {
    configName: 'Profile',
    exports: `
export const PAYMENT_METHOD_TYPES = (() => {
  const config = getProfileConfig();
  return config.paymentMethodTypes || [];
})();

export const ACCOUNT_TYPES = (() => {
  const config = getProfileConfig();
  return config.accountTypes || [];
})();

export const CARD_TYPES = (() => {
  const config = getProfileConfig();
  return config.cardTypes || [];
})();

export const DOCUMENT_TYPES = (() => {
  const config = getProfileConfig();
  return config.documentTypes || [];
})();

export const DOCUMENT_STATUS = (() => {
  const config = getProfileConfig();
  return config.documentStatus || [];
})();

export const MAX_FILE_SIZE = (() => {
  const config = getProfileConfig();
  return config.maxFileSize || 5242880;
})();

export const ACCEPTED_FILE_TYPES = (() => {
  const config = getProfileConfig();
  return config.acceptedFileTypes || {};
})();

export const RATING_LEVELS = (() => {
  const config = getProfileConfig();
  return config.ratingLevels || [];
})();

export const CONTACT_TYPES = (() => {
  const config = getProfileConfig();
  return config.contactTypes || [];
})();
`
  },

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

export const GUIDE_STATUS = (() => {
  const config = getGuidesConfig();
  return config.guideStatus || [];
})();
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

export const GUIDE_TYPES = (() => {
  const config = getAuthConfig();
  return config.guideTypes || [];
})();

export const DEPARTMENTS = [
  { value: 'cusco', label: 'Cusco' },
  { value: 'lima', label: 'Lima' },
  { value: 'arequipa', label: 'Arequipa' }
];
`
  },

  // === NUEVOS POR CREAR (15) ===

  agency: {
    configName: 'Agencies',
    exports: `
export const AGENCY_TYPES = (() => {
  const config = getAgenciesConfig();
  return config.agencyTypes || [];
})();

export const AGENCY_STATUS = (() => {
  const config = getAgenciesConfig();
  return config.agencyStatus || [];
})();

export const BUSINESS_CATEGORIES = (() => {
  const config = getAgenciesConfig();
  return config.businessCategories || [];
})();

export const SERVICE_AREAS = (() => {
  const config = getAgenciesConfig();
  return config.serviceAreas || [];
})();
`
  },

  auth: {
    configName: 'Auth',
    exports: `
export const USER_ROLES = (() => {
  const config = getAuthConfig();
  return config.userRoles || [];
})();

export const GUIDE_TYPES = (() => {
  const config = getAuthConfig();
  return config.guideTypes || [];
})();

export const USER_STATUS = (() => {
  const config = getAuthConfig();
  return config.userStatus || [];
})();

export const AUTH_STATES = (() => {
  const config = getAuthConfig();
  return config.authStates || ['idle', 'loading', 'authenticated', 'unauthenticated', 'error'];
})();

export const SESSION_CONFIG = (() => {
  const config = getAuthConfig();
  return config.sessionConfig || {};
})();
`
  },

  calendar: {
    configName: 'Calendar',
    exports: `
export const VIEW_OPTIONS = [
  { value: 'month', label: 'Mes' },
  { value: 'week', label: 'Semana' },
  { value: 'day', label: 'Día' }
];

export const EVENT_TYPES = (() => {
  const config = getCalendarConfig();
  return config.eventTypes || [];
})();

export const EVENT_STATUS = (() => {
  const config = getCalendarConfig();
  return config.eventStatus || [];
})();

export const TIME_SLOTS = (() => {
  const config = getCalendarConfig();
  return config.timeSlots || [];
})();

export const DEFAULT_EVENT_DURATION = 60;

export const CALENDAR_COLORS = (() => {
  const config = getCalendarConfig();
  return config.calendarColors || {};
})();
`
  },

  clients: {
    configName: 'Clients',
    exports: `
export const CLIENT_TYPES = (() => {
  const config = getClientsConfig();
  return config.clientTypes || [];
})();

export const CLIENT_STATUS = (() => {
  const config = getClientsConfig();
  return config.clientStatus || [];
})();

export const NATIONALITY_OPTIONS = (() => {
  const config = getClientsConfig();
  return config.nationalities || [];
})();

export const IDENTIFICATION_TYPES = (() => {
  const config = getClientsConfig();
  return config.identificationTypes || [];
})();
`
  },

  drivers: {
    configName: 'Drivers',
    exports: `
export const DRIVER_STATUS = (() => {
  const config = getDriversConfig();
  return config.driverStatus || [];
})();

export const LICENSE_TYPES = (() => {
  const config = getDriversConfig();
  return config.licenseTypes || [];
})();

export const EMPLOYMENT_TYPES = (() => {
  const config = getDriversConfig();
  return config.employmentTypes || [];
})();

export const VEHICLE_CATEGORIES = (() => {
  const config = getDriversConfig();
  return config.vehicleCategories || [];
})();
`
  },

  emergency: {
    configName: 'Emergency',
    exports: `
export const EMERGENCY_TYPES = (() => {
  const config = getEmergencyConfig();
  return config.emergencyTypes || [];
})();

export const SEVERITY_LEVELS = (() => {
  const config = getEmergencyConfig();
  return config.severityLevels || [];
})();

export const PROTOCOL_CATEGORIES = (() => {
  const config = getEmergencyConfig();
  return config.protocolCategories || [];
})();

export const EMERGENCY_CONTACTS = (() => {
  const config = getEmergencyConfig();
  return config.emergencyContacts || [];
})();

export const RESPONSE_STATUS = (() => {
  const config = getEmergencyConfig();
  return config.responseStatus || [];
})();
`
  },

  eventForm: {
    configName: 'Calendar',
    exports: `
export const EVENT_PRIORITIES = (() => {
  const config = getCalendarConfig();
  return config.eventPriorities || [];
})();

export const EVENT_VISIBILITY = (() => {
  const config = getCalendarConfig();
  return config.eventVisibility || [];
})();

export const EVENT_REMINDERS = (() => {
  const config = getCalendarConfig();
  return config.eventReminders || [];
})();

export const RECURRENCE_PATTERNS = (() => {
  const config = getCalendarConfig();
  return config.recurrencePatterns || [];
})();

export const DEFAULT_EVENT_TIMES = (() => {
  const config = getCalendarConfig();
  return config.defaultEventTimes || { start: '09:00', end: '17:00' };
})();
`
  },

  guideAvailability: {
    configName: 'Calendar',
    exports: `
export const SLOT_STATUS = (() => {
  const config = getCalendarConfig();
  return config.slotStatus || [];
})();

export const TIME_SLOT_CONFIG = (() => {
  const config = getCalendarConfig();
  return config.timeSlotConfig || {};
})();

export const DISPLAY_LIMITS = (() => {
  const config = getCalendarConfig();
  return config.displayLimits || { maxDays: 30 };
})();

export const DATE_NAVIGATION = (() => {
  const config = getCalendarConfig();
  return config.dateNavigation || {};
})();
`
  },

  monthView: {
    configName: 'Calendar',
    exports: `
export const MONTH_VIEW_CONFIG = (() => {
  const config = getCalendarConfig();
  return config.monthViewConfig || {};
})();

export const HOVER_CONFIG = (() => {
  const config = getCalendarConfig();
  return config.hoverConfig || {};
})();

export const EVENT_COLORS = (() => {
  const config = getCalendarConfig();
  return config.eventColors || {};
})();

export const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
`
  },

  reservationFilters: {
    configName: 'Reservations',
    exports: `
export const DEFAULT_FILTER_VALUES = (() => {
  const config = getReservationsConfig();
  return config.defaultFilterValues || {};
})();

export const FILTER_LIMITS = (() => {
  const config = getReservationsConfig();
  return config.filterLimits || {};
})();

export const PAGINATION_CONFIG = (() => {
  const config = getReservationsConfig();
  return config.paginationConfig || { defaultPageSize: 10 };
})();
`
  },

  reservations: {
    configName: 'Reservations',
    exports: `
export const RESERVATION_STATUS = (() => {
  const config = getReservationsConfig();
  return config.reservationStatus || [];
})();

export const PAYMENT_STATUS = (() => {
  const config = getReservationsConfig();
  return config.paymentStatus || [];
})();

export const PAYMENT_METHODS = (() => {
  const config = getReservationsConfig();
  return config.paymentMethods || [];
})();

export const BOOKING_TYPES = (() => {
  const config = getReservationsConfig();
  return config.bookingTypes || [];
})();

export const CANCELLATION_REASONS = (() => {
  const config = getReservationsConfig();
  return config.cancellationReasons || [];
})();
`
  },

  rewards: {
    configName: 'Rewards',
    exports: `
export const SERVICE_POINTS = (() => {
  const config = getRewardsConfig();
  return config.servicePoints || {};
})();

export const REWARD_CATEGORIES = (() => {
  const config = getRewardsConfig();
  return config.rewardCategories || [];
})();

export const REDEMPTION_STATUS = (() => {
  const config = getRewardsConfig();
  return config.redemptionStatus || [];
})();

export const POINTS_LIMITS = (() => {
  const config = getRewardsConfig();
  return config.pointsLimits || {};
})();

export const TIER_LEVELS = (() => {
  const config = getRewardsConfig();
  return config.tierLevels || [];
})();
`
  },

  upload: {
    configName: 'Upload',
    exports: `
export const ALLOWED_FILE_TYPES = (() => {
  const config = getUploadConfig();
  return config.allowedFileTypes || {};
})();

export const MAX_FILE_SIZE = (() => {
  const config = getUploadConfig();
  return config.maxFileSize || 5242880;
})();

export const MAX_TOTAL_SIZE = (() => {
  const config = getUploadConfig();
  return config.maxTotalSize || 52428800;
})();

export const UPLOAD_CATEGORIES = (() => {
  const config = getUploadConfig();
  return config.uploadCategories || [];
})();

export const IMAGE_CONSTRAINTS = (() => {
  const config = getUploadConfig();
  return config.imageConstraints || {};
})();
`
  },

  vehicles: {
    configName: 'Vehicles',
    exports: `
export const VEHICLE_TYPES = (() => {
  const config = getVehiclesConfig();
  return config.vehicleTypes || [];
})();

export const VEHICLE_STATUS = (() => {
  const config = getVehiclesConfig();
  return config.vehicleStatus || [];
})();

export const FUEL_TYPES = (() => {
  const config = getVehiclesConfig();
  return config.fuelTypes || [];
})();

export const CAPACITY_RANGES = (() => {
  const config = getVehiclesConfig();
  return config.capacityRanges || [];
})();

export const MAINTENANCE_TYPES = (() => {
  const config = getVehiclesConfig();
  return config.maintenanceTypes || [];
})();
`
  },

  shared: {
    configName: 'System',
    exports: `
export const CURRENCIES = (() => {
  const config = getSystemConfig();
  return config.currencies || [];
})();

export const LANGUAGES = (() => {
  const config = getSystemConfig();
  return config.languages || [];
})();

export const GUIDE_TYPES = (() => {
  const config = getSystemConfig();
  return config.guideTypes || [];
})();

export const VALIDATION_PATTERNS = (() => {
  const config = getSystemConfig();
  return config.validationPatterns || {};
})();

export const STATUS_VALUES = (() => {
  const config = getSystemConfig();
  return config.statusValues || [];
})();

export const PRIORITY_LEVELS = (() => {
  const config = getSystemConfig();
  return config.priorityLevels || [];
})();

export const DATE_FORMATS = (() => {
  const config = getSystemConfig();
  return config.dateFormats || {};
})();

export const STATUS_COLORS = (() => {
  const config = getSystemConfig();
  return config.statusColors || {};
})();

export const PRIORITY_COLORS = (() => {
  const config = getSystemConfig();
  return config.priorityColors || {};
})();

export const TIME_CONSTANTS = (() => {
  const config = getSystemConfig();
  return config.timeConstants || {};
})();

export const PAGINATION_DEFAULTS = (() => {
  const config = getSystemConfig();
  return config.paginationDefaults || { pageSize: 10 };
})();

export const RATING_SCALE = (() => {
  const config = getSystemConfig();
  return config.ratingScale || { min: 1, max: 5 };
})();
`
  }
};

// Generar todos los archivos
console.log('🚀 Generando TODOS los archivos de compatibilidad (24 archivos)...\n');

let created = 0;
let skipped = 0;

Object.entries(modules).forEach(([moduleName, config]) => {
  const fileName = `${moduleName}Constants.js`;
  const filePath = path.join(CONSTANTS_DIR, fileName);

  const content = createCompatibilityFile(
    moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
    config.configName,
    config.exports
  );

  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Creado: ${fileName}`);
    created++;
  } catch (error) {
    console.log(`⚠️  Error al crear ${fileName}:`, error.message);
    skipped++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN');
console.log('='.repeat(60));
console.log(`✅ Archivos creados: ${created}/${Object.keys(modules).length}`);
if (skipped > 0) {
  console.log(`⚠️  Archivos con errores: ${skipped}`);
}
console.log('\n✨ Proceso completado!');
console.log('\n📝 Nota: Estos archivos son TEMPORALES.');
console.log('   Recomendado: Migrar componentes para usar hooks directamente.');
console.log('\n🎯 Próximo paso: Ejecutar la aplicación frontend y verificar que no hay errores de imports.\n');
