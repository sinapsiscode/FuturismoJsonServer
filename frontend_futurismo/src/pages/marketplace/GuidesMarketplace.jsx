import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AdjustmentsHorizontalIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  SparklesIcon,
  UserGroupIcon,
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import useMarketplaceStore from '../../stores/marketplaceStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GuidesMarketplace = () => {
  const navigate = useNavigate();
  const { 
    freelanceGuides, 
    isLoading, 
    fetchFreelanceGuides, 
    searchGuides, 
    setFilters,
    activeFilters,
    searchQuery
  } = useMarketplaceStore();
  
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      await fetchFreelanceGuides();
    } catch (error) {
      console.error('Error loading guides:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchGuides(localSearchQuery);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ [filterType]: value });
  };

  // Stats mock data until we have real stats
  const stats = {
    totalGuides: freelanceGuides.length,
    availableGuides: freelanceGuides.filter(g => g.status === 'available').length,
    averageRating: freelanceGuides.length > 0 
      ? (freelanceGuides.reduce((sum, g) => sum + (g.rating || 0), 0) / freelanceGuides.length).toFixed(1)
      : '0.0',
    totalReviews: freelanceGuides.reduce((sum, g) => sum + (g.reviewCount || 0), 0)
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <SparklesIcon className="w-8 h-8 mr-3 text-blue-500" />
            Marketplace de Guías
          </h1>
          <p className="text-gray-600 mt-1">
            Encuentra y contrata guías freelance especializados
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewLayout('grid')}
            className={`p-2 rounded-lg ${viewLayout === 'grid' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewLayout('list')}
            className={`p-2 rounded-lg ${viewLayout === 'list' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ListBulletIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Guías</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGuides}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <SparklesIcon className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableGuides}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <StarIcon className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Rating Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar guías por nombre, especialidad..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filtros</span>
            </button>
            
            <select
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todos los guías</option>
              <option value="available">Solo disponibles</option>
              <option value="busy">Ocupados</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zona de Trabajo
                </label>
                <select
                  onChange={(e) => handleFilterChange('workZone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Todas las zonas</option>
                  <option value="lima-centro">Lima Centro</option>
                  <option value="miraflores">Miraflores</option>
                  <option value="cusco">Cusco</option>
                  <option value="arequipa">Arequipa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idiomas
                </label>
                <select
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Todos los idiomas</option>
                  <option value="english">Inglés</option>
                  <option value="spanish">Español</option>
                  <option value="portuguese">Portugués</option>
                  <option value="french">Francés</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating Mínimo
                </label>
                <select
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Cualquier rating</option>
                  <option value="4.5">4.5+ estrellas</option>
                  <option value="4.0">4.0+ estrellas</option>
                  <option value="3.5">3.5+ estrellas</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Guías Disponibles ({freelanceGuides.length})
          </h3>
        </div>
        
        <div className="p-6">
          {freelanceGuides.length > 0 ? (
            <div className={`grid gap-6 ${
              viewLayout === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {freelanceGuides.map((guide) => (
                <div key={guide.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={guide.profileImage || `https://ui-avatars.com/api/?name=${guide.name}&background=random`}
                      alt={guide.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{guide.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {guide.rating || '0.0'} ({guide.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {guide.workZones?.join(', ') || 'Lima, Perú'}
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {guide.bio || 'Guía profesional especializado en turismo cultural e histórico.'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            guide.status === 'available'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {guide.status === 'available' ? 'Disponible' : 'Ocupado'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${guide.hourlyRate || '25'}/hora
                          </span>
                          <button
                            onClick={() => navigate(`/marketplace/guide/${guide.id}`)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                          >
                            Ver Perfil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay guías disponibles</h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros de búsqueda para encontrar más guías.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidesMarketplace;