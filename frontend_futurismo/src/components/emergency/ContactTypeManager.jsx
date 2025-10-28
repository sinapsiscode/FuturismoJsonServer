import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhoneIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ContactTypeManager = ({ onContactTypesChanged }) => {
  const [contactTypes, setContactTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📞',
    description: '',
    color: '#6B7280',
    priority: 1
  });
  const [errors, setErrors] = useState({});

  // Iconos disponibles para contactos
  const availableIcons = [
    { value: '📞', label: '📞 Teléfono' },
    { value: '🚨', label: '🚨 Emergencia' },
    { value: '🏥', label: '🏥 Médico' },
    { value: '👮', label: '👮 Policía' },
    { value: '👤', label: '👤 Persona' },
    { value: '💼', label: '💼 Empresa' },
    { value: '🛡️', label: '🛡️ Seguro' },
    { value: '🚗', label: '🚗 Vehículo' },
    { value: '⛈️', label: '⛈️ Clima' },
    { value: '🏘️', label: '🏘️ Local' },
    { value: '📋', label: '📋 Operaciones' },
    { value: '🚒', label: '🚒 Bomberos' },
    { value: '🏛️', label: '🏛️ Embajada' },
    { value: '⛑️', label: '⛑️ Rescate' },
    { value: '📡', label: '📡 Comunicación' },
    { value: '🔧', label: '🔧 Soporte Técnico' }
  ];

  // Colores predefinidos
  const availableColors = [
    { value: '#DC2626', label: 'Rojo Intenso' },
    { value: '#EF4444', label: 'Rojo' },
    { value: '#F59E0B', label: 'Naranja' },
    { value: '#3B82F6', label: 'Azul' },
    { value: '#10B981', label: 'Verde' },
    { value: '#8B5CF6', label: 'Morado' },
    { value: '#6366F1', label: 'Índigo' },
    { value: '#EC4899', label: 'Rosa' },
    { value: '#06B6D4', label: 'Cian' },
    { value: '#84CC16', label: 'Lima' },
    { value: '#6B7280', label: 'Gris' },
    { value: '#14B8A6', label: 'Turquesa' }
  ];

  useEffect(() => {
    loadContactTypes();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const loadContactTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/emergency/contact-types', {
        headers: getAuthHeaders()
      });
      const result = await response.json();
      if (result.success) {
        setContactTypes(result.data || []);
      }
    } catch (error) {
      console.error('Error loading contact types:', error);
      toast.error('Error al cargar tipos de contacto');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.priority < 1 || formData.priority > 999) {
      newErrors.priority = 'La prioridad debe estar entre 1 y 999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = editingType
        ? `/api/emergency/contact-types/${editingType.id}`
        : '/api/emergency/contact-types';

      const method = editingType ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        await loadContactTypes();
        if (onContactTypesChanged) onContactTypesChanged();
        handleCloseModal();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error saving contact type:', error);
      toast.error('Error al guardar tipo de contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      icon: type.icon || '📞',
      description: type.description || '',
      color: type.color || '#6B7280',
      priority: type.priority || 1
    });
    setShowModal(true);
  };

  const handleDelete = async (typeId) => {
    if (!window.confirm('¿Está seguro de eliminar este tipo de contacto? Esta acción no se puede deshacer.')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/emergency/contact-types/${typeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        await loadContactTypes();
        if (onContactTypesChanged) onContactTypesChanged();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error deleting contact type:', error);
      toast.error('Error al eliminar tipo de contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingType(null);
    setFormData({
      name: '',
      icon: '📞',
      description: '',
      color: '#6B7280',
      priority: 1
    });
    setErrors({});
  };

  const movePriority = async (type, direction) => {
    const currentIndex = contactTypes.findIndex(t => t.id === type.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === contactTypes.length - 1)
    ) {
      return;
    }

    const newPriority = direction === 'up' ? type.priority - 1 : type.priority + 1;

    setLoading(true);
    try {
      const response = await fetch(`/api/emergency/contact-types/${type.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...type, priority: newPriority })
      });

      const result = await response.json();

      if (result.success) {
        await loadContactTypes();
        if (onContactTypesChanged) onContactTypesChanged();
      }
    } catch (error) {
      console.error('Error updating priority:', error);
      toast.error('Error al actualizar prioridad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tipos de Contacto de Emergencia
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los tipos de contacto disponibles para los protocolos de emergencia
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Tipo de Contacto
        </button>
      </div>

      {/* Contact Types List */}
      {loading && contactTypes.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando tipos de contacto...</p>
        </div>
      ) : contactTypes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <PhoneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay tipos de contacto creados</p>
          <p className="text-sm text-gray-500 mt-1">
            Haz clic en "Nuevo Tipo de Contacto" para crear uno
          </p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contactTypes.map((type, index) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => movePriority(type, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUpIcon className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-900 w-8 text-center">
                        {type.priority}
                      </span>
                      <button
                        onClick={() => movePriority(type, 'down')}
                        disabled={index === contactTypes.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl"
                        style={{ backgroundColor: type.color }}
                      >
                        {type.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {type.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {type.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-md">
                      {type.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(type)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center text-sm"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center text-sm"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingType ? 'Editar Tipo de Contacto' : 'Nuevo Tipo de Contacto'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Emergencia, Médico, Policía..."
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe cuándo usar este tipo de contacto..."
                  rows="3"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Icono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icono
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {availableIcons.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prioridad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad (orden)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.priority ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.priority && (
                    <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Menor número = mayor prioridad
                  </p>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: colorOption.value })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === colorOption.value
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: colorOption.value }}
                      title={colorOption.label}
                    />
                  ))}
                </div>
              </div>

              {/* Vista previa */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {formData.name || 'Nombre del tipo'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.description || 'Descripción del tipo'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Guardando...' : editingType ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

ContactTypeManager.propTypes = {
  onContactTypesChanged: PropTypes.func
};

export default ContactTypeManager;
