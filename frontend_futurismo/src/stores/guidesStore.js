/**
 * Store de guías
 * Maneja el estado global de guías
 */

import { create } from 'zustand';
import { guidesService } from '../services/guidesService';
import {
  AVAILABLE_LANGUAGES,
  LANGUAGE_LEVELS,
  EXPERTISE_LEVELS,
  GUIDE_STATUS_VALUES,
  AVAILABILITY_STATUS,
  GUIDE_TYPES,
  COMMON_MUSEUMS
} from '../constants/guidesConstants';

const useGuidesStore = create((set, get) => ({
  // Estado
  guides: [],
  currentGuide: null,
  isLoading: false,
  error: null,
  
  // Configuración
  availableLanguages: AVAILABLE_LANGUAGES,
  languageLevels: LANGUAGE_LEVELS,
  expertiseLevels: EXPERTISE_LEVELS,
  guideStatuses: GUIDE_STATUS_VALUES,
  guideTypes: GUIDE_TYPES,
  commonMuseums: COMMON_MUSEUMS,
  
  // Filtros
  filters: {
    search: '',
    status: '',
    guideType: '',
    languages: [],
    museums: [],
    availability: ''
  },
  
  // Paginación
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  },
  
  // Estadísticas
  summary: null,
  guideStats: null,
  
  // Acciones de filtros
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 }
    }));
    return get().fetchGuides();
  },
  
  clearFilters: () => {
    set({
      filters: {
        search: '',
        status: '',
        guideType: '',
        languages: [],
        museums: [],
        availability: ''
      },
      pagination: { ...get().pagination, page: 1 }
    });
    return get().fetchGuides();
  },
  
  setSearch: (search) => {
    set((state) => ({
      filters: { ...state.filters, search },
      pagination: { ...state.pagination, page: 1 }
    }));
    return get().fetchGuides();
  },
  
  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page }
    }));
    return get().fetchGuides();
  },
  
  // Acciones CRUD
  fetchGuides: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters, pagination } = get();
      const params = {
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize
      };
      
      const result = await guidesService.getGuides(params);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar guías');
      }
      
      set({
        guides: result.data.guides,
        pagination: {
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
  
  fetchGuideById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.getGuideById(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Guía no encontrado');
      }
      
      set({
        currentGuide: result.data,
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
  
  createGuide: async (guideData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.createGuide(guideData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear guía');
      }
      
      set((state) => ({
        guides: [result.data, ...state.guides],
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
  
  updateGuide: async (id, updateData) => {
    set({ isLoading: true, error: null });

    try {
      // Transform frontend format to backend format
      const backendData = { ...updateData }; // Start with all data

      // Handle fullName -> first_name + last_name (only if fullName is provided)
      if (updateData.fullName && !updateData.first_name) {
        const nameParts = updateData.fullName.trim().split(' ');
        backendData.first_name = nameParts[0];
        backendData.last_name = nameParts.slice(1).join(' ') || nameParts[0];
        backendData.name = updateData.fullName;
        delete backendData.fullName; // Remove fullName after converting
      }

      // Handle guideType -> type conversion (only if guideType is provided)
      if (updateData.guideType && !updateData.type) {
        backendData.type = updateData.guideType === 'planta' ? 'employed' : 'freelance';
        delete backendData.guideType; // Remove guideType after converting
      }

      // Handle dni at top level -> documents.dni (only if top-level dni is provided)
      if (updateData.dni && typeof updateData.dni === 'string') {
        backendData.documents = {
          ...(updateData.documents || {}),
          dni: updateData.dni
        };
        delete backendData.dni; // Remove top-level dni after moving to documents
      }

      console.log('📝 Actualizando guía:', { id, updateData, backendData });

      const result = await guidesService.updateGuide(id, backendData);

      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar guía');
      }

      console.log('✅ Guía actualizado exitosamente');

      // Transform backend response to frontend format
      const transformedGuide = {
        ...result.data,
        fullName: result.data.fullName || `${result.data.first_name} ${result.data.last_name}`.trim() || result.data.name,
        guideType: result.data.guideType || (result.data.type === 'employed' ? 'planta' : result.data.type),
        dni: result.data.dni || result.data.documents?.dni
      };

      set((state) => ({
        guides: state.guides.map(g =>
          g.id === id ? transformedGuide : g
        ),
        currentGuide: state.currentGuide?.id === id
          ? transformedGuide
          : state.currentGuide,
        isLoading: false
      }));

      return transformedGuide;
    } catch (error) {
      console.error('❌ Error al actualizar guía:', error);
      set({
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },
  
  deleteGuide: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.deleteGuide(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar guía');
      }
      
      set((state) => ({
        guides: state.guides.filter(g => g.id !== id),
        currentGuide: state.currentGuide?.id === id 
          ? null 
          : state.currentGuide,
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
  
  updateGuideStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.updateGuideStatus(id, status);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar estado');
      }
      
      set((state) => ({
        guides: state.guides.map(g => 
          g.id === id ? result.data : g
        ),
        currentGuide: state.currentGuide?.id === id 
          ? result.data 
          : state.currentGuide,
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
  
  // Agenda y disponibilidad
  fetchGuideAgenda: async (guideId, params = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.getGuideAgenda(guideId, params);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar agenda');
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
  
  updateGuideAvailability: async (guideId, availability) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.updateGuideAvailability(guideId, availability);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar disponibilidad');
      }
      
      set((state) => ({
        guides: state.guides.map(g => 
          g.id === guideId 
            ? { ...g, availability: result.data }
            : g
        ),
        currentGuide: state.currentGuide?.id === guideId
          ? { ...state.currentGuide, availability: result.data }
          : state.currentGuide,
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
  
  // Estadísticas
  fetchGuideStats: async (guideId, params = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.getGuideStats(guideId, params);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar estadísticas');
      }
      
      set({
        guideStats: result.data,
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
  
  fetchGuidesSummary: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.getGuidesSummary();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar resumen');
      }
      
      set({
        summary: result.data,
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
  
  // Certificaciones
  fetchGuideCertifications: async (guideId) => {
    try {
      const result = await guidesService.getGuideCertifications(guideId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar certificaciones');
      }
      
      return result.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  addGuideCertification: async (guideId, certification) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.addGuideCertification(guideId, certification);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al agregar certificación');
      }
      
      // Actualizar guía en la lista
      const guide = get().guides.find(g => g.id === guideId);
      if (guide) {
        const updatedGuide = {
          ...guide,
          certifications: [...(guide.certifications || []), result.data],
          stats: {
            ...guide.stats,
            certifications: (guide.stats.certifications || 0) + 1
          }
        };
        
        set((state) => ({
          guides: state.guides.map(g => 
            g.id === guideId ? updatedGuide : g
          ),
          currentGuide: state.currentGuide?.id === guideId
            ? updatedGuide
            : state.currentGuide,
          isLoading: false
        }));
      } else {
        set({ isLoading: false });
      }
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },
  
  removeGuideCertification: async (guideId, certificationId) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.removeGuideCertification(guideId, certificationId);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar certificación');
      }
      
      // Actualizar guía en la lista
      const guide = get().guides.find(g => g.id === guideId);
      if (guide) {
        const updatedGuide = {
          ...guide,
          certifications: guide.certifications?.filter(c => c.id !== certificationId) || [],
          stats: {
            ...guide.stats,
            certifications: Math.max(0, (guide.stats.certifications || 0) - 1)
          }
        };
        
        set((state) => ({
          guides: state.guides.map(g => 
            g.id === guideId ? updatedGuide : g
          ),
          currentGuide: state.currentGuide?.id === guideId
            ? updatedGuide
            : state.currentGuide,
          isLoading: false
        }));
      } else {
        set({ isLoading: false });
      }
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },
  
  // Tours del guía
  fetchGuideTours: async (guideId, filters = {}) => {
    try {
      const result = await guidesService.getGuideTours(guideId, filters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar tours');
      }
      
      return result.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  // Especialización
  updateGuideSpecialization: async (guideId, specialization) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.updateGuideSpecialization(guideId, specialization);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar especialización');
      }
      
      set((state) => ({
        guides: state.guides.map(g => 
          g.id === guideId 
            ? { ...g, specializations: result.data }
            : g
        ),
        currentGuide: state.currentGuide?.id === guideId
          ? { ...state.currentGuide, specializations: result.data }
          : state.currentGuide,
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
  
  // Búsqueda avanzada
  searchByCompetencies: async (requirements) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.searchByCompetencies(requirements);
      
      if (!result.success) {
        throw new Error(result.error || 'Error en la búsqueda');
      }
      
      set({
        guides: result.data,
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
  
  checkGuidesAvailability: async (params) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.checkGuidesAvailability(params);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al verificar disponibilidad');
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
  
  // Importación/Exportación
  importGuides: async (file, onProgress = null) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.importGuides(file, onProgress);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al importar guías');
      }
      
      // Recargar lista de guías
      await get().fetchGuides();
      
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
  
  exportGuides: async (filters = {}, format = 'excel') => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await guidesService.exportGuides(filters, format);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al exportar guías');
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
      guides: [],
      currentGuide: null,
      isLoading: false,
      error: null,
      filters: {
        search: '',
        status: '',
        guideType: '',
        languages: [],
        museums: [],
        availability: ''
      },
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      },
      summary: null,
      guideStats: null
    });
  }
}));

export { useGuidesStore };
export default useGuidesStore;