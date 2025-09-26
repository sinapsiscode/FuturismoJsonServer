import { 
  PROVIDER_CATEGORIES, 
  PRICING_TYPES, 
  CURRENCIES,
  PROVIDER_STATUS,
  ASSIGNMENT_STATUS 
} from '../constants/providersConstants';

export const getMockProviders = () => [
  {
    id: 'prov_1',
    name: 'providers.mock.transport.name1',
    category: PROVIDER_CATEGORIES.TRANSPORT,
    location: 'lima_miraflores',
    status: PROVIDER_STATUS.ACTIVE,
    contact: {
      contactPerson: 'providers.mock.transport.contact1',
      phone: '+51 999 888 777',
      email: 'transport1@example.com',
      address: 'providers.mock.transport.address1'
    },
    services: ['providers.services.transport.bus', 'providers.services.transport.van'],
    pricing: {
      basePrice: 150,
      type: PRICING_TYPES.PER_GROUP,
      currency: CURRENCIES.PEN
    },
    rating: 4.5,
    capacity: 20,
    specialties: [],
    languages: ['es', 'en']
  },
  {
    id: 'prov_2',
    name: 'providers.mock.accommodation.name1',
    category: PROVIDER_CATEGORIES.ACCOMMODATION,
    location: 'cusco_ciudad',
    status: PROVIDER_STATUS.ACTIVE,
    contact: {
      contactPerson: 'providers.mock.accommodation.contact1',
      phone: '+51 984 123 456',
      email: 'hotel1@example.com',
      address: 'providers.mock.accommodation.address1'
    },
    services: ['providers.services.accommodation.hotel'],
    pricing: {
      basePrice: 250,
      type: PRICING_TYPES.PER_PERSON,
      currency: CURRENCIES.PEN
    },
    rating: 4.8,
    capacity: 50,
    specialties: ['providers.specialties.boutique', 'providers.specialties.colonial'],
    languages: ['es', 'en', 'fr']
  },
  {
    id: 'prov_3',
    name: 'providers.mock.restaurant.name1',
    category: PROVIDER_CATEGORIES.RESTAURANT,
    location: 'lima_barranco',
    status: PROVIDER_STATUS.ACTIVE,
    contact: {
      contactPerson: 'providers.mock.restaurant.contact1',
      phone: '+51 912 345 678',
      email: 'restaurant1@example.com',
      address: 'providers.mock.restaurant.address1'
    },
    services: ['providers.services.restaurant.lunch', 'providers.services.restaurant.dinner'],
    pricing: {
      basePrice: 80,
      type: PRICING_TYPES.PER_PERSON,
      currency: CURRENCIES.PEN
    },
    rating: 4.6,
    capacity: 100,
    specialties: ['providers.specialties.peruvian', 'providers.specialties.fusion'],
    languages: ['es', 'en']
  }
];

export const getMockTours = () => [
  { id: 'tour_ica_fullday', name: 'providers.tours.icaFullday' },
  { id: 'tour_cusco_city', name: 'providers.tours.cuscoCity' },
  { id: 'tour_machu_picchu', name: 'providers.tours.machuPicchu' },
  { id: 'tour_valle_sagrado', name: 'providers.tours.valleSagrado' },
  { id: 'tour_lima_centro', name: 'providers.tours.limaHistoric' }
];

export const getMockAssignments = () => [
  {
    id: 'assign_1',
    tourId: 'tour_cusco_city',
    tourName: 'providers.tours.cuscoCity',
    date: new Date().toISOString().split('T')[0],
    status: ASSIGNMENT_STATUS.CONFIRMED,
    providers: [
      {
        providerId: 'prov_1',
        providerName: 'providers.mock.transport.name1',
        providerCategory: PROVIDER_CATEGORIES.TRANSPORT,
        providerLocation: 'cusco_ciudad',
        startTime: '08:00',
        endTime: '18:00',
        service: 'providers.services.transport.van',
        notes: 'providers.assignment.notes.transport'
      }
    ],
    notes: 'providers.assignment.notes.general'
  }
];

export const getEmptyProvider = () => ({
  name: '',
  category: '',
  location: '',
  status: PROVIDER_STATUS.ACTIVE,
  contact: {
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  },
  services: [''],
  pricing: {
    basePrice: 0,
    type: PRICING_TYPES.PER_PERSON,
    currency: CURRENCIES.PEN
  },
  rating: 4.0,
  capacity: '',
  specialties: [],
  languages: []
});

export const getEmptyAssignment = () => ({
  tourId: '',
  tourName: '',
  date: '',
  providers: [],
  notes: '',
  status: ASSIGNMENT_STATUS.DRAFT
});