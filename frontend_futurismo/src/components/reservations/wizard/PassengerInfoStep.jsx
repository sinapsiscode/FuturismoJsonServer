import { UserGroupIcon, MapPinIcon, UserPlusIcon, TrashIcon, PlusIcon, MinusIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { validators } from '../../../utils/validators';

const PassengerInfoStep = ({ 
  register, 
  errors, 
  watch,
  fields,
  append,
  remove,
  selectedTour
}) => {
  const { t } = useTranslation();
  const adults = watch('adults') || 0;
  const children = watch('children') || 0;
  const groups = watch('groups') || [];

  const getTotalFromGroups = () => {
    return groups.reduce((total, group) => {
      return total + 1 + (parseInt(group.companionsCount) || 0);
    }, 0);
  };

  const totalPassengers = adults + children;
  const totalFromGroups = getTotalFromGroups();

  return (
    <div className="space-y-6">
      {/* Información del tour */}
      {selectedTour && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900">
            {selectedTour.name}
          </h4>
          <p className="text-sm text-blue-700 mt-1">
            {t('reservations.date')}: {watch('date')} - {watch('time')}
          </p>
        </div>
      )}

      {/* Cantidad de pasajeros */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          <UserGroupIcon className="inline-block w-5 h-5 mr-2" />
          {t('reservations.passengers')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reservations.adults')}
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  const current = parseInt(watch('adults')) || 0;
                  if (current > 1) register('adults').onChange({ target: { value: current - 1 } });
                }}
                className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-100"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <input
                type="number"
                {...register('adults')}
                className="w-20 px-3 py-2 border-t border-b border-gray-300 text-center focus:ring-0 focus:border-gray-300"
                min="1"
              />
              <button
                type="button"
                onClick={() => {
                  const current = parseInt(watch('adults')) || 0;
                  register('adults').onChange({ target: { value: current + 1 } });
                }}
                className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-100"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            {errors.adults && (
              <p className="mt-1 text-sm text-red-600">{errors.adults.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reservations.children')}
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  const current = parseInt(watch('children')) || 0;
                  if (current > 0) register('children').onChange({ target: { value: current - 1 } });
                }}
                className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-100"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <input
                type="number"
                {...register('children')}
                className="w-20 px-3 py-2 border-t border-b border-gray-300 text-center focus:ring-0 focus:border-gray-300"
                min="0"
              />
              <button
                type="button"
                onClick={() => {
                  const current = parseInt(watch('children')) || 0;
                  register('children').onChange({ target: { value: current + 1 } });
                }}
                className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-100"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            {errors.children && (
              <p className="mt-1 text-sm text-red-600">{errors.children.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Grupos de la reserva */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            <UserPlusIcon className="inline-block w-5 h-5 mr-2" />
            {t('reservations.reservationGroups')}
          </h3>
          <span className="text-sm text-gray-500">
            {t('reservations.totalPeople')}: {totalFromGroups} / {totalPassengers}
          </span>
        </div>

        {totalFromGroups !== totalPassengers && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            {t('reservations.groupTotalMismatch')}
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  {t('reservations.group')} {index + 1}
                </h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <UserIcon className="inline-block w-4 h-4 mr-1" />
                    {t('reservations.representative')}
                  </label>
                  <input
                    type="text"
                    {...register(`groups.${index}.representativeName`)}
                    placeholder={t('common.fullName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.groups?.[index]?.representativeName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.groups[index].representativeName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <PhoneIcon className="inline-block w-4 h-4 mr-1" />
                    {t('common.phone')}
                  </label>
                  <input
                    type="tel"
                    {...register(`groups.${index}.representativePhone`)}
                    placeholder="+51 999999999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.groups?.[index]?.representativePhone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.groups[index].representativePhone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reservations.companions')}
                  </label>
                  <input
                    type="number"
                    {...register(`groups.${index}.companionsCount`)}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.groups?.[index]?.companionsCount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.groups[index].companionsCount.message}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {t('reservations.groupTotal')}: {1 + (parseInt(watch(`groups.${index}.companionsCount`)) || 0)} {t('common.people')}
              </p>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ 
              representativeName: '', 
              representativePhone: '', 
              companionsCount: 0 
            })}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
          >
            <PlusIcon className="inline-block w-4 h-4 mr-2" />
            {t('reservations.addGroup')}
          </button>
        </div>
      </div>

      {/* Lugar de recojo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPinIcon className="inline-block w-4 h-4 mr-1" />
          {t('reservations.pickupLocation')}
        </label>
        <input
          type="text"
          {...register('pickupLocation')}
          placeholder={t('reservations.pickupLocationPlaceholder')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.pickupLocation && (
          <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.message}</p>
        )}
      </div>

      {/* Requerimientos especiales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('reservations.specialRequirements')}
        </label>
        <textarea
          {...register('specialRequirements')}
          rows="3"
          placeholder={t('reservations.specialRequirementsPlaceholder')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
    </div>
  );
};

export default PassengerInfoStep;