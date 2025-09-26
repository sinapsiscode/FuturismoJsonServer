import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { format, startOfDay, endOfDay, isWithinInterval, parseISO, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { independentAgendaService } from '../services/independentAgendaService';

const VISIBILITY_LEVELS = {
  PRIVATE: 'private',        // Solo el guía lo ve
  OCCUPIED: 'occupied',      // Admin ve "ocupado" sin detalles  
  COMPANY: 'company',        // Todos ven detalles (tours oficiales)
  PUBLIC: 'public'           // Cliente puede ver disponibilidad
};

const EVENT_TYPES = {
  PERSONAL: 'personal',
  COMPANY_TOUR: 'company_tour', 
  OCCUPIED: 'occupied',
  AVAILABLE: 'available'
};

// Estado inicial vacío - se cargará desde el servicio
const initialState = {
  personalEvents: {},
  assignedTours: {},
  workingHours: {}
};

const useIndependentAgendaStore = create(
  persist(
    devtools(
      (set, get) => ({
          // Estado principal
          currentView: 'week', // day, week, month, year
          selectedDate: new Date(),
          currentGuide: '1', // Seleccionar primer guía por defecto
          
          // Eventos personales del guía (privados)
          personalEvents: initialState.personalEvents,
          
          // Estados de disponibilidad por guía
          availabilitySlots: {},
          
          // Tours asignados por empresa (compartidos)
          assignedTours: initialState.assignedTours,
          
          // Horarios de trabajo por guía
          workingHours: initialState.workingHours,
          
          // Configuración de vista
          viewPreferences: {
            showWeekends: true,
            workingHoursOnly: false,
            timeFormat: '24h',
            firstDayOfWeek: 1 // Lunes
          },
          
          // Estados de carga y error
          isLoading: false,
          error: null,
        
          // Acciones principales
          actions: {
          // === NAVEGACIÓN Y VISTAS ===
          setCurrentView: (view) => set({ currentView: view }),
          
          setSelectedDate: (date) => set({ selectedDate: new Date(date) }),
          
          setCurrentGuide: (guideId) => set({ currentGuide: guideId }),
          
          // === EVENTOS PERSONALES (SOLO GUÍA) ===
          addPersonalEvent: async (guideId, event) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.createPersonalEvent(guideId, event);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al crear evento personal');
              }
              
              const { personalEvents } = get();
              const dateKey = result.data.date;
              
              set({
                personalEvents: {
                  ...personalEvents,
                  [guideId]: {
                    ...personalEvents[guideId],
                    [dateKey]: [
                      ...(personalEvents[guideId]?.[dateKey] || []),
                      result.data
                    ]
                  }
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
          
          updatePersonalEvent: async (guideId, eventId, updates) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.updatePersonalEvent(guideId, eventId, updates);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al actualizar evento');
              }
              
              const { personalEvents } = get();
              const guideEvents = personalEvents[guideId] || {};
              
              const updatedEvents = {};
              Object.entries(guideEvents).forEach(([dateKey, events]) => {
                updatedEvents[dateKey] = events.map(event => 
                  event.id === eventId ? result.data : event
                );
              });
              
              // Si cambió la fecha, mover el evento
              if (updates.date && updates.date !== result.data.date) {
                const oldDate = Object.keys(guideEvents).find(date => 
                  guideEvents[date].some(e => e.id === eventId)
                );
                if (oldDate) {
                  updatedEvents[oldDate] = updatedEvents[oldDate].filter(e => e.id !== eventId);
                  if (!updatedEvents[result.data.date]) {
                    updatedEvents[result.data.date] = [];
                  }
                  updatedEvents[result.data.date].push(result.data);
                }
              }
              
              set({
                personalEvents: {
                  ...personalEvents,
                  [guideId]: updatedEvents
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
          
          deletePersonalEvent: async (guideId, eventId) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.deletePersonalEvent(guideId, eventId);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al eliminar evento');
              }
              
              const { personalEvents } = get();
              const guideEvents = personalEvents[guideId] || {};
              
              const updatedEvents = {};
              Object.entries(guideEvents).forEach(([dateKey, events]) => {
                updatedEvents[dateKey] = events.filter(event => event.id !== eventId);
              });
              
              set({
                personalEvents: {
                  ...personalEvents,
                  [guideId]: updatedEvents
                },
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
          
          // === TIEMPO OCUPADO (VISIBLE PARA ADMIN COMO "OCUPADO") ===
          markTimeAsOccupied: async (guideId, timeSlot) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.markTimeAsOccupied(guideId, timeSlot);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al marcar tiempo como ocupado');
              }
              
              const { personalEvents } = get();
              const dateKey = result.data.date;
              
              set({
                personalEvents: {
                  ...personalEvents,
                  [guideId]: {
                    ...personalEvents[guideId],
                    [dateKey]: [
                      ...(personalEvents[guideId]?.[dateKey] || []),
                      result.data
                    ]
                  }
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
          
          // === HORARIOS DE TRABAJO ===
          setWorkingHours: async (guideId, schedule) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.updateWorkingHours(guideId, schedule);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al actualizar horarios');
              }
              
              const { workingHours } = get();
              set({
                workingHours: {
                  ...workingHours,
                  [guideId]: result.data
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
          
          loadWorkingHours: async (guideId) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.getWorkingHours(guideId);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cargar horarios');
              }
              
              const { workingHours } = get();
              set({
                workingHours: {
                  ...workingHours,
                  [guideId]: result.data
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
          
          // === TOURS ASIGNADOS POR EMPRESA ===
          assignTourToGuide: async (guideId, tour) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.assignTourToGuide(guideId, tour);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al asignar tour');
              }
              
              const { assignedTours } = get();
              const dateKey = result.data.date;
              
              set({
                assignedTours: {
                  ...assignedTours,
                  [guideId]: {
                    ...assignedTours[guideId],
                    [dateKey]: [
                      ...(assignedTours[guideId]?.[dateKey] || []),
                      result.data
                    ]
                  }
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
          
          updateAssignedTour: async (guideId, tourId, updates) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.updateAssignedTour(guideId, tourId, updates);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al actualizar tour');
              }
              
              const { assignedTours } = get();
              const guideTours = assignedTours[guideId] || {};
              
              const updatedTours = {};
              Object.entries(guideTours).forEach(([dateKey, tours]) => {
                updatedTours[dateKey] = tours.map(tour => 
                  tour.id === tourId ? result.data : tour
                );
              });
              
              // Si cambió la fecha, mover el tour
              if (updates.date && updates.date !== result.data.date) {
                const oldDate = Object.keys(guideTours).find(date => 
                  guideTours[date].some(t => t.id === tourId)
                );
                if (oldDate) {
                  updatedTours[oldDate] = updatedTours[oldDate].filter(t => t.id !== tourId);
                  if (!updatedTours[result.data.date]) {
                    updatedTours[result.data.date] = [];
                  }
                  updatedTours[result.data.date].push(result.data);
                }
              }
              
              set({
                assignedTours: {
                  ...assignedTours,
                  [guideId]: updatedTours
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
          
          // === CONSULTAS DE DISPONIBILIDAD (PARA ADMIN) ===
          getGuideAvailability: async (guideId, date, options = {}) => {
            set({ isLoading: true, error: null });

            try {
              const result = await independentAgendaService.getGuideAvailability(guideId, date, options);

              if (!result.success) {
                console.warn('Error obteniendo disponibilidad del guía:', result.error);
                // No lanzar error, solo registrar y devolver datos vacíos
                set({
                  isLoading: false,
                  error: result.error || 'Error al obtener disponibilidad'
                });
                return { availability: [], slots: [] }; // Devolver estructura vacía pero válida
              }

              set({ isLoading: false, error: null });

              return result.data || { availability: [], slots: [] };
            } catch (error) {
              console.error('Error en getGuideAvailability:', error);
              set({
                isLoading: false,
                error: error.message
              });
              // No lanzar error para permitir que la aplicación continúe
              return { availability: [], slots: [] }; // Devolver estructura vacía pero válida
            }
          },
          
          // === VISTA COMPLETA PARA GUÍA ===
          getGuideCompleteAgenda: async (guideId, filters = {}) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.getGuideCompleteAgenda(guideId, filters);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al obtener agenda completa');
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
          
          // === CARGAR DATOS DE AGENDA ===
          loadPersonalEvents: async (guideId, filters = {}) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.getPersonalEvents(guideId, filters);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cargar eventos personales');
              }
              
              // Organizar eventos por fecha
              const eventsByDate = {};
              result.data.forEach(event => {
                if (!eventsByDate[event.date]) {
                  eventsByDate[event.date] = [];
                }
                eventsByDate[event.date].push(event);
              });
              
              const { personalEvents } = get();
              set({
                personalEvents: {
                  ...personalEvents,
                  [guideId]: eventsByDate
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
          
          loadAssignedTours: async (guideId, filters = {}) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.getAssignedTours(guideId, filters);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al cargar tours asignados');
              }
              
              // Organizar tours por fecha
              const toursByDate = {};
              result.data.forEach(tour => {
                if (!toursByDate[tour.date]) {
                  toursByDate[tour.date] = [];
                }
                toursByDate[tour.date].push(tour);
              });
              
              const { assignedTours } = get();
              set({
                assignedTours: {
                  ...assignedTours,
                  [guideId]: toursByDate
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
          
          // === GESTIÓN DE PREFERENCIAS ===
          updateViewPreferences: (preferences) => {
            const { viewPreferences } = get();
            set({
              viewPreferences: {
                ...viewPreferences,
                ...preferences
              }
            });
          },
          
          // === VERIFICACIÓN DE CONFLICTOS ===
          checkScheduleConflicts: async (guideId, eventData) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.checkScheduleConflicts(guideId, eventData);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al verificar conflictos');
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
          
          // === UTILIDADES ===
          getEventsForDateRange: async (guideId, startDate, endDate) => {
            set({ isLoading: true, error: null });
            
            try {
              const filters = {
                startDate: format(new Date(startDate), 'yyyy-MM-dd'),
                endDate: format(new Date(endDate), 'yyyy-MM-dd')
              };
              
              const result = await independentAgendaService.getGuideCompleteAgenda(guideId, filters);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al obtener eventos');
              }
              
              set({ isLoading: false });
              
              return result.data.events || [];
            } catch (error) {
              set({ 
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          // === EXPORTACIÓN ===
          exportAgenda: async (guideId, options = {}) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.exportAgenda(guideId, options);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al exportar agenda');
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
                isLoading: false,
                error: error.message
              });
              throw error;
            }
          },
          
          // === LIMPIEZA Y MANTENIMIENTO ===
          clearOldEvents: async (guideId, daysToKeep = 30) => {
            set({ isLoading: true, error: null });
            
            try {
              const result = await independentAgendaService.clearOldEvents(guideId, daysToKeep);
              
              if (!result.success) {
                throw new Error(result.error || 'Error al limpiar eventos antiguos');
              }
              
              // Recargar datos después de limpiar
              await Promise.all([
                get().actions.loadPersonalEvents(guideId),
                get().actions.loadAssignedTours(guideId)
              ]);
              
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
          
          // === UTILIDADES ADICIONALES ===
          clearError: () => set({ error: null }),
          
          resetStore: () => {
            set({
              currentView: 'week',
              selectedDate: new Date(),
              currentGuide: '1',
              personalEvents: {},
              availabilitySlots: {},
              assignedTours: {},
              workingHours: {},
              viewPreferences: {
                showWeekends: true,
                workingHoursOnly: false,
                timeFormat: '24h',
                firstDayOfWeek: 1
              },
              isLoading: false,
              error: null
            });
          }
        }
      }),
    { 
      name: 'IndependentAgendaStore' 
    }
  ),
  {
    name: 'independent-agenda-store',
    version: 2, // Cambiar versión para forzar regeneración de mock data con startTime corregido
    partialize: (state) => ({
      personalEvents: state.personalEvents,
      availabilitySlots: state.availabilitySlots,
      assignedTours: state.assignedTours,
      workingHours: state.workingHours,
      viewPreferences: state.viewPreferences
    })
  }
));

export default useIndependentAgendaStore;
export { VISIBILITY_LEVELS, EVENT_TYPES };