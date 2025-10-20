import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
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

  const { deleteService, updateServiceStatus, clearDuplicatesAndReset } = useServicesStore();
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
    if (window.confirm(`¿Estás seguro de que quieres eliminar el servicio "${service.code}"?`)) {
      deleteService(service.id);
    }
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

  const renderServiceStats = () => {
    if (currentView !== 'list') return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('services.totalServices') || 'Total Servicios'}</p>
              <p className="text-2xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.pending')}</p>
              <p className="text-2xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Cog6ToothIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Curso</p>
              <p className="text-2xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <InformationCircleIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>
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
                    onStatusChange={(status) => updateServiceStatus(selectedService.id, status)}
                    userRole={user?.role}
                  />
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
      {renderServiceStats()}
      {renderContent()}
      {renderModals()}
    </div>
  );
};

// Componente para mostrar detalles del servicio
const ServiceDetails = ({ service, onEdit, onDelete, onStatusChange, userRole }) => {
  if (!service) return null;
  
  const isAgency = userRole === 'agency';

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      on_way: 'bg-yellow-100 text-yellow-800',
      in_service: 'bg-green-100 text-green-800',
      finished: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Información Principal */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{service.code}</h3>
            <p className="text-sm text-gray-600">{service.type}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
              {service.status}
            </span>
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
        </div>

        <div>
          {/* Información del Servicio */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Información del Servicio</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Título:</strong> {service.title || 'Sin título'}</p>
              <p><strong>Tipo:</strong> {service.type?.replace('_', ' ') || 'N/A'}</p>
              <p><strong>Destino:</strong> {service.destination || 'N/A'}</p>
              <p><strong>Duración:</strong> {service.duration || 'N/A'} horas</p>
              <p><strong>Capacidad máxima:</strong> {service.maxParticipants || 'N/A'} personas</p>
              <p><strong>Precio base:</strong> S/. {service.basePrice?.toFixed(2) || service.price?.toFixed(2) || '0.00'} por persona</p>
              <p><strong>Idiomas disponibles:</strong> {service.languages?.join(', ') || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones de Estado - Solo para no agencias */}
      {!isAgency && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-medium text-gray-900 mb-4">Cambiar Estado</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onStatusChange('pending')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              Pendiente
            </button>
            <button
              onClick={() => onStatusChange('on_way')}
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
            >
              En Camino
            </button>
            <button
              onClick={() => onStatusChange('in_service')}
              className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
            >
              En Servicio
            </button>
            <button
              onClick={() => onStatusChange('finished')}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              Finalizado
            </button>
            <button
              onClick={() => onStatusChange('cancelled')}
              className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
              Cancelado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;