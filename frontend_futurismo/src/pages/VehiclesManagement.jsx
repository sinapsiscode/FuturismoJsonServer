import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TruckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentTextIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import useVehiclesStore from '../stores/vehiclesStore';
import { 
  VEHICLE_DOCUMENTS,
  VEHICLE_DOCUMENT_LABELS
} from '../constants/vehiclesConstants';
import toast from 'react-hot-toast';

const VehiclesManagement = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear()
  });

  const [documentFormData, setDocumentFormData] = useState({
    [VEHICLE_DOCUMENTS.SOAT]: { number: '', expiry: '' },
    [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: { number: '', expiry: '' }
  });
  
  const [errors, setErrors] = useState({});

  // Store
  const {
    vehicles,
    loading,
    filters,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    setFilters
  } = useVehiclesStore();

  // Cargar datos al montar
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Recargar cuando cambien filtros
  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.plate || formData.plate.length < 3) {
      newErrors.plate = 'La placa es requerida (mínimo 3 caracteres)';
    }

    if (!formData.brand) {
      newErrors.brand = 'La marca es requerida';
    }

    if (!formData.model) {
      newErrors.model = 'El modelo es requerido';
    }

    // Validar documentos
    if (!documentFormData[VEHICLE_DOCUMENTS.SOAT].expiry) {
      newErrors.soatExpiry = 'La fecha de vencimiento del SOAT es requerida';
    }

    if (!documentFormData[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry) {
      newErrors.technicalExpiry = 'La fecha de vencimiento de la revisión técnica es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrija los errores en el formulario');
      return;
    }

    try {
      // Preparar datos con documentos
      const vehicleData = {
        ...formData,
        documents: documentFormData
      };

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        await createVehicle(vehicleData);
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear()
    });
    setDocumentFormData({
      [VEHICLE_DOCUMENTS.SOAT]: { number: '', expiry: '' },
      [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: { number: '', expiry: '' }
    });
    setErrors({});
    setEditingVehicle(null);
  };

  // Manejar edición
  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year
    });
    
    // Preparar documentos
    const docs = {};
    docs[VEHICLE_DOCUMENTS.SOAT] = vehicle.documents?.[VEHICLE_DOCUMENTS.SOAT] || { number: '', expiry: '' };
    docs[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW] = vehicle.documents?.[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW] || { number: '', expiry: '' };
    
    if (docs[VEHICLE_DOCUMENTS.SOAT].expiry) {
      docs[VEHICLE_DOCUMENTS.SOAT].expiry = docs[VEHICLE_DOCUMENTS.SOAT].expiry.split('T')[0];
    }
    if (docs[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry) {
      docs[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry = docs[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry.split('T')[0];
    }
    
    setDocumentFormData(docs);
    setShowForm(true);
  };

  // Manejar eliminación
  const handleDelete = async (vehicle) => {
    if (window.confirm(`¿Está seguro de eliminar el vehículo ${vehicle.plate}?`)) {
      await deleteVehicle(vehicle.id);
    }
  };

  // Ver detalles
  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TruckIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Vehículos</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Vehículo
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por placa, marca o modelo..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Lista de vehículos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SOAT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revisión Técnica
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No se encontraron vehículos
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.plate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vehicle.brand} {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          Año: {vehicle.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vehicle.documents?.[VEHICLE_DOCUMENTS.SOAT] ? (
                          <div>
                            <div className="text-sm text-gray-900">
                              {vehicle.documents[VEHICLE_DOCUMENTS.SOAT].number || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Vence: {vehicle.documents[VEHICLE_DOCUMENTS.SOAT].expiry ? 
                                new Date(vehicle.documents[VEHICLE_DOCUMENTS.SOAT].expiry).toLocaleDateString() : 
                                'No registrado'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No registrado</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vehicle.documents?.[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW] ? (
                          <div>
                            <div className="text-sm text-gray-900">
                              {vehicle.documents[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].number || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Vence: {vehicle.documents[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry ? 
                                new Date(vehicle.documents[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry).toLocaleDateString() : 
                                'No registrado'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No registrado</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(vehicle)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información del Vehículo */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Placa *
                      </label>
                      <input
                        type="text"
                        value={formData.plate}
                        onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                        className={`w-full border rounded-lg px-3 py-2 ${errors.plate ? 'border-red-500' : ''}`}
                      />
                      {errors.plate && <p className="text-red-500 text-sm mt-1">{errors.plate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marca *
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 ${errors.brand ? 'border-red-500' : ''}`}
                      />
                      {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modelo *
                      </label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 ${errors.model ? 'border-red-500' : ''}`}
                      />
                      {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Año
                      </label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        min={2000}
                        max={new Date().getFullYear() + 1}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Documentos */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Documentos</h3>
                    <div className="space-y-4">
                      {/* SOAT */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SOAT - Número
                        </label>
                        <input
                          type="text"
                          value={documentFormData[VEHICLE_DOCUMENTS.SOAT].number}
                          onChange={(e) => setDocumentFormData({
                            ...documentFormData,
                            [VEHICLE_DOCUMENTS.SOAT]: {
                              ...documentFormData[VEHICLE_DOCUMENTS.SOAT],
                              number: e.target.value
                            }
                          })}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SOAT - Vencimiento *
                        </label>
                        <input
                          type="date"
                          value={documentFormData[VEHICLE_DOCUMENTS.SOAT].expiry}
                          onChange={(e) => setDocumentFormData({
                            ...documentFormData,
                            [VEHICLE_DOCUMENTS.SOAT]: {
                              ...documentFormData[VEHICLE_DOCUMENTS.SOAT],
                              expiry: e.target.value
                            }
                          })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.soatExpiry ? 'border-red-500' : ''}`}
                        />
                        {errors.soatExpiry && <p className="text-red-500 text-sm mt-1">{errors.soatExpiry}</p>}
                      </div>

                      {/* Revisión Técnica */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Revisión Técnica - Número
                        </label>
                        <input
                          type="text"
                          value={documentFormData[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].number}
                          onChange={(e) => setDocumentFormData({
                            ...documentFormData,
                            [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: {
                              ...documentFormData[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW],
                              number: e.target.value
                            }
                          })}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Revisión Técnica - Vencimiento *
                        </label>
                        <input
                          type="date"
                          value={documentFormData[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry}
                          onChange={(e) => setDocumentFormData({
                            ...documentFormData,
                            [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: {
                              ...documentFormData[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW],
                              expiry: e.target.value
                            }
                          })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.technicalExpiry ? 'border-red-500' : ''}`}
                        />
                        {errors.technicalExpiry && <p className="text-red-500 text-sm mt-1">{errors.technicalExpiry}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : (editingVehicle ? 'Actualizar' : 'Crear')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalles */}
        {showDetails && selectedVehicle && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Detalles del Vehículo</h2>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setSelectedVehicle(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Información del vehículo */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Información General</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Placa</dt>
                        <dd className="text-sm text-gray-900 font-bold">{selectedVehicle.plate}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Vehículo</dt>
                        <dd className="text-sm text-gray-900">{selectedVehicle.brand} {selectedVehicle.model}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Año</dt>
                        <dd className="text-sm text-gray-900">{selectedVehicle.year}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Documentos</h3>
                    <dl className="space-y-3">
                      {selectedVehicle.documents?.[VEHICLE_DOCUMENTS.SOAT] && (
                        <div className="border-l-4 border-blue-500 pl-3">
                          <dt className="text-sm font-medium text-gray-700">SOAT</dt>
                          <dd className="text-sm text-gray-600">
                            Número: {selectedVehicle.documents[VEHICLE_DOCUMENTS.SOAT].number || 'N/A'}
                          </dd>
                          <dd className="text-sm text-gray-600">
                            Vence: {selectedVehicle.documents[VEHICLE_DOCUMENTS.SOAT].expiry ? 
                              new Date(selectedVehicle.documents[VEHICLE_DOCUMENTS.SOAT].expiry).toLocaleDateString() : 
                              'No registrado'}
                          </dd>
                        </div>
                      )}
                      
                      {selectedVehicle.documents?.[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW] && (
                        <div className="border-l-4 border-green-500 pl-3">
                          <dt className="text-sm font-medium text-gray-700">Revisión Técnica</dt>
                          <dd className="text-sm text-gray-600">
                            Número: {selectedVehicle.documents[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].number || 'N/A'}
                          </dd>
                          <dd className="text-sm text-gray-600">
                            Vence: {selectedVehicle.documents[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry ? 
                              new Date(selectedVehicle.documents[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry).toLocaleDateString() : 
                              'No registrado'}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesManagement;