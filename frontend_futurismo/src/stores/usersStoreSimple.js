import { create } from 'zustand';
import { usersService } from '../services/usersService';

// Datos iniciales vacíos - se cargarán desde el servicio
const initialUsersData = [];

const useUsersStore = create((set, get) => ({
  // Estado
  users: initialUsersData,
  roles: [],
  isLoading: false,
  error: null,
  hasInitialized: false,
  
  // Filtros
  filters: {
    role: '',
    status: '',
    guideType: '', // Para filtrar guías planta/freelance
    search: ''
  },

  // Acciones básicas
  initialize: async () => {
    const { hasInitialized } = get();
    if (hasInitialized) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Cargar usuarios
      const usersResult = await usersService.getUsers();
      if (!usersResult.success) {
        throw new Error(usersResult.error || 'Error al cargar usuarios');
      }
      
      // Cargar roles
      const rolesResult = await usersService.getRoles();
      if (!rolesResult.success) {
        throw new Error(rolesResult.error || 'Error al cargar roles');
      }
      
      set({
        users: usersResult.data,
        roles: rolesResult.data,
        isLoading: false,
        hasInitialized: true
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },
  
  getUsers: (filters = {}) => {
    const { users } = get();
    let filtered = [...users];
    
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }
    
    if (filters.guideType) {
      filtered = filtered.filter(user => user.role === 'guia' && user.guideType === filters.guideType);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        (user.company && user.company.toLowerCase().includes(searchTerm)) ||
        (user.ruc && user.ruc.includes(searchTerm))
      );
    }
    
    return filtered;
  },

  getFilteredUsers: () => {
    const { filters } = get();
    return get().getUsers(filters);
  },

  getUserById: (userId) => {
    const { users } = get();
    return users.find(user => user.id === userId);
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await usersService.createUser(userData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear usuario');
      }
      
      set((state) => ({
        users: [...state.users, result.data],
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  updateUser: async (userId, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await usersService.updateUser(userId, updates);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar usuario');
      }
      
      set((state) => ({
        users: state.users.map(user =>
          user.id === userId ? result.data : user
        ),
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await usersService.deleteUser(userId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar usuario');
      }
      
      set((state) => ({
        users: state.users.filter(user => user.id !== userId),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  toggleUserStatus: async (userId) => {
    const user = get().getUserById(userId);
    if (!user) return;
    
    const newStatus = user.status === 'activo' ? 'inactivo' : 'activo';
    return get().updateUser(userId, { status: newStatus });
  },

  getRoles: () => {
    const { roles } = get();
    return roles;
  },

  getUsersStatistics: () => {
    const { users } = get();
    
    const total = users.length;
    const active = users.filter(u => u.status === 'activo').length;
    const inactive = users.filter(u => u.status === 'inactivo').length;
    
    return {
      total,
      active,
      inactive,
      activeRate: total > 0 ? (active / total * 100).toFixed(1) : 0
    };
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        role: '',
        status: '',
        guideType: '',
        search: ''
      }
    });
  },

  // Funciones específicas por tipo de usuario
  getAdministrators: () => {
    const { users } = get();
    return users.filter(user => user.role === 'administrador');
  },

  getAgencies: () => {
    const { users } = get();
    return users.filter(user => user.role === 'agencia');
  },

  getGuides: (type = null) => {
    const { users } = get();
    const guides = users.filter(user => user.role === 'guia');
    if (type) {
      return guides.filter(guide => guide.guideType === type);
    }
    return guides;
  },

  getGuidesByType: () => {
    const { users } = get();
    const guides = users.filter(user => user.role === 'guia');
    return {
      planta: guides.filter(guide => guide.guideType === 'planta'),
      freelance: guides.filter(guide => guide.guideType === 'freelance')
    };
  },

  // Estadísticas específicas por rol
  getRoleStatistics: () => {
    const { users } = get();
    const total = users.length;
    const administradores = users.filter(u => u.role === 'administrador').length;
    const agencias = users.filter(u => u.role === 'agencia').length;
    const guias = users.filter(u => u.role === 'guia').length;
    const guiasPlanta = users.filter(u => u.role === 'guia' && u.guideType === 'planta').length;
    const guiasFreelance = users.filter(u => u.role === 'guia' && u.guideType === 'freelance').length;

    return {
      total,
      administradores,
      agencias,
      guias,
      guiasPlanta,
      guiasFreelance
    };
  },

  resetUserPassword: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await usersService.resetPassword(userId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al resetear contraseña');
      }
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Estados de carga
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export { useUsersStore };
export default useUsersStore;