import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { PROVIDER_CATEGORIES } from '../../constants/providersConstants';

const ProviderSearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  selectedCategory,
  setSelectedCategory,
  locations,
  categories
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 space-y-3">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('providers.assignment.searchProviders')}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <FunnelIcon className="w-4 h-4" />
          {t('common.filters')}:
        </div>
        
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('providers.filters.allLocations')}</option>
          {locations.map(location => (
            <optgroup key={location.id} label={t(location.name)}>
              {location.children?.map(child => (
                <option key={child.id} value={child.id}>
                  {t(child.name)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('providers.filters.allCategories')}</option>
          {Object.entries(PROVIDER_CATEGORIES).map(([key, value]) => (
            <option key={value} value={value}>
              {t(`providers.categories.${value}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

ProviderSearchFilters.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  selectedLocation: PropTypes.string.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  locations: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired
};

export default ProviderSearchFilters;