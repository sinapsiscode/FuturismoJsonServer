import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { USER_STATUS, GUIDE_TYPES } from '../../constants/usersConstants';

const UserFilters = ({
  filters,
  roles,
  showFilters,
  onSearch,
  onFilterChange,
  onToggleFilters,
  onClearFilters,
  hasActiveFilters
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 max-w-full sm:max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('users.list.searchPlaceholder')}
              value={filters.search}
              onChange={onSearch}
              className="pl-10 pr-4 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            className={`flex items-center px-3 py-2 sm:py-3 border rounded-lg text-sm sm:text-base font-medium transition-colors ${
              showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{t('common.filters')}</span>
            <span className="sm:hidden">Filtros</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-2 sm:py-3 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('common.clear')}
            </button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('users.list.role')}
            </label>
            <select
              value={filters.role}
              onChange={(e) => onFilterChange('role', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-base"
            >
              <option value="">{t('users.list.allRoles')}</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('users.list.status')}
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-base"
            >
              <option value="">{t('users.list.allStatuses')}</option>
              <option value={USER_STATUS.ACTIVE}>{t('users.status.active')}</option>
              <option value={USER_STATUS.INACTIVE}>{t('users.status.inactive')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('users.list.guideType')}
            </label>
            <select
              value={filters.guideType}
              onChange={(e) => onFilterChange('guideType', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-base"
            >
              <option value="">{t('users.list.allTypes')}</option>
              <option value={GUIDE_TYPES.PLANT}>{t('users.guideType.plant')}</option>
              <option value={GUIDE_TYPES.FREELANCE}>{t('users.guideType.freelance')}</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;