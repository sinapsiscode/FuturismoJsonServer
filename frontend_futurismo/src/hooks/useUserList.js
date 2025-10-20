import { useState, useEffect } from 'react';
import { useUsersStore } from '../stores/usersStoreSimple';
import { DEFAULT_VALUES } from '../constants/usersConstants';

export const useUserList = () => {
  const {
    getFilteredUsers,
    getUsersStatistics,
    getRoleStatistics,
    getRoles,
    toggleUserStatus,
    resetUserPassword,
    filters,
    setFilters,
    clearFilters,
    initialize,
    hasInitialized
  } = useUsersStore();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [roleStats, setRoleStats] = useState({});
  const [roles, setRoles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Inicializar el store al montar el componente
  useEffect(() => {
    if (!hasInitialized) {
      initialize().catch(err => console.error('Error initializing users:', err));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [filters, hasInitialized]);

  const loadData = () => {
    const filteredUsers = getFilteredUsers();
    const userStats = getUsersStatistics();
    const roleStatistics = getRoleStatistics();
    const systemRoles = getRoles();

    setUsers(filteredUsers);
    setStats(userStats);
    setRoleStats(roleStatistics);
    setRoles(systemRoles);
  };

  const handleSearch = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleStatusToggle = (userId) => {
    toggleUserStatus(userId);
    loadData();
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