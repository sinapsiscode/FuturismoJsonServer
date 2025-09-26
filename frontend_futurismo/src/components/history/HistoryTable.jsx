import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  EyeIcon,
  StarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import StarRating from '../common/StarRating';

const HistoryTable = ({ 
  services, 
  sort, 
  onSort, 
  loading,
  onViewDetails,
  onRate
}) => {
  const { t } = useTranslation();

  const getSortIcon = (field) => {
    if (sort.field !== field) {
      return <ChevronUpIcon className="w-4 h-4 text-gray-400" />;
    }
    return sort.direction === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4 text-gray-900" />
      : <ChevronDownIcon className="w-4 h-4 text-gray-900" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: t('history.table.status.completed')
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: t('history.table.status.cancelled')
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: t('history.table.status.pending')
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getServiceTypeBadge = (type) => {
    const typeConfig = {
      regular: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: t('history.table.serviceType.regular')
      },
      private: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: t('history.table.serviceType.private')
      },
      transfer: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: t('history.table.serviceType.transfer')
      }
    };

    const config = typeConfig[type] || typeConfig.regular;

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4 mb-3">
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={() => onSort('date')}
                >
                  <span>{t('history.table.headers.date')}</span>
                  {getSortIcon('date')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={() => onSort('serviceName')}
                >
                  <span>{t('history.table.headers.service')}</span>
                  {getSortIcon('serviceName')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={() => onSort('clientName')}
                >
                  <span>{t('history.table.headers.client')}</span>
                  {getSortIcon('clientName')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('history.table.headers.type')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('history.table.headers.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={() => onSort('guide')}
                >
                  <span>{t('history.table.headers.guide')}</span>
                  {getSortIcon('guide')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={() => onSort('amount')}
                >
                  <span>{t('history.table.headers.amount')}</span>
                  {getSortIcon('amount')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('history.table.headers.rating')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('history.table.headers.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                  <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">{t('history.table.noResults')}</p>
                  <p className="text-sm">{t('history.table.noResultsDescription')}</p>
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(service.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {service.serviceName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.duration}h • {service.passengers} pax
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getServiceTypeBadge(service.serviceType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(service.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{service.guide}</div>
                      {service.driver && (
                        <div className="text-xs text-gray-500">
                          {t('history.table.driver')}: {service.driver}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(service.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.rating ? (
                      <StarRating rating={service.rating} size="sm" showValue />
                    ) : service.status === 'completed' ? (
                      <span className="text-xs text-gray-400">{t('history.table.notRated')}</span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewDetails(service)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title={t('history.table.actions.viewDetails')}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {service.status === 'completed' && !service.rating && onRate && (
                        <button
                          onClick={() => onRate(service)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                          title={t('history.table.actions.rate')}
                        >
                          <StarIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

HistoryTable.propTypes = {
  services: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    serviceName: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    guide: PropTypes.string.isRequired,
    driver: PropTypes.string,
    amount: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    passengers: PropTypes.number.isRequired,
    rating: PropTypes.number
  })).isRequired,
  sort: PropTypes.shape({
    field: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onRate: PropTypes.func,
  loading: PropTypes.bool
};

HistoryTable.defaultProps = {
  loading: false
};

export default HistoryTable;