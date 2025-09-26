import React from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { USER_STATUS } from '../../constants/usersConstants';

const UserFormFields = ({ formData, handleChange, errors, roles, isEdit }) => {
  const { t } = useTranslation();

  return (
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
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`pl-10 pr-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
              errors.username ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('users.form.placeholders.username')}
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`pl-10 pr-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('users.form.placeholders.email')}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.firstName')} *
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={`px-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
            errors.firstName ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={t('users.form.placeholders.firstName')}
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.lastName')} *
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={`px-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
            errors.lastName ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={t('users.form.placeholders.lastName')}
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.phone')}
        </label>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder={t('users.form.placeholders.phone')}
          />
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.role')} *
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
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
          <p className="mt-1 text-sm text-red-600">{errors.role}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.company')} *
        </label>
        <div className="relative">
          <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`pl-10 pr-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
              errors.company ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('users.form.placeholders.companyName')}
          />
        </div>
        {errors.company && (
          <p className="mt-1 text-sm text-red-600">{errors.company}</p>
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
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={`pl-10 pr-4 py-2 sm:py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
              errors.position ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={t('users.form.placeholders.position')}
          />
        </div>
        {errors.position && (
          <p className="mt-1 text-sm text-red-600">{errors.position}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('users.form.status')} *
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="px-4 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value={USER_STATUS.ACTIVE}>{t('users.status.active')}</option>
          <option value={USER_STATUS.INACTIVE}>{t('users.status.inactive')}</option>
        </select>
      </div>
    </div>
  );
};

export default UserFormFields;