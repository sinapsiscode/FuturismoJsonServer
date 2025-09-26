import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const HistoryFilters = ({ 
  filters, 
  onUpdateFilter, 
  onClearFilters,
  filterOptions,
  loading 
}) => {
  const { t } = useTranslation();

  const handleSearchChange = (e) => {
    onUpdateFilter('search', e.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    onUpdateFilter(filterName, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('history.filters.title')}
        </h3>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center px-3 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          disabled={loading}
        >
          <XMarkIcon className="w-4 h-4 mr-1" />
          {t('history.filters.clear')}
        </button>
      </div>

      {/* Búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder={t('history.filters.searchPlaceholder')}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* Filtros principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rango de fechas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('history.filters.dateRange')}
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="all">{t('history.filters.dateRange.all')}</option>
            <option value="today">{t('history.filters.dateRange.today')}</option>
            <option value="week">{t('history.filters.dateRange.week')}</option>
            <option value="month">{t('history.filters.dateRange.month')}</option>
            <option value="year">{t('history.filters.dateRange.year')}</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('history.filters.status')}
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="all">{t('history.filters.status.all')}</option>
            <option value="completed">{t('history.filters.status.completed')}</option>
            <option value="cancelled">{t('history.filters.status.cancelled')}</option>
            <option value="pending">{t('history.filters.status.pending')}</option>
          </select>
        </div>

        {/* Tipo de servicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('history.filters.serviceType')}
          </label>
          <select
            value={filters.serviceType}
            onChange={(e) => handleFilterChange('serviceType', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="all">{t('history.filters.serviceType.all')}</option>
            <option value="regular">{t('history.filters.serviceType.regular')}</option>
            <option value="private">{t('history.filters.serviceType.private')}</option>
            <option value="transfer">{t('history.filters.serviceType.transfer')}</option>
          </select>
        </div>

        {/* Guía */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('history.filters.guide')}
          </label>
          <select
            value={filters.guide}
            onChange={(e) => handleFilterChange('guide', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="all">{t('history.filters.guide.all')}</option>
            {filterOptions.guides.map(guide => (
              <option key={guide} value={guide}>{guide}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros secundarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* Chofer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('history.filters.driver')}
          </label>
          <select
            value={filters.driver}
            onChange={(e) => handleFilterChange('driver', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="all">{t('history.filters.driver.all')}</option>
            {filterOptions.drivers.map(driver => (
              <option key={driver} value={driver}>{driver}</option>
            ))}
          </select>
        </div>

        {/* Vehículo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('history.filters.vehicle')}
          </label>
          <select
            value={filters.vehicle}
            onChange={(e) => handleFilterChange('vehicle', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="all">{t('history.filters.vehicle.all')}</option>
            {filterOptions.vehicles.map(vehicle => (
              <option key={vehicle} value={vehicle}>{vehicle}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

HistoryFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    dateRange: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    guide: PropTypes.string.isRequired,
    driver: PropTypes.string.isRequired,
    vehicle: PropTypes.string.isRequired
  }).isRequired,
  onUpdateFilter: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  filterOptions: PropTypes.shape({
    guides: PropTypes.arrayOf(PropTypes.string).isRequired,
    drivers: PropTypes.arrayOf(PropTypes.string).isRequired,
    vehicles: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  loading: PropTypes.bool
};

HistoryFilters.defaultProps = {
  loading: false
};

export default HistoryFilters;