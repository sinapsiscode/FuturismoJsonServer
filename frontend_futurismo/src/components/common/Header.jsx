import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Bars3Icon } from '@heroicons/react/24/outline';
import useHeader from '../../hooks/useHeader';
import LanguageToggle from './LanguageToggle';
// import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';
import NotificationBell from '../notifications/NotificationBell';
import PointsDisplay from './PointsDisplay';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { t } = useTranslation();
  const {
    profileMenuOpen,
    setProfileMenuOpen,
    profileMenuRef,
    unreadCount,
    handleLogout,
    navigateToProfile,
    toggleNotifications,
    userInitial,
    userDisplayName,
    userRoleKey
  } = useHeader();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label={t('common.toggleSidebar')}
            >
              <Bars3Icon className="w-5 h-5 text-gray-500" />
            </button>

          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <PointsDisplay />
            
            <LanguageToggle />
            
            <NotificationBell />

            <ProfileMenu
              isOpen={profileMenuOpen}
              onToggle={() => setProfileMenuOpen(!profileMenuOpen)}
              userInitial={userInitial}
              userDisplayName={userDisplayName}
              userRoleKey={userRoleKey}
              onNavigateProfile={navigateToProfile}
              onLogout={handleLogout}
              menuRef={profileMenuRef}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool
};

export default Header;