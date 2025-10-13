/**
 * COMPATIBILITY LAYER - Reservations
 *
 * Este archivo re-exporta constantes desde el backend.
 * Mantiene compatibilidad con código existente.
 *
 * ⚠️ TEMPORAL: Este archivo es parte de la capa de compatibilidad.
 * RECOMENDADO: Migrar a useReservationsConfig() para uso en componentes React.
 */

import useModulesConfigStore from '../stores/modulesConfigStore';

// Cargar configuración si no está cargada
const store = useModulesConfigStore.getState();
if (!store.modules && !store.isLoading) {
  store.loadModules();
}

// Helper para obtener configuración
const getReservationsConfig = () => {
  const state = useModulesConfigStore.getState();
  return state.modules?.reservations || {};
};


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

// Wizard steps for reservation flow
export const WIZARD_STEPS = (() => {
  const config = getReservationsConfig();
  return config.wizardSteps || {
    TOUR_SELECTION: 'tour_selection',
    CLIENT_INFO: 'client_info',
    ADDITIONAL_SERVICES: 'additional_services',
    PAYMENT: 'payment',
    CONFIRMATION: 'confirmation'
  };
})();

// Service types
export const SERVICE_TYPES = (() => {
  const config = getReservationsConfig();
  return config.serviceTypes || {
    HALFDDAY: 'halfday',
    FULLDAY: 'fullday',
    MULTIDAY: 'multiday',
    CUSTOM: 'custom'
  };
})();

// Maximum companions per group
export const MAX_COMPANIONS_PER_GROUP = (() => {
  const config = getReservationsConfig();
  return config.maxCompanionsPerGroup || 20;
})();

// Form steps for reservation store
export const FORM_STEPS = (() => {
  const config = getReservationsConfig();
  return config.formSteps || {
    SERVICE: 1,
    TOURISTS: 2,
    CONFIRMATION: 3,
    MIN_STEP: 1,
    MAX_STEP: 3
  };
})();

// Initial form data
export const INITIAL_FORM_DATA = (() => {
  const config = getReservationsConfig();
  return config.initialFormData || {
    serviceType: '',
    date: '',
    time: '',
    tourName: '',
    pickupLocation: '',
    origin: '',
    destination: '',
    packageName: '',
    accommodation: '',
    touristsCount: 1,
    tourists: [],
    specialRequests: ''
  };
})();

// Validation messages
export const VALIDATION_MESSAGES = (() => {
  const config = getReservationsConfig();
  return config.validationMessages || {
    SERVICE_TYPE_REQUIRED: 'El tipo de servicio es requerido',
    DATE_REQUIRED: 'La fecha es requerida',
    TIME_REQUIRED: 'La hora es requerida',
    ORIGIN_REQUIRED: 'El origen es requerido',
    DESTINATION_REQUIRED: 'El destino es requerido',
    TOUR_NAME_REQUIRED: 'El nombre del tour es requerido',
    PICKUP_LOCATION_REQUIRED: 'La ubicación de recojo es requerida',
    PACKAGE_NAME_REQUIRED: 'El nombre del paquete es requerido',
    ACCOMMODATION_REQUIRED: 'El alojamiento es requerido',
    TOURISTS_REQUIRED: 'Debe agregar al menos un turista',
    TOURISTS_COUNT_MISMATCH: 'Debe agregar exactamente {count} turistas',
    TOURIST_NAME_REQUIRED: 'El nombre del turista es requerido',
    TOURIST_PASSPORT_REQUIRED: 'El pasaporte es requerido',
    TOURIST_EMAIL_REQUIRED: 'El email es requerido'
  };
})();

// Export default para compatibilidad
export default {
  RESERVATION_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  BOOKING_TYPES,
  CANCELLATION_REASONS,
  WIZARD_STEPS,
  SERVICE_TYPES,
  MAX_COMPANIONS_PER_GROUP,
  FORM_STEPS,
  INITIAL_FORM_DATA,
  VALIDATION_MESSAGES
};
