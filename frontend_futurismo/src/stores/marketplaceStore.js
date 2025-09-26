/**
 * Store de marketplace
 * Maneja el estado global del marketplace de guías
 */

import { create } from 'zustand';
import { marketplaceService } from '../services/marketplaceService';
import {
  WORK_ZONES,
  TOUR_TYPES,
  GROUP_TYPES,
  DEFAULT_FILTERS,
  MARKETPLACE_VIEWS
} from '../constants/marketplaceConstants';

const useMarketplaceStore = create((set, get) => ({
  // Estado
  freelanceGuides: [],
  currentGuide: null,
  serviceRequests: [],
  currentRequest: null,
  reviews: [],
  isLoading: false,
  error: null,
  
  // Configuración
  workZones: WORK_ZONES,
  tourTypes: TOUR_TYPES,
  groupTypes: GROUP_TYPES,
  
  // Filtros y búsqueda
  activeFilters: { ...DEFAULT_FILTERS },
  searchQuery: '',
  sortBy: 'rating', // rating, price, experience, reviews
  currentView: MARKETPLACE_VIEWS.GRID,
  
  // Paginación
  pagination: {
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0
  },

  // Estadísticas
  marketplaceStats: null,
  guideStats: null,

  // Acciones de búsqueda y filtros
  searchGuides: async (query) => {
    set({ searchQuery: query, pagination: { ...get().pagination, page: 1 } });
    return get().fetchFreelanceGuides();
  },
  
  setFilters: (filters) => {
    set({ 
      activeFilters: { ...get().activeFilters, ...filters },
      pagination: { ...get().pagination, page: 1 }
    });
    return get().fetchFreelanceGuides();
  },
  
  clearFilters: () => {
    set({
      activeFilters: { ...DEFAULT_FILTERS },
      searchQuery: '',
      pagination: { ...get().pagination, page: 1 }
    });
    return get().fetchFreelanceGuides();
  },
  
  setSortBy: (sortBy) => {
    set({ sortBy });
    return get().fetchFreelanceGuides();
  },

  setView: (view) => {
    set({ currentView: view });
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page }
    }));
    return get().fetchFreelanceGuides();
  },

  // Acciones CRUD - Guías
  fetchFreelanceGuides: async () => {
    console.log('[MarketplaceStore] fetchFreelanceGuides started');
    set({ isLoading: true, error: null });

    try {
      const { activeFilters, searchQuery, sortBy, pagination } = get();

      const params = {
        ...activeFilters,
        search: searchQuery,
        sortBy,
        page: pagination.page,
        pageSize: pagination.pageSize
      };

      console.log('[MarketplaceStore] Calling marketplaceService.getFreelanceGuides with params:', params);
      const result = await marketplaceService.getFreelanceGuides(params);
      console.log('[MarketplaceStore] Result from marketplaceService:', result);

      if (!result.success) {
        console.warn('[MarketplaceStore] Service returned error:', result.error);
        // No lanzar error, solo usar datos vacíos
        set({
          freelanceGuides: [],
          pagination: {
            page: 1,
            pageSize: pagination.pageSize,
            total: 0,
            totalPages: 0
          },
          isLoading: false,
          error: result.error || 'Error al cargar guías'
        });
        return { guides: [], page: 1, pageSize: pagination.pageSize, total: 0, totalPages: 0 };
      }

      set({
        freelanceGuides: result.data?.guides || [],
        pagination: {
          page: result.data?.page || 1,
          pageSize: result.data?.pageSize || pagination.pageSize,
          total: result.data?.total || 0,
          totalPages: result.data?.totalPages || 0
        },
        isLoading: false,
        error: null
      });

      return result.data;
    } catch (error) {
      console.error('[MarketplaceStore] Error in fetchFreelanceGuides:', error);
      set({
        isLoading: false,
        error: error.message,
        freelanceGuides: [], // Asegurar que sea un array
        pagination: {
          page: 1,
          pageSize: get().pagination?.pageSize || 12,
          total: 0,
          totalPages: 0
        }
      });
      // No lanzar error para permitir que la aplicación continúe
      return { guides: [], page: 1, pageSize: 12, total: 0, totalPages: 0 };
    }
  },

  fetchGuideProfile: async (guideId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.getGuideProfile(guideId);
      
      if (!result.success) {
        throw new Error(result.error || 'Guía no encontrado');
      }
      
      set({
        currentGuide: result.data,
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

  fetchGuideAvailability: async (guideId, params = {}) => {
    try {
      const result = await marketplaceService.getGuideAvailability(guideId, params);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar disponibilidad');
      }
      
      return result.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateGuideAvailability: async (guideId, availability) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.updateGuideAvailability(guideId, availability);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar disponibilidad');
      }
      
      // Actualizar guía en la lista si existe
      set((state) => ({
        freelanceGuides: state.freelanceGuides.map(g =>
          g.id === guideId 
            ? { ...g, availability: result.data }
            : g
        ),
        currentGuide: state.currentGuide?.id === guideId
          ? { ...state.currentGuide, availability: result.data }
          : state.currentGuide,
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

  // Acciones CRUD - Solicitudes de servicio
  createServiceRequest: async (requestData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.createServiceRequest(requestData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear solicitud');
      }
      
      set((state) => ({
        serviceRequests: [result.data, ...state.serviceRequests],
        currentRequest: result.data,
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

  fetchServiceRequests: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.getServiceRequests(filters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar solicitudes');
      }
      
      set({
        serviceRequests: result.data,
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

  fetchServiceRequestById: async (requestId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.getServiceRequestById(requestId);
      
      if (!result.success) {
        throw new Error(result.error || 'Solicitud no encontrada');
      }
      
      set({
        currentRequest: result.data,
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

  updateServiceRequest: async (requestId, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.updateServiceRequest(requestId, updates);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar solicitud');
      }
      
      set((state) => ({
        serviceRequests: state.serviceRequests.map(req =>
          req.id === requestId ? result.data : req
        ),
        currentRequest: state.currentRequest?.id === requestId
          ? result.data
          : state.currentRequest,
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

  respondToServiceRequest: async (requestId, response) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.respondToServiceRequest(requestId, response);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al responder solicitud');
      }
      
      set((state) => ({
        serviceRequests: state.serviceRequests.map(req =>
          req.id === requestId ? result.data : req
        ),
        currentRequest: state.currentRequest?.id === requestId
          ? result.data
          : state.currentRequest,
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

  cancelServiceRequest: async (requestId, reason) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.cancelServiceRequest(requestId, reason);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cancelar solicitud');
      }
      
      set((state) => ({
        serviceRequests: state.serviceRequests.map(req =>
          req.id === requestId ? result.data : req
        ),
        currentRequest: state.currentRequest?.id === requestId
          ? result.data
          : state.currentRequest,
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

  completeService: async (requestId, completionData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.completeService(requestId, completionData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al completar servicio');
      }
      
      set((state) => ({
        serviceRequests: state.serviceRequests.map(req =>
          req.id === requestId ? result.data : req
        ),
        currentRequest: state.currentRequest?.id === requestId
          ? result.data
          : state.currentRequest,
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

  // Acciones CRUD - Reseñas
  fetchGuideReviews: async (guideId, params = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.getGuideReviews(guideId, params);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar reseñas');
      }
      
      set({
        reviews: result.data.reviews,
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

  createReview: async (reviewData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.createReview(reviewData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear reseña');
      }
      
      set((state) => ({
        reviews: [result.data, ...state.reviews],
        isLoading: false
      }));
      
      // Actualizar estadísticas del guía si está cargado
      if (get().currentGuide?.id === reviewData.guideId) {
        get().fetchGuideProfile(reviewData.guideId);
      }
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  respondToReview: async (reviewId, response) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.respondToReview(reviewId, response);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al responder reseña');
      }
      
      set((state) => ({
        reviews: state.reviews.map(review =>
          review.id === reviewId 
            ? { ...review, response: { content: response, timestamp: new Date().toISOString() } }
            : review
        ),
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

  markReviewHelpful: async (reviewId) => {
    try {
      const result = await marketplaceService.markReviewHelpful(reviewId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al marcar reseña');
      }
      
      set((state) => ({
        reviews: state.reviews.map(review =>
          review.id === reviewId 
            ? { ...review, metadata: { ...review.metadata, helpful: result.data.helpful } }
            : review
        )
      }));
      
      return result.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Estadísticas
  fetchMarketplaceStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.getMarketplaceStats();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar estadísticas');
      }
      
      set({
        marketplaceStats: result.data,
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

  fetchGuideStats: async (guideId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.getGuideStats(guideId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar estadísticas del guía');
      }
      
      set({
        guideStats: result.data,
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

  // Administración de guías
  updateGuideMarketplaceProfile: async (guideId, profileData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.updateGuideMarketplaceProfile(guideId, profileData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar perfil');
      }
      
      set((state) => ({
        freelanceGuides: state.freelanceGuides.map(g =>
          g.id === guideId ? result.data : g
        ),
        currentGuide: state.currentGuide?.id === guideId
          ? result.data
          : state.currentGuide,
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

  updateGuidePricing: async (guideId, pricing) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.updateGuidePricing(guideId, pricing);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar tarifas');
      }
      
      set((state) => ({
        freelanceGuides: state.freelanceGuides.map(g =>
          g.id === guideId 
            ? { ...g, pricing: result.data }
            : g
        ),
        currentGuide: state.currentGuide?.id === guideId
          ? { ...state.currentGuide, pricing: result.data }
          : state.currentGuide,
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

  verifyGuide: async (guideId, verificationData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.verifyGuide(guideId, verificationData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al verificar guía');
      }
      
      set((state) => ({
        freelanceGuides: state.freelanceGuides.map(g =>
          g.id === guideId 
            ? { ...g, marketplaceStatus: result.data }
            : g
        ),
        currentGuide: state.currentGuide?.id === guideId
          ? { ...state.currentGuide, marketplaceStatus: result.data }
          : state.currentGuide,
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

  // Búsqueda avanzada
  searchGuidesByCompetencies: async (requirements) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.searchGuidesByCompetencies(requirements);
      
      if (!result.success) {
        throw new Error(result.error || 'Error en la búsqueda');
      }
      
      set({
        freelanceGuides: result.data,
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

  fetchFeaturedGuides: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await marketplaceService.getFeaturedGuides();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar guías destacados');
      }
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Utilidades
  clearError: () => set({ error: null }),
  
  resetStore: () => {
    set({
      freelanceGuides: [],
      currentGuide: null,
      serviceRequests: [],
      currentRequest: null,
      reviews: [],
      isLoading: false,
      error: null,
      activeFilters: { ...DEFAULT_FILTERS },
      searchQuery: '',
      sortBy: 'rating',
      currentView: MARKETPLACE_VIEWS.GRID,
      pagination: {
        page: 1,
        pageSize: 12,
        total: 0,
        totalPages: 0
      },
      marketplaceStats: null,
      guideStats: null
    });
  }
}));

export { useMarketplaceStore };
export default useMarketplaceStore;