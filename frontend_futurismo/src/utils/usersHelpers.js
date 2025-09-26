import { 
  VALIDATION_PATTERNS, 
  FORM_LIMITS, 
  DATE_FORMATS,
  ROLE_COLORS,
  STATUS_COLORS 
} from '../constants/usersConstants';

// Validation helpers
export const validateUsername = (username) => {
  if (!username || username.trim().length < FORM_LIMITS.USERNAME_MIN) {
    return false;
  }
  if (username.length > FORM_LIMITS.USERNAME_MAX) {
    return false;
  }
  return VALIDATION_PATTERNS.USERNAME.test(username);
};

export const validateEmail = (email) => {
  return email && VALIDATION_PATTERNS.EMAIL.test(email);
};

export const validatePhone = (phone) => {
  return !phone || VALIDATION_PATTERNS.PHONE.test(phone);
};

export const validateRUC = (ruc) => {
  return ruc && VALIDATION_PATTERNS.RUC.test(ruc);
};

export const validateName = (name) => {
  return name && 
    name.trim().length >= FORM_LIMITS.NAME_MIN && 
    name.trim().length <= FORM_LIMITS.NAME_MAX;
};

export const validatePassword = (password) => {
  return password && 
    password.length >= FORM_LIMITS.PASSWORD_MIN && 
    password.length <= FORM_LIMITS.PASSWORD_MAX;
};

// Format helpers
export const formatLastLogin = (lastLogin) => {
  if (!lastLogin) return null;
  const date = new Date(lastLogin);
  return {
    date: date.toLocaleDateString(DATE_FORMATS.LOCALE),
    time: date.toLocaleTimeString(DATE_FORMATS.LOCALE, DATE_FORMATS.DATE_TIME_FORMAT)
  };
};

export const formatFullDateTime = (lastLogin) => {
  const formatted = formatLastLogin(lastLogin);
  if (!formatted) return 'Nunca';
  return `${formatted.date} ${formatted.time}`;
};

// Role helpers
export const getRoleColor = (roleId, roles = []) => {
  const role = roles.find(r => r.id === roleId);
  return role?.color || ROLE_COLORS[roleId] || 'gray';
};

export const getRoleName = (roleId, roles = []) => {
  const role = roles.find(r => r.id === roleId);
  return role?.name || roleId;
};

// Status helpers
export const getStatusClasses = (status) => {
  const colors = STATUS_COLORS[status];
  if (!colors) return STATUS_COLORS[USER_STATUS.INACTIVE];
  return `${colors.bg} ${colors.text}`;
};

// Array helpers
export const parseCommaSeparatedList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return value.split(',').map(item => item.trim()).filter(item => item);
};

export const formatArrayToString = (array) => {
  if (!Array.isArray(array)) return '';
  return array.join(', ');
};

// Permission helpers
export const hasPermission = (userPermissions, requiredPermission) => {
  if (!Array.isArray(userPermissions)) return false;
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  if (!Array.isArray(userPermissions) || !Array.isArray(requiredPermissions)) return false;
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  if (!Array.isArray(userPermissions) || !Array.isArray(requiredPermissions)) return false;
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

// Filter helpers
export const filterUsers = (users, filters) => {
  return users.filter(user => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        (user.company && user.company.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Role filter
    if (filters.role && user.role !== filters.role) {
      return false;
    }

    // Status filter
    if (filters.status && user.status !== filters.status) {
      return false;
    }

    // Guide type filter
    if (filters.guideType && user.role === 'guia' && user.guideType !== filters.guideType) {
      return false;
    }

    return true;
  });
};

// Statistics helpers
export const calculateUserStatistics = (users) => {
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'activo').length,
    inactive: users.filter(u => u.status === 'inactivo').length
  };

  // Count by role
  const roleStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  // Count guide types
  const guides = users.filter(u => u.role === 'guia');
  const guideStats = {
    total: guides.length,
    planta: guides.filter(g => g.guideType === 'planta').length,
    freelance: guides.filter(g => g.guideType === 'freelance').length
  };

  return {
    ...stats,
    byRole: roleStats,
    guides: guideStats
  };
};