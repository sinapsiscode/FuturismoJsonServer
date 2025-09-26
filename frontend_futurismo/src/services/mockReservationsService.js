/**
 * Servicio mock de reservaciones
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';

// Base de datos mock de reservaciones
const MOCK_RESERVATIONS_DB = [
  {
    id: 'RES001',
    code: 'FUT2024A1B2',
    serviceType: 'tour',
    tourName: 'Tour del Casco Histórico',
    date: '2024-03-15',
    time: '10:00',
    touristsCount: 15,
    tourists: [
      { name: 'John Smith', passport: 'US123456', email: 'john@example.com', nationality: 'US', phone: '+1234567890' },
      { name: 'Jane Smith', passport: 'US123457', email: 'jane@example.com', nationality: 'US', phone: '+1234567891' }
    ],
    pickupLocation: 'Hotel Plaza Mayor',
    guide: { id: 'guide-001', name: 'Juan Pérez' },
    status: 'confirmed',
    price: 450,
    currency: 'EUR',
    notes: 'Grupo familiar con niños',
    createdAt: '2024-03-01T10:00:00Z',
    createdBy: 'agency-001',
    agencyName: 'Agencia Test S.L.'
  },
  {
    id: 'RES002',
    code: 'FUT2024B2C3',
    serviceType: 'transfer',
    origin: 'Aeropuerto Barajas',
    destination: 'Hotel Riu Plaza España',
    date: '2024-03-16',
    time: '14:30',
    touristsCount: 4,
    tourists: [
      { name: 'Pierre Dubois', passport: 'FR987654', email: 'pierre@example.fr', nationality: 'FR', phone: '+33123456789' }
    ],
    status: 'pending',
    price: 85,
    currency: 'EUR',
    vehicleType: 'minivan',
    flightNumber: 'AF1234',
    createdAt: '2024-03-10T15:30:00Z',
    createdBy: 'agency-001',
    agencyName: 'Agencia Test S.L.'
  }
];

class MockReservationsService {
  constructor() {
    this.reservations = [...MOCK_RESERVATIONS_DB];
    this.initializeStorage();
  }

  // Inicializar storage local
  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_reservations`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        this.reservations = JSON.parse(stored);
      } catch (error) {
        console.warn('Error loading mock reservations from storage:', error);
      }
    }
  }

  // Guardar en storage local
  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_reservations`;
    localStorage.setItem(storageKey, JSON.stringify(this.reservations));
  }

  // Simular delay de red
  async simulateDelay(ms = 800) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // Generar código único de reservación
  generateReservationCode() {
    const prefix = 'FUT';
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${year}${random}`;
  }

  // Generar ID único
  generateId() {
    return `RES${Date.now().toString().substr(-6)}`;
  }

  async createReservation(reservationData) {
    await this.simulateDelay();

    const newReservation = {
      id: this.generateId(),
      code: this.generateReservationCode(),
      ...reservationData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      createdBy: 'current-user', // En producción vendría del token
      agencyName: 'Agencia Demo' // En producción vendría del usuario
    };

    this.reservations.push(newReservation);
    this.saveToStorage();

    return {
      success: true,
      data: newReservation
    };
  }

  async getReservations(filters = {}) {
    await this.simulateDelay(600);

    let filtered = [...this.reservations];

    // Aplicar filtros
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.serviceType) {
      filtered = filtered.filter(r => r.serviceType === filters.serviceType);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(r => r.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(r => r.date <= filters.dateTo);
    }

    if (filters.agencyId) {
      filtered = filtered.filter(r => r.createdBy === filters.agencyId);
    }

    // Ordenar por fecha de creación descendente
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
    await this.simulateDelay(500);

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

  async updateReservation(id, updateData) {
    await this.simulateDelay();

    const index = this.reservations.findIndex(r => r.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Reservación no encontrada'
      };
    }

    this.reservations[index] = {
      ...this.reservations[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();

    return {
      success: true,
      data: this.reservations[index]
    };
  }

  async updateReservationStatus(id, status, reason = null) {
    await this.simulateDelay();

    const index = this.reservations.findIndex(r => r.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Reservación no encontrada'
      };
    }

    this.reservations[index] = {
      ...this.reservations[index],
      status,
      statusReason: reason,
      statusUpdatedAt: new Date().toISOString()
    };

    this.saveToStorage();

    return {
      success: true,
      data: this.reservations[index]
    };
  }

  async cancelReservation(id, reason) {
    return this.updateReservationStatus(id, 'cancelled', reason);
  }

  async assignGuide(reservationId, guideId) {
    await this.simulateDelay();

    const index = this.reservations.findIndex(r => r.id === reservationId);

    if (index === -1) {
      return {
        success: false,
        error: 'Reservación no encontrada'
      };
    }

    // Simulación de datos del guía
    const mockGuide = {
      id: guideId,
      name: 'María García',
      phone: '+34 666 777 888',
      languages: ['es', 'en', 'fr']
    };

    this.reservations[index] = {
      ...this.reservations[index],
      guide: mockGuide,
      guideAssignedAt: new Date().toISOString()
    };

    this.saveToStorage();

    return {
      success: true,
      data: this.reservations[index]
    };
  }

  async generateVoucher(id) {
    await this.simulateDelay(1000);

    const reservation = this.reservations.find(r => r.id === id);

    if (!reservation) {
      return {
        success: false,
        error: 'Reservación no encontrada'
      };
    }

    // Simular datos del voucher
    const voucher = {
      voucherId: `V${reservation.code}`,
      reservation: reservation,
      qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
      validUntil: reservation.date,
      terms: [
        'Presentar este voucher al inicio del servicio',
        'Válido solo para la fecha indicada',
        'No reembolsable después de 24 horas antes del servicio'
      ]
    };

    return {
      success: true,
      data: voucher
    };
  }

  async downloadVoucherPDF(id) {
    await this.simulateDelay(1500);

    const reservation = this.reservations.find(r => r.id === id);

    if (!reservation) {
      return {
        success: false,
        error: 'Reservación no encontrada'
      };
    }

    // En un sistema real, esto generaría y descargaría un PDF
    console.log(`[MOCK] Descargando voucher PDF para reservación ${id}`);

    return {
      success: true,
      message: 'Voucher descargado exitosamente'
    };
  }

  async getReservationStats(params = {}) {
    await this.simulateDelay(800);

    const { dateFrom, dateTo } = params;
    let filtered = [...this.reservations];

    if (dateFrom) {
      filtered = filtered.filter(r => r.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(r => r.date <= dateTo);
    }

    // Calcular estadísticas
    const stats = {
      total: filtered.length,
      confirmed: filtered.filter(r => r.status === 'confirmed').length,
      pending: filtered.filter(r => r.status === 'pending').length,
      cancelled: filtered.filter(r => r.status === 'cancelled').length,
      revenue: filtered
        .filter(r => r.status === 'confirmed')
        .reduce((sum, r) => sum + (r.price || 0), 0),
      averageGroupSize: filtered.length > 0
        ? filtered.reduce((sum, r) => sum + r.touristsCount, 0) / filtered.length
        : 0,
      byServiceType: {
        tour: filtered.filter(r => r.serviceType === 'tour').length,
        transfer: filtered.filter(r => r.serviceType === 'transfer').length,
        package: filtered.filter(r => r.serviceType === 'package').length
      }
    };

    return {
      success: true,
      data: stats
    };
  }

  async searchReservations(query, filters = {}) {
    await this.simulateDelay(600);

    const searchTerm = query.toLowerCase();
    
    let results = this.reservations.filter(r => 
      r.code.toLowerCase().includes(searchTerm) ||
      r.tourists.some(t => 
        t.name.toLowerCase().includes(searchTerm) ||
        t.email.toLowerCase().includes(searchTerm)
      ) ||
      (r.tourName && r.tourName.toLowerCase().includes(searchTerm)) ||
      (r.agencyName && r.agencyName.toLowerCase().includes(searchTerm))
    );

    // Aplicar filtros adicionales
    if (filters.status) {
      results = results.filter(r => r.status === filters.status);
    }

    return {
      success: true,
      data: {
        results,
        total: results.length
      }
    };
  }

  async checkAvailability(params) {
    await this.simulateDelay(1000);

    // Simulación de verificación de disponibilidad
    const { serviceType, date, time, touristsCount } = params;

    // Simular capacidad máxima por tipo de servicio
    const maxCapacity = {
      tour: 50,
      transfer: 8,
      package: 30
    };

    // Contar reservas existentes para esa fecha/hora
    const existingReservations = this.reservations.filter(r => 
      r.serviceType === serviceType &&
      r.date === date &&
      r.time === time &&
      r.status !== 'cancelled'
    );

    const bookedSpots = existingReservations.reduce((sum, r) => sum + r.touristsCount, 0);
    const availableSpots = maxCapacity[serviceType] - bookedSpots;

    const isAvailable = availableSpots >= touristsCount;

    return {
      success: true,
      data: {
        available: isAvailable,
        availableSpots,
        maxCapacity: maxCapacity[serviceType],
        message: isAvailable 
          ? 'Disponibilidad confirmada' 
          : `Solo quedan ${availableSpots} plazas disponibles`
      }
    };
  }

  async getAvailableTours(date) {
    await this.simulateDelay(700);

    // Simulación de tours disponibles
    const availableTours = [
      {
        id: 'tour-001',
        name: 'Tour del Casco Histórico',
        schedule: ['09:00', '11:00', '16:00'],
        duration: '2h',
        languages: ['es', 'en', 'fr'],
        price: 25,
        maxCapacity: 30
      },
      {
        id: 'tour-002',
        name: 'Ruta de Tapas',
        schedule: ['12:00', '19:00'],
        duration: '3h',
        languages: ['es', 'en'],
        price: 45,
        maxCapacity: 20
      },
      {
        id: 'tour-003',
        name: 'Toledo Tour',
        schedule: ['08:00'],
        duration: '8h',
        languages: ['es', 'en', 'fr', 'de'],
        price: 65,
        maxCapacity: 50
      }
    ];

    return {
      success: true,
      data: availableTours
    };
  }

  async duplicateReservation(id, newData = {}) {
    await this.simulateDelay();

    const original = this.reservations.find(r => r.id === id);

    if (!original) {
      return {
        success: false,
        error: 'Reservación original no encontrada'
      };
    }

    const duplicate = {
      ...original,
      id: this.generateId(),
      code: this.generateReservationCode(),
      ...newData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      duplicatedFrom: id
    };

    delete duplicate.guide;
    delete duplicate.confirmedAt;

    this.reservations.push(duplicate);
    this.saveToStorage();

    return {
      success: true,
      data: duplicate
    };
  }

  async exportReservations(filters = {}, format = 'excel') {
    await this.simulateDelay(2000);

    // En un sistema real, esto generaría y descargaría el archivo
    console.log(`[MOCK] Exportando reservaciones en formato ${format}`, filters);

    return {
      success: true,
      message: `Reservaciones exportadas en formato ${format}`
    };
  }
}

export const mockReservationsService = new MockReservationsService();
export default mockReservationsService;