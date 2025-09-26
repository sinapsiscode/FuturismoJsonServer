import React from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { USER_STATUS, DEPARTMENTS } from '../../constants/usersConstants';

const UserBasicInfoForm = ({
  register,
  errors,
  watch,
  roles,
  isEdit,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword
}) => {
  const { t } = useTranslation();
  const departments = DEPARTMENTS;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        {isEdit ? t('users.form.editUser') : t('users.form.newUser')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('users.form.username')} *
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              {...register('username')}
              className={`pl-10 pr-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                errors.username ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={t('users.form.placeholders.username')}
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('users.form.email')} *
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              {...register('email')}
              className={`pl-10 pr-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={t('users.form.placeholders.email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('users.form.firstName')} *
          </label>
          <input
            type="text"
            {...register('firstName')}
            className={`px-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('users.form.placeholders.firstName')}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('users.form.lastName')} *
          </label>
          <input
            type="text"
            {...register('lastName')}
            className={`px-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('users.form.placeholders.lastName')}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('users.form.phone')} *
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              {...register('phone')}
              className={`pl-10 pr-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={t('users.form.placeholders.phone')}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('users.form.role')} *
          </label>
          <select
            {...register('role')}
            className={`px-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
              errors.role ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">{t('users.form.selectRole')}</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name} - {role.description}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('users.form.department')} *
          </label>
          <div className="relative">
            <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              {...register('department')}
              className={`pl-10 pr-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                errors.department ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">{t('users.form.selectDepartment')}</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('users.form.position')} *
          </label>
          <div className="relative">
            <IdentificationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              {...register('position')}
              className={`pl-10 pr-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                errors.position ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={t('users.form.placeholders.position')}
            />
          </div>
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('users.form.status')} *
          </label>
          <select
            {...register('status')}
            className={`px-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
              errors.status ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value={USER_STATUS.ACTIVE}>{t('users.status.active')}</option>
            <option value={USER_STATUS.INACTIVE}>{t('users.status.inactive')}</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Password fields */}
      {(!isEdit || showPassword) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('users.form.password')} {!isEdit && '*'}
            </label>
            <div className="relative">
              <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`pl-10 pr-10 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={t('users.form.placeholders.password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('users.form.confirmPassword')} {!isEdit && '*'}
            </label>
            <div className="relative">
              <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className={`pl-10 pr-10 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={t('users.form.placeholders.password')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Change password button for edit mode */}
      {isEdit && !showPassword && (
        <div>
          <button
            type="button"
            onClick={() => setShowPassword(true)}
            className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium px-2 py-1 rounded"
          >
            {t('users.form.changePassword')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserBasicInfoForm;