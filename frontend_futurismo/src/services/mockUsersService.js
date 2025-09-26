/**
 * Servicio mock de usuarios
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';

// Roles del sistema
const SYSTEM_ROLES = [
  { id: 'admin', name: 'Administrador', description: 'Acceso total al sistema' },
  { id: 'agency', name: 'Agencia', description: 'Gestión de reservas y tours' },
  { id: 'guide-planta', name: 'Guía Planta', description: 'Guía empleado fijo de la empresa' },
  { id: 'guide-freelance', name: 'Guía Freelance', description: 'Guía independiente por servicios' }
];

// Permisos del sistema
const SYSTEM_PERMISSIONS = [
  // Usuarios
  { id: 'users.view', module: 'users', action: 'view', description: 'Ver usuarios' },
  { id: 'users.create', module: 'users', action: 'create', description: 'Crear usuarios' },
  { id: 'users.edit', module: 'users', action: 'edit', description: 'Editar usuarios' },
  { id: 'users.delete', module: 'users', action: 'delete', description: 'Eliminar usuarios' },
  
  // Reservaciones
  { id: 'reservations.view', module: 'reservations', action: 'view', description: 'Ver reservaciones' },
  { id: 'reservations.create', module: 'reservations', action: 'create', description: 'Crear reservaciones' },
  { id: 'reservations.edit', module: 'reservations', action: 'edit', description: 'Editar reservaciones' },
  { id: 'reservations.delete', module: 'reservations', action: 'delete', description: 'Eliminar reservaciones' },
  
  // Guías
  { id: 'guides.view', module: 'guides', action: 'view', description: 'Ver guías' },
  { id: 'guides.create', module: 'guides', action: 'create', description: 'Crear guías' },
  { id: 'guides.edit', module: 'guides', action: 'edit', description: 'Editar guías' },
  { id: 'guides.delete', module: 'guides', action: 'delete', description: 'Eliminar guías' },
  
  // Marketplace
  { id: 'marketplace.view', module: 'marketplace', action: 'view', description: 'Ver marketplace' },
  { id: 'marketplace.manage', module: 'marketplace', action: 'manage', description: 'Gestionar marketplace' },
  
  // Reportes
  { id: 'reports.view', module: 'reports', action: 'view', description: 'Ver reportes' },
  { id: 'reports.export', module: 'reports', action: 'export', description: 'Exportar reportes' },
  
  // Configuración
  { id: 'settings.view', module: 'settings', action: 'view', description: 'Ver configuración' },
  { id: 'settings.edit', module: 'settings', action: 'edit', description: 'Editar configuración' }
];

// Base de datos mock de usuarios
const MOCK_USERS_DB = [
  {
    id: 'user-001',
    email: 'admin@futurismo.com',
    name: 'Admin Sistema',
    roleId: 'admin',
    status: 'activo',
    phone: '+51 999 888 777',
    department: 'Sistemas',
    position: 'Administrador de Sistema',
    permissions: SYSTEM_PERMISSIONS.map(p => p.id), // Admin tiene todos los permisos
    avatar: null,
    lastLogin: '2024-03-10T10:30:00Z',
    loginCount: 245,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-03-10T10:30:00Z',
    createdBy: 'system',
    twoFactorEnabled: true,
    emailVerified: true,
    passwordLastChanged: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user-002',
    email: 'maria.garcia@futurismo.com',
    name: 'María García',
    roleId: 'agency',
    status: 'activo',
    phone: '+51 987 654 321',
    department: 'Ventas',
    position: 'Ejecutiva de Ventas',
    permissions: [
      'reservations.view', 'reservations.create', 'reservations.edit',
      'guides.view', 'marketplace.view', 'reports.view'
    ],
    avatar: null,
    lastLogin: '2024-03-12T08:15:00Z',
    loginCount: 156,
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-03-12T08:15:00Z',
    createdBy: 'user-001',
    twoFactorEnabled: false,
    emailVerified: true,
    passwordLastChanged: '2023-12-01T00:00:00Z'
  },
  {
    id: 'user-003',
    email: 'juan.perez@futurismo.com',
    name: 'Juan Pérez',
    roleId: 'guide-planta',
    status: 'activo',
    phone: '+51 976 543 210',
    department: 'Operaciones',
    position: 'Guía Turístico',
    permissions: [
      'reservations.view', 'guides.view', 'reports.view'
    ],
    avatar: null,
    lastLogin: '2024-03-11T14:20:00Z',
    loginCount: 89,
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-03-11T14:20:00Z',
    createdBy: 'user-001',
    twoFactorEnabled: false,
    emailVerified: true,
    passwordLastChanged: '2024-02-01T00:00:00Z'
  },
  {
    id: 'user-004',
    email: 'carlos.lopez@futurismo.com',
    name: 'Carlos López',
    roleId: 'agency',
    status: 'inactivo',
    phone: '+51 965 432 109',
    department: 'Ventas',
    position: 'Ejecutivo de Ventas',
    permissions: [
      'reservations.view', 'reservations.create',
      'guides.view', 'reports.view'
    ],
    avatar: null,
    lastLogin: '2024-02-28T16:45:00Z',
    loginCount: 45,
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    createdBy: 'user-001',
    twoFactorEnabled: false,
    emailVerified: true,
    passwordLastChanged: '2023-09-01T00:00:00Z',
    deactivatedAt: '2024-03-01T09:00:00Z',
    deactivatedReason: 'Fin de contrato'
  }
];

// Actividad mock de usuarios
const MOCK_USER_ACTIVITIES = [
  {
    id: 'activity-001',
    userId: 'user-001',
    action: 'login',
    module: 'auth',
    details: 'Inicio de sesión exitoso',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    timestamp: '2024-03-12T10:30:00Z'
  },
  {
    id: 'activity-002',
    userId: 'user-001',
    action: 'create',
    module: 'users',
    details: 'Usuario creado: nuevo@futurismo.com',
    ip: '192.168.1.100',
    timestamp: '2024-03-12T10:45:00Z'
  }
];

// Sesiones activas mock
const MOCK_USER_SESSIONS = [
  {
    id: 'session-001',
    userId: 'user-001',
    token: 'mock-token-001',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    location: 'Lima, Peru',
    device: 'Desktop - Chrome',
    createdAt: '2024-03-12T10:30:00Z',
    lastActivity: '2024-03-12T15:45:00Z',
    expiresAt: '2024-03-13T10:30:00Z'
  }
];

class MockUsersService {
  constructor() {
    this.users = [...MOCK_USERS_DB];
    this.roles = [...SYSTEM_ROLES];
    this.permissions = [...SYSTEM_PERMISSIONS];
    this.activities = [...MOCK_USER_ACTIVITIES];
    this.sessions = [...MOCK_USER_SESSIONS];
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_users`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.users = data.users || this.users;
        this.activities = data.activities || this.activities;
        this.sessions = data.sessions || this.sessions;
      } catch (error) {
        console.warn('Error loading mock users from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_users`;
    localStorage.setItem(storageKey, JSON.stringify({
      users: this.users,
      activities: this.activities,
      sessions: this.sessions
    }));
  }

  async simulateDelay(ms = 500) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId(prefix = 'user') {
    return `${prefix}-${Date.now()}`;
  }

  async getUsers(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.users];
    
    // Aplicar filtros
    if (filters.role) {
      filtered = filtered.filter(u => u.roleId === filters.role);
    }
    
    if (filters.status) {
      filtered = filtered.filter(u => u.status === filters.status);
    }
    
    if (filters.department) {
      filtered = filtered.filter(u => u.department === filters.department);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm) ||
        u.phone.includes(searchTerm)
      );
    }
    
    // Ordenar por fecha de creación descendente
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Paginación
    const page = filters.page || 1;
    const pageSize = filters.pageSize || APP_CONFIG.pagination.defaultPageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = filtered.slice(start, end);
    
    return {
      success: true,
      data: {
        users: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  async getUserById(id) {
    await this.simulateDelay();
    
    const user = this.users.find(u => u.id === id);
    
    if (!user) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
    
    // Incluir rol completo
    const role = this.roles.find(r => r.id === user.roleId);
    
    return {
      success: true,
      data: {
        ...user,
        role
      }
    };
  }

  async createUser(userData) {
    await this.simulateDelay();
    
    // Verificar email único
    if (this.users.some(u => u.email === userData.email)) {
      return {
        success: false,
        error: 'El email ya está registrado'
      };
    }
    
    const newUser = {
      id: this.generateId(),
      ...userData,
      status: 'activo',
      loginCount: 0,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user', // En producción vendría del token
      emailVerified: false,
      twoFactorEnabled: false,
      passwordLastChanged: new Date().toISOString()
    };
    
    this.users.push(newUser);
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'create',
      module: 'users',
      details: `Usuario creado: ${newUser.email}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      data: newUser
    };
  }

  async updateUser(id, updateData) {
    await this.simulateDelay();
    
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
    
    // Verificar email único si se está actualizando
    if (updateData.email && updateData.email !== this.users[index].email) {
      if (this.users.some(u => u.email === updateData.email)) {
        return {
          success: false,
          error: 'El email ya está registrado'
        };
      }
    }
    
    this.users[index] = {
      ...this.users[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'update',
      module: 'users',
      details: `Usuario actualizado: ${this.users[index].email}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.users[index]
    };
  }

  async deleteUser(id) {
    await this.simulateDelay();
    
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
    
    // No permitir eliminar el último admin
    const user = this.users[index];
    if (user.roleId === 'admin') {
      const adminCount = this.users.filter(u => u.roleId === 'admin').length;
      if (adminCount === 1) {
        return {
          success: false,
          error: 'No se puede eliminar el último administrador'
        };
      }
    }
    
    const deletedUser = this.users[index];
    this.users.splice(index, 1);
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'delete',
      module: 'users',
      details: `Usuario eliminado: ${deletedUser.email}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  async toggleUserStatus(id, status) {
    await this.simulateDelay();
    
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
    
    this.users[index].status = status;
    this.users[index].updatedAt = new Date().toISOString();
    
    if (status === 'inactivo') {
      this.users[index].deactivatedAt = new Date().toISOString();
    } else {
      delete this.users[index].deactivatedAt;
      delete this.users[index].deactivatedReason;
    }
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'update',
      module: 'users',
      details: `Usuario ${status}: ${this.users[index].email}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.users[index]
    };
  }

  async resetUserPassword(id) {
    await this.simulateDelay();
    
    const user = this.users.find(u => u.id === id);
    
    if (!user) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
    
    // En producción, aquí se enviaría un email
    console.log(`[MOCK] Password reset email sent to: ${user.email}`);
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'password-reset',
      module: 'users',
      details: `Contraseña reseteada para: ${user.email}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      message: 'Se ha enviado un email con instrucciones para resetear la contraseña'
    };
  }

  async changeUserPassword(id, passwordData) {
    await this.simulateDelay();
    
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
    
    // En producción se verificaría la contraseña actual
    this.users[index].passwordLastChanged = new Date().toISOString();
    this.users[index].updatedAt = new Date().toISOString();
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: id,
      action: 'password-change',
      module: 'users',
      details: 'Contraseña cambiada',
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  async updateUserPermissions(id, permissions) {
    await this.simulateDelay();
    
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
    
    this.users[index].permissions = permissions;
    this.users[index].updatedAt = new Date().toISOString();
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'permissions-update',
      module: 'users',
      details: `Permisos actualizados para: ${this.users[index].email}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.users[index]
    };
  }

  async updateUserRole(id, roleId) {
    await this.simulateDelay();
    
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
    
    const role = this.roles.find(r => r.id === roleId);
    if (!role) {
      return {
        success: false,
        error: 'Rol no válido'
      };
    }
    
    this.users[index].roleId = roleId;
    this.users[index].updatedAt = new Date().toISOString();
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'role-update',
      module: 'users',
      details: `Rol actualizado para ${this.users[index].email}: ${role.name}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.users[index]
    };
  }

  async getRoles() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: this.roles
    };
  }

  async getPermissions() {
    await this.simulateDelay();
    
    // Agrupar permisos por módulo
    const groupedPermissions = this.permissions.reduce((acc, perm) => {
      if (!acc[perm.module]) {
        acc[perm.module] = [];
      }
      acc[perm.module].push(perm);
      return acc;
    }, {});
    
    return {
      success: true,
      data: {
        permissions: this.permissions,
        grouped: groupedPermissions
      }
    };
  }

  async searchUsers(query) {
    await this.simulateDelay();
    
    const searchTerm = query.toLowerCase();
    const results = this.users.filter(u =>
      u.name.toLowerCase().includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm) ||
      u.phone.includes(searchTerm) ||
      u.department?.toLowerCase().includes(searchTerm) ||
      u.position?.toLowerCase().includes(searchTerm)
    );
    
    return {
      success: true,
      data: results
    };
  }

  async getUserActivity(id, params = {}) {
    await this.simulateDelay();
    
    let activities = this.activities.filter(a => a.userId === id);
    
    // Filtrar por fecha
    if (params.dateFrom) {
      activities = activities.filter(a => 
        new Date(a.timestamp) >= new Date(params.dateFrom)
      );
    }
    
    if (params.dateTo) {
      activities = activities.filter(a => 
        new Date(a.timestamp) <= new Date(params.dateTo)
      );
    }
    
    // Ordenar por fecha descendente
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Paginación
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = activities.slice(start, end);
    
    return {
      success: true,
      data: {
        activities: paginatedData,
        total: activities.length,
        page,
        pageSize,
        totalPages: Math.ceil(activities.length / pageSize)
      }
    };
  }

  async getUsersStats() {
    await this.simulateDelay();
    
    const activeUsers = this.users.filter(u => u.status === 'activo');
    const inactiveUsers = this.users.filter(u => u.status === 'inactivo');
    
    const usersByRole = this.roles.map(role => ({
      role: role.name,
      count: this.users.filter(u => u.roleId === role.id).length
    }));
    
    const usersByDepartment = [...new Set(this.users.map(u => u.department).filter(Boolean))]
      .map(dept => ({
        department: dept,
        count: this.users.filter(u => u.department === dept).length
      }));
    
    const recentLogins = this.users
      .filter(u => u.lastLogin)
      .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
      .slice(0, 5);
    
    const stats = {
      totalUsers: this.users.length,
      activeUsers: activeUsers.length,
      inactiveUsers: inactiveUsers.length,
      newUsersThisMonth: this.users.filter(u => {
        const createdDate = new Date(u.createdAt);
        const currentDate = new Date();
        return createdDate.getMonth() === currentDate.getMonth() &&
               createdDate.getFullYear() === currentDate.getFullYear();
      }).length,
      usersByRole,
      usersByDepartment,
      averageLoginCount: Math.round(
        this.users.reduce((acc, u) => acc + u.loginCount, 0) / this.users.length
      ),
      twoFactorEnabled: this.users.filter(u => u.twoFactorEnabled).length,
      recentLogins
    };
    
    return {
      success: true,
      data: stats
    };
  }

  async checkEmailUnique(email, excludeId = null) {
    await this.simulateDelay();
    
    const exists = this.users.some(u => 
      u.email === email && u.id !== excludeId
    );
    
    return {
      success: true,
      data: {
        unique: !exists
      }
    };
  }

  async inviteUser(inviteData) {
    await this.simulateDelay();
    
    // Verificar email único
    if (this.users.some(u => u.email === inviteData.email)) {
      return {
        success: false,
        error: 'El email ya está registrado'
      };
    }
    
    const newUser = {
      id: this.generateId(),
      email: inviteData.email,
      name: inviteData.name || inviteData.email.split('@')[0],
      roleId: inviteData.role,
      permissions: inviteData.permissions || [],
      status: 'pendiente',
      invitedAt: new Date().toISOString(),
      invitedBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    
    // En producción se enviaría email de invitación
    console.log(`[MOCK] Invitation email sent to: ${inviteData.email}`);
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'invite',
      module: 'users',
      details: `Usuario invitado: ${inviteData.email}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      data: newUser
    };
  }

  async resendInvitation(userId) {
    await this.simulateDelay();
    
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
    
    if (user.status !== 'pendiente') {
      return {
        success: false,
        error: 'El usuario ya está activo'
      };
    }
    
    // En producción se reenviaría email
    console.log(`[MOCK] Invitation resent to: ${user.email}`);
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'resend-invite',
      module: 'users',
      details: `Invitación reenviada a: ${user.email}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      message: 'Invitación reenviada exitosamente'
    };
  }

  async importUsers(file) {
    await this.simulateDelay(2000);
    
    // Simular importación
    console.log(`[MOCK] Importing users from file: ${file.name}`);
    
    return {
      success: true,
      data: {
        imported: 10,
        failed: 2,
        errors: [
          { row: 5, error: 'Email duplicado' },
          { row: 8, error: 'Formato de email inválido' }
        ]
      }
    };
  }

  async exportUsers(filters = {}, format = 'excel') {
    await this.simulateDelay(1500);
    
    // Simular exportación
    console.log(`[MOCK] Exporting users in format: ${format}`, filters);
    
    return {
      success: true,
      message: `Usuarios exportados en formato ${format}`
    };
  }

  async getUserSessions(userId) {
    await this.simulateDelay();
    
    const userSessions = this.sessions.filter(s => s.userId === userId);
    
    return {
      success: true,
      data: userSessions
    };
  }

  async terminateUserSession(userId, sessionId) {
    await this.simulateDelay();
    
    const index = this.sessions.findIndex(s => 
      s.id === sessionId && s.userId === userId
    );
    
    if (index === -1) {
      return {
        success: false,
        error: 'Sesión no encontrada'
      };
    }
    
    this.sessions.splice(index, 1);
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'terminate-session',
      module: 'users',
      details: `Sesión terminada para usuario ${userId}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  async terminateAllUserSessions(userId) {
    await this.simulateDelay();
    
    const userSessions = this.sessions.filter(s => s.userId === userId);
    
    if (userSessions.length === 0) {
      return {
        success: false,
        error: 'No hay sesiones activas'
      };
    }
    
    this.sessions = this.sessions.filter(s => s.userId !== userId);
    
    // Registrar actividad
    this.activities.push({
      id: this.generateId('activity'),
      userId: 'current-user',
      action: 'terminate-all-sessions',
      module: 'users',
      details: `Todas las sesiones terminadas para usuario ${userId}`,
      timestamp: new Date().toISOString()
    });
    
    this.saveToStorage();
    
    return {
      success: true,
      message: `${userSessions.length} sesiones terminadas`
    };
  }
}

export const mockUsersService = new MockUsersService();
export default mockUsersService;