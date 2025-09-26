import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  CalendarIcon,
  FunnelIcon,
  PlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import useMarketplaceStore from '../../stores/marketplaceStore';
import useAuthStore from '../../stores/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AgencyMarketplaceDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { serviceRequests, freelanceGuides, reviews } = useMarketplaceStore();
  
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedServices: 0,
    averageRating: 0,
    totalSpent: 0,
    favoriteGuides: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    filterRequests();
    calculateStats();
  }, [activeFilter, searchQuery, serviceRequests]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = serviceRequests.filter(req => req.agencyId === user.id);
    
    // Filtro por estado
    if (activeFilter !== 'all') {
      filtered = filtered.filter(req => req.status === activeFilter);
    }
    
    // Búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => {
        const guide = freelanceGuides.find(g => g.id === req.guideId);
        return (
          req.requestCode.toLowerCase().includes(query) ||
          guide?.fullName.toLowerCase().includes(query) ||
          req.serviceDetails.tourName?.toLowerCase().includes(query) ||
          req.serviceDetails.location.toLowerCase().includes(query)
        );
      });
    }
    
    // Ordenar por fecha más reciente
    filtered.sort((a, b) => new Date(b.timeline.requestedAt) - new Date(a.timeline.requestedAt));
    
    setFilteredRequests(filtered);
  };

  const calculateStats = () => {
    const agencyRequests = serviceRequests.filter(req => req.agencyId === user.id);
    const completedRequests = agencyRequests.filter(req => req.status === 'completed');
    
    // Calcular promedio de calificaciones
    const agencyReviews = reviews.filter(r => r.agencyId === user.id);
    const avgRating = agencyReviews.length > 0
      ? agencyReviews.reduce((sum, r) => sum + r.ratings.overall, 0) / agencyReviews.length
      : 0;
    
    // Calcular total gastado
    const totalSpent = completedRequests.reduce((sum, req) => sum + req.pricing.finalRate, 0);
    
    // Encontrar guías favoritos (más contratados)
    const guideFrequency = {};
    completedRequests.forEach(req => {
      guideFrequency[req.guideId] = (guideFrequency[req.guideId] || 0) + 1;
    });
    
    const favoriteGuides = Object.entries(guideFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([guideId, count]) => ({
        guide: freelanceGuides.find(g => g.id === guideId),
        count
      }));
    
    setStats({
      totalRequests: agencyRequests.length,
      pendingRequests: agencyRequests.filter(req => req.status === 'pending').length,
      completedServices: completedRequests.length,
      averageRating: avgRating,
      totalSpent,
      favoriteGuides
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pendiente', icon: ClockIcon, className: 'bg-yellow-100 text-yellow-800' },
      accepted: { label: 'Aceptado', icon: CheckCircleIcon, className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rechazado', icon: XCircleIcon, className: 'bg-red-100 text-red-800' },
      completed: { label: 'Completado', icon: StarIcon, className: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'Cancelado', icon: XCircleIcon, className: 'bg-gray-100 text-gray-800' }
    };
    
    const { label, icon: Icon, className } = config[status];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const RequestCard = ({ request }) => {
    const guide = freelanceGuides.find(g => g.id === request.guideId);
    const hasReview = request.status === 'completed' && request.hasReview;
    
    return (
      <div 
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6"
        onClick={() => navigate(`/marketplace/requests/${request.id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{request.requestCode}</h3>
            <p className="text-sm text-gray-500">
              {new Date(request.timeline.requestedAt).toLocaleDateString()}
            </p>
          </div>
          {getStatusBadge(request.status)}
        </div>
        
        <div className="flex items-start gap-4">
          <img
            src={guide?.profile.avatar}
            alt={guide?.fullName}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900">{guide?.fullName}</p>
            <p className="text-sm text-gray-600 truncate">
              {request.serviceDetails.tourName || request.serviceDetails.type} • 
              {' '}{request.serviceDetails.location}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {new Date(request.serviceDetails.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {request.serviceDetails.startTime}
              </span>
              <span className="flex items-center gap-1">
                <UserGroupIcon className="h-4 w-4" />
                {request.serviceDetails.groupSize}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">S/. {request.pricing.finalRate}</p>
            {request.status === 'completed' && !hasReview && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/marketplace/review/${request.id}`);
                }}
                className="mt-2 text-xs text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Calificar →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketplace de Guías</h1>
              <p className="text-gray-600 mt-1">Gestiona tus solicitudes y contrataciones</p>
            </div>
            <button
              onClick={() => navigate('/marketplace')}
              className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Buscar guías
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total solicitudes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-gray-300" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-300" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completados</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedServices}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-300" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Calificación promedio</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </p>
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                </div>
              </div>
              <ChartBarIcon className="h-8 w-8 text-gray-300" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total gastado</p>
                <p className="text-2xl font-bold text-gray-900">S/. {stats.totalSpent}</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-gray-300" />
            </div>
          </div>
        </div>

        {/* Guías favoritos */}
        {stats.favoriteGuides.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Guías más contratados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.favoriteGuides.map(({ guide, count }) => (
                <div 
                  key={guide.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/marketplace/guide/${guide.id}`)}
                >
                  <img
                    src={guide.profile.avatar}
                    alt={guide.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{guide.fullName}</p>
                    <p className="text-sm text-gray-600">{count} servicios completados</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium">{guide.ratings.overall.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por código, guía, tour o ubicación..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <div className="flex gap-2">
                {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === filter
                        ? 'bg-cyan-100 text-cyan-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter === 'all' ? 'Todas' :
                     filter === 'pending' ? 'Pendientes' :
                     filter === 'accepted' ? 'Aceptadas' :
                     filter === 'completed' ? 'Completadas' : 'Canceladas'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de solicitudes */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron solicitudes
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || activeFilter !== 'all' 
                  ? 'Intenta ajustar tus filtros de búsqueda'
                  : 'Comienza buscando guías para tu próximo tour'
                }
              </p>
              {activeFilter === 'all' && !searchQuery && (
                <button
                  onClick={() => navigate('/marketplace')}
                  className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Explorar guías
                </button>
              )}
            </div>
          ) : (
            filteredRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyMarketplaceDashboard;