/**
 * Hook personalizado para acceder a configuraciones del servidor
 * Reemplaza imports hardcodeados
 */

import { useEffect, useState } from 'react';
import useAppConfigStore from '../stores/appConfigStore.js';
import serverConfigService from '../services/serverConfigService.js';

// Hook principal para configuraciones del servidor
export const useServerConfig = () => {
  const store = useAppConfigStore();

  return {
    // Estado
    initialized: store.initialized,
    loading: store.loading,
    error: store.error,

    // Acciones
    initializeApp: store.initializeApp,
    refreshConfig: store.refreshConfig,
    clearState: store.clearState,

    // Datos
    currentUser: store.currentUser,
    currentRole: store.currentRole,
    navigation: store.getNavigation(),
    permissions: store.permissions,
    dashboardData: store.getDashboardData(),

    // Helpers
    hasPermission: store.hasPermission,
    isAdmin: store.isAdmin,
    isAgency: store.isAgency,
    isGuide: store.isGuide
  };
};

// Hook para obtener constantes (reemplaza imports de constants.js)
export const useConstants = () => {
  const store = useAppConfigStore();

  return {
    USER_ROLES: store.getUserRoles(),
    SERVICE_STATUS: store.getServiceStatus(),
    SERVICE_CATEGORIES: store.getServiceCategories(),
    TOUR_TYPES: store.getTourTypes(),
    GROUP_TYPES: store.getGroupTypes(),
    LANGUAGES: store.getLanguages(),
    WORK_ZONES: store.getWorkZones(),
    APP_SETTINGS: store.getAppSettings()
  };
};

// Hook para validaciones del servidor
export const useServerValidation = () => {
  const store = useAppConfigStore();

  return {
    validateEmail: store.validateEmail,
    validatePhone: store.validatePhone,

    // Función helper para validar reservación
    validateReservation: async (reservationData) => {
      return await serverConfigService.validateReservation(reservationData);
    },

    // Función helper para validar usuario
    validateUserRegistration: async (userData) => {
      return await serverConfigService.validateUserRegistration(userData);
    }
  };
};

// Hook para utilidades de formateo del servidor
export const useServerFormatting = () => {
  const store = useAppConfigStore();

  return {
    formatCurrency: store.formatCurrency,
    formatDate: store.formatDate,
    calculatePrice: store.calculatePrice,

    // Función helper para generar ID
    generateId: async (prefix = 'item') => {
      return await serverConfigService.generateId(prefix);
    },

    // Función helper para calcular distancia
    calculateDistance: async (lat1, lon1, lat2, lon2, unit = 'km') => {
      return await serverConfigService.calculateDistance(lat1, lon1, lat2, lon2, unit);
    }
  };
};

// Hook especializado para USER_ROLES
export const useUserRoles = () => {
  const [userRoles, setUserRoles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRoles = async () => {
      try {
        const roles = await serverConfigService.getUserRoles();
        setUserRoles(roles);
      } catch (error) {
        console.error('Error loading user roles:', error);
        // Fallback temporal si falla el servidor
        setUserRoles({
          ADMIN: 'admin',
          AGENCY: 'agency',
          GUIDE: 'guide',
          CLIENT: 'client'
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserRoles();
  }, []);

  return { userRoles, loading };
};

// Hook especializado para SERVICE_STATUS
export const useServiceStatus = () => {
  const [serviceStatus, setServiceStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServiceStatus = async () => {
      try {
        const status = await serverConfigService.getServiceStatus();
        setServiceStatus(status);
      } catch (error) {
        console.error('Error loading service status:', error);
        // Fallback temporal si falla el servidor
        setServiceStatus({
          PENDING: 'pending',
          CONFIRMED: 'confirmed',
          IN_PROGRESS: 'in_progress',
          COMPLETED: 'completed',
          CANCELLED: 'cancelled'
        });
      } finally {
        setLoading(false);
      }
    };

    loadServiceStatus();
  }, []);

  return { serviceStatus, loading };
};

// Hook para tipos de tour
export const useTourTypes = () => {
  const [tourTypes, setTourTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTourTypes = async () => {
      try {
        const types = await serverConfigService.getTourTypes();
        setTourTypes(types);
      } catch (error) {
        console.error('Error loading tour types:', error);
        setTourTypes([]);
      } finally {
        setLoading(false);
      }
    };

    loadTourTypes();
  }, []);

  return { tourTypes, loading };
};

// Hook para idiomas
export const useLanguages = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const langs = await serverConfigService.getLanguages();
        setLanguages(langs);
      } catch (error) {
        console.error('Error loading languages:', error);
        setLanguages([]);
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  return { languages, loading };
};

// Hook para inicialización completa de la app
export const useAppInitialization = (role, userId) => {
  const [initData, setInitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      if (!role || !userId) return;

      try {
        setLoading(true);
        setError(null);

        const data = await serverConfigService.getAppInitData(role, userId);
        setInitData(data);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [role, userId]);

  return { initData, loading, error };
};

// Hook para datos específicos por rol
export const useRoleData = (role, userId) => {
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoleData = async () => {
      if (!role || !userId) return;

      try {
        const data = await serverConfigService.getRoleData(role, userId);
        setRoleData(data);
      } catch (error) {
        console.error('Error loading role data:', error);
        setRoleData(null);
      } finally {
        setLoading(false);
      }
    };

    loadRoleData();
  }, [role, userId]);

  return { roleData, loading };
};

// Hook para precargar configuraciones comunes
export const usePreloadConfig = () => {
  const [preloaded, setPreloaded] = useState(false);

  useEffect(() => {
    const preload = async () => {
      try {
        await serverConfigService.preloadCommonData();
        setPreloaded(true);
      } catch (error) {
        console.error('Error preloading config:', error);
      }
    };

    preload();
  }, []);

  return { preloaded };
};