/**
 * Servicio mock de agencias
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  SERVICE_TYPES,
  MOCK_CLIENT_NAMES,
  MOCK_GUIDE_NAMES,
  RESERVATION_STATUS,
  POINTS_TRANSACTION_TYPES,
  TRANSACTION_REASONS,
  AVAILABLE_TIMES,
  MEMBERSHIP_TIERS,
  MOCK_DATA_CONFIG,
  POINTS_CONFIG,
  DATE_FORMATS,
  DEFAULT_AGENCY,
  ID_PREFIXES
} from '../constants/agencyConstants';

// Base de datos mock de agencias
const MOCK_AGENCIES_DB = [
  {
    id: DEFAULT_AGENCY.ID,
    name: DEFAULT_AGENCY.NAME,
    email: DEFAULT_AGENCY.EMAIL,
    phone: DEFAULT_AGENCY.PHONE,
    address: DEFAULT_AGENCY.ADDRESS,
    pointsBalance: DEFAULT_AGENCY.INITIAL_POINTS,
    totalEarned: DEFAULT_AGENCY.TOTAL_EARNED,
    totalRedeemed: DEFAULT_AGENCY.TOTAL_REDEEMED,
    memberSince: DEFAULT_AGENCY.MEMBER_SINCE,
    tier: DEFAULT_AGENCY.TIER,
    status: 'active',
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z'
  },
  {
    id: 'agency2',
    name: 'Viajes del Sur S.A.',
    email: 'contacto@viajesdelsur.com',
    phone: '+51 987 654 322',
    address: 'Jr. Comercio 456, Lima',
    pointsBalance: 250,
    totalEarned: 800,
    totalRedeemed: 550,
    memberSince: '2023-03-20',
    tier: MEMBERSHIP_TIERS.SILVER,
    status: 'active',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z'
  }
];

// Generar reservas mock
const generateMockReservations = (agencyId = DEFAULT_AGENCY.ID) => {
  const reservations = [];
  const today = new Date();
  
  for (let i = -MOCK_DATA_CONFIG.DAYS_PAST; i <= MOCK_DATA_CONFIG.DAYS_FUTURE; i++) {
    const date = addDays(today, i);
    const dateKey = format(date, DATE_FORMATS.DATE_KEY);
    
    if (Math.random() > (1 - MOCK_DATA_CONFIG.RESERVATION_PROBABILITY)) {
      const numReservations = Math.floor(Math.random() * MOCK_DATA_CONFIG.MAX_RESERVATIONS_PER_DAY) + 1;
      
      for (let j = 0; j < numReservations; j++) {
        const reservation = {
          id: `${ID_PREFIXES.RESERVATION}${dateKey}_${j}`,
          agencyId,
          date: dateKey,
          serviceType: SERVICE_TYPES[Math.floor(Math.random() * SERVICE_TYPES.length)],
          clientName: MOCK_CLIENT_NAMES[Math.floor(Math.random() * MOCK_CLIENT_NAMES.length)],
          participants: Math.floor(Math.random() * MOCK_DATA_CONFIG.MAX_PARTICIPANTS) + MOCK_DATA_CONFIG.MIN_PARTICIPANTS,
          totalAmount: (Math.floor(Math.random() * MOCK_DATA_CONFIG.MAX_AMOUNT) + MOCK_DATA_CONFIG.MIN_AMOUNT),
          status: [RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.PENDING, RESERVATION_STATUS.CANCELLED][Math.floor(Math.random() * 3)],
          guideAssigned: Math.random() > MOCK_DATA_CONFIG.GUIDE_ASSIGNMENT_PROBABILITY ? MOCK_GUIDE_NAMES[Math.floor(Math.random() * MOCK_GUIDE_NAMES.length)] : null,
          time: AVAILABLE_TIMES[Math.floor(Math.random() * AVAILABLE_TIMES.length)],
          duration: Math.floor(Math.random() * (MOCK_DATA_CONFIG.MAX_DURATION_HOURS - MOCK_DATA_CONFIG.MIN_DURATION_HOURS)) + MOCK_DATA_CONFIG.MIN_DURATION_HOURS,
          commission: Math.floor(Math.random() * MOCK_DATA_CONFIG.MAX_COMMISSION) + MOCK_DATA_CONFIG.MIN_COMMISSION,
          points: Math.floor(Math.random() * MOCK_DATA_CONFIG.MAX_POINTS) + MOCK_DATA_CONFIG.MIN_POINTS,
          createdAt: date.toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        reservations.push(reservation);
      }
    }
  }
  
  return reservations;
};

// Generar transacciones de puntos mock
const generateMockPointsTransactions = (agencyId = DEFAULT_AGENCY.ID) => {
  const transactions = [];
  const today = new Date();
  
  for (let i = -(MOCK_DATA_CONFIG.DAYS_PAST * 2); i <= 0; i++) {
    const date = addDays(today, i);
    
    if (Math.random() > (1 - MOCK_DATA_CONFIG.TRANSACTION_PROBABILITY)) {
      transactions.push({
        id: `${ID_PREFIXES.POINTS_TRANSACTION}${Date.now()}_${Math.abs(i)}`,
        agencyId,
        type: Math.random() > 0.3 ? POINTS_TRANSACTION_TYPES.EARNED : POINTS_TRANSACTION_TYPES.REDEEMED,
        amount: Math.floor(Math.random() * POINTS_CONFIG.MAX_TRANSACTION_AMOUNT) + POINTS_CONFIG.MIN_TRANSACTION_AMOUNT,
        reason: TRANSACTION_REASONS[Math.floor(Math.random() * TRANSACTION_REASONS.length)],
        relatedReservation: Math.random() > 0.5 ? `${ID_PREFIXES.RESERVATION}${format(date, DATE_FORMATS.DATE_KEY)}_0` : null,
        date: format(date, DATE_FORMATS.DATE_KEY),
        createdAt: date.toISOString(),
        processedBy: 'system'
      });
    }
  }
  
  return transactions;
};

class MockAgencyService {
  constructor() {
    this.agencies = [...MOCK_AGENCIES_DB];
    this.reservations = generateMockReservations();
    this.pointsTransactions = generateMockPointsTransactions();
    this.availableSlots = {};
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_agency`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.agencies = data.agencies || this.agencies;
        this.reservations = data.reservations || this.reservations;
        this.pointsTransactions = data.pointsTransactions || this.pointsTransactions;
        this.availableSlots = data.availableSlots || this.availableSlots;
      } catch (error) {
        console.warn('Error loading mock agency data from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_agency`;
    localStorage.setItem(storageKey, JSON.stringify({
      agencies: this.agencies,
      reservations: this.reservations,
      pointsTransactions: this.pointsTransactions,
      availableSlots: this.availableSlots
    }));
  }

  async simulateDelay(ms = 500) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId(prefix = 'item') {
    return `${prefix}${Date.now()}`;
  }

  // Agencias
  async getAgencies() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: this.agencies.filter(a => a.status === 'active')
    };
  }

  async getAgencyById(id) {
    await this.simulateDelay();
    
    const agency = this.agencies.find(a => a.id === id);
    
    if (!agency) {
      return {
        success: false,
        error: 'Agencia no encontrada'
      };
    }
    
    return {
      success: true,
      data: agency
    };
  }

  async updateAgency(id, updateData) {
    await this.simulateDelay();
    
    const index = this.agencies.findIndex(a => a.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Agencia no encontrada'
      };
    }
    
    this.agencies[index] = {
      ...this.agencies[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.agencies[index]
    };
  }

  // Reservaciones
  async getReservations(agencyId, filters = {}) {
    await this.simulateDelay();
    
    let filtered = this.reservations.filter(r => r.agencyId === agencyId);
    
    // Filtrar por fechas
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(res => 
        res.date >= filters.startDate && res.date <= filters.endDate
      );
    }
    
    // Filtrar por estado
    if (filters.status) {
      filtered = filtered.filter(res => res.status === filters.status);
    }
    
    // Filtrar por tipo de servicio
    if (filters.serviceType) {
      filtered = filtered.filter(res => 
        res.serviceType.toLowerCase().includes(filters.serviceType.toLowerCase())
      );
    }
    
    // Ordenar
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Paginación
    const page = filters.page || 1;
    const pageSize = filters.pageSize || APP_CONFIG.pagination.defaultPageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = filtered.slice(start, end);
    
    return {
      success: true,
      data: {
        reservations: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  async getReservationById(id) {
    await this.simulateDelay();
    
    const reservation = this.reservations.find(r => r.id === id);
    
    if (!reservation) {
      return {
        success: false,
        error: 'Reservación no encontrada'
      };
    }
    
    return {
      success: true,
      data: reservation
    };
  }

  async createReservation(reservationData) {
    await this.simulateDelay();
    
    const newReservation = {
      id: this.generateId(ID_PREFIXES.RESERVATION),
      ...reservationData,
      status: RESERVATION_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.reservations.push(newReservation);
    this.saveToStorage();
    
    return {
      success: true,
      data: newReservation
    };
  }

  async updateReservation(id, updateData) {
    await this.simulateDelay();
    
    const index = this.reservations.findIndex(r => r.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Reservación no encontrada'
      };
    }
    
    const oldReservation = this.reservations[index];
    this.reservations[index] = {
      ...oldReservation,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Si la reserva cambia a confirmada, crear transacción de puntos automática
    if (oldReservation.status === RESERVATION_STATUS.PENDING && 
        updateData.status === RESERVATION_STATUS.CONFIRMED) {
      const pointsToEarn = this.calculatePointsForReservation(this.reservations[index]);
      
      const pointsTransaction = {
        id: this.generateId(ID_PREFIXES.POINTS_TRANSACTION),
        agencyId: oldReservation.agencyId,
        type: POINTS_TRANSACTION_TYPES.EARNED,
        amount: pointsToEarn,
        reason: `Reserva confirmada - ${oldReservation.serviceType}`,
        relatedReservation: id,
        date: format(new Date(), DATE_FORMATS.DATE_KEY),
        createdAt: new Date().toISOString(),
        processedBy: 'system'
      };
      
      this.pointsTransactions.push(pointsTransaction);
      
      // Actualizar balance de puntos de la agencia
      const agencyIndex = this.agencies.findIndex(a => a.id === oldReservation.agencyId);
      if (agencyIndex !== -1) {
        this.agencies[agencyIndex].pointsBalance += pointsToEarn;
        this.agencies[agencyIndex].totalEarned += pointsToEarn;
      }
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.reservations[index]
    };
  }

  async deleteReservation(id) {
    await this.simulateDelay();
    
    const index = this.reservations.findIndex(r => r.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Reservación no encontrada'
      };
    }
    
    this.reservations.splice(index, 1);
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  calculatePointsForReservation(reservation) {
    const basePoints = 10;
    const amountMultiplier = Math.floor(reservation.totalAmount / 100);
    const participantBonus = Math.floor(reservation.participants / 2);
    
    const serviceMultipliers = {
      'City Tour': 1,
      'Machu Picchu': 2,
      'Valle Sagrado': 1.5,
      'Islas Ballestas': 1.2,
      'Nazca Lines': 1.8
    };
    
    const serviceMultiplier = serviceMultipliers[reservation.serviceType] || 1;
    
    return Math.floor((basePoints + amountMultiplier + participantBonus) * serviceMultiplier);
  }

  // Sistema de puntos
  async getPointsTransactions(agencyId, filters = {}) {
    await this.simulateDelay();
    
    let filtered = this.pointsTransactions.filter(pt => pt.agencyId === agencyId);
    
    // Filtrar por tipo
    if (filters.type) {
      filtered = filtered.filter(pt => pt.type === filters.type);
    }
    
    // Filtrar por fechas
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(pt => 
        pt.date >= filters.startDate && pt.date <= filters.endDate
      );
    }
    
    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Paginación
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 50;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = filtered.slice(start, end);
    
    return {
      success: true,
      data: {
        transactions: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  async createPointsTransaction(transactionData) {
    await this.simulateDelay();
    
    const newTransaction = {
      id: this.generateId(ID_PREFIXES.POINTS_TRANSACTION),
      ...transactionData,
      date: format(new Date(), DATE_FORMATS.DATE_KEY),
      createdAt: new Date().toISOString()
    };
    
    this.pointsTransactions.push(newTransaction);
    
    // Actualizar balance de puntos de la agencia
    const agencyIndex = this.agencies.findIndex(a => a.id === transactionData.agencyId);
    if (agencyIndex !== -1) {
      if (transactionData.type === POINTS_TRANSACTION_TYPES.EARNED) {
        this.agencies[agencyIndex].pointsBalance += transactionData.amount;
        this.agencies[agencyIndex].totalEarned += transactionData.amount;
      } else {
        this.agencies[agencyIndex].pointsBalance -= transactionData.amount;
        this.agencies[agencyIndex].totalRedeemed += transactionData.amount;
      }
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: newTransaction
    };
  }

  async getPointsBalance(agencyId) {
    await this.simulateDelay();
    
    const agency = this.agencies.find(a => a.id === agencyId);
    
    if (!agency) {
      return {
        success: false,
        error: 'Agencia no encontrada'
      };
    }
    
    return {
      success: true,
      data: {
        balance: agency.pointsBalance,
        totalEarned: agency.totalEarned,
        totalRedeemed: agency.totalRedeemed,
        tier: agency.tier
      }
    };
  }

  // Reportes
  async getMonthlyReport(agencyId, year, month) {
    await this.simulateDelay();
    
    const startDate = format(new Date(year, month - 1, 1), DATE_FORMATS.DATE_KEY);
    const endDate = format(new Date(year, month, 0), DATE_FORMATS.DATE_KEY);
    
    const monthReservations = this.reservations.filter(res => 
      res.agencyId === agencyId &&
      res.date >= startDate && 
      res.date <= endDate && 
      res.status === RESERVATION_STATUS.CONFIRMED
    );
    
    const totalRevenue = monthReservations.reduce((sum, res) => sum + res.totalAmount, 0);
    const totalCommission = monthReservations.reduce((sum, res) => sum + (res.commission || 0), 0);
    const totalParticipants = monthReservations.reduce((sum, res) => sum + res.participants, 0);
    
    // Agrupar por tipo de servicio
    const serviceBreakdown = monthReservations.reduce((acc, res) => {
      if (!acc[res.serviceType]) {
        acc[res.serviceType] = {
          count: 0,
          revenue: 0,
          participants: 0
        };
      }
      acc[res.serviceType].count++;
      acc[res.serviceType].revenue += res.totalAmount;
      acc[res.serviceType].participants += res.participants;
      return acc;
    }, {});
    
    // Datos por día
    const dailyData = eachDayOfInterval({
      start: new Date(year, month - 1, 1),
      end: new Date(year, month, 0)
    }).map(date => {
      const dateKey = format(date, DATE_FORMATS.DATE_KEY);
      const dayReservations = monthReservations.filter(res => res.date === dateKey);
      return {
        date: dateKey,
        revenue: dayReservations.reduce((sum, res) => sum + res.totalAmount, 0),
        reservations: dayReservations.length,
        participants: dayReservations.reduce((sum, res) => sum + res.participants, 0)
      };
    });
    
    return {
      success: true,
      data: {
        period: { year, month },
        summary: {
          totalReservations: monthReservations.length,
          totalRevenue,
          totalCommission,
          totalParticipants,
          averageOrderValue: monthReservations.length > 0 ? totalRevenue / monthReservations.length : 0
        },
        serviceBreakdown,
        dailyData
      }
    };
  }

  async getYearlyComparison(agencyId, year) {
    await this.simulateDelay();
    
    const months = [];
    for (let i = 1; i <= 12; i++) {
      const report = await this.getMonthlyReport(agencyId, year, i);
      if (report.success) {
        months.push({
          month: i,
          monthName: format(new Date(year, i - 1, 1), 'MMMM', { locale: es }),
          ...report.data.summary
        });
      }
    }
    
    return {
      success: true,
      data: months
    };
  }

  // Disponibilidad
  async getAvailableSlots(agencyId, date) {
    await this.simulateDelay();
    
    const dateKey = format(new Date(date), DATE_FORMATS.DATE_KEY);
    
    return {
      success: true,
      data: this.availableSlots[`${agencyId}_${dateKey}`] || AVAILABLE_TIMES
    };
  }

  async setAvailableSlots(agencyId, date, slots) {
    await this.simulateDelay();
    
    const dateKey = format(new Date(date), DATE_FORMATS.DATE_KEY);
    this.availableSlots[`${agencyId}_${dateKey}`] = slots;
    
    this.saveToStorage();
    
    return {
      success: true,
      data: slots
    };
  }

  // Estadísticas
  async getAgencyStats(agencyId) {
    await this.simulateDelay();
    
    const agency = this.agencies.find(a => a.id === agencyId);
    
    if (!agency) {
      return {
        success: false,
        error: 'Agencia no encontrada'
      };
    }
    
    const totalReservations = this.reservations.filter(r => r.agencyId === agencyId).length;
    const confirmedReservations = this.reservations.filter(r => 
      r.agencyId === agencyId && r.status === RESERVATION_STATUS.CONFIRMED
    ).length;
    
    const totalRevenue = this.reservations
      .filter(r => r.agencyId === agencyId && r.status === RESERVATION_STATUS.CONFIRMED)
      .reduce((sum, r) => sum + r.totalAmount, 0);
    
    const topServices = SERVICE_TYPES.map(service => {
      const serviceReservations = this.reservations.filter(r => 
        r.agencyId === agencyId && 
        r.serviceType === service && 
        r.status === RESERVATION_STATUS.CONFIRMED
      );
      
      return {
        service,
        count: serviceReservations.length,
        revenue: serviceReservations.reduce((sum, r) => sum + r.totalAmount, 0)
      };
    }).sort((a, b) => b.revenue - a.revenue);
    
    return {
      success: true,
      data: {
        totalReservations,
        confirmedReservations,
        cancellationRate: totalReservations > 0 
          ? ((totalReservations - confirmedReservations) / totalReservations * 100).toFixed(2)
          : 0,
        totalRevenue,
        averageOrderValue: confirmedReservations > 0 
          ? (totalRevenue / confirmedReservations).toFixed(2)
          : 0,
        topServices: topServices.slice(0, 5),
        pointsBalance: agency.pointsBalance,
        tier: agency.tier
      }
    };
  }

  // Calendario
  async getCalendarData(agencyId, startDate, endDate) {
    await this.simulateDelay();
    
    const reservations = this.reservations.filter(r => 
      r.agencyId === agencyId &&
      r.date >= startDate && 
      r.date <= endDate
    );
    
    const calendarData = {};
    
    // Inicializar todos los días del rango
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
      const dateKey = format(currentDate, DATE_FORMATS.DATE_KEY);
      calendarData[dateKey] = {
        date: dateKey,
        reservations: [],
        totalRevenue: 0,
        totalParticipants: 0,
        hasAvailability: true
      };
      currentDate = addDays(currentDate, 1);
    }
    
    // Llenar con datos de reservas
    reservations.forEach(reservation => {
      if (calendarData[reservation.date]) {
        calendarData[reservation.date].reservations.push(reservation);
        if (reservation.status === RESERVATION_STATUS.CONFIRMED) {
          calendarData[reservation.date].totalRevenue += reservation.totalAmount;
          calendarData[reservation.date].totalParticipants += reservation.participants;
        }
      }
    });
    
    return {
      success: true,
      data: calendarData
    };
  }
}

export const mockAgencyService = new MockAgencyService();
export default mockAgencyService;