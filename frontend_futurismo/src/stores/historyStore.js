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
          // Importar los stores necesarios dinámicamente
          const useReservationsStore = (await import('./reservationsStore')).default;
          const useClientsStore = (await import('./clientsStore')).default;

          // Obtener datos de los stores
          const reservationsStore = useReservationsStore.getState();
          const clientsStore = useClientsStore.getState();

          // Cargar datos si no están disponibles
          if (!reservationsStore.reservations || reservationsStore.reservations.length === 0) {
            await reservationsStore.fetchReservations();
          }

          if (!clientsStore.clients || clientsStore.clients.length === 0) {
            await clientsStore.loadClients();
          }

          // Obtener token de autenticación
          const token = localStorage.getItem('token');
          const headers = {
            'Content-Type': 'application/json'
          };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          // Cargar tours para obtener nombres
          const toursResponse = await fetch('/api/data/section/tours', { headers });
          const toursData = await toursResponse.json();

          // Cargar guías
          const guidesResponse = await fetch('/api/data/section/guides', { headers });
          const guidesData = await guidesResponse.json();

          // Cargar drivers
          const driversResponse = await fetch('/api/data/section/drivers', { headers });
          const driversData = await driversResponse.json();

          // Cargar vehicles
          const vehiclesResponse = await fetch('/api/data/section/vehicles', { headers });
          const vehiclesData = await vehiclesResponse.json();

          const reservations = reservationsStore.reservations || [];
          const tours = toursData.success ? toursData.data : [];
          const guides = guidesData.success ? guidesData.data : [];
          const clients = clientsStore.clients || [];
          const drivers = driversData.success ? driversData.data : [];
          const vehicles = vehiclesData.success ? vehiclesData.data : [];

          // Transformar reservas a formato de historial de servicios
          const historyData = reservations.map(reservation => {
            // Buscar tour
            const tour = tours.find(t => t.id === reservation.service_id);
            const serviceName = reservation.service_name || tour?.name || tour?.title || 'Servicio sin nombre';

            // Buscar guía
            const guide = guides.find(g => g.id === reservation.guide_id);
            const guideName = guide?.name ||
                             guide?.fullName ||
                             (guide?.first_name && guide?.last_name ? `${guide.first_name} ${guide.last_name}` : null) ||
                             reservation.guideName ||
                             'Sin asignar';

            // Buscar cliente
            const client = clients.find(c => c.id === reservation.client_id);
            const clientName = reservation.client_name || client?.name || client?.fullName || 'Cliente desconocido';

            // Buscar driver (si tiene driver_id o driver_name)
            const driver = drivers.find(d => d.id === reservation.driver_id);
            const driverName = reservation.driver_name ||
                              driver?.name ||
                              driver?.fullName ||
                              (driver?.first_name && driver?.last_name ? `${driver.first_name} ${driver.last_name}` : null) ||
                              'Sin asignar';

            // Buscar vehicle (si tiene vehicle_id)
            const vehicle = vehicles.find(v => v.id === reservation.vehicle_id);
            const vehicleInfo = vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : (reservation.vehicle || 'Sin asignar');

            return {
              id: reservation.id,
              serviceName: serviceName,
              clientName: clientName,
              date: reservation.date || reservation.tour_date,
              time: reservation.time || '00:00',
              duration: tour?.duration || reservation.duration || 4, // Duración en horas
              status: reservation.status || (reservation.guide_id ? 'confirmed' : 'unassigned'),
              serviceType: reservation.service_type || 'regular',
              guide: guideName,
              driver: driverName,
              vehicle: vehicleInfo,
              participants: reservation.group_size || reservation.participants || 0,
              amount: reservation.total_amount || reservation.total || 0,
              rating: reservation.rating || 0,
              hasRating: !!reservation.rating,
              paymentStatus: reservation.payment_status || 'pending',
              reservationCode: reservation.reservation_code || reservation.id
            };
          });

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
          console.error('Error loading history:', error);
          set({
            error: error.message || 'Error al cargar el historial',
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

        // Obtener los que están asignados en reservas
        const assignedGuides = new Set(services.map(s => s.guide).filter(g => g && g !== 'Sin asignar' && g !== 'N/A'));
        const assignedDrivers = new Set(services.map(s => s.driver).filter(d => d && d !== 'Sin asignar' && d !== 'N/A'));
        const assignedVehicles = new Set(services.map(s => s.vehicle).filter(v => v && v !== 'Sin asignar' && v !== 'N/A'));

        return {
          guides: [...assignedGuides],
          drivers: [...assignedDrivers],
          vehicles: [...assignedVehicles],
          assignedGuides: assignedGuides,
          assignedDrivers: assignedDrivers,
          assignedVehicles: assignedVehicles
        };
      },

      // Obtener todas las opciones disponibles (incluyendo no asignados)
      getAllFilterOptions: async () => {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        try {
          // Cargar todos los drivers disponibles
          const driversResponse = await fetch('/api/data/section/drivers', { headers });
          const driversData = await driversResponse.json();

          // Cargar todos los vehicles disponibles
          const vehiclesResponse = await fetch('/api/data/section/vehicles', { headers });
          const vehiclesData = await vehiclesResponse.json();

          // Cargar todas las guías disponibles
          const guidesResponse = await fetch('/api/data/section/guides', { headers });
          const guidesData = await guidesResponse.json();

          const allDrivers = driversData.success ? driversData.data : [];
          const allVehicles = vehiclesData.success ? vehiclesData.data : [];
          const allGuides = guidesData.success ? guidesData.data : [];

          // Obtener los asignados
          const filterOptions = get().getFilterOptions();

          return {
            allGuides: allGuides.map(g => ({
              id: g.id,
              name: g.name || g.fullName || (g.first_name && g.last_name ? `${g.first_name} ${g.last_name}` : 'Sin nombre'),
              assigned: filterOptions.assignedGuides.has(g.name || g.fullName || (g.first_name && g.last_name ? `${g.first_name} ${g.last_name}` : ''))
            })),
            allDrivers: allDrivers.map(d => ({
              id: d.id,
              name: d.name || d.fullName || (d.first_name && d.last_name ? `${d.first_name} ${d.last_name}` : 'Sin nombre'),
              assigned: filterOptions.assignedDrivers.has(d.name || d.fullName || (d.first_name && d.last_name ? `${d.first_name} ${d.last_name}` : ''))
            })),
            allVehicles: allVehicles.map(v => ({
              id: v.id,
              name: `${v.brand} ${v.model} (${v.plate})`,
              assigned: filterOptions.assignedVehicles.has(`${v.brand} ${v.model} (${v.plate})`)
            }))
          };
        } catch (error) {
          console.error('Error loading all filter options:', error);
          return {
            allGuides: [],
            allDrivers: [],
            allVehicles: []
          };
        }
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