import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  ChevronDownIcon, 
  ArrowRightOnRectangleIcon, 
  UserIcon
} from '@heroicons/react/24/outline';

const ProfileMenu = ({ 
  isOpen, 
  onToggle, 
  userInitial, 
  userDisplayName, 
  userRoleKey,
  onNavigateProfile,
  onLogout,
  menuRef
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {userInitial}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{userDisplayName}</p>
          <p className="text-xs text-gray-500">
            {userRoleKey && t(userRoleKey)}
          </p>
        </div>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <button
            onClick={onNavigateProfile}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <UserIcon className="w-4 h-4 mr-3" />
            {t('profile.myProfile')}
          </button>
          <hr className="my-1" />
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
            {t('profile.logout')}
          </button>
        </div>
      )}
    </div>
  );
};

ProfileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  userInitial: PropTypes.string.isRequired,
  userDisplayName: PropTypes.string.isRequired,
  userRoleKey: PropTypes.string,
  onNavigateProfile: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  menuRef: PropTypes.object
};

export default ProfileMenu;