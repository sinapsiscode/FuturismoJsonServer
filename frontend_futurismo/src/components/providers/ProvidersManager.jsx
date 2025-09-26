import { useState, useEffect, useMemo } from 'react';
import { MapPinIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon, BuildingOffice2Icon, PhoneIcon, EnvelopeIcon, StarIcon, UserGroupIcon, ClockIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import useProvidersStore from '../../stores/providersStore';
import ProviderCard from './ProviderCard';
import ProviderForm from './ProviderForm';
// import ProviderAssignment from './ProviderAssignment';
import LocationTree from './LocationTree';

const ProvidersManager = () => {
  const {
    locations,
    categories,
    providers,
    selectedLocation,
    selectedCategory,
    isLoading,
    actions
  } = useProvidersStore();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'tree'
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    minRating: 0
  });

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        await actions.initialize();
        await actions.fetchProviders();
      } catch (error) {
        console.error('Error loading providers data:', error);
      }
    };
    
    loadData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        const filterParams = {
          search: searchQuery,
          location: selectedLocation || filters.location || undefined,
          category: selectedCategory || filters.category || undefined,
          minRating: filters.minRating || undefined
        };
        
        await actions.setFilters(filterParams);
      } catch (error) {
        console.error('Error applying filters:', error);
      }
    };
    
    applyFilters();
  }, [searchQuery, filters, selectedLocation, selectedCategory, actions]);

  // Filtrar proveedores local
  const filteredProviders = useMemo(() => {
    if (!providers || !Array.isArray(providers)) {
      return [];
    }
    
    return providers.filter(provider => {
      if (searchQuery && !provider.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (filters.location && provider.location !== filters.location) {
        return false;
      }
      
      if (filters.category && provider.category !== filters.category) {
        return false;
      }
      
      if (filters.minRating && (provider.rating || 0) < filters.minRating) {
        return false;
      }
      
      return true;
    });
  }, [providers, searchQuery, filters]);

  const handleAddProvider = () => {
    setEditingProvider(null);
    setShowForm(true);
  };

  const handleEditProvider = (provider) => {
    setEditingProvider(provider);
    setShowForm(true);
  };

  const handleDeleteProvider = async (providerId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        await actions.deleteProvider(providerId);
      } catch (error) {
        console.error('Error deleting provider:', error);
      }
    }
  };

  const handleSaveProvider = async (providerData) => {
    try {
      if (editingProvider) {
        await actions.updateProvider(editingProvider.id, providerData);
      } else {
        await actions.createProvider(providerData);
      }
      setShowForm(false);
      setEditingProvider(null);
    } catch (error) {
      console.error('Error saving provider:', error);
    }
  };

  const getLocationName = (locationId) => {
    return locations.find(l => l.id === locationId)?.name || '';
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Proveedores</h1>
          <p className="text-gray-600 mt-1">
            Administra proveedores locales por ubicación y categoría
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddProvider}
            className="btn btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Nuevo Proveedor</span>
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar proveedores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex items-center space-x-4">
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Todas las ubicaciones</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Modo de vista */}
          <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('tree')}
              className={`p-1.5 rounded ${viewMode === 'tree' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Vista árbol"
            >
              <BuildingOffice2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Vista cuadrícula"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Vista lista"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex gap-6">
        {/* Árbol de ubicaciones/categorías (sidebar) */}
        {viewMode === 'tree' && (
          <div className="w-80 flex-shrink-0">
            <LocationTree />
          </div>
        )}

        {/* Lista/Grilla de proveedores */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProviders.map(provider => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      locationName={getLocationName(provider.location)}
                      categoryInfo={getCategoryInfo(provider.category)}
                      onEdit={() => handleEditProvider(provider)}
                      onDelete={() => handleDeleteProvider(provider.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProviders.map(provider => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      locationName={getLocationName(provider.location)}
                      categoryInfo={getCategoryInfo(provider.category)}
                      onEdit={() => handleEditProvider(provider)}
                      onDelete={() => handleDeleteProvider(provider.id)}
                      layout="list"
                    />
                  ))}
                </div>
              )}

              {filteredProviders.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No se encontraron proveedores
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza agregando un nuevo proveedor o ajusta los filtros.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleAddProvider}
                      className="btn btn-primary"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Agregar Proveedor
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modales */}
      {showForm && (
        <ProviderForm
          provider={editingProvider}
          onSave={handleSaveProvider}
          onCancel={() => {
            setShowForm(false);
            setEditingProvider(null);
          }}
        />
      )}

    </div>
  );
};

export default ProvidersManager;