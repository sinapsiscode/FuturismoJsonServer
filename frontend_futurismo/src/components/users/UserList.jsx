import React from 'react';
import { UserIcon, EyeIcon, PencilIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useUserList } from '../../hooks/useUserList';
import { formatFullDateTime, getRoleColor, getRoleName, getStatusClasses } from '../../utils/usersHelpers';
import { DEFAULT_VALUES, USER_STATUS } from '../../constants/usersConstants';
import UserStatCards from './UserStatCards';
import UserFilters from './UserFilters';
import UserTableRow from './UserTableRow';

const UserList = ({ onEdit, onView, onDelete }) => {
  const { t } = useTranslation();
  const {
    users,
    stats,
    roleStats,
    roles,
    showFilters,
    filters,
    handleSearch,
    handleFilterChange,
    handleStatusToggle,
    handlePasswordReset,
    clearFilters,
    setShowFilters,
    hasActiveFilters
  } = useUserList();

  const onPasswordReset = (userId) => {
    if (window.confirm(t('users.list.confirmPasswordReset'))) {
      handlePasswordReset(userId, null, (password) => {
        alert(t('users.list.passwordResetSuccess', { password }));
      });
    }
  };

  const getFormattedLastLogin = (lastLogin) => {
    const formatted = formatFullDateTime(lastLogin);
    return formatted || t('users.list.never');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Estadísticas */}
      <UserStatCards roleStats={roleStats} />

      {/* Barra de búsqueda y filtros */}
      <UserFilters
        filters={filters}
        roles={roles}
        showFilters={showFilters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters()}
      />

      {/* Vista desktop - Tabla */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.list.user')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.list.role')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.list.companyType')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.list.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.list.lastLogin')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  roles={roles}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPasswordReset={onPasswordReset}
                  onStatusToggle={handleStatusToggle}
                  formatLastLogin={getFormattedLastLogin}
                />
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('users.list.noUsers')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters()
                ? t('users.list.noUsersWithFilters')
                : t('users.list.createFirstUser')
              }
            </p>
          </div>
        )}
      </div>

      {/* Vista móvil - Tarjetas */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500">@{user.username}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onView && onView(user)}
                  className="text-gray-600 hover:text-gray-900 p-1"
                  title={t('users.list.viewDetails')}
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit && onEdit(user)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                  title={t('users.list.editUser')}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onPasswordReset(user.id)}
                  className="text-yellow-600 hover:text-yellow-900 p-1"
                  title={t('users.list.resetPassword')}
                >
                  <KeyIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{t('users.list.role')}:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getRoleColor(user.role, roles)}-100 text-${getRoleColor(user.role, roles)}-800`}>
                  {getRoleName(user.role, roles)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{t('users.list.status')}:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(user.status)}`}>
                  {user.status === USER_STATUS.ACTIVE ? t('users.status.active') : t('users.status.inactive')}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{t('users.list.companyType')}:</span>
                <span className="text-xs text-gray-900">{user.company}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{t('users.list.lastLogin')}:</span>
                <span className="text-xs text-gray-900">{getFormattedLastLogin(user.lastLogin)}</span>
              </div>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('users.list.noUsers')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters()
                ? t('users.list.noUsersWithFilters')
                : t('users.list.createFirstUser')
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;