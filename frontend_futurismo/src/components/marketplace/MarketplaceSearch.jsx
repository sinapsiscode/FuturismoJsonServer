import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { useDebouncedCallback } from 'use-debounce';
import { useTranslation } from 'react-i18next';
import useMarketplaceStore from '../../stores/marketplaceStore';
import { SORT_OPTIONS } from '../../constants/marketplaceConstants';

const MarketplaceSearch = ({ onSearchChange }) => {
  const { searchQuery, sortBy, searchGuides, setSortBy } = useMarketplaceStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const { t } = useTranslation();

  const debouncedSearch = useDebouncedCallback((value) => {
    searchGuides(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  }, 300);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    debouncedSearch(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Barra de búsqueda */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={handleSearchChange}
            placeholder={t('marketplace.search.placeholder')}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Ordenamiento */}
        <div className="flex items-center gap-2">
          <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="block w-full lg:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 rounded-lg"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

MarketplaceSearch.propTypes = {
  onSearchChange: PropTypes.func
};

export default MarketplaceSearch;