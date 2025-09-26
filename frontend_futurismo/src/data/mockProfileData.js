import { 
  PAYMENT_METHOD_TYPES, 
  ACCOUNT_TYPES, 
  CURRENCIES,
  CARD_TYPES 
} from '../constants/profileConstants';

export const getMockPaymentMethods = () => [
  {
    id: 1,
    type: PAYMENT_METHOD_TYPES.BANK_ACCOUNT,
    bank: 'profile.payment.banks.bcp',
    accountNumber: '194-1234567-8-90',
    accountType: ACCOUNT_TYPES.CHECKING,
    currency: CURRENCIES.PEN,
    holderName: 'profile.payment.mockHolder',
    isMain: true
  },
  {
    id: 2,
    type: PAYMENT_METHOD_TYPES.BANK_ACCOUNT,
    bank: 'profile.payment.banks.interbank',
    accountNumber: '200-9876543-2-10',
    accountType: ACCOUNT_TYPES.CHECKING,
    currency: CURRENCIES.PEN,
    holderName: 'profile.payment.mockHolder',
    isMain: false
  },
  {
    id: 3,
    type: PAYMENT_METHOD_TYPES.CREDIT_CARD,
    bank: 'profile.payment.banks.bbva',
    cardNumber: '4532123456789876',
    cardType: CARD_TYPES.VISA,
    expiryDate: '12/2025',
    holderName: 'profile.payment.mockCardHolder',
    isMain: false
  }
];

export const getEmptyPaymentMethod = () => ({
  type: '',
  bank: '',
  accountNumber: '',
  cardNumber: '',
  accountType: '',
  cardType: '',
  currency: CURRENCIES.PEN,
  holderName: '',
  expiryDate: '',
  isMain: false
});

export const getMockCompanyData = () => ({
  ruc: '20123456789',
  businessName: 'profile.company.mockBusinessName',
  commercialName: 'profile.company.mockCommercialName',
  address: 'profile.company.mockAddress',
  district: 'profile.company.mockDistrict',
  province: 'profile.company.mockProvince',
  department: 'profile.company.mockDepartment',
  legalRepresentative: 'profile.company.mockLegalRep',
  foundingDate: '2010-01-15',
  economicActivity: 'profile.company.mockActivity'
});

export const getMockContactData = () => ({
  mainContact: {
    name: 'profile.contact.mockMainName',
    position: 'profile.contact.mockMainPosition',
    email: 'profile.contact.mockMainEmail',
    phone: 'profile.contact.mockMainPhone',
    mobile: 'profile.contact.mockMainMobile'
  },
  billingContact: {
    name: 'profile.contact.mockBillingName',
    position: 'profile.contact.mockBillingPosition',
    email: 'profile.contact.mockBillingEmail',
    phone: 'profile.contact.mockBillingPhone'
  },
  emergencyContact: {
    name: 'profile.contact.mockEmergencyName',
    phone: 'profile.contact.mockEmergencyPhone',
    available24h: true
  }
});

export const getMockDocuments = () => [
  {
    id: 1,
    type: 'profile.documents.types.ruc',
    name: 'profile.documents.mockRucName',
    status: 'valid',
    uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    expiryDate: null,
    size: '1.2 MB',
    url: '#'
  },
  {
    id: 2,
    type: 'profile.documents.types.touristLicense',
    name: 'profile.documents.mockLicenseName',
    status: 'valid',
    uploadDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    size: '2.5 MB',
    url: '#'
  },
  {
    id: 3,
    type: 'profile.documents.types.insurance',
    name: 'profile.documents.mockInsuranceName',
    status: 'expired',
    uploadDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    size: '3.1 MB',
    url: '#'
  }
];

export const getMockFeedbackData = () => ({
  recentFeedback: [
    {
      id: 1,
      tourName: 'profile.feedback.mockTour1',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      rating: 5,
      category: 'service',
      comment: 'profile.feedback.mockComment1',
      touristName: 'profile.feedback.mockTourist1'
    },
    {
      id: 2,
      tourName: 'profile.feedback.mockTour2',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      rating: 4,
      category: 'guides',
      comment: 'profile.feedback.mockComment2',
      touristName: 'profile.feedback.mockTourist2'
    }
  ],
  stats: {
    averageRating: 4.7,
    totalReviews: 156,
    responseRate: 92,
    satisfactionIndex: 94
  },
  categoryBreakdown: {
    service: 4.8,
    guides: 4.9,
    transport: 4.5,
    accommodation: 4.6,
    communication: 4.7
  }
});