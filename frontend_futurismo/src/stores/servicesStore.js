import { create } from 'zustand';
import { SERVICE_STATUS } from '../utils/constants';
import { servicesService } from '../services/servicesService';

const useServicesStore = create((set, get) => ({
  // Estado
  services: [], // Catálogo de servicios que ofrecemos
  activeServices: [],
  historicalServices: [],
  filters: {
    status: '',
    date: '',
    guide: '',
    client: '',
    serviceType: '',
    search: ''
  },
  isLoading: false,
  error: null,
  selectedService: null,
  mapView: false,

  // Paginación
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  },

  // Acciones
  loadServices: async (filters = {}) => {
    set({ isLoading: true, error: null });

    try {
      const { filters: storeFilters, pagination } = get();
      const params = {
        ...storeFilters,
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize
      };

      // Cargar desde /api/services (catálogo)
      const result = await servicesService.getServices(params);

      if (!result.success) {
        throw new Error(result.error || 'Error al cargar servicios');
      }

      // Manejar respuesta paginada o array directo
      let services = [];
      if (Array.isArray(result.data)) {
        services = result.data;
      } else if (result.data && Array.isArray(result.data.items)) {
        services = result.data.items;
      } else if (result.data && typeof result.data === 'object') {
        services = result.data.services || result.data.data || [];
      }

      // Todos los servicios del catálogo están "activos" (disponibles para vender)
      const active = services.filter(s => s.status === 'active');
      const historical = services.filter(s => s.status !== 'active');

      set({
        services,
        activeServices: active,
        historicalServices: historical,
        pagination: {
          page: 1,
          pageSize: 20,
          total: services.length,
          totalPages: Math.ceil(services.length / 20)
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
  
  loadActiveServices: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await servicesService.getActiveServices(filters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar servicios activos');
      }
      
      set({ 
        activeServices: result.data,
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

  createService: async (serviceData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await servicesService.createService(serviceData);

      if (!result.success) {
        throw new Error(result.error || 'Error al crear servicio');
      }

      set((state) => {
        // Validación defensiva: asegurar que services y activeServices son arrays
        const currentServices = Array.isArray(state.services) ? state.services : [];
        const currentActiveServices = Array.isArray(state.activeServices) ? state.activeServices : [];

        return {
          services: [...currentServices, result.data],
          activeServices: [...currentActiveServices, result.data],
          isLoading: false
        };
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

  updateService: async (serviceId, updates) => {
    set({ isLoading: true, error: null });

    try {
      const result = await servicesService.updateService(serviceId, updates);

      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar servicio');
      }

      set((state) => {
        const updatedServices = state.services.map(service =>
          service.id === serviceId ? result.data : service
        );

        return {
          services: updatedServices,
          activeServices: updatedServices, // Todos los servicios son activos
          historicalServices: [], // No hay histórico de plantillas
          isLoading: false
        };
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

  deleteService: async (serviceId) => {
    set({ isLoading: true, error: null });

    try {
      const result = await servicesService.deleteService(serviceId);

      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar servicio');
      }

      // Eliminar el servicio del estado local
      set((state) => {
        const filteredServices = state.services.filter(s => s.id !== serviceId);
        const filteredActiveServices = state.activeServices.filter(s => s.id !== serviceId);

        return {
          services: filteredServices,
          activeServices: filteredActiveServices,
          isLoading: false
        };
      });

      return result;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  updateServiceStatus: async (serviceId, status) => {
    set({ isLoading: true, error: null });

    try {
      const result = await servicesService.updateServiceStatus(serviceId, status);

      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar estado del servicio');
      }

      // Actualizar el servicio en el estado local
      set((state) => {
        const updatedServices = state.services.map(service =>
          service.id === serviceId ? { ...service, status, updated_at: new Date().toISOString() } : service
        );
        const updatedActiveServices = state.activeServices.map(service =>
          service.id === serviceId ? { ...service, status, updated_at: new Date().toISOString() } : service
        );

        return {
          services: updatedServices,
          activeServices: updatedActiveServices,
          isLoading: false
        };
      });

      return result;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  updateServiceLocation: async (serviceId, location) => {
    try {
      const result = await servicesService.updateServiceLocation(serviceId, location);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar ubicación');
      }
      
      set((state) => ({
        services: state.services.map(service =>
          service.id === serviceId ? result.data : service
        ),
        activeServices: state.activeServices.map(service =>
          service.id === serviceId ? result.data : service
        )
      }));
      
      return result.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateGuidePosition: async (guideId, position) => {
    try {
      const result = await servicesService.updateGuideLocation(guideId, position);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar posición del guía');
      }
      
      // Actualizar todos los servicios afectados
      set((state) => {
        const updatedGuideServices = result.data;
        const updatedServiceIds = new Set(updatedGuideServices.map(s => s.id));
        
        return {
          services: state.services.map(service =>
            updatedServiceIds.has(service.id) 
              ? updatedGuideServices.find(s => s.id === service.id)
              : service
          ),
          activeServices: state.activeServices.map(service =>
            updatedServiceIds.has(service.id) 
              ? updatedGuideServices.find(s => s.id === service.id)
              : service
          )
        };
      });
      
      return result.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Gestión de filtros con recarga automática
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 }
    }));
    return get().loadServices();
  },

  clearFilters: () => {
    set({
      filters: {
        status: '',
        date: '',
        guide: '',
        client: '',
        serviceType: '',
        search: ''
      },
      pagination: { ...get().pagination, page: 1 }
    });
    return get().loadServices();
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page }
    }));
    return get().loadServices();
  },

  resetFilters: () => {
    set({
      filters: {
        status: '',
        date: '',
        guide: '',
        client: '',
        serviceType: '',
        search: ''
      }
    });
  },

  getFilteredServices: () => {
    const { services, filters } = get();
    
    return services.filter(service => {
      // Filtro por estado
      if (filters.status && service.status !== filters.status) {
        return false;
      }
      
      // Filtro por fecha
      if (filters.date) {
        const serviceDate = new Date(service.date).toDateString();
        const filterDate = new Date(filters.date).toDateString();
        if (serviceDate !== filterDate) {
          return false;
        }
      }
      
      // Filtro por tipo de servicio
      if (filters.serviceType && service.type !== filters.serviceType) {
        return false;
      }
      
      // Filtro por búsqueda
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          service.code,
          service.guideName,
          service.touristName,
          service.destination
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableFields.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  },

  selectService: (service) => set({ selectedService: service }),
  
  clearSelectedService: () => set({ selectedService: null }),

  toggleMapView: () => set((state) => ({ mapView: !state.mapView })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Obtener estadísticas
  getActiveServices: (filters = {}) => {
    const { activeServices } = get();
    
    if (!filters || Object.keys(filters).length === 0) {
      return activeServices;
    }
    
    return activeServices.filter(service => {
      // Filtro por estado
      if (filters.status && service.status !== filters.status) {
        return false;
      }
      
      // Filtro por fecha
      if (filters.date) {
        const serviceDate = new Date(service.date).toDateString();
        const filterDate = new Date(filters.date).toDateString();
        if (serviceDate !== filterDate) {
          return false;
        }
      }
      
      // Filtro por tipo de servicio
      if (filters.serviceType && service.type !== filters.serviceType) {
        return false;
      }
      
      return true;
    });
  },

  getStatistics: () => {
    const { activeServices } = get();
    
    return {
      total: activeServices.length,
      pending: activeServices.filter(s => s.status === SERVICE_STATUS.PENDING).length,
      onWay: activeServices.filter(s => s.status === SERVICE_STATUS.ON_WAY).length,
      inService: activeServices.filter(s => s.status === SERVICE_STATUS.IN_SERVICE).length
    };
  },

  // Acciones de estado del servicio
  startService: async (serviceId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await servicesService.startService(serviceId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al iniciar servicio');
      }
      
      // Actualizar estado local
      get().updateService(serviceId, result.data);
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },
  
  pauseService: async (serviceId, reason = '') => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await servicesService.pauseService(serviceId, reason);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al pausar servicio');
      }
      
      // Actualizar estado local
      get().updateService(serviceId, result.data);
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },
  
  resumeService: async (serviceId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await servicesService.resumeService(serviceId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al reanudar servicio');
      }
      
      // Actualizar estado local
      get().updateService(serviceId, result.data);
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },
  
  finishService: async (serviceId, completionData = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await servicesService.finishService(serviceId, completionData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al finalizar servicio');
      }
      
      // Actualizar estado local
      get().updateService(serviceId, result.data);
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },
  
  cancelService: async (serviceId, reason) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await servicesService.cancelService(serviceId, reason);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cancelar servicio');
      }
      
      // Actualizar estado local
      get().updateService(serviceId, result.data);
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },
  
  // Estadísticas
  loadStatistics: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await servicesService.getStatistics(filters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar estadísticas');
      }
      
      set({ isLoading: false });
      
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

  // Limpiar store
  clearStore: () => {
    set({
      services: [],
      activeServices: [],
      historicalServices: [],
      filters: {
        status: '',
        date: null,
        serviceType: '',
        search: ''
      },
      selectedService: null,
      error: null,
      isLoading: false
    });
  },
  
  // Actualizaciones en tiempo real
  realtimeInterval: null,
  
  startRealtimeUpdates: () => {
    const interval = servicesService.startRealtimeUpdates((updatedServices) => {
      // Actualizar servicios con nuevas ubicaciones
      set((state) => {
        const updatedServiceIds = new Set(updatedServices.map(s => s.id));
        
        return {
          activeServices: state.activeServices.map(service =>
            updatedServiceIds.has(service.id) 
              ? updatedServices.find(s => s.id === service.id)
              : service
          )
        };
      });
    });
    
    set({ realtimeInterval: interval });
  },
  
  stopRealtimeUpdates: () => {
    const { realtimeInterval } = get();
    if (realtimeInterval) {
      servicesService.stopRealtimeUpdates();
      set({ realtimeInterval: null });
    }
  }
}));

export { useServicesStore };
export default useServicesStore;