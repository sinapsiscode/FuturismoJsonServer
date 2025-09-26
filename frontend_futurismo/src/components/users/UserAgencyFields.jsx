import React from 'react';
import { useTranslation } from 'react-i18next';

const UserAgencyFields = ({ formData, handleChange, errors }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t">
      <h4 className="col-span-full text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-4">
        {t('users.form.agencyInfo')}
      </h4>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.ruc')} *
        </label>
        <input
          type="text"
          name="ruc"
          value={formData.ruc}
          onChange={handleChange}
          className={`px-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
            errors.ruc ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={t('users.form.placeholders.ruc')}
        />
        {errors.ruc && (
          <p className="mt-1 text-sm text-red-600">{errors.ruc}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.creditLimit')}
        </label>
        <input
          type="number"
          name="creditLimit"
          value={formData.creditLimit}
          onChange={handleChange}
          className="px-4 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          placeholder={t('users.form.placeholders.creditLimit')}
        />
      </div>

      <div className="col-span-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.address')} *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`px-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
            errors.address ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={t('users.form.placeholders.address')}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>
    </div>
  );
};

export default UserAgencyFields;