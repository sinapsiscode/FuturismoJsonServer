import React, { useState, useEffect, useMemo } from 'react';
import { 
  UsersIcon as Users,
  CalendarIcon as Calendar,
  FunnelIcon as Filter,
  MagnifyingGlassIcon as Search,
  ArrowDownTrayIcon as Download,
  ArrowPathIcon as RefreshCw,
  MapPinIcon as MapPin,
  ClockIcon as Clock,
  CheckCircleIcon as CheckCircle,
  CurrencyDollarIcon as DollarSign,
  ArrowTrendingUpIcon as TrendingUp,
  ChartBarIcon as BarChart3,
  PlusIcon
} from '@heroicons/react/24/outline';
import useReservationsStore from '../../stores/reservationsStore';
import useClientsStore from '../../stores/clientsStore';
import useToursStore from '../../stores/toursStore';
import useGuidesStore from '../../stores/guidesStore';
import ReservationWizard from '../../components/reservations/ReservationWizard';

const ReservationManagement = () => {
  // Hooks de stores
  const { reservations, fetchReservations, isLoading } = useReservationsStore();
  const { clients, initialize: initializeClients } = useClientsStore();
  const { tours, initialize: initializeTours } = useToursStore();
  const { guides, fetchGuides } = useGuidesStore();
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    destination: 'all',
    guide: 'all',
    tourType: 'all',
    status: 'completed', // Por defecto solo completados
    searchTerm: '',
    // Filtros por cantidad de clientes
    clientQuantityType: 'all', // all, range, category
    minClients: '',
    maxClients: '',
    clientCategory: 'all', // all, individual, small, medium, large, extra_large
    // Nuevos filtros de fecha avanzados
    dateFilterType: 'custom', // custom, today, week, biweekly, month, quarter, year
    specificDate: '',
    weekNumber: '',
    month: '',
    quarter: '',
    year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos de manera independiente para evitar que un error bloquee todo
        const promises = [
          fetchReservations().catch(err => console.warn('Error cargando reservations:', err)),
          initializeClients().catch(err => console.warn('Error cargando clients:', err)),
          initializeTours().catch(err => console.warn('Error cargando tours:', err)),
          fetchGuides().catch(err => console.warn('Error cargando guides:', err))
        ];

        await Promise.allSettled(promises);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    loadData();
  }, []);

  // Agencias disponibles desde el store
  const agencies = Array.isArray(clients) ? clients.filter(client => client.type === 'agency') : [];

  // Opciones de filtro de fecha
  const dateFilterOptions = [
    { value: 'custom', label: 'Personalizado' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'biweekly', label: 'Últimas 2 semanas' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year', label: 'Este año' }
  ];


  // Opciones dinámicas basadas en datos reales
  const destinations = Array.isArray(tours) ? [...new Set(tours.map(tour => tour.destination).filter(Boolean))] : [];
  const guidesOptions = Array.isArray(guides) ? guides.map(guide => guide.name) : [];
  const tourTypes = Array.isArray(tours) ? [...new Set(tours.map(tour => tour.category).filter(Boolean))] : [];
  const statusOptions = ['all', 'completed', 'confirmed', 'pending', 'cancelled'];
  
  // Enriquecer reservas con datos relacionados
  const enrichedReservations = Array.isArray(reservations) ? reservations.map(reservation => {
    const client = clients.find(c => c.id === reservation.clientId);
    const tour = tours.find(t => t.id === reservation.tourId);
    const guide = guides.find(g => g.id === reservation.guideId);
    
    return {
      ...reservation,
      clientName: client?.name || 'Cliente desconocido',
      clientEmail: client?.email || '',
      clientPhone: client?.phone || '',
      tourName: tour?.name || reservation.tourName || 'Tour sin nombre',
      destination: tour?.destination || 'Destino desconocido',
      guide: guide?.name || 'Guía sin asignar',
      tourists: (reservation.adults || 0) + (reservation.children || 0),
      totalAmount: reservation.total || 0,
      tourType: tour?.category || 'cultural',
      agencyId: client?.id || '',
      agencyName: client?.name || 'Reserva Directa',
      tourDate: reservation.date,
      bookingDate: reservation.createdAt
    };
  }) : [];
  
  // Categorías por cantidad de clientes
  const clientCategories = [
    { value: 'all', label: 'Todas las cantidades', range: null },
    { value: 'individual', label: 'Individual (1 persona)', range: [1, 1] },
    { value: 'small', label: 'Grupo Pequeño (2-4)', range: [2, 4] },
    { value: 'medium', label: 'Grupo Mediano (5-8)', range: [5, 8] },
    { value: 'large', label: 'Grupo Grande (9-15)', range: [9, 15] },
    { value: 'extra_large', label: 'Grupo Extra Grande (16+)', range: [16, 999] }
  ];

  // Este useEffect ya no es necesario ya que tenemos otro que carga los datos reales

  // Función para manejar cambios en los filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Filtrar reservas basado en los filtros aplicados
  const filteredReservations = useMemo(() => {
    let filtered = enrichedReservations;

    // Filtro por estado (por defecto solo completados)
    if (filters.status !== 'all') {
      filtered = filtered.filter(res => res.status === filters.status);
    }

    // Filtro por rango de fechas
    if (filters.dateFrom) {
      filtered = filtered.filter(res => res.tourDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(res => res.tourDate <= filters.dateTo);
    }

    // Filtro por destino
    if (filters.destination !== 'all') {
      filtered = filtered.filter(res => res.destination === filters.destination);
    }

    // Filtro por guía
    if (filters.guide !== 'all') {
      filtered = filtered.filter(res => res.guide === filters.guide);
    }

    // Filtro por tipo de tour
    if (filters.tourType !== 'all') {
      filtered = filtered.filter(res => res.tourType === filters.tourType);
    }

    // Filtro por término de búsqueda
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(res => 
        res.clientName.toLowerCase().includes(searchTerm) ||
        res.clientEmail.toLowerCase().includes(searchTerm) ||
        res.tourName.toLowerCase().includes(searchTerm) ||
        res.id.toLowerCase().includes(searchTerm)
      );
    }

    // Filtros por cantidad de clientes
    if (filters.clientQuantityType === 'range' && (filters.minClients || filters.maxClients)) {
      const minClients = parseInt(filters.minClients) || 0;
      const maxClients = parseInt(filters.maxClients) || 999;
      filtered = filtered.filter(res => 
        res.tourists >= minClients && res.tourists <= maxClients
      );
    } else if (filters.clientQuantityType === 'category' && filters.clientCategory !== 'all') {
      const category = clientCategories.find(cat => cat.value === filters.clientCategory);
      if (category && category.range) {
        const [min, max] = category.range;
        filtered = filtered.filter(res => 
          res.tourists >= min && res.tourists <= max
        );
      }
    }


    // Filtros de fecha avanzados
    if (filters.dateFilterType !== 'custom') {
      const today = new Date();
      let startDate = null;
      let endDate = null;

      switch (filters.dateFilterType) {
        case 'today':
          startDate = today.toISOString().split('T')[0];
          endDate = startDate;
          break;
        
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          startDate = weekStart.toISOString().split('T')[0];
          endDate = weekEnd.toISOString().split('T')[0];
          break;
        
        case 'biweekly':
          const biweeklyStart = new Date(today);
          biweeklyStart.setDate(today.getDate() - 14);
          startDate = biweeklyStart.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        
        case 'month':
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          startDate = monthStart.toISOString().split('T')[0];
          endDate = monthEnd.toISOString().split('T')[0];
          break;
        
        case 'quarter':
          const quarter = Math.floor(today.getMonth() / 3);
          const quarterStart = new Date(today.getFullYear(), quarter * 3, 1);
          const quarterEnd = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
          startDate = quarterStart.toISOString().split('T')[0];
          endDate = quarterEnd.toISOString().split('T')[0];
          break;
        
        case 'year':
          const yearStart = new Date(filters.year || today.getFullYear(), 0, 1);
          const yearEnd = new Date(filters.year || today.getFullYear(), 11, 31);
          startDate = yearStart.toISOString().split('T')[0];
          endDate = yearEnd.toISOString().split('T')[0];
          break;
      }

      if (startDate && endDate) {
        filtered = filtered.filter(res => 
          res.tourDate >= startDate && res.tourDate <= endDate
        );
      }
    }

    return filtered;
  }, [enrichedReservations, filters]);

  // Calcular estadísticas basadas en reservas filtradas
  const stats = useMemo(() => {
    const totalClients = filteredReservations.length;
    const totalTourists = filteredReservations.reduce((sum, res) => sum + res.tourists, 0);
    const totalRevenue = filteredReservations.reduce((sum, res) => sum + res.totalAmount, 0);
    const avgGroupSize = totalClients > 0 ? (totalTourists / totalClients).toFixed(1) : 0;

    // Distribución por tamaño de grupo
    const groupSizeDistribution = clientCategories.map(category => {
      if (category.value === 'all') return null;
      
      const count = filteredReservations.filter(res => {
        const [min, max] = category.range;
        return res.tourists >= min && res.tourists <= max;
      }).length;
      
      return {
        category: category.label,
        count,
        percentage: totalClients > 0 ? ((count / totalClients) * 100).toFixed(1) : 0
      };
    }).filter(Boolean);

    return {
      totalClients,
      totalTourists,
      totalRevenue,
      avgGroupSize,
      groupSizeDistribution
    };
  }, [filteredReservations]);

  const handleExport = () => {
    // Simular exportación de datos
    console.log('Exportando reservas filtradas:', filteredReservations);
    alert(`Exportando ${filteredReservations.length} reservas...`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGroupSizeInfo = (touristCount) => {
    const category = clientCategories.find(cat => {
      if (!cat.range) return false;
      const [min, max] = cat.range;
      return touristCount >= min && touristCount <= max;
    });
    
    return {
      category: category?.value || 'unknown',
      label: category?.label || 'Desconocido',
      color: category?.value === 'individual' ? 'bg-blue-100 text-blue-800' :
             category?.value === 'small' ? 'bg-green-100 text-green-800' :
             category?.value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
             category?.value === 'large' ? 'bg-purple-100 text-purple-800' :
             category?.value === 'extra_large' ? 'bg-red-100 text-red-800' :
             'bg-gray-100 text-gray-800'
    };
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Reservas
              </h1>
              <p className="text-gray-600">
                Administración completa de reservas y clientes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowWizard(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Nueva Reserva
              </button>
              <button
                onClick={() => setLoading(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <h3 className="text-base font-semibold text-gray-800">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            {/* Período de fecha */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Período
              </label>
              <select
                value={filters.dateFilterType}
                onChange={(e) => handleFilterChange('dateFilterType', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateFilterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Solo mostrar inputs de fecha si es personalizado */}
            {filters.dateFilterType === 'custom' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha desde
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha hasta
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Año selector para filtro anual */}
            {filters.dateFilterType === 'year' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Año
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                  className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Destino */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Destino
              </label>
              <select
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option key="all" value="all">Todos los destinos</option>
                {destinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            {/* Guía */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Guía
              </label>
              <select
                value={filters.guide}
                onChange={(e) => handleFilterChange('guide', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option key="all" value="all">Todos los guías</option>
                {guidesOptions.map(guide => (
                  <option key={guide} value={guide}>{guide}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {/* Tipo de tour */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo de tour
              </label>
              <select
                value={filters.tourType}
                onChange={(e) => handleFilterChange('tourType', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option key="all" value="all">Todos los tipos</option>
                {tourTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Todos los estados' :
                     status === 'completed' ? 'Completados' :
                     status === 'confirmed' ? 'Confirmados' :
                     status === 'pending' ? 'Pendientes' :
                     status === 'cancelled' ? 'Cancelados' : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cliente, email, ID..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filtros por cantidad de clientes */}
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <h4 className="text-xs font-semibold text-gray-800">Filtros por Cantidad de Clientes</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Tipo de filtro */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tipo de filtro
                </label>
                <select
                  value={filters.clientQuantityType}
                  onChange={(e) => {
                    handleFilterChange('clientQuantityType', e.target.value);
                    // Limpiar otros filtros relacionados
                    if (e.target.value !== 'range') {
                      handleFilterChange('minClients', '');
                      handleFilterChange('maxClients', '');
                    }
                    if (e.target.value !== 'category') {
                      handleFilterChange('clientCategory', 'all');
                    }
                  }}
                  className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option key="all" value="all">Sin filtro</option>
                  <option key="range" value="range">Rango personalizado</option>
                  <option key="category" value="category">Categorías predefinidas</option>
                </select>
              </div>

              {/* Rango personalizado */}
              {filters.clientQuantityType === 'range' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mínimo
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      placeholder="1"
                      value={filters.minClients}
                      onChange={(e) => handleFilterChange('minClients', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Máximo
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      placeholder="999"
                      value={filters.maxClients}
                      onChange={(e) => handleFilterChange('maxClients', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Categorías predefinidas */}
              {filters.clientQuantityType === 'category' && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Categoría de grupo
                  </label>
                  <select
                    value={filters.clientCategory}
                    onChange={(e) => handleFilterChange('clientCategory', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {clientCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mostrar filtro activo */}
              {(filters.clientQuantityType === 'range' && (filters.minClients || filters.maxClients)) && (
                <div className="md:col-span-1 flex items-end">
                  <div className="bg-blue-50 border border-blue-200 rounded-md px-2 py-1 text-xs">
                    <span className="text-blue-800 font-medium">
                      Filtro: {filters.minClients || 1} - {filters.maxClients || '999+'} clientes
                    </span>
                  </div>
                </div>
              )}

              {(filters.clientQuantityType === 'category' && filters.clientCategory !== 'all') && (
                <div className="md:col-span-1 flex items-end">
                  <div className="bg-green-50 border border-green-200 rounded-md px-2 py-1 text-xs">
                    <span className="text-green-800 font-medium">
                      {clientCategories.find(cat => cat.value === filters.clientCategory)?.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total de Clientes"
            value={stats.totalClients}
            subtitle="Reservas filtradas"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Ingresos Totales"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="Valor acumulado"
            icon={DollarSign}
            color="purple"
          />
          <StatCard
            title="Promedio Grupo"
            value={stats.avgGroupSize}
            subtitle="Personas por reserva"
            icon={BarChart3}
            color="orange"
          />
        </div>


        {/* Acciones */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Mostrando {filteredReservations.length} de {enrichedReservations.length} reservas
            {(filters.clientQuantityType === 'range' && (filters.minClients || filters.maxClients)) && (
              <span className="ml-2 text-blue-600 font-medium">
                • Filtrado por: {filters.minClients || 1}-{filters.maxClients || '999+'} clientes
              </span>
            )}
            {(filters.clientQuantityType === 'category' && filters.clientCategory !== 'all') && (
              <span className="ml-2 text-green-600 font-medium">
                • {clientCategories.find(cat => cat.value === filters.clientCategory)?.label}
              </span>
            )}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>

        {/* Tabla de reservas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour / Destino
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guía
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turistas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        Cargando reservas...
                      </div>
                    </td>
                  </tr>
                ) : filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No se encontraron reservas con los filtros aplicados
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.clientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reservation.clientEmail}
                          </div>
                          <div className="text-xs text-gray-400">
                            {reservation.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.tourName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {reservation.destination}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(reservation.tourDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reservation.guide}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {reservation.tourists}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGroupSizeInfo(reservation.tourists).color}`}>
                            {getGroupSizeInfo(reservation.tourists).category === 'individual' ? 'Individual' :
                             getGroupSizeInfo(reservation.tourists).category === 'small' ? 'Pequeño' :
                             getGroupSizeInfo(reservation.tourists).category === 'medium' ? 'Mediano' :
                             getGroupSizeInfo(reservation.tourists).category === 'large' ? 'Grande' :
                             getGroupSizeInfo(reservation.tourists).category === 'extra_large' ? 'XL' : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(reservation.totalAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-sm text-green-800 bg-green-100 px-2 py-1 rounded-full">
                            Completado
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Nueva Reserva */}
      {showWizard && (
        <div className="modal-overlay">
          <div className="modal-content p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <ReservationWizard onClose={() => setShowWizard(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;