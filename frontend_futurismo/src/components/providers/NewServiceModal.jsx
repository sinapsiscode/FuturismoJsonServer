import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const NewServiceModal = ({ isOpen, onClose, onSave, selectedCategory, categories }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    category: selectedCategory || '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // Actualizar la categoría cuando cambia o cuando se abre el modal
  useEffect(() => {
    if (isOpen && selectedCategory) {
      setFormData(prev => ({
        ...prev,
        category: selectedCategory
      }));
    }
  }, [isOpen, selectedCategory]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del servicio es requerido';
    }
    if (!formData.category) {
      newErrors.category = 'Debe seleccionar una categoría';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await onSave(formData);
        // Solo cerrar si onSave fue exitoso
        handleClose();
      } catch (error) {
        console.error('Error en handleSubmit:', error);
        // No cerrar el modal si hay error, para que el usuario pueda corregir
      }
    }
  };

  const handleClose = () => {
    setFormData({ name: '', category: selectedCategory || '', description: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BriefcaseIcon className="w-5 h-5 mr-2 text-blue-600" />
            Nuevo Servicio
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            {/* Nombre del Servicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Servicio *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Masajes relajantes, City tour, etc."
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar categoría</option>
                {Array.isArray(categories) && categories.map(category => {
                  try {
                    return (
                      <option key={category.id} value={category.id}>
                        {t(category.name) || category.name}
                      </option>
                    );
                  } catch (error) {
                    console.warn('Error traduciendo categoría:', category, error);
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    );
                  }
                })}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">{errors.category}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe el servicio que se ofrece..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Servicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

NewServiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
  categories: PropTypes.array.isRequired
};

export default NewServiceModal;
