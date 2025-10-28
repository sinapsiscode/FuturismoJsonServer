import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BuildingStorefrontIcon,
  PlusIcon,
  XMarkIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import useProvidersStore from '../../stores/providersStore';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const ProviderAssignment = ({ tour, selectedProviders, onProvidersChange }) => {
  const { t } = useTranslation();
  const { providers, categories, actions, isLoading } = useProvidersStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [providerPurpose, setProviderPurpose] = useState('');
  const [providerNotes, setProviderNotes] = useState('');
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    // Inicializar store de proveedores
    if (!providers || providers.length === 0) {
      actions.initialize();
      actions.fetchProviders();
    }

    // Cargar servicios
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const response = await fetch('/api/services');
      const result = await response.json();
      if (result.success) {
        setServices(result.data || []);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Error al cargar servicios');
    } finally {
      setLoadingServices(false);
    }
  };

  // Filtrar proveedores por categoría seleccionada
  const filteredProviders = selectedCategory && providers
    ? providers.filter(p => p.category === selectedCategory)
    : (providers || []);

  // Agregar proveedor a la lista
  const handleAddProvider = () => {
    if (!selectedProvider) {
      toast.error('Seleccione un proveedor');
      return;
    }

    if (!providers || providers.length === 0) {
      toast.error('No hay proveedores disponibles');
      return;
    }

    const provider = providers.find(p => p.id === selectedProvider);
    if (!provider) return;

    // Obtener detalles completos de los servicios seleccionados
    const providerServices = selectedServices.map(serviceId => {
      const service = services.find(s => s.id === serviceId);
      return service ? {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        currency: service.currency,
        duration: service.duration
      } : null;
    }).filter(Boolean);

    const newProvider = {
      id: provider.id,
      name: provider.name,
      category: provider.category,
      purpose: providerPurpose,
      notes: providerNotes,
      phone: provider.phone,
      address: provider.address,
      contactPerson: provider.contactPerson,
      services: providerServices
    };

    onProvidersChange([...selectedProviders, newProvider]);

    // Limpiar formulario
    setSelectedProvider('');
    setProviderPurpose('');
    setProviderNotes('');
    setSelectedServices([]);
    setShowAddModal(false);
  };

  // Remover proveedor de la lista
  const handleRemoveProvider = (providerId) => {
    onProvidersChange(selectedProviders.filter(p => p.id !== providerId));
  };

  // Obtener nombre de categoría traducido
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? t(category.name) : categoryId;
  };

  // Obtener icono de categoría
  const getCategoryIcon = (categoryName) => {
    const icons = {
      restaurant: '🍽️',
      hotel: '🏨',
      transport: '🚗',
      activity: '🎫',
      guide: '👥',
      attraction: '📍'
    };
    return icons[categoryName] || '📦';
  };

  return (
    <div className="space-y-4">
      {/* Lista de proveedores asignados */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            Proveedores Asignados ({selectedProviders.length})
          </h4>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Agregar
          </button>
        </div>

        {selectedProviders.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <BuildingStorefrontIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No hay proveedores asignados</p>
            <p className="text-xs text-gray-400 mt-1">
              Haz clic en "Agregar" para asignar proveedores a este tour
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-lg mr-2">
                        {getCategoryIcon(provider.category)}
                      </span>
                      <h5 className="font-medium text-gray-900">{provider.name}</h5>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1 ml-7">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Categoría:</span>
                        {getCategoryName(provider.category)}
                      </div>

                      {provider.purpose && (
                        <div className="flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          <span className="font-medium mr-1">Propósito:</span>
                          {provider.purpose}
                        </div>
                      )}

                      {provider.phone && (
                        <div className="flex items-center">
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          {provider.phone}
                        </div>
                      )}

                      {provider.address && (
                        <div className="flex items-center">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {provider.address}
                        </div>
                      )}

                      {provider.notes && (
                        <div className="text-gray-600 mt-1 italic">
                          "{provider.notes}"
                        </div>
                      )}

                      {/* Servicios asignados */}
                      {provider.services && provider.services.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="font-medium text-gray-700 mb-1">
                            Servicios asignados ({provider.services.length}):
                          </div>
                          <div className="space-y-1">
                            {provider.services.map((service) => (
                              <div key={service.id} className="flex items-start text-xs">
                                <span className="text-blue-600 mr-1">•</span>
                                <div className="flex-1">
                                  <span className="font-medium">{service.name}</span>
                                  {service.description && (
                                    <span className="text-gray-500"> - {service.description}</span>
                                  )}
                                  <div className="text-gray-600">
                                    {service.price} {service.currency} • {service.duration}h
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveProvider(provider.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                    title="Eliminar proveedor"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar proveedor */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Agregar Proveedor
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedProvider('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {t(cat.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proveedor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor *
                </label>
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-xs text-gray-500 mt-2">Cargando proveedores...</p>
                  </div>
                ) : (
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar proveedor</option>
                    {filteredProviders.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name} - {getCategoryName(provider.category)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Propósito */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Propósito
                </label>
                <input
                  type="text"
                  value={providerPurpose}
                  onChange={(e) => setProviderPurpose(e.target.value)}
                  placeholder="Ej: Almuerzo, Recojo, Entrada incluida..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas adicionales
                </label>
                <textarea
                  value={providerNotes}
                  onChange={(e) => setProviderNotes(e.target.value)}
                  placeholder="Horarios, indicaciones especiales, contacto..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Servicios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servicios del módulo "Servicios"
                </label>
                {loadingServices ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-xs text-gray-500 mt-2">Cargando servicios...</p>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                    {services.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No hay servicios disponibles
                      </div>
                    ) : (
                      <div className="divide-y">
                        {services.map((service) => (
                          <label
                            key={service.id}
                            className="flex items-start p-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedServices([...selectedServices, service.id]);
                                } else {
                                  setSelectedServices(selectedServices.filter(id => id !== service.id));
                                }
                              }}
                              className="mt-0.5 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {service.name}
                              </div>
                              {service.description && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {service.description}
                                </div>
                              )}
                              <div className="text-xs text-gray-600 mt-1">
                                {service.price} {service.currency} • {service.duration}h
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {selectedServices.length} servicio(s) seleccionado(s)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProvider}
                disabled={!selectedProvider}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProviderAssignment.propTypes = {
  tour: PropTypes.object.isRequired,
  selectedProviders: PropTypes.array.isRequired,
  onProvidersChange: PropTypes.func.isRequired
};

export default ProviderAssignment;
