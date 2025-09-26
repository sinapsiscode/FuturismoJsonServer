import React, { useState, useEffect } from 'react';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import useClientsStore from '../stores/clientsStore';
import useAgencyStore from '../stores/agencyStore';
import { 
  CLIENT_TYPES, 
  CLIENT_TYPE_LABELS,
  CLIENT_STATUS,
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_COLORS,
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  CLIENT_VALIDATIONS,
  CLIENT_MESSAGES
} from '../constants/clientsConstants';
import toast from 'react-hot-toast';

const ClientsManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    type: CLIENT_TYPES.AGENCY,
    name: '',
    documentType: DOCUMENT_TYPES.RUC,
    documentNumber: '',
    email: '',
    phone: '',
    address: '',
    contact: '',
    status: CLIENT_STATUS.ACTIVE
  });
  const [errors, setErrors] = useState({});
  const [warningModal, setWarningModal] = useState({ show: false, message: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, client: null });
  const [pointsModal, setPointsModal] = useState({ show: false, client: null });
  const [pointsData, setPointsData] = useState({ amount: '', reason: '' });

  // Store
  const {
    clients,
    isLoading,
    filters,
    pagination,
    initialize,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
    toggleClientStatus,
    setFilters,
    clearFilters,
    setPage,
    getStatistics,
    validateRUC
  } = useClientsStore();

  // Agency store for points management
  const { actions: agencyActions } = useAgencyStore();

  // Cargar datos al montar
  useEffect(() => {
    initialize().catch(console.error);
  }, []);

  // Estadísticas con validación defensiva
  const stats = {
    total: Array.isArray(clients) ? clients.length : 0,
    active: Array.isArray(clients) ? clients.filter(c => c.status === CLIENT_STATUS.ACTIVE).length : 0,
    agencies: Array.isArray(clients) ? clients.filter(c => c.type === CLIENT_TYPES.AGENCY).length : 0,
    companies: Array.isArray(clients) ? clients.filter(c => c.type === CLIENT_TYPES.COMPANY).length : 0
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < CLIENT_VALIDATIONS.NAME_MIN_LENGTH) {
      newErrors.name = `El nombre debe tener al menos ${CLIENT_VALIDATIONS.NAME_MIN_LENGTH} caracteres`;
    }

    if (!formData.documentNumber) {
      newErrors.documentNumber = 'El número de documento es requerido';
    } else if (formData.documentType === DOCUMENT_TYPES.RUC && formData.documentNumber.length !== CLIENT_VALIDATIONS.RUC_LENGTH) {
      newErrors.documentNumber = 'El RUC debe tener 11 dígitos';
    }

    if (!formData.email || !CLIENT_VALIDATIONS.EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }

    if (!formData.phone || formData.phone.length !== 9 || formData.phone[0] !== '9') {
      newErrors.phone = 'El teléfono debe tener 9 dígitos y empezar con 9';
    }

    if (formData.type !== CLIENT_TYPES.INDIVIDUAL && !formData.contact) {
      newErrors.contact = 'El contacto es requerido para empresas y agencias';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData);
        toast.success(CLIENT_MESSAGES.UPDATE_SUCCESS);
      } else {
        await createClient(formData);
        toast.success(CLIENT_MESSAGES.CREATE_SUCCESS);
      }
      
      setShowForm(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || (editingClient ? CLIENT_MESSAGES.UPDATE_ERROR : CLIENT_MESSAGES.CREATE_ERROR));
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      type: CLIENT_TYPES.AGENCY,
      name: '',
      documentType: DOCUMENT_TYPES.RUC,
      documentNumber: '',
      email: '',
      phone: '',
      address: '',
      contact: '',
      status: CLIENT_STATUS.ACTIVE
    });
    setErrors({});
    setEditingClient(null);
  };

  // Editar cliente
  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      type: client.type || CLIENT_TYPES.AGENCY,
      name: client.name,
      documentType: client.documentType || DOCUMENT_TYPES.RUC,
      documentNumber: client.documentNumber || client.ruc || '',
      email: client.email,
      phone: client.phone,
      address: client.address || '',
      contact: client.contact || '',
      status: client.status || CLIENT_STATUS.ACTIVE
    });
    setShowForm(true);
  };

  // Mostrar modal de confirmación para eliminar
  const showDeleteModal = (client) => {
    setDeleteModal({ show: true, client });
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteModal.client) return;

    try {
      await deleteClient(deleteModal.client.id);
      toast.success(CLIENT_MESSAGES.DELETE_SUCCESS);
      setDeleteModal({ show: false, client: null });
    } catch (error) {
      toast.error(CLIENT_MESSAGES.DELETE_ERROR);
    }
  };

  // Cambiar estado
  const handleToggleStatus = async (client) => {
    try {
      await toggleClientStatus(client.id);
      toast.success(`Cliente ${client.status === CLIENT_STATUS.ACTIVE ? 'desactivado' : 'activado'}`);
    } catch (error) {
      toast.error('Error al cambiar estado del cliente');
    }
  };

  // Ver detalles
  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  // Manejar adición de puntos
  const handleAddPoints = async () => {
    const amount = parseInt(pointsData.amount);
    
    if (!amount || amount <= 0) {
      toast.error('Ingrese una cantidad válida de puntos');
      return;
    }

    if (!pointsData.reason || pointsData.reason.trim() === '') {
      toast.error('Ingrese un motivo para agregar puntos');
      return;
    }

    try {
      await agencyActions.createPointsTransaction({
        agencyId: pointsModal.client.id,
        type: 'earned',
        amount: amount,
        reason: pointsData.reason,
        processedBy: 'manual'
      });
      
      toast.success(`Se agregaron ${amount} puntos a ${pointsModal.client.name}`);
      setPointsModal({ show: false, client: null });
      setPointsData({ amount: '', reason: '' });
      
      // Refresh client data
      await loadClients();
    } catch (error) {
      toast.error('Error al agregar puntos');
    }
  };

  // Validar documento al cambiar
  const handleDocumentChange = async (value) => {
    setFormData({ ...formData, documentNumber: value });
    
    if (formData.documentType === DOCUMENT_TYPES.RUC && value.length === CLIENT_VALIDATIONS.RUC_LENGTH) {
      try {
        const result = await validateRUC(value);
        if (result.exists && !editingClient) {
          setErrors({ ...errors, documentNumber: CLIENT_MESSAGES.DUPLICATE_DOCUMENT });
        }
      } catch (error) {
        setWarningModal({ 
          show: true, 
          message: `Error al validar RUC: ${error.message || 'Error desconocido'}` 
        });
      }
    }
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    const colors = {
      [CLIENT_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
      [CLIENT_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800',
      [CLIENT_STATUS.SUSPENDED]: 'bg-red-100 text-red-800',
      [CLIENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading && clients.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Agencias</h1>
          <p className="text-gray-600">Administra agencias y empresas</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nueva Agencia</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Agencias</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Agencias</p>
              <p className="text-2xl font-bold text-gray-900">{stats.agencies}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Todos los tipos</option>
              {Object.entries(CLIENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Todos los estados</option>
              {Object.entries(CLIENT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar filtros
            </button>
          </div>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nombre, RUC o email..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(clients) ? clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">
                        {client.documentType || 'RUC'}: {client.documentNumber || client.ruc}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {CLIENT_TYPE_LABELS[client.type] || client.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-900">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {client.email}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                      {CLIENT_STATUS_LABELS[client.status] || client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {client.rating && (
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-900 ml-1">{client.rating}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(client)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver detalles"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {client.type === CLIENT_TYPES.AGENCY && (
                        <button
                          onClick={() => {
                            setPointsModal({ show: true, client });
                            setPointsData({ amount: '', reason: '' });
                          }}
                          className="text-purple-600 hover:text-purple-800"
                          title="Agregar puntos"
                        >
                          <GiftIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(client)}
                        className={client.status === CLIENT_STATUS.ACTIVE ? 'text-gray-600 hover:text-gray-800' : 'text-green-600 hover:text-green-800'}
                        title={client.status === CLIENT_STATUS.ACTIVE ? 'Desactivar' : 'Activar'}
                      >
                        {client.status === CLIENT_STATUS.ACTIVE ? (
                          <XCircleIcon className="h-5 w-5" />
                        ) : (
                          <CheckCircleIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => showDeleteModal(client)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No hay clientes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {((pagination?.page || 1) - 1) * (pagination?.limit || 10) + 1} a{' '}
              {Math.min((pagination?.page || 1) * (pagination?.limit || 10), pagination?.total || 0)} de{' '}
              {pagination?.total || 0} resultados
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((pagination?.page || 1) - 1)}
                disabled={(pagination?.page || 1) === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((pagination?.page || 1) + 1)}
                disabled={(pagination?.page || 1) === (pagination?.totalPages || 1)}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {editingClient ? 'Editar Agencia' : 'Nueva Agencia'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Agencia
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(CLIENT_TYPE_LABELS).map(([value, label]) => (
                    <label
                      key={value}
                      className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                        formData.type === value
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        value={value}
                        checked={formData.type === value}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Datos básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre / Razón Social *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo y Número de Documento *
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={formData.documentNumber}
                      onChange={(e) => handleDocumentChange(e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.documentNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.documentNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.documentNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    placeholder="9XXXXXXXX (9 dígitos)"
                    maxLength="9"
                    pattern="9[0-9]{8}"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value === '' || (value[0] === '9' && value.length <= 9)) {
                        setFormData({ ...formData, phone: value });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Contacto (para empresas/agencias) */}
              {formData.type !== CLIENT_TYPES.INDIVIDUAL && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Persona de Contacto *
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contact ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.contact && (
                    <p className="text-sm text-red-600 mt-1">{errors.contact}</p>
                  )}
                </div>
              )}


              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(CLIENT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Guardando...' : (editingClient ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedClient && (
        <div className="modal-overlay">
          <div className="modal-content p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles de la Agencia
              </h3>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedClient(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Info básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Información General</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Nombre:</span>
                      <p className="font-medium">{selectedClient.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Tipo:</span>
                      <p className="font-medium">
                        {CLIENT_TYPE_LABELS[selectedClient.type] || selectedClient.type}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Documento:</span>
                      <p className="font-medium">
                        {selectedClient.documentType || 'RUC'}: {selectedClient.documentNumber || selectedClient.ruc}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Estado:</span>
                      <p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedClient.status)}`}>
                          {CLIENT_STATUS_LABELS[selectedClient.status] || selectedClient.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Contacto</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{selectedClient.phone}</span>
                    </div>
                    {selectedClient.address && (
                      <div className="flex items-start">
                        <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                        <span>{selectedClient.address}</span>
                      </div>
                    )}
                    {selectedClient.contact && (
                      <div>
                        <span className="text-sm text-gray-600">Contacto:</span>
                        <p className="font-medium">{selectedClient.contact}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">{t('common.statistics')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{t('dashboard.totalReservations')}</p>
                    <p className="text-lg font-semibold">{selectedClient.totalBookings || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{t('dashboard.totalIncome')}</p>
                    <p className="text-lg font-semibold">
                      S/ {(selectedClient.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                  {selectedClient.type === CLIENT_TYPES.AGENCY && (
                    <>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Puntos Actuales</p>
                        <p className="text-lg font-semibold text-purple-600">
                          <StarIcon className="h-4 w-4 inline mr-1 text-yellow-500" />
                          {(selectedClient.pointsBalance || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Puntos Totales</p>
                        <p className="text-lg font-semibold text-purple-600">
                          {(selectedClient.totalEarned || 0).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Rating */}
              {selectedClient.rating && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Calificación</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(selectedClient.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {selectedClient.rating} / 5.0
                    </span>
                  </div>
                </div>
              )}

              {/* Fechas */}
              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                <span>Agencia desde: {new Date(selectedClient.since || selectedClient.createdAt).toLocaleDateString()}</span>
                <span>Última actualización: {new Date(selectedClient.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {warningModal.show && (
        <div className="modal-overlay">
          <div className="modal-content p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Advertencia</h3>
              </div>
              <button
                onClick={() => setWarningModal({ show: false, message: '' })}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">{warningModal.message}</p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setWarningModal({ show: false, message: '' })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.client && (
        <div className="modal-overlay">
          <div className="modal-content p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
              </div>
              <button
                onClick={() => setDeleteModal({ show: false, client: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              ¿Está seguro de que desea eliminar a <span className="font-semibold">{deleteModal.client.name}</span>? 
              Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, client: null })}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Points Modal */}
      {pointsModal.show && pointsModal.client && (
        <div className="modal-overlay">
          <div className="modal-content p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <GiftIcon className="h-6 w-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">Agregar Puntos</h3>
              </div>
              <button
                onClick={() => {
                  setPointsModal({ show: false, client: null });
                  setPointsData({ amount: '', reason: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Agregando puntos a: <span className="font-semibold">{pointsModal.client.name}</span>
              </p>
              <p className="text-sm text-gray-500">
                Balance actual: <span className="font-medium text-purple-600">
                  <StarIcon className="h-3 w-3 inline mr-1 text-yellow-500" />
                  {(pointsModal.client.pointsBalance || 0).toLocaleString()} puntos
                </span>
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddPoints();
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad de puntos
                </label>
                <input
                  type="number"
                  value={pointsData.amount}
                  onChange={(e) => setPointsData({ ...pointsData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: 1000"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo
                </label>
                <textarea
                  value={pointsData.reason}
                  onChange={(e) => setPointsData({ ...pointsData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Bonificación por meta cumplida"
                  rows="3"
                  required
                />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      Los puntos se agregarán inmediatamente al balance de la agencia y podrán ser canjeados en la tienda de premios.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setPointsModal({ show: false, client: null });
                    setPointsData({ amount: '', reason: '' });
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Agregar Puntos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsManagement;