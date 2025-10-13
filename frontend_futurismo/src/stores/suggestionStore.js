/**
 * Store de Zustand para gestión de sugerencias
 */

import { create } from 'zustand';
import suggestionService from '../services/suggestionService';

const useSuggestionStore = create((set, get) => ({
  // Estado inicial
  suggestions: [],
  isLoading: false,
  error: null,
  filters: {
    status: null,
    priority: null,
    area: null,
    type: null
  },

  // Obtener todas las sugerencias
  fetchSuggestions: async (filters = {}) => {
    set({ isLoading: true, error: null });

    try {
      const result = await suggestionService.getAllSuggestions(filters);

      if (result.success) {
        set({
          suggestions: result.data,
          isLoading: false
        });
      } else {
        set({
          error: result.error || 'Error al cargar sugerencias',
          isLoading: false
        });
      }
    } catch (error) {
      set({
        error: error.message || 'Error al cargar sugerencias',
        isLoading: false
      });
    }
  },

  // Crear nueva sugerencia
  createSuggestion: async (suggestionData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await suggestionService.createSuggestion(suggestionData);

      if (result.success) {
        set(state => ({
          suggestions: [...state.suggestions, result.data],
          isLoading: false
        }));
        return { success: true, data: result.data };
      } else {
        set({
          error: result.error || 'Error al crear sugerencia',
          isLoading: false
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al crear sugerencia';
      set({
        error: errorMessage,
        isLoading: false
      });
      return { success: false, error: errorMessage };
    }
  },

  // Actualizar estado de una sugerencia
  updateStatus: async (suggestionId, newStatus) => {
    set({ isLoading: true, error: null });

    try {
      const result = await suggestionService.updateStatus(suggestionId, newStatus);

      if (result.success) {
        set(state => ({
          suggestions: state.suggestions.map(s =>
            s.id === suggestionId
              ? { ...s, status: newStatus, ...(newStatus === 'implemented' ? { completedAt: new Date().toISOString() } : {}) }
              : s
          ),
          isLoading: false
        }));
        return { success: true };
      } else {
        set({
          error: result.error || 'Error al actualizar estado',
          isLoading: false
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al actualizar estado';
      set({
        error: errorMessage,
        isLoading: false
      });
      return { success: false, error: errorMessage };
    }
  },

  // Añadir respuesta a una sugerencia
  addResponse: async (suggestionId, responseData) => {
    set({ isLoading: true, error: null });

    try {
      // Agregar timestamp si no existe
      const completeResponse = {
        ...responseData,
        respondedAt: responseData.respondedAt || new Date().toISOString(),
        id: Date.now() // Generar ID temporal
      };

      const result = await suggestionService.addResponse(suggestionId, completeResponse);

      if (result.success) {
        set(state => ({
          suggestions: state.suggestions.map(s =>
            s.id === suggestionId
              ? { ...s, responses: [...(s.responses || []), completeResponse] }
              : s
          ),
          isLoading: false
        }));
        return { success: true };
      } else {
        set({
          error: result.error || 'Error al añadir respuesta',
          isLoading: false
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Error al añadir respuesta';
      set({
        error: errorMessage,
        isLoading: false
      });
      return { success: false, error: errorMessage };
    }
  },

  // Actualizar filtros
  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().fetchSuggestions({ ...get().filters, ...newFilters });
  },

  // Limpiar filtros
  clearFilters: () => {
    set({ filters: { status: null, priority: null, area: null, type: null } });
    get().fetchSuggestions();
  },

  // Limpiar error
  clearError: () => {
    set({ error: null });
  },

  // Obtener sugerencias por estado
  getSuggestionsByStatus: (status) => {
    const { suggestions } = get();
    return suggestions.filter(s => s.status === status);
  },

  // Obtener contador de sugerencias por estado
  getCountByStatus: (status) => {
    const { suggestions } = get();
    return suggestions.filter(s => s.status === status).length;
  }
}));

export default useSuggestionStore;
