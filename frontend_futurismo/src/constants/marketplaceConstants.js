import { LANGUAGES as SHARED_LANGUAGES } from './sharedConstants';

// Marketplace-specific language format
export const LANGUAGES = SHARED_LANGUAGES.map(lang => ({
  code: lang.code,
  name: `marketplace.filters.languages.${lang.name.toLowerCase()}`
}));

export const SORT_OPTIONS = [
  { value: 'rating', label: 'marketplace.search.sort.rating' },
  { value: 'price', label: 'marketplace.search.sort.price' },
  { value: 'experience', label: 'marketplace.search.sort.experience' },
  { value: 'reviews', label: 'marketplace.search.sort.reviews' }
];

export const TOUR_TYPE_ICONS = {
  cultural: 'BuildingLibraryIcon',
  aventura: 'GlobeAltIcon',
  gastronomico: 'CakeIcon',
  mistico: 'SparklesIcon',
  fotografico: 'CameraIcon'
};

export const WORK_ZONE_NAMES = {
  'cusco-ciudad': 'marketplace.zones.cusco-city',
  'valle-sagrado': 'marketplace.zones.sacred-valley',
  'machu-picchu': 'marketplace.zones.machu-picchu',
  'sur-valle': 'marketplace.zones.south-valley',
  'otros': 'marketplace.zones.others'
};

export const DEFAULT_FILTERS = {
  languages: [],
  tourTypes: [],
  workZones: [],
  groupTypes: [],
  priceRange: { min: 0, max: 500 },
  rating: 0,
  availability: null,
  instantBooking: false,
  verified: false
};

export const RATING_OPTIONS = [5, 4, 3, 2, 1];

export const PRICE_RANGE_CONFIG = {
  min: { min: 0, max: 200, step: 10 },
  max: { min: 0, max: 500, step: 10 }
};

export const FILTER_SECTIONS = {
  languages: true,
  tourTypes: true,
  workZones: true,
  groupTypes: false,
  price: false,
  rating: true,
  availability: false
};

// Zonas de trabajo completas
export const WORK_ZONES = [
  { id: 'cusco-ciudad', name: 'Cusco Ciudad', description: 'Centro histórico y alrededores' },
  { id: 'valle-sagrado', name: 'Valle Sagrado', description: 'Pisac, Ollantaytambo, Chinchero' },
  { id: 'machu-picchu', name: 'Machu Picchu', description: 'Ciudadela y Huayna Picchu' },
  { id: 'sur-valle', name: 'Sur del Valle', description: 'Tipón, Pikillaqta, Andahuaylillas' },
  { id: 'otros', name: 'Otros destinos', description: 'Otros lugares turísticos' }
];

// Tipos de tours con iconos
export const TOUR_TYPES = [
  { id: 'cultural', name: 'Cultural', icon: '🏛️' },
  { id: 'aventura', name: 'Aventura', icon: '🏔️' },
  { id: 'gastronomico', name: 'Gastronómico', icon: '🍽️' },
  { id: 'mistico', name: 'Místico', icon: '🔮' },
  { id: 'fotografico', name: 'Fotográfico', icon: '📸' }
];

// Tipos de grupos
export const GROUP_TYPES = [
  { id: 'children', name: 'Niños', description: 'Grupos escolares y familiares con niños' },
  { id: 'schools', name: 'Colegios', description: 'Visitas educativas' },
  { id: 'elderly', name: 'Adultos mayores', description: 'Grupos de tercera edad' },
  { id: 'corporate', name: 'Corporativo', description: 'Viajes de empresa' },
  { id: 'vip', name: 'VIP', description: 'Clientes exclusivos' },
  { id: 'specialNeeds', name: 'Necesidades especiales', description: 'Grupos con requerimientos especiales' }
];

// Niveles de idioma
export const LANGUAGE_LEVELS = {
  NATIVE: 'nativo',
  ADVANCED: 'avanzado',
  INTERMEDIATE: 'intermedio',
  BASIC: 'basico'
};

// Niveles de experiencia
export const EXPERIENCE_LEVELS = {
  EXPERT: 'experto',
  INTERMEDIATE: 'intermedio',
  BASIC: 'basico'
};

// Días de la semana
export const WORKING_DAYS = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

// Configuración de precios por defecto
export const DEFAULT_PRICING = {
  HOURLY_RATE: 30,
  FULL_DAY_RATE: 200,
  HALF_DAY_RATE: 120,
  VIP_RATE: 50,
  CHILDREN_RATE: 25
};

// Configuración de disponibilidad
export const AVAILABILITY_CONFIG = {
  DEFAULT_ADVANCE_BOOKING_DAYS: 2,
  MAX_GROUP_SIZE: 20,
  DEFAULT_WORKING_DAYS: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
};

// Configuración de ratings
export const RATING_CATEGORIES = {
  OVERALL: 'overall',
  COMMUNICATION: 'communication',
  KNOWLEDGE: 'knowledge',
  PUNCTUALITY: 'punctuality',
  PROFESSIONALISM: 'professionalism',
  VALUE_FOR_MONEY: 'valueForMoney'
};

// Valores por defecto para ratings
export const DEFAULT_RATINGS = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  INITIAL_RATING: 0
};

// Tiempos de respuesta (minutos)
export const RESPONSE_TIME_CONFIG = {
  EXCELLENT: 30,
  GOOD: 60,
  AVERAGE: 120,
  SLOW: 240
};

// Tasas de aceptación (porcentaje)
export const ACCEPTANCE_RATE_CONFIG = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  LOW: 40
};

// URLs de avatar por defecto
export const AVATAR_CONFIG = {
  BASE_URL: 'https://ui-avatars.com/api/',
  DEFAULT_PARAMS: {
    BACKGROUND: '0D8ABC',
    COLOR: 'fff'
  }
};

// Certificaciones comunes
export const COMMON_CERTIFICATIONS = {
  OFFICIAL_GUIDE: 'Guía Oficial de Turismo',
  FIRST_AID: 'Primeros Auxilios',
  LANGUAGE_CERT: 'Certificación de Idioma',
  SPECIALIZED_TOUR: 'Tour Especializado'
};

// Estados del marketplace
export const MARKETPLACE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING_APPROVAL: 'pending_approval'
};

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  NO_GUIDES_FOUND: 'No se encontraron guías con los filtros seleccionados',
  LOADING_GUIDES: 'Cargando guías...',
  ERROR_LOADING: 'Error al cargar los guías. Por favor intenta nuevamente.',
  GUIDE_NOT_FOUND: 'Guía no encontrado',
  INVALID_FILTER: 'Filtro inválido'
};

// Tiempos de simulación (ms)
export const API_DELAYS = {
  LOAD_GUIDES: 1000,
  LOAD_GUIDE_DETAIL: 500,
  UPDATE_FILTERS: 300
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48]
};

// Vistas del marketplace
export const MARKETPLACE_VIEWS = {
  GRID: 'grid',
  LIST: 'list'
};

// Valores de stats por defecto
export const DEFAULT_STATS = {
  totalBookings: 0,
  completedServices: 0,
  cancelledServices: 0,
  responseTime: 0,
  acceptanceRate: 0,
  repeatClients: 0,
  totalEarnings: 0
};