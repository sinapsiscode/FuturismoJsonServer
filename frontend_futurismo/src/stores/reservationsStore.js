/**
 * Store de reservaciones
 * Maneja el estado global de reservaciones
 */

import { create } from 'zustand';
import { reservationsService } from '../services/reservationsService';
import { SERVICE_TYPES, FORM_STATES } from '../utils/constants';
import {
  INITIAL_FORM_DATA,
  FORM_STEPS,
  RESERVATION_STATUS,
  VALIDATION_MESSAGES
} from '../constants/reservationsConstants';

const useReservationsStore = create((set, get) => ({
  // Estado
  formData: INITIAL_FORM_DATA,
  currentStep: FORM_STEPS.SERVICE,
  formState: FORM_STATES.IDLE,
  validationErrors: {},
  isSubmitting: false,
  reservations: [],
  currentReservation: null,
  isLoading: false,
  error: null,
  filters: {
    status: '',
    serviceType: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  },
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  },

  // Acciones del formulario
  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data }
    }));
  },

  setServiceType: (serviceType) => {
    set((state) => ({
      formData: { 
        ...INITIAL_FORM_DATA,
        serviceType,
        date: state.formData.date,
        time: state.formData.time,
        touristsCount: state.formData.touristsCount
      }
    }));
  },

  addTourist: (tourist) => {
    set((state) => ({
      formData: {
        ...state.formData,
        tourists: [...state.formData.tourists, tourist]
      }
    }));
  },

  updateTourist: (index, tourist) => {
    set((state) => ({
      formData: {
        ...state.formData,
        tourists: state.formData.tourists.map((t, i) => 
          i === index ? tourist : t
        )
      }
    }));
  },

  removeTourist: (index) => {
    set((state) => ({
      formData: {
        ...state.formData,
        tourists: state.formData.tourists.filter((_, i) => i !== index)
      }
    }));
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, validateCurrentStep } = get();
    
    if (validateCurrentStep()) {
      set({ currentStep: Math.min(currentStep + 1, FORM_STEPS.MAX_STEP) });
      return true;
    }
    
    return false;
  },

  previousStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, FORM_STEPS.MIN_STEP)
    }));
  },

  validateCurrentStep: () => {
    const { currentStep, formData } = get();
    const errors = {};
    
    switch (currentStep) {
      case FORM_STEPS.SERVICE:
        if (!formData.serviceType) {
          errors.serviceType = VALIDATION_MESSAGES.SERVICE_TYPE_REQUIRED;
        }
        if (!formData.date) {
          errors.date = VALIDATION_MESSAGES.DATE_REQUIRED;
        }
        if (!formData.time) {
          errors.time = VALIDATION_MESSAGES.TIME_REQUIRED;
        }
        
        // Validaciones específicas por tipo
        if (formData.serviceType === SERVICE_TYPES.TRANSFER) {
          if (!formData.origin) errors.origin = VALIDATION_MESSAGES.ORIGIN_REQUIRED;
          if (!formData.destination) errors.destination = VALIDATION_MESSAGES.DESTINATION_REQUIRED;
        } else if (formData.serviceType === SERVICE_TYPES.TOUR) {
          if (!formData.tourName) errors.tourName = VALIDATION_MESSAGES.TOUR_NAME_REQUIRED;
          if (!formData.pickupLocation) errors.pickupLocation = VALIDATION_MESSAGES.PICKUP_LOCATION_REQUIRED;
        } else if (formData.serviceType === SERVICE_TYPES.PACKAGE) {
          if (!formData.packageName) errors.packageName = VALIDATION_MESSAGES.PACKAGE_NAME_REQUIRED;
          if (!formData.accommodation) errors.accommodation = VALIDATION_MESSAGES.ACCOMMODATION_REQUIRED;
        }
        break;
        
      case FORM_STEPS.TOURISTS:
        if (formData.tourists.length === 0) {
          errors.tourists = VALIDATION_MESSAGES.TOURISTS_REQUIRED;
        } else if (formData.tourists.length !== formData.touristsCount) {
          errors.tourists = VALIDATION_MESSAGES.TOURISTS_COUNT_MISMATCH.replace('{count}', formData.touristsCount);
        }
        
        // Validar cada turista
        formData.tourists.forEach((tourist, index) => {
          if (!tourist.name) {
            errors[`tourist_${index}_name`] = VALIDATION_MESSAGES.TOURIST_NAME_REQUIRED;
          }
          if (!tourist.passport) {
            errors[`tourist_${index}_passport`] = VALIDATION_MESSAGES.TOURIST_PASSPORT_REQUIRED;
          }
          if (!tourist.email) {
            errors[`tourist_${index}_email`] = VALIDATION_MESSAGES.TOURIST_EMAIL_REQUIRED;
          }
        });
        break;
    }
    
    set({ validationErrors: errors });
    return Object.keys(errors).length === 0;
  },

  submitReservation: async () => {
    set({ isSubmitting: true, formState: FORM_STATES.LOADING, error: null });
    
    try {
      const { formData } = get();
      const result = await reservationsService.createReservation(formData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear la reservación');
      }
      
      set((state) => ({
        reservations: [result.data, ...state.reservations],
        formState: FORM_STATES.SUCCESS,
        isSubmitting: false,
        currentReservation: result.data
      }));
      
      // Limpiar formulario después de éxito
      setTimeout(() => {
        get().resetForm();
      }, 2000);
      
      return { success: true, reservation: result.data };
    } catch (error) {
      set({ 
        formState: FORM_STATES.ERROR,
        isSubmitting: false,
        error: error.message
      });
      
      return { success: false, error: error.message };
    }
  },

  resetForm: () => {
    set({
      formData: INITIAL_FORM_DATA,
      currentStep: FORM_STEPS.SERVICE,
      formState: FORM_STATES.IDLE,
      validationErrors: {},
      error: null
    });
  },

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  clearValidationErrors: () => set({ validationErrors: {} }),

  // Acciones CRUD
  fetchReservations: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const { pagination } = get();
      const params = {
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize
      };
      
      const result = await reservationsService.getReservations(params);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar reservaciones');
      }
      
      set({
        reservations: result.data.reservations,
        pagination: {
          page: result.data.page,
          pageSize: result.data.pageSize,
          total: result.data.total,
          totalPages: result.data.totalPages
        },
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  fetchReservationById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await reservationsService.getReservationById(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Reservación no encontrada');
      }
      
      set({
        currentReservation: result.data,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  updateReservation: async (id, updateData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await reservationsService.updateReservation(id, updateData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar la reservación');
      }
      
      set((state) => ({
        reservations: state.reservations.map(r => 
          r.id === id ? result.data : r
        ),
        currentReservation: state.currentReservation?.id === id 
          ? result.data 
          : state.currentReservation,
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  updateReservationStatus: async (id, status, reason = null) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await reservationsService.updateReservationStatus(id, status, reason);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar el estado');
      }
      
      set((state) => ({
        reservations: state.reservations.map(r => 
          r.id === id ? result.data : r
        ),
        currentReservation: state.currentReservation?.id === id 
          ? result.data 
          : state.currentReservation,
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  cancelReservation: async (id, reason) => {
    return get().updateReservationStatus(id, RESERVATION_STATUS.CANCELLED, reason);
  },

  assignGuide: async (reservationId, guideId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await reservationsService.assignGuide(reservationId, guideId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al asignar guía');
      }
      
      set((state) => ({
        reservations: state.reservations.map(r => 
          r.id === reservationId ? result.data : r
        ),
        currentReservation: state.currentReservation?.id === reservationId 
          ? result.data 
          : state.currentReservation,
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Filtros y búsqueda
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 } // Reset página al filtrar
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        status: '',
        serviceType: '',
        dateFrom: '',
        dateTo: '',
        search: ''
      },
      pagination: { ...get().pagination, page: 1 }
    });
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page }
    }));
  },

  setPageSize: (pageSize) => {
    set((state) => ({
      pagination: { ...state.pagination, pageSize, page: 1 }
    }));
  },

  // Búsqueda
  searchReservations: async (query) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await reservationsService.searchReservations(query, get().filters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error en la búsqueda');
      }
      
      set({
        reservations: result.data.results,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Validación de disponibilidad
  checkAvailability: async (params) => {
    try {
      const result = await reservationsService.checkAvailability(params);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al verificar disponibilidad');
      }
      
      return result.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Estadísticas
  fetchStats: async (params = {}) => {
    try {
      const result = await reservationsService.getReservationStats(params);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar estadísticas');
      }
      
      return result.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null })
}));

export { useReservationsStore };
export default useReservationsStore;