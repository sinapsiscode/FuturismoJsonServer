import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { RESERVATION_STATUS_SPANISH } from '../../constants/reservationConstants';

const ReservationFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  customerFilter,
  setCustomerFilter,
  minPassengers,
  setMinPassengers,
  maxPassengers,
  setMaxPassengers,
  resetFilters,
  hasActiveFilters
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Búsqueda principal */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('search.searchByTour')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        />
      </div>

      {/* Filtros avanzados */}
      <div className="space-y-3 sm:space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
        {/* Estado */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('reservations.status')}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">{t('common.all')}</option>
            {Object.values(RESERVATION_STATUS_SPANISH).map(status => (
              <option key={status} value={status}>
                {t(`reservations.${status}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha desde */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('common.dateFrom')}
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Fecha hasta */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('common.dateTo')}
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Cliente */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('common.customer')}
          </label>
          <input
            type="text"
            placeholder={t('common.customerName')}
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Pasajeros - en móvil se muestran en grid 2 columnas */}
        <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1 xl:col-span-2 sm:grid-cols-2">
          {/* Mínimo pasajeros */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              {t('reservations.minPassengers')}
            </label>
            <input
              type="number"
              min="1"
              placeholder="1"
              value={minPassengers}
              onChange={(e) => setMinPassengers(e.target.value)}
              className="w-full px-2 sm:px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Máximo pasajeros */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              {t('reservations.maxPassengers')}
            </label>
            <input
              type="number"
              min="1"
              placeholder="50"
              value={maxPassengers}
              onChange={(e) => setMaxPassengers(e.target.value)}
              className="w-full px-2 sm:px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <div className="sm:flex sm:items-end col-span-full sm:col-span-2 lg:col-span-1">
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <XMarkIcon className="h-4 w-4" />
              <span className="sm:hidden">Limpiar</span>
              <span className="hidden sm:inline">{t('common.clearFilters')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationFilters;