import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { PRICING_TYPES, CURRENCIES } from '../../constants/providersConstants';

const ProviderPricingSection = ({ register, errors, watch }) => {
  const { t } = useTranslation();

  const getPricingTypeOptions = () => {
    return Object.entries(PRICING_TYPES).map(([key, value]) => ({
      value,
      label: t(`providers.pricing.types.${value}`)
    }));
  };

  const getCurrencyOptions = () => {
    return Object.values(CURRENCIES).map(currency => ({
      value: currency,
      label: t(`providers.pricing.currencies.${currency}`)
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <CurrencyDollarIcon className="w-5 h-5 mr-2" />
        {t('providers.form.sections.pricing')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('providers.form.fields.basePrice')} *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('pricing.basePrice', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.pricing?.basePrice ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.pricing?.basePrice && (
            <p className="mt-1 text-sm text-red-600">{errors.pricing.basePrice.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('providers.form.fields.pricingType')} *
          </label>
          <select
            {...register('pricing.type')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.pricing?.type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{t('providers.form.placeholders.selectPricingType')}</option>
            {getPricingTypeOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.pricing?.type && (
            <p className="mt-1 text-sm text-red-600">{errors.pricing.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('providers.form.fields.currency')} *
          </label>
          <select
            {...register('pricing.currency')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {getCurrencyOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <UserGroupIcon className="w-4 h-4 inline mr-1" />
            {t('providers.form.fields.capacity')}
          </label>
          <input
            type="number"
            {...register('capacity', { valueAsNumber: true })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.capacity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('providers.form.placeholders.capacity')}
          />
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

ProviderPricingSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired
};

export default ProviderPricingSection;