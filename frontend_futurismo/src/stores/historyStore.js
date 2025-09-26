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

      // Cargar servicios del historial
      loadHistory: async () => {
        set({ loading: true, error: null });
        try {
          // Simular carga de datos - en producción vendría de la API
          const mockHistoryData = generateMockHistoryData();
          const totalItems = mockHistoryData.length;
          const totalPages = Math.ceil(totalItems / get().pagination.itemsPerPage);
          
          set({ 
            services: mockHistoryData,
            filteredServices: mockHistoryData,
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

// Función auxiliar para generar datos mock
function generateMockHistoryData() {
  const services = [];
  const serviceTypes = ['regular', 'private', 'transfer'];
  const statuses = ['completed', 'cancelled', 'pending'];
  const guides = ['Carlos Mendoza', 'Ana García', 'Luis Rodriguez', 'María López'];
  const drivers = ['Pedro Silva', 'Juan Torres', 'Diego Morales', 'Roberto Castro'];
  const vehicles = ['Toyota Hiace - ABC123', 'Mercedes Sprinter - XYZ789', 'Ford Transit - DEF456'];

  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const hasRating = status === 'completed' && Math.random() > 0.3; // 70% de servicios completados tienen rating

    services.push({
      id: `service-${i + 1}`,
      serviceName: `Servicio ${i + 1}`,
      clientName: `Cliente ${i + 1}`,
      date: date.toISOString(),
      serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      status,
      guide: guides[Math.floor(Math.random() * guides.length)],
      driver: drivers[Math.floor(Math.random() * drivers.length)],
      vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
      amount: Math.floor(Math.random() * 500) + 100,
      duration: Math.floor(Math.random() * 8) + 2,
      passengers: Math.floor(Math.random() * 10) + 1,
      notes: `Notas para el servicio ${i + 1}`,
      rating: hasRating ? Math.floor(Math.random() * 5) + 1 : null,
      ratingComment: hasRating ? `Comentario de calificación para el servicio ${i + 1}` : null
    });
  }

  return services;
}

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