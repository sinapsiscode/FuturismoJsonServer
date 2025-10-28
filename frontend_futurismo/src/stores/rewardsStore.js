import { create } from 'zustand';
import {
  REWARD_CATEGORIES,
  REDEMPTION_STATUS,
  SERVICE_TYPE_POINTS
} from '../constants/rewardsConstants';
import { useAuthStore } from './authStore';

const useRewardsStore = create((set, get) => ({
  // Estado
  rewards: [],
  agencies: [], // Agencias con sus puntos
  redemptions: [],
  loading: false,
  error: null,

  // Helper para obtener headers con token
  getAuthHeaders: () => {
    const token = useAuthStore.getState().token;
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },

  // Acciones para premios
  fetchRewards: async () => {
    set({ loading: true, error: null });
    try {
      const headers = get().getAuthHeaders();
      const response = await fetch('/api/rewards/catalog', { headers });
      const result = await response.json();

      if (result.success) {
        set({ rewards: result.data || [], loading: false });
      } else {
        throw new Error(result.error || 'Error al cargar premios');
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
      set({ error: error.message, loading: false, rewards: [] });
    }
  },

  createReward: async (rewardData) => {
    set({ loading: true, error: null });
    try {
      const headers = get().getAuthHeaders();
      const response = await fetch('/api/rewards/catalog', {
        method: 'POST',
        headers,
        body: JSON.stringify(rewardData)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al crear premio');
      }

      set(state => ({
        rewards: [...state.rewards, result.data],
        loading: false
      }));

      return result.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateReward: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const headers = get().getAuthHeaders();
      const response = await fetch(`/api/rewards/catalog/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar premio');
      }

      set(state => ({
        rewards: state.rewards.map(reward =>
          reward.id === id ? result.data : reward
        ),
        loading: false
      }));

      return result.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteReward: async (id) => {
    set({ loading: true, error: null });
    try {
      const headers = get().getAuthHeaders();
      const response = await fetch(`/api/rewards/catalog/${id}`, {
        method: 'DELETE',
        headers
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar premio');
      }

      set(state => ({
        rewards: state.rewards.filter(reward => reward.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Acciones para agencias y puntos
  fetchAgencies: async () => {
    set({ loading: true, error: null });
    try {
      const headers = get().getAuthHeaders();
      const response = await fetch('/api/agencies', { headers });
      const result = await response.json();

      if (result.success) {
        // Mapear agencias con sus puntos
        const agenciesWithPoints = (result.data || []).map(agency => ({
          id: agency.id,
          name: agency.name || agency.agency_name,
          email: agency.email || agency.contact_email,
          totalPoints: agency.totalPoints || agency.total_points || 0,
          availablePoints: agency.availablePoints || agency.available_points || 0,
          usedPoints: agency.usedPoints || agency.used_points || 0,
          joinDate: agency.created_at || agency.joinDate || new Date().toISOString()
        }));

        set({ agencies: agenciesWithPoints, loading: false });
      } else {
        throw new Error(result.error || 'Error al cargar agencias');
      }
    } catch (error) {
      console.error('Error fetching agencies:', error);
      set({ error: error.message, loading: false, agencies: [] });
    }
  },

  addPointsToAgency: async (agencyId, points, reason) => {
    try {
      // En un backend real: POST /api/agencies/:id/points
      set(state => ({
        agencies: state.agencies.map(agency =>
          agency.id === agencyId
            ? {
                ...agency,
                totalPoints: agency.totalPoints + points,
                availablePoints: agency.availablePoints + points
              }
            : agency
        )
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Acciones para canjes
  fetchRedemptions: async () => {
    set({ loading: true, error: null });
    try {
      // Por ahora retorna array vacío ya que no hay endpoint específico
      // En el futuro: GET /api/rewards/redemptions
      set({ redemptions: [], loading: false });
    } catch (error) {
      console.error('Error fetching redemptions:', error);
      set({ error: error.message, loading: false, redemptions: [] });
    }
  },

  requestRedemption: async (agencyId, rewardId) => {
    set({ loading: true, error: null });
    try {
      const agency = get().agencies.find(a => a.id === agencyId);
      const reward = get().rewards.find(r => r.id === rewardId);

      if (!agency || !reward) {
        throw new Error('Agencia o premio no encontrado');
      }

      if (agency.availablePoints < reward.points) {
        throw new Error('Puntos insuficientes');
      }

      if (reward.stock <= 0) {
        throw new Error('Premio sin stock disponible');
      }

      const newRedemption = {
        id: `redemption-${Date.now()}`,
        agencyId,
        agencyName: agency.name,
        rewardId,
        rewardName: reward.name,
        points: reward.points,
        status: REDEMPTION_STATUS.PENDING,
        requestDate: new Date().toISOString(),
        notes: 'Solicitud de canje pendiente de aprobación'
      };

      // Descontar puntos de la agencia y reducir stock
      set(state => ({
        agencies: state.agencies.map(a =>
          a.id === agencyId
            ? {
                ...a,
                availablePoints: a.availablePoints - reward.points,
                usedPoints: a.usedPoints + reward.points
              }
            : a
        ),
        rewards: state.rewards.map(r =>
          r.id === rewardId ? { ...r, stock: r.stock - 1 } : r
        ),
        redemptions: [...state.redemptions, newRedemption],
        loading: false
      }));

      return newRedemption;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateRedemptionStatus: async (id, status, notes = '') => {
    set({ loading: true, error: null });
    try {
      const updates = { status, notes };
      if (status === REDEMPTION_STATUS.APPROVED) {
        updates.approvalDate = new Date().toISOString();
      } else if (status === REDEMPTION_STATUS.DELIVERED) {
        updates.deliveryDate = new Date().toISOString();
      }

      set(state => ({
        redemptions: state.redemptions.map(redemption =>
          redemption.id === id ? { ...redemption, ...updates } : redemption
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Calcular puntos por servicio
  calculateServicePoints: (serviceType, basePrice) => {
    const basePoints = SERVICE_TYPE_POINTS[serviceType] || SERVICE_TYPE_POINTS.custom;
    // Bonus por precio (1 punto extra cada 10 soles)
    const priceBonus = Math.floor(basePrice / 10);
    return basePoints + priceBonus;
  },

  // Reset estado
  resetStore: () => {
    set({
      rewards: [],
      agencies: [],
      redemptions: [],
      loading: false,
      error: null
    });
  }
}));

export default useRewardsStore;
