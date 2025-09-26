import { CheckCircleIcon, CurrencyDollarIcon, CalendarIcon, ClockIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { formatters } from '../../../utils/formatters';

const ConfirmationStep = ({ 
  formData, 
  selectedTour,
  getTotalPrice,
  register,
  errors,
  watch
}) => {
  const { t } = useTranslation();
  const totalPrice = getTotalPrice();
  const acceptTerms = watch('acceptTerms');

  const formatGroups = () => {
    return formData.groups?.map((group, index) => (
      <div key={index} className="text-sm text-gray-600">
        <span className="font-medium">{group.representativeName}</span> ({group.representativePhone})
        - {parseInt(group.companionsCount) + 1} {t('common.people')}
      </div>
    )) || [];
  };

  return (
    <div className="space-y-6">
      {/* Mensaje de confirmación exitosa para tours regulares */}
      {formData.serviceType === 'tour' && selectedTour?.type === 'regular' && (
        <div className="border border-green-300 bg-green-50 rounded-lg p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                {t('reservations.almostReady')}
              </h3>
              <p className="mt-1 text-sm text-green-700">
                {t('reservations.reviewAndConfirm')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de la reserva */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('reservations.reservationSummary')}
        </h3>

        <div className="space-y-4">
          {/* Tour */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{t('reservations.tourDetails')}</h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {t('reservations.tour')}: <span className="font-medium text-gray-900">{selectedTour?.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                <CalendarIcon className="inline-block w-4 h-4 mr-1" />
                {formatters.date(formData.date)}
              </p>
              <p className="text-sm text-gray-600">
                <ClockIcon className="inline-block w-4 h-4 mr-1" />
                {formData.time}
              </p>
            </div>
          </div>

          {/* Pasajeros */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              <UserGroupIcon className="inline-block w-4 h-4 mr-1" />
              {t('reservations.passengers')}
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                {t('reservations.adults')}: {formData.adults}
              </p>
              {formData.children > 0 && (
                <p className="text-sm text-gray-600">
                  {t('reservations.children')}: {formData.children}
                </p>
              )}
              <p className="text-sm font-medium text-gray-900">
                {t('reservations.totalPassengers')}: {formData.adults + formData.children}
              </p>
            </div>
          </div>

          {/* Grupos */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{t('reservations.groups')}</h4>
            <div className="space-y-1">
              {formatGroups()}
            </div>
          </div>

          {/* Lugar de recojo */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              <MapPinIcon className="inline-block w-4 h-4 mr-1" />
              {t('reservations.pickupLocation')}
            </h4>
            <p className="text-sm text-gray-600">{formData.pickupLocation}</p>
          </div>

          {/* Requerimientos especiales */}
          {formData.specialRequirements && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {t('reservations.specialRequirements')}
              </h4>
              <p className="text-sm text-gray-600">{formData.specialRequirements}</p>
            </div>
          )}

          {/* Total */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">
                <CurrencyDollarIcon className="inline-block w-5 h-5 mr-1" />
                {t('reservations.total')}
              </span>
              <span className="text-2xl font-bold text-primary-600">
                S/. {totalPrice}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t('reservations.includesTaxes')}
            </p>
          </div>
        </div>
      </div>

      {/* Información de pago */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('reservations.paymentInfo')}
        </h3>

        {/* Método de pago */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('reservations.paymentMethod')}
          </label>
          <select
            {...register('paymentMethod')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">{t('reservations.selectPaymentMethod')}</option>
            <option value="cash">{t('reservations.cash')}</option>
            <option value="card">{t('reservations.creditCard')}</option>
            <option value="transfer">{t('reservations.bankTransfer')}</option>
          </select>
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
          )}
        </div>

        {/* Datos de facturación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reservations.billingName')}
            </label>
            <input
              type="text"
              {...register('billingName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.billingName && (
              <p className="mt-1 text-sm text-red-600">{errors.billingName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reservations.billingDocument')}
            </label>
            <input
              type="text"
              {...register('billingDocument')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.billingDocument && (
              <p className="mt-1 text-sm text-red-600">{errors.billingDocument.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('reservations.billingAddress')}
          </label>
          <input
            type="text"
            {...register('billingAddress')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.billingAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.billingAddress.message}</p>
          )}
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="border-t pt-4">
        <label className="flex items-start">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">
            {t('reservations.acceptTermsText')} 
            <a href="#" className="text-primary-600 hover:underline ml-1">
              {t('reservations.termsAndConditions')}
            </a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmationStep;