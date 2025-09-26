export const PROVIDER_CATEGORIES = {
  TRANSPORT: 'transport',
  ACCOMMODATION: 'accommodation',
  RESTAURANT: 'restaurant',
  ACTIVITY: 'activity',
  GUIDE: 'guide',
  EQUIPMENT: 'equipment',
  OTHER: 'other'
};

export const PRICING_TYPES = {
  PER_PERSON: 'per_person',
  PER_GROUP: 'per_group',
  PER_HOUR: 'per_hour',
  PER_DAY: 'per_day',
  FIXED: 'fixed'
};

import { CURRENCIES as SHARED_CURRENCIES } from './sharedConstants';

// Re-export currencies from shared constants (values only)
export const CURRENCIES = {
  PEN: SHARED_CURRENCIES.PEN.value,
  USD: SHARED_CURRENCIES.USD.value,
  EUR: SHARED_CURRENCIES.EUR.value
};

export const PROVIDER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended'
};

export const ASSIGNMENT_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const TIME_SLOTS = {
  DEFAULT_START: '09:00',
  DEFAULT_END: '10:00'
};

export const RATING_RANGE = {
  MIN: 0,
  MAX: 5,
  DEFAULT: 4.0
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'common.validation.required',
  INVALID_EMAIL: 'common.validation.invalidEmail',
  POSITIVE_NUMBER: 'common.validation.positiveNumber',
  MIN_VALUE: 'common.validation.minValue',
  MAX_VALUE: 'common.validation.maxValue'
};

export const DEFAULT_LOCATION_TREE = {
  LIMA: {
    id: 'lima',
    name: 'providers.locations.lima',
    children: {
      MIRAFLORES: { id: 'lima_miraflores', name: 'providers.locations.lima.miraflores' },
      BARRANCO: { id: 'lima_barranco', name: 'providers.locations.lima.barranco' },
      SAN_ISIDRO: { id: 'lima_san_isidro', name: 'providers.locations.lima.sanIsidro' },
      CENTRO: { id: 'lima_centro', name: 'providers.locations.lima.centro' }
    }
  },
  CUSCO: {
    id: 'cusco',
    name: 'providers.locations.cusco',
    children: {
      CIUDAD: { id: 'cusco_ciudad', name: 'providers.locations.cusco.ciudad' },
      VALLE_SAGRADO: { id: 'cusco_valle', name: 'providers.locations.cusco.valleSagrado' },
      MACHU_PICCHU: { id: 'cusco_machupicchu', name: 'providers.locations.cusco.machuPicchu' }
    }
  },
  ICA: {
    id: 'ica',
    name: 'providers.locations.ica',
    children: {
      CIUDAD: { id: 'ica_ciudad', name: 'providers.locations.ica.ciudad' },
      PARACAS: { id: 'ica_paracas', name: 'providers.locations.ica.paracas' },
      NAZCA: { id: 'ica_nazca', name: 'providers.locations.ica.nazca' }
    }
  }
};

import { LANGUAGES as SHARED_LANGUAGES } from './sharedConstants';

// Provider-specific language format
export const DEFAULT_LANGUAGES = SHARED_LANGUAGES
  .filter(lang => ['es', 'en', 'fr', 'de', 'it', 'pt', 'ja', 'zh'].includes(lang.code))
  .map(lang => ({
    code: lang.code,
    name: `providers.languages.${lang.name.toLowerCase()}`
  }));

export const SERVICE_TYPES = {
  TRANSPORT: [
    'providers.services.transport.bus',
    'providers.services.transport.van',
    'providers.services.transport.car',
    'providers.services.transport.boat'
  ],
  ACCOMMODATION: [
    'providers.services.accommodation.hotel',
    'providers.services.accommodation.hostel',
    'providers.services.accommodation.lodge',
    'providers.services.accommodation.camping'
  ],
  RESTAURANT: [
    'providers.services.restaurant.breakfast',
    'providers.services.restaurant.lunch',
    'providers.services.restaurant.dinner',
    'providers.services.restaurant.snacks'
  ],
  ACTIVITY: [
    'providers.services.activity.trekking',
    'providers.services.activity.rafting',
    'providers.services.activity.zipline',
    'providers.services.activity.cultural'
  ]
};