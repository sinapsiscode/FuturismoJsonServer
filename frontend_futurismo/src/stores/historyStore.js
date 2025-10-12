import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useHistoryStore = create(
  persist(
    (set, get) => ({
      // Estado del historial
      services: [],
      filteredServices: [],
      loading: false,
      error: null,
      
      // Filtros
      filters: {
        dateRange: 'all', // all, today, week, month, year
        status: 'all', // all, completed, cancelled, pending
        serviceType: 'all', // all, regular, private, transfer
        search: '',
        guide: 'all',
        driver: 'all',
        vehicle: 'all'
      },

      // Paginación
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0
      },

      // Ordenamiento
      sort: {
        field: 'date',
        direction: 'desc' // asc, desc
      },

      // Cargar servicios del historial desde la API
      loadHistory: async () => {
        set({ loading: true, error: null });
        try {
          // TODO: Implementar llamada real a la API cuando esté disponible
          // const response = await api.get('/history/services');
          // const historyData = response.data;

          // Temporalmente retornamos array vacío hasta que se implemente el endpoint
          const historyData = [];
          const totalItems = historyData.length;
          const totalPages = Math.ceil(totalItems / get().pagination.itemsPerPage);

          set({
            services: historyData,
            filteredServices: historyData,
            loading: false,
            pagination: {
              ...get().pagination,
              totalItems,
              totalPages
            }
          });
        } catch (error) {
          set({
            error: error.message,
            loading: false
          });
        }
      },

      // Aplicar filtros (legacy - not used anymore to avoid circular calls)
      applyFilters: () => {
        // This function is kept for compatibility but not used
        // All filtering is now done inline in updateFilter, clearFilters, etc.
      },

      // Actualizar filtros
      updateFilter: (filterName, value) => {
        const state = get();
        const newFilters = {
          ...state.filters,
          [filterName]: value
        };
        
        // Apply filters immediately without calling applyFilters
        let filtered = [...state.services];

        // Filter logic (moved here to avoid circular calls)
        if (newFilters.search.trim()) {
          const searchTerm = newFilters.search.toLowerCase();
          filtered = filtered.filter(service => 
            service.serviceName.toLowerCase().includes(searchTerm) ||
            service.clientName.toLowerCase().includes(searchTerm) ||
            service.guide?.toLowerCase().includes(searchTerm) ||
            service.driver?.toLowerCase().includes(searchTerm)
          );
        }

        if (newFilters.dateRange !== 'all') {
          const now = new Date();
          const filterDate = getDateByRange(newFilters.dateRange, now);
          filtered = filtered.filter(service => 
            new Date(service.date) >= filterDate
          );
        }

        if (newFilters.status !== 'all') {
          filtered = filtered.filter(service => service.status === newFilters.status);
        }

        if (newFilters.serviceType !== 'all') {
          filtered = filtered.filter(service => service.serviceType === newFilters.serviceType);
        }

        if (newFilters.guide !== 'all') {
          filtered = filtered.filter(service => service.guide === newFilters.guide);
        }

        if (newFilters.driver !== 'all') {
          filtered = filtered.filter(service => service.driver === newFilters.driver);
        }

        if (newFilters.vehicle !== 'all') {
          filtered = filtered.filter(service => service.vehicle === newFilters.vehicle);
        }

        // Sort
        filtered.sort((a, b) => {
          const { field, direction } = state.sort;
          let aVal = a[field];
          let bVal = b[field];

          if (field === 'date') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
          }

          if (direction === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage);

        set({
          filters: newFilters,
          filteredServices: filtered,
          pagination: {
            ...state.pagination,
            currentPage: 1,
            totalItems,
            totalPages
          }
        });
      },

      // Limpiar filtros
      clearFilters: () => {
        const state = get();
        const totalItems = state.services.length;
        const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage);
        
        set({
          filters: {
            dateRange: 'all',
            status: 'all',
            serviceType: 'all',
            search: '',
            guide: 'all',
            driver: 'all',
            vehicle: 'all'
          },
          filteredServices: [...state.services],
          pagination: {
            ...state.pagination,
            currentPage: 1,
            totalItems,
            totalPages
          }
        });
      },

      // Cambiar página
      changePage: (page) => {
        set(state => ({
          pagination: {
            ...state.pagination,
            currentPage: page
          }
        }));
      },

      // Cambiar ordenamiento
      updateSort: (field) => {
        const state = get();
        const currentSort = state.sort;
        const newDirection = currentSort.field === field && currentSort.direction === 'desc' 
          ? 'asc' 
          : 'desc';
        
        // Sort filtered services directly
        const sortedServices = [...state.filteredServices];
        sortedServices.sort((a, b) => {
          let aVal = a[field];
          let bVal = b[field];

          if (field === 'date') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
          }

          if (newDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
        
        set({
          sort: {
            field,
            direction: newDirection
          },
          filteredServices: sortedServices
        });
      },

      // Obtener servicios paginados
      getPaginatedServices: () => {
        const { filteredServices, pagination } = get();
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        return filteredServices.slice(startIndex, endIndex);
      },

      // Obtener opciones únicas para filtros
      getFilterOptions: () => {
        const { services } = get();
        return {
          guides: [...new Set(services.map(s => s.guide).filter(Boolean))],
          drivers: [...new Set(services.map(s => s.driver).filter(Boolean))],
          vehicles: [...new Set(services.map(s => s.vehicle).filter(Boolean))]
        };
      }
    }),
    {
      name: 'history-store',
      partialize: (state) => ({ 
        filters: state.filters,
        pagination: state.pagination,
        sort: state.sort 
      })
    }
  )
);

// Función auxiliar para obtener fecha por rango
function getDateByRange(range, baseDate) {
  const date = new Date(baseDate);

  switch (range) {
    case 'today':
      date.setHours(0, 0, 0, 0);
      break;
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      return new Date(0); // Fecha muy antigua para mostrar todos
  }

  return date;
}

export default useHistoryStore;