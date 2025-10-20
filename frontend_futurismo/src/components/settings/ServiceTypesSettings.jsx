import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ServiceTypesSettings = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingType, setEditingType] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    description: '',
    icon: 'briefcase',
    category: 'general'
  });

  // Cargar tipos de servicio
  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/config/service-types');
      const result = await response.json();

      if (result.success) {
        setServiceTypes(result.data.serviceTypes || []);
      } else {
        toast.error('Error al cargar tipos de servicio');
      }
    } catch (error) {
      console.error('Error loading service types:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.value || !formData.label) {
      toast.error('Valor y etiqueta son requeridos');
      return;
    }

    try {
      const url = editingType
        ? `/api/config/service-types/${editingType.value}`
        : '/api/config/service-types';

      const method = editingType ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingType ? 'Tipo actualizado' : 'Tipo creado');
        loadServiceTypes();
        resetForm();
      } else {
        toast.error(result.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving service type:', error);
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (value) => {
    if (!confirm('¿Estás seguro de eliminar este tipo de servicio?')) {
      return;
    }

    try {
      const response = await fetch(`/api/config/service-types/${value}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Tipo eliminado');
        loadServiceTypes();
      } else {
        toast.error(result.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting service type:', error);
      toast.error('Error al eliminar');
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({
      value: type.value,
      label: type.label,
      description: type.description || '',
      icon: type.icon || 'briefcase',
      category: type.category || 'general'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      value: '',
      label: '',
      description: '',
      icon: 'briefcase',
      category: 'general'
    });
    setEditingType(null);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tipos de Servicio</h3>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona los tipos de servicio disponibles en el sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? (
            <>
              <XMarkIcon className="w-5 h-5" />
              Cancelar
            </>
          ) : (
            <>
              <PlusIcon className="w-5 h-5" />
              Nuevo Tipo
            </>
          )}
        </button>
      </div>

      {/* Formulario de creación/edición */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {editingType ? 'Editar Tipo de Servicio' : 'Nuevo Tipo de Servicio'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (ID) *
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="tour_privado"
                required
                disabled={editingType !== null}
              />
              <p className="text-xs text-gray-500 mt-1">
                Identificador único (sin espacios, usar guiones bajos)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiqueta *
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tour Privado"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descripción del tipo de servicio"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícono
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="briefcase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="general">General</option>
                <option value="tour">Tour</option>
                <option value="transport">Transporte</option>
                <option value="special">Especial</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckIcon className="w-5 h-5" />
              {editingType ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de tipos de servicio */}
      <div className="space-y-3">
        {serviceTypes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BriefcaseIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No hay tipos de servicio configurados</p>
            <p className="text-sm mt-1">Crea el primer tipo de servicio</p>
          </div>
        ) : (
          serviceTypes.map((type) => (
            <div
              key={type.value}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{type.label}</h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        ID: <code className="bg-gray-100 px-1 rounded">{type.value}</code>
                      </span>
                      <span className="text-xs text-gray-500">
                        Categoría: <span className="bg-gray-100 px-1 rounded">{type.category}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(type)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(type.value)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceTypesSettings;
