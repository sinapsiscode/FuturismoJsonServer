import { create } from 'zustand';
import { settingsService } from '../services/settingsService';
import {
  VALIDATION_MESSAGES,
  VALIDATION_MINIMUMS
} from '../constants/settingsConstants';

// Estado inicial vacío - se cargará desde el servicio
const defaultSettings = {
  general: {},
  tours: {},
  agencies: {},
  guides: {},
  notifications: {},
  monitoring: {},
  reports: {},
  security: {},
  integrations: {}
};

const useSettingsStore = create((set, get) => ({
  // Estado
  settings: defaultSettings,
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,
  history: [],
  availableOptions: null,
  systemStatus: null,
  backups: [],

  // Acciones generales
  loadSettings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.getSettings();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar configuraciones');
      }
      
      set({ 
        settings: result.data,
        isLoading: false,
        hasUnsavedChanges: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  saveSettings: async () => {
    const { settings } = get();
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.updateSettings(settings);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al guardar configuraciones');
      }
      
      set({ 
        hasUnsavedChanges: false, 
        isLoading: false 
      });
      
      return result;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  resetSettings: async (category = null) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.resetSettings(category);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al restablecer configuraciones');
      }
      
      if (category) {
        set((state) => ({
          settings: {
            ...state.settings,
            [category]: result.data
          },
          hasUnsavedChanges: true,
          isLoading: false
        }));
      } else {
        set({ 
          settings: result.data,
          hasUnsavedChanges: true,
          isLoading: false
        });
      }
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  // Acciones específicas por categoría
  updateCategorySettings: (category, updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [category]: { ...state.settings[category], ...updates }
      },
      hasUnsavedChanges: true
    }));
  },
  
  updateGeneralSettings: (updates) => {
    get().updateCategorySettings('general', updates);
  },

  updateToursSettings: (updates) => {
    get().updateCategorySettings('tours', updates);
  },

  updateAgenciesSettings: (updates) => {
    get().updateCategorySettings('agencies', updates);
  },

  updateGuidesSettings: (updates) => {
    get().updateCategorySettings('guides', updates);
  },

  updateNotificationsSettings: (updates) => {
    get().updateCategorySettings('notifications', updates);
  },

  updateMonitoringSettings: (updates) => {
    get().updateCategorySettings('monitoring', updates);
  },

  updateReportsSettings: (updates) => {
    get().updateCategorySettings('reports', updates);
  },

  updateSecuritySettings: (updates) => {
    get().updateCategorySettings('security', updates);
  },

  updateIntegrationsSettings: (updates) => {
    get().updateCategorySettings('integrations', updates);
  },

  // Cargar configuración específica
  loadCategorySettings: async (category) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.getSettingsByCategory(category);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar configuración');
      }
      
      set((state) => ({
        settings: {
          ...state.settings,
          [category]: result.data
        },
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Historial de cambios
  loadHistory: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.getSettingsHistory(filters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar historial');
      }
      
      set({ 
        history: result.data.history,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Opciones disponibles
  loadAvailableOptions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.getAvailableOptions();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar opciones');
      }
      
      set({ 
        availableOptions: result.data,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  // Validaciones
  validateSettings: async () => {
    const { settings } = get();
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.validateSettings(settings);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al validar configuraciones');
      }
      
      set({ isLoading: false });
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  // Funciones de utilidad
  exportSettings: async (format = 'json') => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.exportSettings(format);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al exportar configuraciones');
      }
      
      // Descargar archivo
      if (result.data.content) {
        const blob = new Blob([result.data.content], { type: result.data.mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.data.filename;
        link.click();
        URL.revokeObjectURL(url);
      }
      
      set({ isLoading: false });
      
      return result;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  importSettings: async (data, format = 'json') => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.importSettings(data, format);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al importar configuraciones');
      }
      
      set({ 
        settings: result.data.settings,
        hasUnsavedChanges: true,
        isLoading: false
      });
      
      return result;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Sistema y backups
  checkSystemStatus: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.checkSystemStatus();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al verificar estado del sistema');
      }
      
      set({ 
        systemStatus: result.data,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  loadBackups: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.getBackups();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar backups');
      }
      
      set({ 
        backups: result.data,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  createBackup: async (name) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.createBackup(name);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear backup');
      }
      
      set((state) => ({
        backups: [result.data, ...state.backups],
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },
  
  restoreBackup: async (backupId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await settingsService.restoreBackup(backupId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al restaurar backup');
      }
      
      // Recargar configuraciones después de restaurar
      await get().loadSettings();
      
      set({ isLoading: false });
      
      return result;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  // Estados de carga y error
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Getters específicos
  getGeneralSettings: () => get().settings.general,
  getToursSettings: () => get().settings.tours,
  getNotificationSettings: () => get().settings.notifications,
  getSecuritySettings: () => get().settings.security,
  getIntegrationsSettings: () => get().settings.integrations,

  // Reset
  resetStore: () => set({
    settings: defaultSettings,
    isLoading: false,
    error: null,
    hasUnsavedChanges: false,
    history: [],
    availableOptions: null,
    systemStatus: null,
    backups: []
  })
}));

export { useSettingsStore };
export default useSettingsStore;