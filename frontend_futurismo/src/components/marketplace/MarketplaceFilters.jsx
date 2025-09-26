import PropTypes from 'prop-types';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useMarketplaceFilters from '../../hooks/useMarketplaceFilters';
import FilterSection from './FilterSection';
import LanguageFilter from './LanguageFilter';
import RatingFilter from './RatingFilter';
import PriceRangeFilter from './PriceRangeFilter';

const MarketplaceFilters = ({ onFiltersChange }) => {
  const { t } = useTranslation();
  const {
    expandedSections,
    localFilters,
    filtersCount,
    workZones,
    tourTypes,
    groupTypes,
    toggleSection,
    handleLanguageToggle,
    handleTourTypeToggle,
    handleWorkZoneToggle,
    handleGroupTypeToggle,
    handlePriceChange,
    handleRatingChange,
    handleCheckboxChange,
    applyFilters,
    resetFilters
  } = useMarketplaceFilters(onFiltersChange);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">{t('marketplace.filters.title')}</h3>
          {filtersCount > 0 && (
            <span className="ml-2 bg-cyan-100 text-cyan-800 text-xs font-medium px-2 py-1 rounded-full">
              {filtersCount}
            </span>
          )}
        </div>
        {filtersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            {t('marketplace.filters.clear')}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Idiomas */}
        <FilterSection
          title={t('marketplace.filters.languages.title')}
          isExpanded={expandedSections.languages}
          onToggle={() => toggleSection('languages')}
        >
          <LanguageFilter
            selectedLanguages={localFilters.languages}
            onLanguageToggle={handleLanguageToggle}
          />
        </FilterSection>

        {/* Tipos de Tour */}
        <FilterSection
          title={t('marketplace.filters.tourTypes.title')}
          isExpanded={expandedSections.tourTypes}
          onToggle={() => toggleSection('tourTypes')}
        >
          <div className="space-y-2">
            {tourTypes.map(type => (
              <label
                key={type.id}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={localFilters.tourTypes.includes(type.id)}
                  onChange={() => handleTourTypeToggle(type.id)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {type.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Zonas de Trabajo */}
        <FilterSection
          title={t('marketplace.filters.workZones.title')}
          isExpanded={expandedSections.workZones}
          onToggle={() => toggleSection('workZones')}
        >
          <div className="space-y-2">
            {workZones.map(zone => (
              <label
                key={zone.id}
                className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={localFilters.workZones.includes(zone.id)}
                  onChange={() => handleWorkZoneToggle(zone.id)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded mt-0.5"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">{zone.name}</p>
                  <p className="text-xs text-gray-500">{zone.description}</p>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Experiencia con Grupos */}
        <FilterSection
          title={t('marketplace.filters.groupTypes.title')}
          isExpanded={expandedSections.groupTypes}
          onToggle={() => toggleSection('groupTypes')}
        >
          <div className="space-y-2">
            {groupTypes.map(type => (
              <label
                key={type.id}
                className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={localFilters.groupTypes.includes(type.id)}
                  onChange={() => handleGroupTypeToggle(type.id)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded mt-0.5"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">{type.name}</p>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Calificación */}
        <FilterSection
          title={t('marketplace.filters.rating.title')}
          isExpanded={expandedSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <RatingFilter
            selectedRating={localFilters.rating}
            onRatingChange={handleRatingChange}
          />
        </FilterSection>

        {/* Precio */}
        <FilterSection
          title={t('marketplace.filters.price.title')}
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <PriceRangeFilter
            priceRange={localFilters.priceRange}
            onPriceChange={handlePriceChange}
          />
        </FilterSection>

        {/* Opciones adicionales */}
        <div className="space-y-3 pt-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.instantBooking}
              onChange={handleCheckboxChange('instantBooking')}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{t('marketplace.filters.instantBooking')}</span>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.verified}
              onChange={handleCheckboxChange('verified')}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{t('marketplace.filters.verifiedOnly')}</span>
          </label>
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full mt-6 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
      >
        {t('marketplace.filters.apply')}
      </button>
    </div>
  );
};

MarketplaceFilters.propTypes = {
  onFiltersChange: PropTypes.func
};

export default MarketplaceFilters;