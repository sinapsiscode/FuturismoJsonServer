import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useLayout } from '../../contexts/LayoutContext';
import { 
  Bars3Icon, 
  BellIcon, 
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import LanguageToggle from '../common/LanguageToggle';
import ProfileMenu from './ProfileMenu';
import NotificationBell from '../notifications/NotificationBell';

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toggleSidebar, viewport } = useLayout();
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/monitoring?search=${encodeURIComponent(searchQuery)}`);
      setShowMobileSearch(false);
    }
  };

  return (
    <div className="min-h-16 bg-white border-b border-gray-200 shadow-sm">
      {/* Main header row */}
      <div className="h-16 px-3 sm:px-4 lg:px-6 xl:px-8 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Menu toggle button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation lg:hidden"
            aria-label={t('common.toggleMenu')}
          >
            <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>

          {/* Logo and name - Only visible on mobile */}
          <Link to="/dashboard" className="flex items-center gap-2 md:hidden">
            <span className="text-2xl">🌎</span>
            <span className="text-xl font-bold text-gray-800">Futurismo</span>
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>

          {/* Notifications */}
          <NotificationBell />

          <ProfileMenu 
            user={user} 
            viewport={viewport} 
            onLogout={handleLogout} 
          />
        </div>
      </div>
    </div>
  );
};

export default AppHeader;