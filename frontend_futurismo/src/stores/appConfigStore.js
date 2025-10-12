/**
 * Store centralizado para configuración de la app desde el servidor
 * Reemplaza imports hardcodeados de constants
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import serverConfigService from '../services/serverConfigService.js';
import configService from '../services/configService.js';

const useAppConfigStore = create(
  persist(
    (set, get) => ({
      // ===== ESTADO =====
      initialized: false,
      loading: false,
      error: null,
      isLoaded: false,
      isLoading: false,

      // Configuraciones del servidor
      constants: null,
      tourTypes: null,
      groupTypes: null,
      languages: null,
      workZones: null,
      appSettings: null,

      // Nuevas configuraciones dinámicas desde db.json
      system: null,
      emergency: null,
      guides: null,
      app: null,
      validationSchemas: null,

      // Datos de usuario actual
      currentUser: null,
      currentRole: null,
      navigation: [],
      permissions: {},
      dashboardData: {},

      // ===== ACCIONES =====

      // Inicializar la app con datos del servidor
      initializeApp: async (role = null, userId = null) => {
        set({ loading: true, error: null });

        try {
          // Obtener datos de inicialización
          const initData = await serverConfigService.getAppInitData(role, userId);

          set({
            initialized: true,
            loading: false,
            currentUser: initData.user,
            currentRole: role,
            constants: initData.constants,
            navigation: initData.navigation,
            permissions: initData.permissions,
            dashboardData: initData.dashboard,

            // También guardar tipos específicos para fácil acceso
            tourTypes: initData.constants.TOUR_TYPES,
            languages: initData.constants.LANGUAGES
          });

          // Precargar datos adicionales
          await get().loadAdditionalConfig();

          return initData;
        } catch (error) {
          console.error('Error initializing app:', error);
          set({
            loading: false,
            error: error.message,
            initialized: false
          });
          throw error;
        }
      },

      // Cargar configuraciones adicionales
      loadAdditionalConfig: async () => {
        try {
          const [groupTypes, workZones, appSettings] = await Promise.all([
            serverConfigService.getGroupTypes(),
            serverConfigService.getWorkZones(),
            serverConfigService.getAppSettings()
          ]);

          set({
            groupTypes,
            workZones,
            appSettings
          });
        } catch (error) {
          console.error('Error loading additional config:', error);
        }
      },

      // ===== GETTERS PARA REEMPLAZAR HARDCODEO =====

      // Reemplaza: import { USER_ROLES } from '../constants'
      getUserRoles: () => {
        const { constants } = get();
        return constants?.USER_ROLES || {};
      },

      // Reemplaza: import { SERVICE_STATUS } from '../constants'
      getServiceStatus: () => {
        const { constants } = get();
        return constants?.RESERVATION_STATUS || {};
      },

      // Reemplaza: import { SERVICE_CATEGORIES } from '../constants'
      getServiceCategories: () => {
        const { constants } = get();
        return constants?.SERVICE_CATEGORIES || {};
      },

      // Obtener tipos de tour
      getTourTypes: () => {
        const { tourTypes } = get();
        return tourTypes || [];
      },

      // Obtener idiomas
      getLanguages: () => {
        const { languages } = get();
        return languages || [];
      },

      // Obtener tipos de grupo
      getGroupTypes: () => {
        const { groupTypes } = get();
        return groupTypes || [];
      },

      // Obtener zonas de trabajo
      getWorkZones: () => {
        const { workZones } = get();
        return workZones || [];
      },

      // Obtener configuraciones de la app
      getAppSettings: () => {
        const { appSettings } = get();
        return appSettings || {};
      },

      // ===== UTILIDADES =====

      // Validar email usando servidor
      validateEmail: async (email) => {
        return await serverConfigService.validateEmail(email);
      },

      // Validar teléfono usando servidor
      validatePhone: async (phone, country = 'PE') => {
        return await serverConfigService.validatePhone(phone, country);
      },

      // Formatear moneda usando servidor
      formatCurrency: async (amount, currency = 'USD', locale = 'en-US') => {
        return await serverConfigService.formatCurrency(amount, currency, locale);
      },

      // Formatear fecha usando servidor
      formatDate: async (date, format = 'DD/MM/YYYY', timezone = 'America/Lima') => {
        return await serverConfigService.formatDate(date, format, timezone);
      },

      // Calcular precios usando servidor
      calculatePrice: async (priceData) => {
        return await serverConfigService.calculatePrice(priceData);
      },

      // ===== HELPERS =====

      // Verificar si un rol tiene permiso
      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions[permission] || false;
      },

      // Verificar si es admin
      isAdmin: () => {
        const { currentRole } = get();
        return currentRole === 'admin';
      },

      // Verificar if es agency
      isAgency: () => {
        const { currentRole } = get();
        return currentRole === 'agency';
      },

      // Verificar si es guide
      isGuide: () => {
        const { currentRole } = get();
        return currentRole === 'guide';
      },

      // Obtener navegación del usuario actual
      getNavigation: () => {
        const { navigation } = get();
        return navigation || [];
      },

      // Obtener datos del dashboard
      getDashboardData: () => {
        const { dashboardData } = get();
        return dashboardData || {};
      },

      // ===== ACCIONES DE ESTADO =====

      // Actualizar usuario actual
      setCurrentUser: (user) => {
        set({ currentUser: user });
      },

      // Actualizar datos del dashboard
      updateDashboardData: (data) => {
        set({ dashboardData: { ...get().dashboardData, ...data } });
      },

      // Refrescar configuración
      refreshConfig: async () => {
        const { currentRole, currentUser } = get();
        if (currentRole && currentUser) {
          await get().initializeApp(currentRole, currentUser.id);
        }
      },

      // Limpiar estado
      clearState: () => {
        set({
          initialized: false,
          loading: false,
          error: null,
          isLoaded: false,
          isLoading: false,
          constants: null,
          tourTypes: null,
          groupTypes: null,
          languages: null,
          workZones: null,
          appSettings: null,
          system: null,
          emergency: null,
          guides: null,
          app: null,
          validationSchemas: null,
          currentUser: null,
          currentRole: null,
          navigation: [],
          permissions: {},
          dashboardData: {}
        });
      },

      // ===== NUEVAS ACCIONES PARA CONFIGURACIÓN DINÁMICA =====

      // Cargar toda la configuración en una sola llamada
      loadAllConfig: async () => {
        if (get().isLoading) return; // Evitar múltiples llamadas simultáneas

        set({ isLoading: true, error: null });

        try {
          const response = await configService.getAllConfig();

          if (response.success) {
            set({
              system: response.data.system,
              emergency: response.data.emergency,
              guides: response.data.guides,
              app: response.data.app,
              validationSchemas: response.data.validationSchemas,
              isLoaded: true,
              isLoading: false,
              error: null
            });

            return response.data;
          } else {
            throw new Error(response.error || 'Error al cargar configuración');
          }
        } catch (error) {
          console.error('[appConfigStore] Error loading all config:', error);
          set({
            isLoading: false,
            error: error.message,
            isLoaded: false
          });
          throw error;
        }
      },

      // Cargar configuración del sistema
      loadSystemConfig: async () => {
        try {
          const response = await configService.getSystemConfig();
          if (response.success) {
            set({ system: response.data });
            return response.data;
          }
        } catch (error) {
          console.error('[appConfigStore] Error loading system config:', error);
          throw error;
        }
      },

      // Cargar configuración de emergencias
      loadEmergencyConfig: async () => {
        try {
          const response = await configService.getEmergencyConfig();
          if (response.success) {
            set({ emergency: response.data });
            return response.data;
          }
        } catch (error) {
          console.error('[appConfigStore] Error loading emergency config:', error);
          throw error;
        }
      },

      // Cargar configuración de guías
      loadGuidesConfig: async () => {
        try {
          const response = await configService.getGuidesConfig();
          if (response.success) {
            set({ guides: response.data });
            return response.data;
          }
        } catch (error) {
          console.error('[appConfigStore] Error loading guides config:', error);
          throw error;
        }
      },

      // Cargar configuración de la app
      loadAppConfig: async () => {
        try {
          const response = await configService.getAppConfig();
          if (response.success) {
            set({ app: response.data });
            return response.data;
          }
        } catch (error) {
          console.error('[appConfigStore] Error loading app config:', error);
          throw error;
        }
      }
    }),
    {
      name: 'app-config-store',
      partialize: (state) => ({
        // Solo persistir datos que no cambien frecuentemente
        constants: state.constants,
        tourTypes: state.tourTypes,
        groupTypes: state.groupTypes,
        languages: state.languages,
        workZones: state.workZones,
        appSettings: state.appSettings,
        // Nuevas configuraciones dinámicas
        system: state.system,
        emergency: state.emergency,
        guides: state.guides,
        app: state.app,
        validationSchemas: state.validationSchemas,
        isLoaded: state.isLoaded
      })
    }
  )
);

export { useAppConfigStore };
export default useAppConfigStore;