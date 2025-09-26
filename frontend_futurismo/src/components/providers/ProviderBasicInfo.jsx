import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { BuildingOffice2Icon, TagIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { PROVIDER_CATEGORIES, RATING_RANGE } from '../../constants/providersConstants';
import useProvidersStore from '../../stores/providersStore';

const ProviderBasicInfo = ({ register, errors, watch }) => {
  const { t } = useTranslation();
  const { locations, categories } = useProvidersStore();

  const getCategoryOptions = () => {
    return Object.entries(PROVIDER_CATEGORIES).map(([key, value]) => ({
      value,
      label: t(`providers.categories.${value}`)
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <BuildingOffice2Icon className="w-5 h-5 mr-2" />
        {t('providers.form.sections.basicInfo')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('providers.form.fields.name')} *
          </label>
          <input
            type="text"
            {...register('name')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('providers.form.placeholders.name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('providers.form.fields.category')} *
          </label>
          <select
            {...register('category')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{t('providers.form.placeholders.selectCategory')}</option>
            {getCategoryOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('providers.form.fields.location')} *
          </label>
          <select
            {...register('location')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{t('providers.form.placeholders.selectLocation')}</option>
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
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('providers.form.fields.rating')} *
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              step="0.1"
              min={RATING_RANGE.MIN}
              max={RATING_RANGE.MAX}
              {...register('rating', { valueAsNumber: true })}
              className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.rating ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(watch('rating') || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

ProviderBasicInfo.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired
};

export default ProviderBasicInfo;