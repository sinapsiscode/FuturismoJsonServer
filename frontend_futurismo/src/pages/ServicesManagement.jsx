import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ServicesList from '../components/services/ServicesList';
import ServiceForm from '../components/services/ServiceForm';
import ServiceTypesSettings from '../components/settings/ServiceTypesSettings';
import { useServicesStore } from '../stores/servicesStore';
import { useAuthStore } from '../stores/authStore';

const ServicesManagement = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view', 'config'
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null); // Modal de eliminación personalizado

  const { deleteService, clearDuplicatesAndReset } = useServicesStore();
  const { user } = useAuthStore();

  const handleCreateService = () => {
    setSelectedService(null);
    setCurrentView('create');
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setCurrentView('edit');
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setCurrentView('view');
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete) {
      try {
        await deleteService(serviceToDelete.id);
        setShowDeleteModal(false);
        setServiceToDelete(null);
        // Si estamos en la vista de detalles, volver a la lista
        if (currentView === 'view') {
          setCurrentView('list');
          setSelectedService(null);
        }
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  const handleFormSubmit = async (serviceData) => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentView('list');
      setSelectedService(null);
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setCurrentView('list');
    setSelectedService(null);
  };

  const handleClearDuplicates = async () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar los duplicados y resetear los datos? Esto restaurará los servicios a los valores por defecto.')) {
      await clearDuplicatesAndReset();
    }
  };

  const renderHeader = () => {
    const titles = {
      list: t('services.management') || 'Gestión de Servicios',
      create: t('services.newService') || 'Nuevo Servicio',
      edit: t('services.editService') || 'Editar Servicio',
      view: t('services.serviceDetails') || 'Detalles del Servicio',
      config: 'Configuración de Tipos de Servicio'
    };

    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {currentView !== 'list' && (
            <button
              onClick={() => setCurrentView('list')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {titles[currentView]}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {currentView === 'list' && 'Registra y gestiona todos los servicios turísticos'}
              {currentView === 'create' && 'Registra una nueva solicitud de servicio'}
              {currentView === 'edit' && `Editando: ${selectedService?.code}`}
              {currentView === 'view' && `Código: ${selectedService?.code}`}
              {currentView === 'config' && 'Configura los tipos de servicio disponibles'}
            </p>
          </div>
        </div>

        {/* Botones de acción - solo visible en vista de lista y para admin */}
        {currentView === 'list' && user?.role === 'admin' && (
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('config')}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Configurar Tipos
            </button>
            <button
              onClick={handleCreateService}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {t('services.newService') || 'Nuevo Servicio'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (currentView === 'config') {
      return <ServiceTypesSettings />;
    }

    return (
      <ServicesList
        onEdit={handleEditService}
        onDelete={handleDeleteService}
        onView={handleViewService}
        onCreate={handleCreateService}
        showFilters={false}
        compact={true}
        showHeader={false}
      />
    );
  };

  const renderModals = () => {
    return (
      <>
        {/* Modal de formulario */}
        {(currentView === 'create' || currentView === 'edit') && (
          <ServiceForm
            service={currentView === 'edit' ? selectedService : null}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isLoading}
          />
        )}

        {/* Modal de detalles */}
        {currentView === 'view' && selectedService && (
          <div className="modal-overlay">
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">Detalles del Servicio</h2>
                  <button
                    type="button"
                    onClick={handleFormCancel}
                    className="modal-close"
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <ServiceDetails
                    service={selectedService}
                    onEdit={() => handleEditService(selectedService)}
                    onDelete={() => handleDeleteService(selectedService)}
                    userRole={user?.role}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && serviceToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Overlay */}
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              {/* Modal */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Eliminar Servicio
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar el servicio <span className="font-semibold text-gray-900">"{serviceToDelete.code}"</span>?
                        Esta acción cambiará el estado del servicio a inactivo.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {renderHeader()}
      {renderContent()}
      {renderModals()}
    </div>
  );
};

// Componente para mostrar detalles del servicio
const ServiceDetails = ({ service, onEdit, onDelete, userRole }) => {
  if (!service) return null;

  const isAgency = userRole === 'agency';

  return (
    <div className="space-y-6">
      {/* Información Principal */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{service.code}</h3>
            <p className="text-sm text-gray-600">{service.type}</p>
          </div>
          {!isAgency && (
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              >
                Editar
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Información del Servicio */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Información del Servicio</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Nombre</p>
                <p className="text-sm font-semibold text-gray-900">{service.name || service.title || 'Sin nombre'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Categoría</p>
                <p className="text-sm font-semibold text-gray-900">{(service.category || service.type)?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Ubicación</p>
                <p className="text-sm font-semibold text-gray-900">{service.location || service.destination || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Duración</p>
                <p className="text-sm font-semibold text-gray-900">{service.duration || 'N/A'} horas</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Capacidad máxima</p>
                <p className="text-sm font-semibold text-gray-900">{service.max_group_size || service.maxParticipants || 'N/A'} personas</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Precio por persona</p>
                <p className="text-sm font-semibold text-gray-900">{service.currency || 'USD'} {service.price?.toFixed(2) || service.basePrice?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Calificación</p>
                <p className="text-sm font-semibold text-gray-900">{service.rating ? `${service.rating}/5 ⭐` : 'Sin calificar'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Fecha de creación</p>
                <p className="text-sm font-semibold text-gray-900">{service.created_at ? new Date(service.created_at).toLocaleDateString('es-ES') : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {service.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{service.description}</p>
            </div>
          )}

          {/* Incluido/Excluido */}
          {(service.included?.length > 0 || service.excluded?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.included?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-green-600">✓</span> Incluido
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 bg-green-50 p-3 rounded-lg">
                    {service.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.excluded?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-red-600">✗</span> No Incluido
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 bg-red-50 p-3 rounded-lg">
                    {service.excluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;