/**
 * Store de agencias
 * Maneja el estado global de agencias
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, addDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { agencyService } from '../services/agencyService';
import {
  DATE_FORMATS,
  DEFAULT_AGENCY,
  STORAGE_CONFIG,
  RESERVATION_STATUS
} from '../constants/agencyConstants';

const useAgencyStore = create(
  persist(
    (set, get) => ({
      // Estado
      currentAgency: null,
      reservations: [],
      pointsTransactions: [],
      availableSlots: {},
      isLoading: false,
      error: null,
      
      // Paginación
      reservationsPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      },
      
      transactionsPagination: {
        page: 1,
        pageSize: 50,
        total: 0,
        totalPages: 0
      },
      
      // Filtros
      reservationsFilters: {
        startDate: '',
        endDate: '',
        status: '',
        serviceType: ''
      },
      
      transactionsFilters: {
        startDate: '',
        endDate: '',
        type: ''
      },
      
      // Estadísticas
      stats: null,
      monthlyReport: null,
      yearlyComparison: null,
      calendarData: {},
      
      // Acciones
      actions: {
        // Inicialización
        initialize: async (agencyId = DEFAULT_AGENCY.ID) => {
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.getAgencyById(agencyId);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al cargar agencia');
            }
            
            set({
              currentAgency: result.data,
              isLoading: false
            });
            
            // Cargar datos adicionales
            await Promise.all([
              get().actions.fetchReservations(),
              get().actions.fetchPointsTransactions()
            ]);
            
            return true;
          } catch (error) {
            set({
              isLoading: false,
              error: error.message
            });
            throw error;
          }
        },
        
        // === GESTIÓN DE RESERVAS ===
        fetchReservations: async () => {
          const { currentAgency, reservationsFilters, reservationsPagination } = get();
          
          if (!currentAgency) return;
          
          set({ isLoading: true, error: null });
          
          try {
            const params = {
              ...reservationsFilters,
              page: reservationsPagination.page,
              pageSize: reservationsPagination.pageSize
            };
            
            const result = await agencyService.getReservations(currentAgency.id, params);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al cargar reservaciones');
            }
            
            set({
              reservations: result.data.reservations,
              reservationsPagination: {
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
        
        getReservationsByDate: (date) => {
          const { reservations } = get();
          const dateKey = format(new Date(date), DATE_FORMATS.DATE_KEY);
          return reservations.filter(res => res.date === dateKey);
        },
        
        createReservation: async (reservationData) => {
          const { currentAgency } = get();
          
          if (!currentAgency) {
            throw new Error('No hay agencia activa');
          }
          
          set({ isLoading: true, error: null });
          
          try {
            const data = {
              ...reservationData,
              agencyId: currentAgency.id
            };
            
            const result = await agencyService.createReservation(data);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al crear reservación');
            }
            
            set((state) => ({
              reservations: [result.data, ...state.reservations],
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
        
        updateReservation: async (id, updateData) => {
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.updateReservation(id, updateData);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al actualizar reservación');
            }
            
            set((state) => ({
              reservations: state.reservations.map(res => 
                res.id === id ? result.data : res
              ),
              isLoading: false
            }));
            
            // Si se confirmó la reserva, actualizar balance de puntos
            if (updateData.status === RESERVATION_STATUS.CONFIRMED) {
              await get().actions.fetchPointsBalance();
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
        
        deleteReservation: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.deleteReservation(id);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al eliminar reservación');
            }
            
            set((state) => ({
              reservations: state.reservations.filter(res => res.id !== id),
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
        
        confirmReservation: async (id) => {
          return get().actions.updateReservation(id, { status: RESERVATION_STATUS.CONFIRMED });
        },
        
        cancelReservation: async (id, reason = '') => {
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.cancelReservation(id, reason);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al cancelar reservación');
            }
            
            set((state) => ({
              reservations: state.reservations.map(res => 
                res.id === id ? result.data : res
              ),
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
        
        // === REPORTES Y ESTADÍSTICAS ===
        fetchMonthlyReport: async (year, month) => {
          const { currentAgency } = get();
          
          if (!currentAgency) return null;
          
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.getMonthlyReport(currentAgency.id, year, month);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al cargar reporte mensual');
            }
            
            set({
              monthlyReport: result.data,
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
        
        fetchYearlyComparison: async (year) => {
          const { currentAgency } = get();
          
          if (!currentAgency) return null;
          
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.getYearlyComparison(currentAgency.id, year);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al cargar comparación anual');
            }
            
            set({
              yearlyComparison: result.data,
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
        
        // === SISTEMA DE PUNTOS ===
        fetchPointsTransactions: async () => {
          const { currentAgency, transactionsFilters, transactionsPagination } = get();
          
          if (!currentAgency) return;
          
          set({ isLoading: true, error: null });
          
          try {
            const params = {
              ...transactionsFilters,
              page: transactionsPagination.page,
              pageSize: transactionsPagination.pageSize
            };
            
            const result = await agencyService.getPointsTransactions(currentAgency.id, params);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al cargar transacciones');
            }
            
            set({
              pointsTransactions: result.data.transactions,
              transactionsPagination: {
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
        
        fetchPointsBalance: async () => {
          const { currentAgency } = get();
          
          if (!currentAgency) return;
          
          try {
            const result = await agencyService.getPointsBalance(currentAgency.id);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al cargar balance de puntos');
            }
            
            set((state) => ({
              currentAgency: {
                ...state.currentAgency,
                pointsBalance: result.data.balance,
                totalEarned: result.data.totalEarned,
                totalRedeemed: result.data.totalRedeemed,
                tier: result.data.tier
              }
            }));
            
            return result.data;
          } catch (error) {
            set({ error: error.message });
            throw error;
          }
        },
        
        createPointsTransaction: async (transactionData) => {
          const { currentAgency } = get();
          
          if (!currentAgency) {
            throw new Error('No hay agencia activa');
          }
          
          set({ isLoading: true, error: null });
          
          try {
            const data = {
              ...transactionData,
              agencyId: currentAgency.id
            };
            
            const result = await agencyService.createPointsTransaction(data);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al crear transacción');
            }
            
            set((state) => ({
              pointsTransactions: [result.data, ...state.pointsTransactions],
              isLoading: false
            }));
            
            // Actualizar balance
            await get().actions.fetchPointsBalance();
            
            return result.data;
          } catch (error) {
            set({ 
              isLoading: false,
              error: error.message
            });
            throw error;
          }
        },
        
        redeemPoints: async (redemptionData) => {
          const { currentAgency } = get();
          
          if (!currentAgency) {
            throw new Error('No hay agencia activa');
          }
          
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.redeemPoints(currentAgency.id, redemptionData);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al canjear puntos');
            }
            
            set((state) => ({
              pointsTransactions: [result.data, ...state.pointsTransactions],
              isLoading: false
            }));
            
            // Actualizar balance
            await get().actions.fetchPointsBalance();
            
            return result.data;
          } catch (error) {
            set({ 
              isLoading: false,
              error: error.message
            });
            throw error;
          }
        },
        
        // === DISPONIBILIDAD ===
        fetchAvailableSlots: async (date) => {
          const { currentAgency } = get();
          
          if (!currentAgency) return [];
          
          try {
            const result = await agencyService.getAvailableSlots(currentAgency.id, date);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al cargar slots disponibles');
            }
            
            const dateKey = format(new Date(date), DATE_FORMATS.DATE_KEY);
            set((state) => ({
              availableSlots: {
                ...state.availableSlots,
                [dateKey]: result.data
              }
            }));
            
            return result.data;
          } catch (error) {
            set({ error: error.message });
            throw error;
          }
        },
        
        setAvailableSlots: async (date, slots) => {
          const { currentAgency } = get();
          
          if (!currentAgency) return;
          
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.setAvailableSlots(currentAgency.id, date, slots);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al actualizar slots');
            }
            
            const dateKey = format(new Date(date), DATE_FORMATS.DATE_KEY);
            set((state) => ({
              availableSlots: {
                ...state.availableSlots,
                [dateKey]: result.data
              },
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
        
        // === CONFIGURACIÓN DE AGENCIA ===
        updateAgencyProfile: async (updates) => {
          const { currentAgency } = get();
          
          if (!currentAgency) return;
          
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.updateAgency(currentAgency.id, updates);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al actualizar perfil');
            }
            
            set({
              currentAgency: result.data,
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
        
        // === UTILIDADES ===
        fetchCalendarData: async (startDate, endDate) => {
          const { currentAgency } = get();
          
          if (!currentAgency) return {};
          
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.getCalendarData(currentAgency.id, startDate, endDate);
            
            if (!result.success) {
              throw new Error(result.error || 'Error al cargar datos del calendario');
            }
            
            set({
              calendarData: result.data,
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
        
        fetchAgencyStats: async () => {
          const { currentAgency } = get();
          
          if (!currentAgency) return null;
          
          set({ isLoading: true, error: null });
          
          try {
            const result = await agencyService.getAgencyStats(currentAgency.id);
            
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
        
        // Filtros
        setReservationsFilters: (filters) => {
          set((state) => ({
            reservationsFilters: { ...state.reservationsFilters, ...filters },
            reservationsPagination: { ...state.reservationsPagination, page: 1 }
          }));
          return get().actions.fetchReservations();
        },
        
        setTransactionsFilters: (filters) => {
          set((state) => ({
            transactionsFilters: { ...state.transactionsFilters, ...filters },
            transactionsPagination: { ...state.transactionsPagination, page: 1 }
          }));
          return get().actions.fetchPointsTransactions();
        },
        
        setReservationsPage: (page) => {
          set((state) => ({
            reservationsPagination: { ...state.reservationsPagination, page }
          }));
          return get().actions.fetchReservations();
        },
        
        setTransactionsPage: (page) => {
          set((state) => ({
            transactionsPagination: { ...state.transactionsPagination, page }
          }));
          return get().actions.fetchPointsTransactions();
        },
        
        // Utilidades
        clearError: () => set({ error: null }),
        
        resetStore: () => {
          set({
            currentAgency: null,
            reservations: [],
            pointsTransactions: [],
            availableSlots: {},
            isLoading: false,
            error: null,
            reservationsPagination: {
              page: 1,
              pageSize: 20,
              total: 0,
              totalPages: 0
            },
            transactionsPagination: {
              page: 1,
              pageSize: 50,
              total: 0,
              totalPages: 0
            },
            reservationsFilters: {
              startDate: '',
              endDate: '',
              status: '',
              serviceType: ''
            },
            transactionsFilters: {
              startDate: '',
              endDate: '',
              type: ''
            },
            stats: null,
            monthlyReport: null,
            yearlyComparison: null,
            calendarData: {}
          });
        }
      }
    }),
    {
      name: STORAGE_CONFIG.KEY,
      partialize: (state) => ({
        currentAgency: state.currentAgency,
        reservations: state.reservations,
        pointsTransactions: state.pointsTransactions,
        availableSlots: state.availableSlots
      })
    }
  )
);

export { useAgencyStore };
export default useAgencyStore;