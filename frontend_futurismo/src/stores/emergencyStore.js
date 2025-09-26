/**
 * Store de emergencias
 * Maneja el estado global de protocolos de emergencia
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { emergencyService } from '../services/emergencyService';

const useEmergencyStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // Estado
        protocols: [],
        materials: [],
        incidents: [],
        categories: [],
        currentProtocol: null,
        currentMaterial: null,
        currentIncident: null,
        isLoading: false,
        error: null,
        
        // Paginación
        protocolsPagination: {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0
        },
        
        materialsPagination: {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0
        },
        
        incidentsPagination: {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0
        },
        
        // Filtros
        protocolsFilters: {
          search: '',
          category: '',
          priority: ''
        },
        
        materialsFilters: {
          search: '',
          category: '',
          mandatory: null
        },
        
        incidentsFilters: {
          category: '',
          severity: '',
          status: '',
          dateFrom: '',
          dateTo: ''
        },
        
        // Estadísticas
        stats: null,

        // Acciones
        actions: {
          // Inicialización
          initialize: async () => {
            set({ isLoading: true, error: null });
            
            try {
              const categoriesResult = await emergencyService.getCategories();
              
              if (!categoriesResult.success) {
                throw new Error('Error al cargar categorías');
              }
              
              set({
                categories: categoriesResult.data,
                isLoading: false
              });
              
              return true;
            } catch (error) {
              set({
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          // Protocolos
          fetchProtocols: async () => {
            set({ isLoading: true, error: null });
            
            try {
              const { protocolsFilters, protocolsPagination } = get();
              const params = {
                ...protocolsFilters,
                page: protocolsPagination.page,
                pageSize: protocolsPagination.pageSize
              };
              
              const result = await emergencyService.getProtocols(params);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cargar protocolos');
              }
              
              set({
                protocols: result.data.protocols,
                protocolsPagination: {
                  page: result.data.page,
                  pageSize: result.data.pageSize,
                  total: result.data.total,
                  totalPages: result.data.totalPages
                },
                isLoading: false
              });
              
              return result.data;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          fetchProtocolById: async (id) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.getProtocolById(id);
              
              if (!result.success) {
                throw new Error(result.error || 'Protocolo no encontrado');
              }
              
              set({
                currentProtocol: result.data,
                isLoading: false
              });
              
              return result.data;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          createProtocol: async (protocolData) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.createProtocol(protocolData);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al crear protocolo');
              }
              
              set((state) => ({
                protocols: [result.data, ...state.protocols],
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
          
          updateProtocol: async (id, updateData) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.updateProtocol(id, updateData);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al actualizar protocolo');
              }
              
              set((state) => ({
                protocols: state.protocols.map(p => 
                  p.id === id ? result.data : p
                ),
                currentProtocol: state.currentProtocol?.id === id 
                  ? result.data 
                  : state.currentProtocol,
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
          
          deleteProtocol: async (id) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.deleteProtocol(id);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al eliminar protocolo');
              }
              
              set((state) => ({
                protocols: state.protocols.filter(p => p.id !== id),
                currentProtocol: state.currentProtocol?.id === id 
                  ? null 
                  : state.currentProtocol,
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
          
          // Materiales
          fetchMaterials: async () => {
            set({ isLoading: true, error: null });
            
            try {
              const { materialsFilters, materialsPagination } = get();
              const params = {
                ...materialsFilters,
                page: materialsPagination.page,
                pageSize: materialsPagination.pageSize
              };
              
              const result = await emergencyService.getMaterials(params);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cargar materiales');
              }
              
              set({
                materials: result.data.materials,
                materialsPagination: {
                  page: result.data.page,
                  pageSize: result.data.pageSize,
                  total: result.data.total,
                  totalPages: result.data.totalPages
                },
                isLoading: false
              });
              
              return result.data;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          fetchMaterialById: async (id) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.getMaterialById(id);
              
              if (!result.success) {
                throw new Error(result.error || 'Material no encontrado');
              }
              
              set({
                currentMaterial: result.data,
                isLoading: false
              });
              
              return result.data;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          createMaterial: async (materialData) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.createMaterial(materialData);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al crear material');
              }
              
              set((state) => ({
                materials: [result.data, ...state.materials],
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
          
          updateMaterial: async (id, updateData) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.updateMaterial(id, updateData);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al actualizar material');
              }
              
              set((state) => ({
                materials: state.materials.map(m => 
                  m.id === id ? result.data : m
                ),
                currentMaterial: state.currentMaterial?.id === id 
                  ? result.data 
                  : state.currentMaterial,
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
          
          deleteMaterial: async (id) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.deleteMaterial(id);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al eliminar material');
              }
              
              set((state) => ({
                materials: state.materials.filter(m => m.id !== id),
                currentMaterial: state.currentMaterial?.id === id 
                  ? null 
                  : state.currentMaterial,
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
          
          checkMaterial: async (id, checkedBy) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.checkMaterial(id, checkedBy);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al marcar material');
              }
              
              set((state) => ({
                materials: state.materials.map(m => 
                  m.id === id ? result.data : m
                ),
                currentMaterial: state.currentMaterial?.id === id 
                  ? result.data 
                  : state.currentMaterial,
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
          
          // Incidentes
          fetchIncidents: async () => {
            set({ isLoading: true, error: null });
            
            try {
              const { incidentsFilters, incidentsPagination } = get();
              const params = {
                ...incidentsFilters,
                page: incidentsPagination.page,
                pageSize: incidentsPagination.pageSize
              };
              
              const result = await emergencyService.getIncidents(params);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cargar incidentes');
              }
              
              set({
                incidents: result.data.incidents,
                incidentsPagination: {
                  page: result.data.page,
                  pageSize: result.data.pageSize,
                  total: result.data.total,
                  totalPages: result.data.totalPages
                },
                isLoading: false
              });
              
              return result.data;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          fetchIncidentById: async (id) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.getIncidentById(id);
              
              if (!result.success) {
                throw new Error(result.error || 'Incidente no encontrado');
              }
              
              set({
                currentIncident: result.data,
                isLoading: false
              });
              
              return result.data;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          createIncident: async (incidentData) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.createIncident(incidentData);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al crear incidente');
              }
              
              set((state) => ({
                incidents: [result.data, ...state.incidents],
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
          
          updateIncident: async (id, updateData) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.updateIncident(id, updateData);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al actualizar incidente');
              }
              
              set((state) => ({
                incidents: state.incidents.map(i => 
                  i.id === id ? result.data : i
                ),
                currentIncident: state.currentIncident?.id === id 
                  ? result.data 
                  : state.currentIncident,
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
          
          closeIncident: async (id, resolution) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.closeIncident(id, resolution);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cerrar incidente');
              }
              
              set((state) => ({
                incidents: state.incidents.map(i => 
                  i.id === id ? result.data : i
                ),
                currentIncident: state.currentIncident?.id === id 
                  ? result.data 
                  : state.currentIncident,
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
          
          // Filtros
          setProtocolsFilters: (filters) => {
            set((state) => ({
              protocolsFilters: { ...state.protocolsFilters, ...filters },
              protocolsPagination: { ...state.protocolsPagination, page: 1 }
            }));
            return get().actions.fetchProtocols();
          },
          
          setMaterialsFilters: (filters) => {
            set((state) => ({
              materialsFilters: { ...state.materialsFilters, ...filters },
              materialsPagination: { ...state.materialsPagination, page: 1 }
            }));
            return get().actions.fetchMaterials();
          },
          
          setIncidentsFilters: (filters) => {
            set((state) => ({
              incidentsFilters: { ...state.incidentsFilters, ...filters },
              incidentsPagination: { ...state.incidentsPagination, page: 1 }
            }));
            return get().actions.fetchIncidents();
          },
          
          // Búsqueda
          searchProtocols: async (query) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.searchProtocols(query);
              
              if (!result.success) {
                throw new Error(result.error || 'Error en la búsqueda');
              }
              
              set({
                protocols: result.data.protocols,
                isLoading: false
              });
              
              return result.data;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          // Estadísticas
          fetchEmergencyStats: async () => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.getEmergencyStats();
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cargar estadísticas');
              }
              
              set({
                stats: result.data,
                isLoading: false
              });
              
              return result.data;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          // Exportación
          exportProtocolsPDF: async () => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.exportProtocolsPDF();
              
              if (!result.success) {
                throw new Error(result.error || 'Error al exportar protocolos');
              }
              
              set({ isLoading: false });
              
              return result;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          exportMaterialsChecklist: async () => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.exportMaterialsChecklist();
              
              if (!result.success) {
                throw new Error(result.error || 'Error al exportar checklist');
              }
              
              set({ isLoading: false });
              
              return result;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          exportIncidentsReport: async (filters = {}) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await emergencyService.exportIncidentsReport(filters);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al exportar reporte');
              }
              
              set({ isLoading: false });
              
              return result;
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          // Utilidades
          clearError: () => set({ error: null }),
          
          resetStore: () => {
            set({
              protocols: [],
              materials: [],
              incidents: [],
              currentProtocol: null,
              currentMaterial: null,
              currentIncident: null,
              isLoading: false,
              error: null,
              protocolsPagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 0
              },
              materialsPagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 0
              },
              incidentsPagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 0
              },
              protocolsFilters: {
                search: '',
                category: '',
                priority: ''
              },
              materialsFilters: {
                search: '',
                category: '',
                mandatory: null
              },
              incidentsFilters: {
                category: '',
                severity: '',
                status: '',
                dateFrom: '',
                dateTo: ''
              },
              stats: null
            });
          }
        }
      }),
      {
        name: 'emergency-storage',
        version: 1
      }
    ),
    {
      name: 'emergency-store'
    }
  )
);

export default useEmergencyStore;