/**
 * Store de autenticación
 * Maneja el estado global de autenticación
 */

import { create } from 'zustand';
import authService from '../services/authService';
import { APP_CONFIG, getStorageKey } from '../config/app.config';
import {
  USER_ROLES,
  GUIDE_TYPES,
  USER_STATUS,
  ERROR_MESSAGES,
  INITIAL_STATE,
  AUTH_STATES,
  AUTH_EVENTS,
  SESSION_CONFIG
} from '../constants/authConstants';

const useAuthStore = create((set, get) => ({
  // Estado inicial
  ...INITIAL_STATE,
  authState: AUTH_STATES.IDLE,

  // Acciones
  login: async (credentials) => {
    set({ 
      isLoading: true, 
      error: null,
      authState: AUTH_STATES.LOADING 
    });
    
    try {
      const result = await authService.login(credentials);
      
      if (!result.success) {
        throw new Error(result.error || ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const { token, user } = result.data;
      
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        rememberMe: credentials.rememberMe || false,
        authState: AUTH_STATES.AUTHENTICATED
      });
      
      // Guardar en storage si remember me está activo
      if (credentials.rememberMe) {
        localStorage.setItem(getStorageKey('authToken'), token);
        localStorage.setItem(getStorageKey('authUser'), JSON.stringify(user));
      } else {
        // Si no hay remember me, usar sessionStorage
        sessionStorage.setItem(getStorageKey('authToken'), token);
        sessionStorage.setItem(getStorageKey('authUser'), JSON.stringify(user));
      }

      // Emitir evento de login exitoso
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGIN_SUCCESS, { detail: { user } }));
      
      return { success: true, user };
      
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.INVALID_CREDENTIALS;
      
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        token: null,
        user: null,
        authState: AUTH_STATES.ERROR
      });

      // Emitir evento de login fallido
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGIN_FAILURE, { detail: { error: errorMessage } }));
      
      throw error;
    }
  },

  register: async (registerData) => {
    set({ 
      isLoading: true, 
      error: null,
      authState: AUTH_STATES.LOADING 
    });
    
    try {
      const result = await authService.register(registerData);
      
      if (!result.success) {
        throw new Error(result.error || ERROR_MESSAGES.EMAIL_EXISTS);
      }

      const { token, user } = result.data;
      
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        authState: AUTH_STATES.AUTHENTICATED
      });
      
      // Guardar en storage
      localStorage.setItem(getStorageKey('authToken'), token);
      localStorage.setItem(getStorageKey('authUser'), JSON.stringify(user));
      
      return { success: true, user };
      
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar usuario';
      
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        token: null,
        user: null,
        authState: AUTH_STATES.ERROR
      });
      
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    const { token } = get();
    
    // Intentar logout en el servidor
    if (token) {
      await authService.logout(token);
    }

    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,
      authState: AUTH_STATES.UNAUTHENTICATED
    });
    
    // Limpiar storage
    localStorage.removeItem(getStorageKey('authToken'));
    localStorage.removeItem(getStorageKey('authUser'));
    sessionStorage.removeItem(getStorageKey('authToken'));
    sessionStorage.removeItem(getStorageKey('authUser'));

    // Emitir evento de logout
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
  },

  checkTokenExpiry: async () => {
    const { token } = get();
    
    if (!token) {
      // Intentar recuperar de storage
      const savedToken = localStorage.getItem(getStorageKey('authToken')) || 
                       sessionStorage.getItem(getStorageKey('authToken'));
      const savedUser = localStorage.getItem(getStorageKey('authUser')) || 
                       sessionStorage.getItem(getStorageKey('authUser'));
      
      if (savedToken && savedUser) {
        try {
          // Verificar token con el servidor
          const result = await authService.verifyToken(savedToken);
          
          if (result.valid) {
            const user = JSON.parse(savedUser);
            set({
              token: savedToken,
              user: result.user || user,
              isAuthenticated: true,
              rememberMe: !!localStorage.getItem(getStorageKey('authToken')),
              authState: AUTH_STATES.AUTHENTICATED
            });
            return true;
          }
        } catch (error) {
          console.warn('Error al verificar token:', error);
          // Limpiar storage si el token no es válido
          get().clearStorage();
        }
      }
      return false;
    }

    // Verificar token existente
    try {
      const result = await authService.verifyToken(token);
      if (!result.valid) {
        get().logout();
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.SESSION_EXPIRED));
        return false;
      }
      return true;
    } catch (error) {
      console.warn('Error al verificar token:', error);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  updateProfile: async (profileData) => {
    const { user, token } = get();
    if (!user || !token) return { success: false, error: 'No autenticado' };
    
    try {
      set({ isLoading: true });
      
      const result = await authService.updateProfile(user.id, profileData, token);
      
      if (!result.success) {
        throw new Error(result.error || ERROR_MESSAGES.UPDATE_PROFILE_ERROR);
      }

      const updatedUser = result.data.user;
      
      set({
        user: updatedUser,
        isLoading: false
      });
      
      // Actualizar storage
      const storage = get().rememberMe ? localStorage : sessionStorage;
      storage.setItem(getStorageKey('authUser'), JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message || ERROR_MESSAGES.UPDATE_PROFILE_ERROR 
      });
      return { success: false, error: error.message };
    }
  },

  changePassword: async (passwordData) => {
    const { user, token } = get();
    if (!user || !token) return { success: false, error: 'No autenticado' };
    
    try {
      set({ isLoading: true });
      
      const result = await authService.changePassword(user.id, passwordData, token);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cambiar contraseña');
      }
      
      set({ isLoading: false });
      
      return { success: true };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message 
      });
      return { success: false, error: error.message };
    }
  },

  clearStorage: () => {
    localStorage.removeItem(getStorageKey('authToken'));
    localStorage.removeItem(getStorageKey('authUser'));
    sessionStorage.removeItem(getStorageKey('authToken'));
    sessionStorage.removeItem(getStorageKey('authUser'));
  },

  // Función para inicializar el store
  initialize: async () => {
    set({ authState: AUTH_STATES.LOADING });
    
    const savedToken = localStorage.getItem(getStorageKey('authToken')) || 
                     sessionStorage.getItem(getStorageKey('authToken'));
    const savedUser = localStorage.getItem(getStorageKey('authUser')) || 
                     sessionStorage.getItem(getStorageKey('authUser'));
    
    if (savedToken && savedUser) {
      try {
        // Verificar token con el servidor
        const result = await authService.verifyToken(savedToken);
        
        if (result.valid) {
          const user = JSON.parse(savedUser);
          set({
            token: savedToken,
            user: result.user || user,
            isAuthenticated: true,
            rememberMe: !!localStorage.getItem(getStorageKey('authToken')),
            authState: AUTH_STATES.AUTHENTICATED
          });
        } else {
          // Token inválido, limpiar
          get().clearStorage();
          set({ authState: AUTH_STATES.UNAUTHENTICATED });
        }
      } catch (error) {
        console.warn('Error al inicializar sesión:', error);
        get().clearStorage();
        set({ authState: AUTH_STATES.UNAUTHENTICATED });
      }
    } else {
      set({ authState: AUTH_STATES.UNAUTHENTICATED });
    }
  },

  // Función para refrescar token
  refreshToken: async () => {
    const { token } = get();
    if (!token) return false;

    try {
      const result = await authService.refreshToken(token);
      
      if (result.success) {
        const newToken = result.data.token;
        set({ token: newToken });
        
        // Actualizar storage
        const storage = get().rememberMe ? localStorage : sessionStorage;
        storage.setItem(getStorageKey('authToken'), newToken);
        
        // Emitir evento
        window.dispatchEvent(new CustomEvent(AUTH_EVENTS.TOKEN_REFRESHED));
        
        return true;
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
    }
    
    return false;
  }
}));

// Configurar verificación periódica de sesión
if (APP_CONFIG.app.isDevelopment === false) {
  setInterval(() => {
    const state = useAuthStore.getState();
    if (state.isAuthenticated) {
      state.checkTokenExpiry();
    }
  }, SESSION_CONFIG.CHECK_INTERVAL);
}

export { useAuthStore };
export default useAuthStore;