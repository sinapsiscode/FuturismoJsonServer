import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  PlusIcon, 
  StarIcon, 
  MapPinIcon, 
  TagIcon 
} from '@heroicons/react/24/outline';

const AvailableProviderCard = ({ provider, onAdd }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className="font-semibold">{provider.name}</h5>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <TagIcon className="w-4 h-4" />
              {t(`providers.categories.${provider.category}`)}
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              {t(provider.location)}
            </span>
            <span className="flex items-center gap-1">
              <StarIcon className="w-4 h-4" />
              {provider.rating}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {t('providers.pricing.label')}: {provider.pricing.currency} {provider.pricing.basePrice} / 
            {t(`providers.pricing.types.${provider.pricing.type}`)}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <PlusIcon className="w-4 h-4" />
          {t('common.add')}
        </button>
      </div>
    </div>
  );
};

AvailableProviderCard.propTypes = {
  provider: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired
};

export default AvailableProviderCard;