import { create } from 'zustand';
import { 
  REWARD_CATEGORIES, 
  REDEMPTION_STATUS,
  SERVICE_TYPE_POINTS 
} from '../constants/rewardsConstants';

const useRewardsStore = create((set, get) => ({
  // Estado
  rewards: [],
  agencies: [], // Agencias con sus puntos
  redemptions: [],
  loading: false,
  error: null,

  // Mock data inicial
  mockRewards: [
    {
      id: '1',
      name: 'iPad Air 10.9"',
      description: 'Tablet Apple iPad Air de última generación',
      points: 15000,
      category: REWARD_CATEGORIES.ELECTRONICS,
      image: '/api/placeholder/300/200',
      stock: 5,
      active: true,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Voucher Hotel 5 estrellas',
      description: 'Una noche en hotel 5 estrellas en Lima',
      points: 8000,
      category: REWARD_CATEGORIES.TRAVEL,
      image: '/api/placeholder/300/200',
      stock: 10,
      active: true,
      createdAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '3',
      name: 'Gift Card Amazon S/300',
      description: 'Tarjeta regalo de Amazon por S/300 PEN',
      points: 5000,
      category: REWARD_CATEGORIES.GIFT_CARDS,
      image: '/api/placeholder/300/200',
      stock: 20,
      active: true,
      createdAt: '2024-01-25T10:00:00Z'
    },
    {
      id: '4',
      name: 'Cena para 2 personas',
      description: 'Cena en restaurante gourmet para 2 personas',
      points: 3500,
      category: REWARD_CATEGORIES.EXPERIENCES,
      image: '/api/placeholder/300/200',
      stock: 15,
      active: true,
      createdAt: '2024-02-01T10:00:00Z'
    },
    {
      id: '5',
      name: 'Polo Futurismo FF',
      description: 'Polo oficial de Futurismo FF',
      points: 1200,
      category: REWARD_CATEGORIES.MERCHANDISE,
      image: '/api/placeholder/300/200',
      stock: 50,
      active: true,
      createdAt: '2024-02-05T10:00:00Z'
    }
  ],

  mockAgencies: [
    {
      id: '1',
      name: 'Lima Adventures',
      email: 'contact@limaadventures.com',
      totalPoints: 12500,
      availablePoints: 8500,
      usedPoints: 4000,
      joinDate: '2024-01-01T00:00:00Z'
    },
    {
      id: '2', 
      name: 'Peru Explorer',
      email: 'info@peruexplorer.com',
      totalPoints: 9800,
      availablePoints: 9800,
      usedPoints: 0,
      joinDate: '2024-01-15T00:00:00Z'
    }
  ],

  mockRedemptions: [
    {
      id: '1',
      agencyId: '1',
      agencyName: 'Lima Adventures',
      rewardId: '5',
      rewardName: 'Polo Futurismo FF',
      points: 1200,
      status: REDEMPTION_STATUS.DELIVERED,
      requestDate: '2024-02-10T10:00:00Z',
      deliveryDate: '2024-02-15T10:00:00Z',
      notes: 'Entregado en oficina'
    },
    {
      id: '2',
      agencyId: '1',
      rewardId: '4',
      rewardName: 'Cena para 2 personas',
      points: 3500,
      status: REDEMPTION_STATUS.APPROVED,
      requestDate: '2024-02-20T14:00:00Z',
      approvalDate: '2024-02-21T09:00:00Z',
      notes: 'Aprobado para entrega'
    }
  ],

  // Acciones para premios
  fetchRewards: async () => {
    set({ loading: true, error: null });
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ rewards: get().mockRewards, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createReward: async (rewardData) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newReward = {
        id: Date.now().toString(),
        ...rewardData,
        createdAt: new Date().toISOString(),
        active: true
      };
      set(state => ({ 
        rewards: [...state.rewards, newReward],
        mockRewards: [...state.mockRewards, newReward],
        loading: false 
      }));
      return newReward;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateReward: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        rewards: state.rewards.map(reward => 
          reward.id === id ? { ...reward, ...updates } : reward
        ),
        mockRewards: state.mockRewards.map(reward => 
          reward.id === id ? { ...reward, ...updates } : reward
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteReward: async (id) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        rewards: state.rewards.filter(reward => reward.id !== id),
        mockRewards: state.mockRewards.filter(reward => reward.id !== id),
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
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ agencies: get().mockAgencies, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addPointsToAgency: async (agencyId, points, reason) => {
    try {
      set(state => ({
        agencies: state.agencies.map(agency => 
          agency.id === agencyId 
            ? {
                ...agency,
                totalPoints: agency.totalPoints + points,
                availablePoints: agency.availablePoints + points
              }
            : agency
        ),
        mockAgencies: state.mockAgencies.map(agency => 
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
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ redemptions: get().mockRedemptions, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
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

      await new Promise(resolve => setTimeout(resolve, 800));

      const newRedemption = {
        id: Date.now().toString(),
        agencyId,
        agencyName: agency.name,
        rewardId,
        rewardName: reward.name,
        points: reward.points,
        status: REDEMPTION_STATUS.PENDING,
        requestDate: new Date().toISOString(),
        notes: 'Solicitud de canje pendiente de aprobación'
      };

      // Descontar puntos de la agencia
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
        mockAgencies: state.mockAgencies.map(a => 
          a.id === agencyId 
            ? {
                ...a,
                availablePoints: a.availablePoints - reward.points,
                usedPoints: a.usedPoints + reward.points
              }
            : a
        ),
        // Reducir stock del premio
        rewards: state.rewards.map(r => 
          r.id === rewardId ? { ...r, stock: r.stock - 1 } : r
        ),
        mockRewards: state.mockRewards.map(r => 
          r.id === rewardId ? { ...r, stock: r.stock - 1 } : r
        ),
        // Agregar canje
        redemptions: [...state.redemptions, newRedemption],
        mockRedemptions: [...state.mockRedemptions, newRedemption],
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
        mockRedemptions: state.mockRedemptions.map(redemption => 
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