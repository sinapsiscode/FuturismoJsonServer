/**
 * Store para configuraciones de módulos específicos
 * Centraliza la configuración de todos los módulos del sistema
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useModulesConfigStore = create(
  persist(
    (set, get) => ({
      // Estado
      modules: null,
      isLoaded: false,
      isLoading: false,
      error: null,

      // Cargar todas las configuraciones de módulos
      loadModules: async () => {
        if (get().isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const response = await api.get('/config/modules');

          if (response.data.success) {
            set({
              modules: response.data.data,
              isLoaded: true,
              isLoading: false,
              error: null
            });
          } else {
            throw new Error(response.data.error || 'Error al cargar configuraciones');
          }
        } catch (error) {
          console.error('Error loading modules config:', error);
          set({
            error: error.message || 'Error al cargar configuraciones de módulos',
            isLoading: false,
            isLoaded: false
          });
        }
      },

      // Cargar un módulo específico
      loadModule: async (moduleName) => {
        try {
          const response = await api.get(`/config/${moduleName}`);

          if (response.data.success) {
            set(state => ({
              modules: {
                ...state.modules,
                [moduleName]: response.data.data
              }
            }));
          }
        } catch (error) {
          console.error(`Error loading ${moduleName} config:`, error);
          throw error;
        }
      },

      // Limpiar configuración
      clearModules: () => {
        set({
          modules: null,
          isLoaded: false,
          isLoading: false,
          error: null
        });
      },

      // Recargar configuración
      reloadModules: async () => {
        get().clearModules();
        await get().loadModules();
      }
    }),
    {
      name: 'modules-config-store',
      partialize: (state) => ({
        modules: state.modules,
        isLoaded: state.isLoaded
      })
    }
  )
);

export default useModulesConfigStore;
