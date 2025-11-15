/**
 * Store de proveedores
 * Maneja el estado global de proveedores
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { providersService } from '../services/providersService';

const useProvidersStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Estado
        locations: [],
        categories: [],
        services: [],
        providers: [],
        assignments: [],
        currentProvider: null,
        currentAssignment: null,
        selectedLocation: null,
        selectedCategory: null,
        isLoading: false,
        error: null,
        
        // Paginación
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0
        },
        
        assignmentsPagination: {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0
        },
        
        // Filtros
        filters: {
          search: '',
          location: '',
          category: '',
          minRating: null,
          status: ''
        },
        
        // Estadísticas
        stats: null,

        // Acciones
        actions: {
          // Inicialización
          initialize: async () => {
            set({ isLoading: true, error: null });

            try {
              // Cargar datos de manera independiente para evitar que un error bloquee todo
              let locations = [];
              let categories = [];
              let services = [];

              try {
                const locationsResult = await providersService.getLocations();
                locations = locationsResult.success ? locationsResult.data || [] : [];
              } catch (err) {
                console.warn('Error cargando locations de providers:', err);
                locations = []; // Continuar con array vacío
              }

              try {
                const categoriesResult = await providersService.getCategories();
                categories = categoriesResult.success ? categoriesResult.data || [] : [];
              } catch (err) {
                console.warn('Error cargando categories de providers:', err);
                categories = []; // Continuar con array vacío
              }

              try {
                const servicesResult = await providersService.getServices();
                services = servicesResult.success ? servicesResult.data || [] : [];
              } catch (err) {
                console.warn('Error cargando services de providers:', err);
                services = []; // Continuar con array vacío
              }

              set({
                locations,
                categories,
                services,
                isLoading: false,
                error: null
              });

              return true;
            } catch (error) {
              console.error('Error en initialize providersStore:', error);
              set({
                isLoading: false,
                error: error.message,
                locations: [], // Asegurar que sean arrays
                categories: [],
                services: []
              });
              // No lanzar error para permitir que la aplicación continúe
              return false;
            }
          },
          
          // Acciones de filtros
          setFilters: (filters) => {
            set((state) => ({
              filters: { ...state.filters, ...filters },
              pagination: { ...state.pagination, page: 1 }
            }));
            return get().actions.fetchProviders();
          },
          
          clearFilters: () => {
            set({
              filters: {
                search: '',
                location: '',
                category: '',
                minRating: null,
                status: ''
              },
              pagination: { ...get().pagination, page: 1 }
            });
            return get().actions.fetchProviders();
          },
          
          setSearch: (search) => {
            set((state) => ({
              filters: { ...state.filters, search },
              pagination: { ...state.pagination, page: 1 }
            }));
            return get().actions.fetchProviders();
          },
          
          setPage: (page) => {
            set((state) => ({
              pagination: { ...state.pagination, page }
            }));
            return get().actions.fetchProviders();
          },
          
          setSelectedLocation: (locationId) => {
            set({ selectedLocation: locationId });
            return get().actions.setFilters({ location: locationId });
          },
          
          setSelectedCategory: (categoryId) => {
            set({ selectedCategory: categoryId });
            return get().actions.setFilters({ category: categoryId });
          },

          // CRUD de proveedores
          fetchProviders: async () => {
            set({ isLoading: true, error: null });
            
            try {
              const { filters, pagination } = get();
              const params = {
                ...filters,
                page: pagination.page,
                pageSize: pagination.pageSize
              };
              
              const result = await providersService.getProviders(params);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cargar proveedores');
              }
              
              set({
                providers: result.data.providers || result.data || [],
                pagination: {
                  page: result.data.page || 1,
                  pageSize: result.data.pageSize || 20,
                  total: result.data.total || 0,
                  totalPages: result.data.totalPages || 0
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
          
          fetchProviderById: async (id) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.getProviderById(id);
              
              if (!result.success) {
                throw new Error(result.error || 'Proveedor no encontrado');
              }
              
              set({
                currentProvider: result.data,
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
          
          createProvider: async (providerData) => {
            set({ isLoading: true, error: null });

            try {
              const result = await providersService.createProvider(providerData);

              if (!result.success) {
                throw new Error(result.error || 'Error al crear proveedor');
              }

              set((state) => {
                // Asegurar que state.providers sea un array válido
                const currentProviders = Array.isArray(state.providers) ? state.providers : [];

                console.log('✅ Proveedor creado, agregando a la lista:', {
                  nuevo: result.data.name,
                  cantidadActual: currentProviders.length,
                  cantidadNueva: currentProviders.length + 1
                });

                return {
                  providers: [result.data, ...currentProviders],
                  isLoading: false
                };
              });

              return result.data;
            } catch (error) {
              console.error('❌ Error creando proveedor:', error);
              set({
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },

          updateProvider: async (id, updateData) => {
            set({ isLoading: true, error: null });

            try {
              const result = await providersService.updateProvider(id, updateData);

              if (!result.success) {
                throw new Error(result.error || 'Error al actualizar proveedor');
              }

              set((state) => ({
                providers: (state.providers || []).map(p =>
                  p.id === id ? result.data : p
                ),
                currentProvider: state.currentProvider?.id === id
                  ? result.data
                  : state.currentProvider,
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

          deleteProvider: async (id) => {
            set({ isLoading: true, error: null });

            try {
              const result = await providersService.deleteProvider(id);

              if (!result.success) {
                throw new Error(result.error || 'Error al eliminar proveedor');
              }

              set((state) => ({
                providers: (state.providers || []).filter(p => p.id !== id),
                currentProvider: state.currentProvider?.id === id
                  ? null
                  : state.currentProvider,
                isLoading: false
              }));

              return true;
            } catch (error) {
              set({
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          toggleProviderStatus: async (id, status) => {
            set({ isLoading: true, error: null });

            try {
              const result = await providersService.toggleProviderStatus(id, status);

              if (!result.success) {
                throw new Error(result.error || 'Error al cambiar estado');
              }

              set((state) => ({
                providers: (state.providers || []).map(p =>
                  p.id === id ? result.data : p
                ),
                currentProvider: state.currentProvider?.id === id
                  ? result.data
                  : state.currentProvider,
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

          // Asignaciones
          fetchAssignments: async (filters = {}) => {
            set({ isLoading: true, error: null });
            
            try {
              const { assignmentsPagination } = get();
              const params = {
                ...filters,
                page: assignmentsPagination.page,
                pageSize: assignmentsPagination.pageSize
              };
              
              const result = await providersService.getAssignments(params);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cargar asignaciones');
              }
              
              set({
                assignments: result.data.assignments,
                assignmentsPagination: {
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
          
          fetchAssignmentById: async (id) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.getAssignmentById(id);
              
              if (!result.success) {
                throw new Error(result.error || 'Asignación no encontrada');
              }
              
              set({
                currentAssignment: result.data,
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
          
          createAssignment: async (assignmentData) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.createAssignment(assignmentData);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al crear asignación');
              }
              
              set((state) => ({
                assignments: [result.data, ...state.assignments],
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

          updateAssignment: async (id, updateData) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.updateAssignment(id, updateData);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al actualizar asignación');
              }
              
              set((state) => ({
                assignments: state.assignments.map(a => 
                  a.id === id ? result.data : a
                ),
                currentAssignment: state.currentAssignment?.id === id 
                  ? result.data 
                  : state.currentAssignment,
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

          confirmAssignment: async (id) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.confirmAssignment(id);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al confirmar asignación');
              }
              
              set((state) => ({
                assignments: state.assignments.map(a => 
                  a.id === id ? result.data : a
                ),
                currentAssignment: state.currentAssignment?.id === id 
                  ? result.data 
                  : state.currentAssignment,
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
          
          cancelAssignment: async (id, reason = '') => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.cancelAssignment(id, reason);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cancelar asignación');
              }
              
              set((state) => ({
                assignments: state.assignments.map(a => 
                  a.id === id ? result.data : a
                ),
                currentAssignment: state.currentAssignment?.id === id 
                  ? result.data 
                  : state.currentAssignment,
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

          // Búsqueda y validación
          searchProviders: async (query, filters = {}) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.searchProviders(query, filters);
              
              if (!result.success) {
                throw new Error(result.error || 'Error en la búsqueda');
              }
              
              set({
                providers: result.data.providers,
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
          
          checkProviderAvailability: async (providerId, date, startTime, endTime) => {
            try {
              const result = await providersService.checkProviderAvailability(
                providerId, date, startTime, endTime
              );
              
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
          fetchProvidersStats: async () => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.getProvidersStats();
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cargar estadísticas');
              }
              
              set({
                stats: result.data,
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
          
          // Importación/Exportación
          importProviders: async (file, onProgress = null) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.importProviders(file, onProgress);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al importar proveedores');
              }
              
              // Recargar lista de proveedores
              await get().actions.fetchProviders();
              
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
          
          exportProviders: async (filters = {}, format = 'excel') => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.exportProviders(filters, format);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al exportar proveedores');
              }
              
              set({ isLoading: false });
              
              return result;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          exportAssignmentPDF: async (assignmentId) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await providersService.exportAssignmentPDF(assignmentId);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al exportar PDF');
              }
              
              set({ isLoading: false });
              
              return result;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          // Crear ubicación
          createLocation: async (locationData) => {
            set({ isLoading: true, error: null });

            try {
              const result = await providersService.createLocation(locationData);

              if (!result.success) {
                throw new Error(result.error || 'Error al crear ubicación');
              }

              // Agregar la nueva ubicación al estado inmediatamente
              set((state) => ({
                locations: [...state.locations, result.data],
                isLoading: false
              }));

              // Opcionalmente, recargar todas las ubicaciones para sincronizar
              try {
                const locationsResult = await providersService.getLocations();
                if (locationsResult.success) {
                  set({ locations: locationsResult.data || [] });
                }
              } catch (reloadError) {
                console.warn('Error recargando ubicaciones:', reloadError);
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

          // Crear categoría
          createCategory: async (categoryData) => {
            set({ isLoading: true, error: null });

            try {
              const result = await providersService.createCategory(categoryData);

              if (!result.success) {
                throw new Error(result.error || 'Error al crear categoría');
              }

              // Agregar la nueva categoría al estado inmediatamente
              set((state) => ({
                categories: [...state.categories, result.data],
                isLoading: false
              }));

              // Opcionalmente, recargar todas las categorías para sincronizar
              try {
                const categoriesResult = await providersService.getCategories();
                if (categoriesResult.success) {
                  set({ categories: categoriesResult.data || [] });
                }
              } catch (reloadError) {
                console.warn('Error recargando categorías:', reloadError);
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

          // Crear servicio
          createService: async (serviceData) => {
            set({ isLoading: true, error: null });

            try {
              const result = await providersService.createService(serviceData);

              if (!result.success) {
                throw new Error(result.error || 'Error al crear servicio');
              }

              // Agregar el nuevo servicio al estado inmediatamente para evitar delay
              set((state) => ({
                services: [...state.services, result.data],
                isLoading: false
              }));

              // Opcionalmente, recargar todos los servicios para sincronizar
              try {
                const servicesResult = await providersService.getServices();
                if (servicesResult.success) {
                  set({ services: servicesResult.data || [] });
                }
              } catch (reloadError) {
                console.warn('Error recargando servicios:', reloadError);
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
          getCategoriesByLocation: (locationId) => {
            const location = get().locations.find(loc => loc.id === locationId);
            if (!location || !location.categories) return [];

            const allCategories = get().categories;
            if (!allCategories || allCategories.length === 0) return [];

            return location.categories.map(catId =>
              allCategories.find(cat => cat.id === catId)
            ).filter(Boolean);
          },
          
          getProvidersByLocationAndCategory: (locationId, categoryId = null) => {
            const { providers } = get();
            
            if (!providers || providers.length === 0) {
              return [];
            }
            
            let filteredProviders = providers;
            
            // Filtrar por ubicación
            if (locationId) {
              filteredProviders = filteredProviders.filter(provider => 
                provider.locationId === locationId || 
                provider.location?.id === locationId ||
                (provider.locations && provider.locations.some(loc => loc.id === locationId))
              );
            }
            
            // Filtrar por categoría si se especifica
            if (categoryId) {
              filteredProviders = filteredProviders.filter(provider => 
                provider.categoryId === categoryId || 
                provider.category?.id === categoryId ||
                (provider.categories && provider.categories.some(cat => cat.id === categoryId))
              );
            }
            
            return filteredProviders;
          },
          
          getTotalProvidersCount: () => {
            const { providers } = get();
            return providers ? providers.length : 0;
          },
          
          clearError: () => set({ error: null }),
          
          resetStore: () => {
            set({
              providers: [],
              assignments: [],
              currentProvider: null,
              currentAssignment: null,
              selectedLocation: null,
              selectedCategory: null,
              isLoading: false,
              error: null,
              pagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 0
              },
              assignmentsPagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 0
              },
              filters: {
                search: '',
                location: '',
                category: '',
                minRating: null,
                status: ''
              },
              stats: null
            });
          }
        }
      }),
      {
        name: 'providers-store',
        version: 1, // Incrementar versión para forzar reset
        partialize: (state) => ({
          providers: state.providers,
          assignments: state.assignments,
          locations: state.locations,
          categories: state.categories,
          services: state.services
        }),
        // Función de migración para asegurar que los datos restaurados sean válidos
        merge: (persistedState, currentState) => {
          const merged = {
            ...currentState,
            ...persistedState,
            // Asegurar que arrays sean siempre arrays válidos
            providers: Array.isArray(persistedState?.providers) ? persistedState.providers : [],
            assignments: Array.isArray(persistedState?.assignments) ? persistedState.assignments : [],
            locations: Array.isArray(persistedState?.locations) ? persistedState.locations : [],
            categories: Array.isArray(persistedState?.categories) ? persistedState.categories : [],
            services: Array.isArray(persistedState?.services) ? persistedState.services : []
          };
          console.log('🔄 Datos restaurados del localStorage:', merged);
          return merged;
        }
      }
    ),
    {
      name: 'providers-store'
    }
  )
);

export default useProvidersStore;