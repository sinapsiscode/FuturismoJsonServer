import React from 'react';
import { useTranslation } from 'react-i18next';
import { GUIDE_TYPES } from '../../constants/usersConstants';

const UserGuideFields = ({ formData, setFormData, handleChange, errors }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t">
      <h4 className="col-span-full text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-4">
        {t('users.form.guideInfo')}
      </h4>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.guideType')} *
        </label>
        <select
          name="guideType"
          value={formData.guideType}
          onChange={handleChange}
          className={`px-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
            errors.guideType ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">{t('users.form.selectGuideType')}</option>
          <option value={GUIDE_TYPES.PLANT}>{t('users.guideType.plant')}</option>
          <option value={GUIDE_TYPES.FREELANCE}>{t('users.guideType.freelance')}</option>
        </select>
        {errors.guideType && (
          <p className="mt-1 text-sm text-red-600">{errors.guideType}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.yearsExperience')}
        </label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="px-4 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          placeholder={t('users.form.placeholders.experience')}
          min="0"
        />
      </div>

      <div className="col-span-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.languages')}
        </label>
        <input
          type="text"
          name="languages"
          value={Array.isArray(formData.languages) ? formData.languages.join(', ') : formData.languages}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            languages: e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang)
          }))}
          className="px-4 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          placeholder={t('users.form.placeholders.languages')}
        />
      </div>

      <div className="col-span-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.specialties')}
        </label>
        <input
          type="text"
          name="specialties"
          value={Array.isArray(formData.specialties) ? formData.specialties.join(', ') : formData.specialties}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            specialties: e.target.value.split(',').map(spec => spec.trim()).filter(spec => spec)
          }))}
          className="px-4 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          placeholder={t('users.form.placeholders.specialties')}
        />
      </div>
    </div>
  );
};

export default UserGuideFields;