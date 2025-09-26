/**
 * Store centralizado para configuración de la app desde el servidor
 * Reemplaza imports hardcodeados de constants
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import serverConfigService from '../services/serverConfigService.js';

const useAppConfigStore = create(
  persist(
    (set, get) => ({
      // ===== ESTADO =====
      initialized: false,
      loading: false,
      error: null,

      // Configuraciones del servidor
      constants: null,
      tourTypes: null,
      groupTypes: null,
      languages: null,
      workZones: null,
      appSettings: null,

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
          constants: null,
          tourTypes: null,
          groupTypes: null,
          languages: null,
          workZones: null,
          appSettings: null,
          currentUser: null,
          currentRole: null,
          navigation: [],
          permissions: {},
          dashboardData: {}
        });
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
        appSettings: state.appSettings
      })
    }
  )
);

export default useAppConfigStore;