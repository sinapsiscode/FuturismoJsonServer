import { useState, useEffect } from 'react';
import { useUsersStore } from '../stores/usersStoreSimple';
import { DEFAULT_VALUES } from '../constants/usersConstants';

export const useUserList = () => {
  // Suscribirse directamente a las funciones del store
  const toggleUserStatus = useUsersStore((state) => state.toggleUserStatus);
  const resetUserPassword = useUsersStore((state) => state.resetUserPassword);
  const setFilters = useUsersStore((state) => state.setFilters);
  const clearFilters = useUsersStore((state) => state.clearFilters);
  const initialize = useUsersStore((state) => state.initialize);
  const hasInitialized = useUsersStore((state) => state.hasInitialized);

  // Suscribirse a los datos computados - estos se actualizarán automáticamente cuando cambien los filtros
  const users = useUsersStore((state) => state.getFilteredUsers());
  const stats = useUsersStore((state) => state.getUsersStatistics());
  const roleStats = useUsersStore((state) => state.getRoleStatistics());
  const roles = useUsersStore((state) => state.getRoles());
  const filters = useUsersStore((state) => state.filters);

  const [showFilters, setShowFilters] = useState(false);

  // Inicializar el store al montar el componente
  useEffect(() => {
    if (!hasInitialized) {
      initialize().catch(err => console.error('Error initializing users:', err));
    }
  }, [hasInitialized, initialize]);

  const handleSearch = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleStatusToggle = (userId) => {
    toggleUserStatus(userId);
  };

  const handlePasswordReset = (userId, onConfirm, onSuccess) => {
    resetUserPassword(userId, DEFAULT_VALUES.TEMPORARY_PASSWORD);
    if (onSuccess) {
      onSuccess(DEFAULT_VALUES.TEMPORARY_PASSWORD);
    }
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(v => v !== '');
  };

  const getDepartments = () => {
    return [...new Set(users.map(user => user.department))];
  };

  return {
    // State
    users,
    stats,
    roleStats,
    roles,
    showFilters,
    filters,
    
    // Actions
    handleSearch,
    handleFilterChange,
    handleStatusToggle,
    handlePasswordReset,
    clearFilters,
    setShowFilters,
    
    // Computed
    hasActiveFilters,
    getDepartments
  };
};