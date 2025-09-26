import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ServiceDetailsModal = ({ isOpen, onClose, service }) => {
  const { t } = useTranslation();

  if (!isOpen || !service) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getServiceTypeLabel = (type) => {
    switch (type) {
      case 'regular':
        return t('history.details.serviceType.regular');
      case 'private':
        return t('history.details.serviceType.private');
      case 'transfer':
        return t('history.details.serviceType.transfer');
      default:
        return type;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return t('history.details.status.completed');
      case 'cancelled':
        return t('history.details.status.cancelled');
      case 'pending':
        return t('history.details.status.pending');
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">{t('common.close')}</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {t('history.details.title')}
              </h3>

              <div className="space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      {t('history.details.basicInfo')}
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {t('history.details.serviceName')}:
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          {service.serviceName}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {t('history.details.client')}:
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          {service.clientName}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {t('history.details.date')}:
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          {formatDate(service.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      {t('history.details.status')}
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                          {getStatusLabel(service.status)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {t('history.details.type')}:
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          {getServiceTypeLabel(service.serviceType)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalles del servicio */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      {t('history.details.serviceDetails')}
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {t('history.details.duration')}:
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          {service.duration}h
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {t('history.details.passengers')}:
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          {service.passengers}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {t('history.details.amount')}:
                        </span>
                        <span className="ml-2 text-sm font-semibold text-green-600">
                          {formatCurrency(service.amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      {t('history.details.guide')}
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-900">
                          {service.guide}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      {t('history.details.transport')}
                    </h4>
                    <div className="space-y-2">
                      {service.driver && (
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {t('history.details.driver')}:
                          </span>
                          <span className="ml-2 text-sm text-gray-600">
                            {service.driver}
                          </span>
                        </div>
                      )}
                      {service.vehicle && (
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {t('history.details.vehicle')}:
                          </span>
                          <span className="ml-2 text-sm text-gray-600">
                            {service.vehicle}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notas */}
                {service.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      {t('history.details.notes')}
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{service.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={onClose}
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ServiceDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    serviceName: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    guide: PropTypes.string.isRequired,
    driver: PropTypes.string,
    vehicle: PropTypes.string,
    amount: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    passengers: PropTypes.number.isRequired,
    notes: PropTypes.string
  })
};

export default ServiceDetailsModal;