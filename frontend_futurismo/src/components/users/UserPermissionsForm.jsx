import React from 'react';
import { useTranslation } from 'react-i18next';

const UserPermissionsForm = ({
  permissionsByModule,
  selectedPermissions,
  handlePermissionChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">
        {t('users.form.userPermissions')}
      </h3>

      {Object.entries(permissionsByModule).map(([module, permissions]) => (
        <div key={module} className="space-y-2 sm:space-y-3">
          <h4 className="font-medium text-gray-900 border-b pb-1 sm:pb-2 text-sm sm:text-base">{module}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {permissions.map((permission) => (
              <label
                key={permission.id}
                className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                />
                <span className="text-xs sm:text-sm text-gray-700 leading-tight">{permission.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {selectedPermissions.length === 0 && (
        <div className="text-center py-6 sm:py-8">
          <p className="text-sm sm:text-base text-gray-500">
            {t('users.form.noPermissionsSelected')}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPermissionsForm;