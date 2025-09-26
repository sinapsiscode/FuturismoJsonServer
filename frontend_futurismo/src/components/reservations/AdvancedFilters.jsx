import { useState } from 'react';
import { 
  FunnelIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  MapPinIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const AdvancedFilters = ({ onApplyFilters, onClose }) => {
  const [showFilters, setShowFilters] = useState({
    dates: true,
    customers: false,
    passengers: false,
    price: false,
    location: false
  });

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    customerName: '',
    customerPhone: '',
    tourName: '',
    minPassengers: '',
    maxPassengers: '',
    minPrice: '',
    maxPrice: '',
    pickupLocation: '',
    paymentStatus: 'all'
  });

  const toggleSection = (section) => {
    setShowFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      customerName: '',
      customerPhone: '',
      tourName: '',
      minPassengers: '',
      maxPassengers: '',
      minPrice: '',
      maxPrice: '',
      pickupLocation: '',
      paymentStatus: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.customerName || filters.customerPhone) count++;
    if (filters.tourName) count++;
    if (filters.minPassengers || filters.maxPassengers) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.pickupLocation) count++;
    if (filters.paymentStatus !== 'all') count++;
    return count;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen px-2 pt-4 pb-2 text-center sm:block sm:p-0 sm:items-center">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-t-lg sm:rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-3 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <FunnelIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    Filtros Avanzados
                  </h3>
                  {getActiveFiltersCount() > 0 && (
                    <span className="mt-1 inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {getActiveFiltersCount()} activos
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 p-1"
              >
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Filtros */}
            <div className="space-y-3 sm:space-y-4">
              {/* Filtro por Fechas */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('dates')}
                  className="w-full px-3 py-3 sm:px-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    <span className="font-medium text-gray-900 text-sm sm:text-base">Rango de Fechas</span>
                  </div>
                  {showFilters.dates ? (
                    <ChevronUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  )}
                </button>
                {showFilters.dates && (
                  <div className="px-3 py-3 sm:px-4 border-t border-gray-200">
                    <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Desde
                        </label>
                        <input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hasta
                        </label>
                        <input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => handleInputChange('dateTo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro por Cliente */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('customers')}
                  className="w-full px-3 py-3 sm:px-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    <span className="font-medium text-gray-900 text-sm sm:text-base">Cliente / Tour</span>
                  </div>
                  {showFilters.customers ? (
                    <ChevronUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  )}
                </button>
                {showFilters.customers && (
                  <div className="px-3 py-3 sm:px-4 border-t border-gray-200 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Cliente
                      </label>
                      <input
                        type="text"
                        value={filters.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={filters.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="Ej: +51 987654321"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Tour
                      </label>
                      <input
                        type="text"
                        value={filters.tourName}
                        onChange={(e) => handleInputChange('tourName', e.target.value)}
                        placeholder="Ej: City Tour Lima"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro por Cantidad de Pasajeros */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('passengers')}
                  className="w-full px-3 py-3 sm:px-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    <span className="font-medium text-gray-900 text-sm sm:text-base">Cantidad de Pasajeros</span>
                  </div>
                  {showFilters.passengers ? (
                    <ChevronUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  )}
                </button>
                {showFilters.passengers && (
                  <div className="px-3 py-3 sm:px-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mínimo
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={filters.minPassengers}
                          onChange={(e) => handleInputChange('minPassengers', e.target.value)}
                          placeholder="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Máximo
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={filters.maxPassengers}
                          onChange={(e) => handleInputChange('maxPassengers', e.target.value)}
                          placeholder="50"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro por Precio */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Rango de Precio</span>
                  </div>
                  {showFilters.price ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {showFilters.price && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Mínimo (S/.)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={filters.minPrice}
                          onChange={(e) => handleInputChange('minPrice', e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Máximo (S/.)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={filters.maxPrice}
                          onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                          placeholder="10000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro por Ubicación y Estado de Pago */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('location')}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Ubicación y Pago</span>
                  </div>
                  {showFilters.location ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {showFilters.location && (
                  <div className="px-4 py-3 border-t border-gray-200 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lugar de Recojo
                      </label>
                      <input
                        type="text"
                        value={filters.pickupLocation}
                        onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                        placeholder="Ej: Hotel Marriott"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado de Pago
                      </label>
                      <select
                        value={filters.paymentStatus}
                        onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                        <option value="reembolsado">Reembolsado</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-3 py-3 sm:px-6 sm:py-3 flex flex-col sm:flex-row sm:flex-row-reverse gap-2 sm:gap-3">
            <button
              onClick={handleApply}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2.5 sm:py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2.5 sm:py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Limpiar
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2.5 sm:py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;