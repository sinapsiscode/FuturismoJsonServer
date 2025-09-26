import { useState } from 'react';
import { MapPinIcon, ChevronDownIcon, ChevronRightIcon, BuildingOffice2Icon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import useProvidersStore from '../../stores/providersStore';

const LocationTree = () => {
  const {
    locations,
    categories,
    selectedLocation,
    selectedCategory,
    actions
  } = useProvidersStore();

  const [expandedLocations, setExpandedLocations] = useState(new Set());

  const toggleLocation = (locationId) => {
    const newExpanded = new Set(expandedLocations);
    if (newExpanded.has(locationId)) {
      newExpanded.delete(locationId);
    } else {
      newExpanded.add(locationId);
    }
    setExpandedLocations(newExpanded);
  };

  const handleLocationClick = (locationId) => {
    if (selectedLocation === locationId) {
      actions.setSelectedLocation(null);
      actions.setSelectedCategory(null);
    } else {
      actions.setSelectedLocation(locationId);
      actions.setSelectedCategory(null);
      toggleLocation(locationId);
    }
  };

  const handleCategoryClick = (locationId, categoryId) => {
    actions.setSelectedLocation(locationId);
    actions.setSelectedCategory(categoryId);
  };

  const getProviderCount = (locationId, categoryId = null) => {
    return actions.getProvidersByLocationAndCategory(locationId, categoryId).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BuildingOffice2Icon className="w-5 h-5 mr-2 text-blue-500" />
          Proveedores por Ubicación
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Explora proveedores organizados por ubicación y categoría
        </p>
      </div>

      {/* Tree content */}
      <div className="p-4">
        <div className="space-y-2">
          {locations.map(location => {
            const isExpanded = expandedLocations.has(location.id);
            const isSelected = selectedLocation === location.id;
            const locationProviderCount = getProviderCount(location.id);
            const availableCategories = actions.getCategoriesByLocation(location.id);

            return (
              <div key={location.id} className="select-none">
                {/* Ubicación */}
                <div
                  className={`
                    flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
                    ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}
                  `}
                  onClick={() => handleLocationClick(location.id)}
                >
                  <div className="flex items-center space-x-2">
                    <button className="p-1">
                      {isExpanded ? (
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    
                    <MapPinIcon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                    
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                        {location.name}
                      </span>
                      <div className="text-xs text-gray-500">
                        {location.region}, {location.country}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {locationProviderCount} {locationProviderCount === 1 ? 'proveedor' : 'proveedores'}
                    </span>
                  </div>
                </div>

                {/* Categorías (cuando está expandido) */}
                {isExpanded && (
                  <div className="ml-8 mt-2 space-y-1">
                    {availableCategories.map(category => {
                      const categoryProviderCount = getProviderCount(location.id, category.id);
                      const isCategorySelected = selectedLocation === location.id && selectedCategory === category.id;

                      return (
                        <div
                          key={category.id}
                          className={`
                            flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
                            ${isCategorySelected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'}
                          `}
                          onClick={() => handleCategoryClick(location.id, category.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className={`text-sm ${isCategorySelected ? 'text-indigo-900 font-medium' : 'text-gray-700'}`}>
                              {category.name}
                            </span>
                          </div>

                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${isCategorySelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}
                          `}>
                            {categoryProviderCount}
                          </span>
                        </div>
                      );
                    })}

                    {availableCategories.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <BuildingOffice2Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No hay categorías disponibles</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Resumen en la parte inferior */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total de ubicaciones:</span>
              <span className="font-medium text-gray-900">{locations.length}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total de categorías:</span>
              <span className="font-medium text-gray-900">{categories.length}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total de proveedores:</span>
              <span className="font-medium text-gray-900">
                {actions.getTotalProvidersCount()}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <button 
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
              onClick={() => {
                // Expandir todas las ubicaciones
                setExpandedLocations(new Set(locations.map(l => l.id)));
              }}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Expandir todas
            </button>
            
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
              onClick={() => {
                // Colapsar todas las ubicaciones
                setExpandedLocations(new Set());
                actions.setSelectedLocation(null);
                actions.setSelectedCategory(null);
              }}
            >
              <BuildingOffice2Icon className="w-4 h-4 mr-2" />
              Colapsar todas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTree;