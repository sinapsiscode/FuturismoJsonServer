import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useNotificationsStore from '../stores/notificationsStore';

const useHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount, toggleVisibility } = useNotificationsStore();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/monitoring?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navigateToProfile = () => {
    navigate('/profile');
    setProfileMenuOpen(false);
  };

  const getUserInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    return user?.name || 'Usuario';
  };

  const getUserRoleKey = () => {
    const roleMap = {
      agency: 'roles.agency',
      guide: 'roles.guide',
      admin: 'roles.admin'
    };
    return roleMap[user?.role] || '';
  };

  return {
    // State
    profileMenuOpen,
    setProfileMenuOpen,
    searchQuery,
    setSearchQuery,
    profileMenuRef,
    unreadCount,
    
    // Handlers
    handleLogout,
    handleSearch,
    navigateToProfile,
    toggleNotifications: toggleVisibility,
    
    // Computed values
    userInitial: getUserInitial(),
    userDisplayName: getUserDisplayName(),
    userRoleKey: getUserRoleKey()
  };
};

export default useHeader;