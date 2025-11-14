import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TagIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { SERVICE_TYPES } from '../../constants/providersConstants';
import useProvidersStore from '../../stores/providersStore';
import NewServiceModal from './NewServiceModal';
import toast from 'react-hot-toast';

const ProviderServicesSection = ({
  services,
  handleAddService,
  handleRemoveService,
  handleServiceChange,
  selectedCategory
}) => {
  const { t } = useTranslation();
  const { categories, services: storeServices, actions } = useProvidersStore();
  const [showServiceModal, setShowServiceModal] = useState(false);

  const getServiceOptions = () => {
    if (!selectedCategory) return [];

    // Intentar encontrar la categoría por ID si selectedCategory es un ID
    let categoryValue = selectedCategory;
    let categoryId = selectedCategory;
    let categoryName = null;

    // Si categories está disponible y selectedCategory parece ser un ID
    if (Array.isArray(categories) && categories.length > 0) {
      const foundCategory = categories.find(cat => cat.id === selectedCategory);
      if (foundCategory) {
        categoryId = foundCategory.id;
        categoryName = foundCategory.name;
        // Extraer el último segmento del nombre de categoría
        // ej: "providers.categories.restaurant" -> "restaurant"
        const nameParts = foundCategory.name.split('.');
        categoryValue = nameParts[nameParts.length - 1];
      }
    }

    const options = [];

    // 1. Agregar servicios dinámicos del store (servicios creados por el usuario)
    if (Array.isArray(storeServices) && storeServices.length > 0) {
      const dynamicServices = storeServices.filter(service => {
        // Comparar por ID directo, por valor de categoría, o por nombre completo
        const matches = service.category === categoryId ||
                       service.category === categoryValue ||
                       service.category === categoryName;

        return matches;
      });

      dynamicServices.forEach(service => {
        options.push({
          value: service.id,
          label: service.name,
          isDynamic: true
        });
      });
    }

    // 2. Agregar servicios estáticos de las constantes (fallback)
    const categoryKey = categoryValue ? categoryValue.toUpperCase() : '';
    const categoryServices = SERVICE_TYPES[categoryKey];

    if (categoryServices && Array.isArray(categoryServices)) {
      categoryServices.forEach(service => {
        try {
          options.push({
            value: service,
            label: t(service) || service,
            isDynamic: false
          });
        } catch (error) {
          console.warn('Error traduciendo servicio:', service, error);
          options.push({
            value: service,
            label: service,
            isDynamic: false
          });
        }
      });
    }

    return options;
  };

  const handleSaveService = async (serviceData) => {
    try {
      await actions.createService(serviceData);
      toast.success('Servicio creado exitosamente');
    } catch (error) {
      const errorMessage = error.message || 'Error al crear servicio';
      toast.error(errorMessage);
      throw error; // Re-lanzar el error para que NewServiceModal sepa que falló
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <TagIcon className="w-5 h-5 mr-2" />
        {t('providers.form.sections.services')}
      </h3>

      <div className="space-y-2">
        {services.map((service, index) => (
          <div key={index} className="flex gap-2">
            <select
              value={service}
              onChange={(e) => handleServiceChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('providers.form.placeholders.selectService')}</option>
              {getServiceOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {services.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveService(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <MinusIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddService}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            {t('providers.form.actions.addService')}
          </button>
          <button
            type="button"
            onClick={() => setShowServiceModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            title="Crear Nuevo Servicio"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo Servicio
          </button>
        </div>
      </div>

      {/* Modal de Nuevo Servicio */}
      <NewServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSave={handleSaveService}
        selectedCategory={selectedCategory}
        categories={categories}
      />
    </div>
  );
};

ProviderServicesSection.propTypes = {
  services: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleAddService: PropTypes.func.isRequired,
  handleRemoveService: PropTypes.func.isRequired,
  handleServiceChange: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string
};

export default ProviderServicesSection;