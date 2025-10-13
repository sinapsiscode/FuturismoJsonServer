import React, { useState, useEffect } from 'react';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  CalendarDaysIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChevronUpDownIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useServicesStore } from '../../stores/servicesStore';
import { useAuthStore } from '../../stores/authStore';
import useModulesConfigStore from '../../stores/modulesConfigStore';
import { SERVICE_STATUS, STATUS_COLORS } from '../../utils/constants';
// import Pagination from '../common/Pagination';

const getStatusBadge = (status) => {
  const statusConfig = {
    [SERVICE_STATUS.PENDING]: { 
      label: 'Pendiente', 
      className: 'bg-gray-100 text-gray-800 border-gray-200' 
    },
    [SERVICE_STATUS.ON_WAY]: { 
      label: 'En Camino', 
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
    },
    [SERVICE_STATUS.IN_SERVICE]: { 
      label: 'En Servicio', 
      className: 'bg-green-100 text-green-800 border-green-200' 
    },
    [SERVICE_STATUS.FINISHED]: { 
      label: 'Finalizado', 
      className: 'bg-blue-100 text-blue-800 border-blue-200' 
    },
    [SERVICE_STATUS.CANCELLED]: { 
      label: 'Cancelado', 
      className: 'bg-red-100 text-red-800 border-red-200' 
    }
  };

  const config = statusConfig[status] || statusConfig[SERVICE_STATUS.PENDING];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

const ServicesList = ({
  onEdit,
  onDelete,
  onView,
  onCreate,
  showFilters = true,
  compact = false,
  showPagination = true,
  showHeader = true,
  maxItems = null,
  title = "Lista de Servicios"
}) => {
  const {
    services,
    isLoading,
    error,
    pagination,
    filters,
    loadServices,
    setFilters,
    clearFilters,
    setPage
  } = useServicesStore();

  const { user } = useAuthStore();
  const { modules } = useModulesConfigStore();

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Obtener tipos de servicio desde la configuración
  const serviceTypes = modules?.serviceTypes?.serviceTypes || [];

  useEffect(() => {
    loadServices();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedServices = () => {
    if (!Array.isArray(services)) return [];

    let sortedServices = [...services];

    // Aplicar límite de items si se especifica
    if (maxItems && maxItems > 0) {
      sortedServices = sortedServices.slice(0, maxItems);
    }

    sortedServices.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sortedServices;
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters({ [filterKey]: value });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString?.slice(0, 5) || '--:--';
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">
              {Array.isArray(services) ? services.length : 0} servicios registrados
            </p>
          </div>
          {onCreate && user?.role !== 'agency' && (
            <button
              onClick={onCreate}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </button>
          )}
        </div>
      )}

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value={SERVICE_STATUS.PENDING}>Pendiente</option>
                <option value={SERVICE_STATUS.ON_WAY}>En Camino</option>
                <option value={SERVICE_STATUS.IN_SERVICE}>En Servicio</option>
                <option value={SERVICE_STATUS.FINISHED}>Finalizado</option>
                <option value={SERVICE_STATUS.CANCELLED}>Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                {serviceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Guía
              </label>
              <input
                type="text"
                value={filters.guide}
                onChange={(e) => handleFilterChange('guide', e.target.value)}
                placeholder="Nombre del guía"
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <input
                type="text"
                value={filters.client}
                onChange={(e) => handleFilterChange('client', e.target.value)}
                placeholder="Nombre del cliente"
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('code')}
                >
                  <div className="flex items-center">
                    Código
                    <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Fecha/Hora
                    <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guía
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Estado
                    <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Precio
                    <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-500">Cargando servicios...</span>
                    </div>
                  </td>
                </tr>
              ) : getSortedServices().length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No hay servicios
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        No se encontraron servicios con los filtros aplicados.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                getSortedServices().map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {service.code}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(service.date)}
                        </div>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {formatTime(service.startTime)} - {formatTime(service.endTime)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {service.client?.name || 'Sin asignar'}
                        </div>
                        {service.client?.phone && (
                          <div className="flex items-center mt-1">
                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {service.client.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {service.destination}
                        </div>
                        {service.participants && (
                          <div className="flex items-center mt-1">
                            <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {service.participants} pax
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.guide?.name || (
                          <span className="text-gray-400 italic">Sin asignar</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(service.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {service.price?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(service)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        )}
                        {onEdit && user?.role !== 'agency' && (
                          <button
                            onClick={() => onEdit(service)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && user?.role !== 'agency' && (
                          <button
                            onClick={() => onDelete(service)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {showPagination && !isLoading && Array.isArray(services) && services.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 text-center text-sm text-gray-500">
            Mostrando {maxItems ? Math.min(services.length, maxItems) : services.length} servicios
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesList;