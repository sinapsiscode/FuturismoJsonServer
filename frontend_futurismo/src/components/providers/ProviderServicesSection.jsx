import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TagIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { SERVICE_TYPES } from '../../constants/providersConstants';

const ProviderServicesSection = ({ 
  services, 
  handleAddService, 
  handleRemoveService, 
  handleServiceChange,
  selectedCategory 
}) => {
  const { t } = useTranslation();

  const getServiceOptions = () => {
    const categoryServices = SERVICE_TYPES[selectedCategory?.toUpperCase()] || [];
    return categoryServices.map(service => ({
      value: service,
      label: t(service)
    }));
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
        <button
          type="button"
          onClick={handleAddService}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          {t('providers.form.actions.addService')}
        </button>
      </div>
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