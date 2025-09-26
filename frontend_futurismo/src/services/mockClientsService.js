/**
 * Servicio mock de clientes
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';

// Base de datos mock de clientes
const MOCK_CLIENTS_DB = [
  {
    id: '1',
    type: 'agency',
    name: 'Viajes El Dorado SAC',
    contact: 'Ana López',
    email: 'ventas@viajeseldorado.com',
    phone: '+51 912345678',
    ruc: '20123456789',
    address: 'Av. Larco 345, Miraflores',
    creditLimit: 10000,
    creditUsed: 3500,
    status: 'activo',
    since: '2022-01-15',
    totalBookings: 156,
    totalRevenue: 45680,
    rating: 4.8,
    paymentTerms: 30,
    pointsBalance: 15750,
    totalEarned: 28500,
    totalRedeemed: 12750,
    createdAt: new Date('2022-01-15').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString()
  },
  {
    id: '2',
    type: 'agency',
    name: 'Peru Travel Experience',
    contact: 'Roberto Díaz',
    email: 'roberto@perutravel.com',
    phone: '+51 923456789',
    ruc: '20987654321',
    address: 'Calle Las Begonias 456, San Isidro',
    creditLimit: 15000,
    creditUsed: 8200,
    status: 'activo',
    since: '2021-06-20',
    totalBookings: 234,
    totalRevenue: 78920,
    rating: 4.6,
    paymentTerms: 45,
    pointsBalance: 8500,
    totalEarned: 35000,
    totalRedeemed: 26500,
    createdAt: new Date('2021-06-20').toISOString(),
    updatedAt: new Date('2024-02-08').toISOString()
  },
  {
    id: '3',
    type: 'direct',
    name: 'Laura Martínez',
    email: 'laura.martinez@gmail.com',
    phone: '+51 934567890',
    dni: '12345678',
    nationality: 'Peruana',
    status: 'activo',
    since: '2023-03-10',
    totalBookings: 12,
    totalRevenue: 890,
    rating: 5.0,
    preferences: ['cultural', 'gastronómico'],
    createdAt: new Date('2023-03-10').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString()
  }
];

// Tipos de cliente
const CLIENT_TYPES = {
  agency: 'Agencia',
  direct: 'Directo',
  corporate: 'Corporativo',
  wholesale: 'Mayorista'
};

class MockClientsService {
  constructor() {
    this.clients = [...MOCK_CLIENTS_DB];
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_clients`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        this.clients = JSON.parse(stored);
      } catch (error) {
        console.warn('Error loading mock clients from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_clients`;
    localStorage.setItem(storageKey, JSON.stringify(this.clients));
  }

  async simulateDelay(ms = 300) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId() {
    return String(Date.now());
  }

  // Obtener todos los clientes
  async getClients(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.clients];
    
    // Filtrar por tipo
    if (filters.type) {
      filtered = filtered.filter(client => client.type === filters.type);
    }
    
    // Filtrar por estado
    if (filters.status) {
      filtered = filtered.filter(client => client.status === filters.status);
    }
    
    // Búsqueda por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        (client.contact && client.contact.toLowerCase().includes(searchTerm)) ||
        (client.ruc && client.ruc.includes(searchTerm)) ||
        (client.dni && client.dni.includes(searchTerm))
      );
    }
    
    // Filtrar por rating mínimo
    if (filters.minRating) {
      filtered = filtered.filter(client => client.rating >= filters.minRating);
    }
    
    // Ordenamiento
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'revenue':
            return b.totalRevenue - a.totalRevenue;
          case 'bookings':
            return b.totalBookings - a.totalBookings;
          case 'rating':
            return b.rating - a.rating;
          case 'recent':
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          default:
            return 0;
        }
      });
    }
    
    // Paginación
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = filtered.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedData,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit)
      }
    };
  }

  // Obtener cliente por ID
  async getClientById(id) {
    await this.simulateDelay();
    
    const client = this.clients.find(c => c.id === id);
    
    if (!client) {
      return {
        success: false,
        error: 'Cliente no encontrado'
      };
    }
    
    return {
      success: true,
      data: client
    };
  }

  // Crear nuevo cliente
  async createClient(clientData) {
    await this.simulateDelay();
    
    const newClient = {
      id: this.generateId(),
      ...clientData,
      status: 'activo',
      since: new Date().toISOString().split('T')[0],
      totalBookings: 0,
      totalRevenue: 0,
      rating: 0,
      creditUsed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.clients.push(newClient);
    this.saveToStorage();
    
    return {
      success: true,
      data: newClient
    };
  }

  // Actualizar cliente
  async updateClient(id, updates) {
    await this.simulateDelay();
    
    const index = this.clients.findIndex(c => c.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Cliente no encontrado'
      };
    }
    
    this.clients[index] = {
      ...this.clients[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.clients[index]
    };
  }

  // Eliminar cliente
  async deleteClient(id) {
    await this.simulateDelay();
    
    const index = this.clients.findIndex(c => c.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Cliente no encontrado'
      };
    }
    
    this.clients.splice(index, 1);
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  // Cambiar estado del cliente
  async toggleClientStatus(id) {
    await this.simulateDelay();
    
    const client = this.clients.find(c => c.id === id);
    
    if (!client) {
      return {
        success: false,
        error: 'Cliente no encontrado'
      };
    }
    
    const newStatus = client.status === 'activo' ? 'inactivo' : 'activo';
    
    return this.updateClient(id, { status: newStatus });
  }

  // Obtener tipos de cliente
  async getClientTypes() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: Object.entries(CLIENT_TYPES).map(([key, value]) => ({
        id: key,
        name: value
      }))
    };
  }

  // Obtener estadísticas de clientes
  async getStatistics() {
    await this.simulateDelay();
    
    const stats = {
      total: this.clients.length,
      active: this.clients.filter(c => c.status === 'activo').length,
      byType: {},
      totalRevenue: 0,
      totalBookings: 0,
      averageRating: 0
    };
    
    // Estadísticas por tipo
    Object.keys(CLIENT_TYPES).forEach(type => {
      stats.byType[type] = this.clients.filter(c => c.type === type).length;
    });
    
    // Totales y promedios
    this.clients.forEach(client => {
      stats.totalRevenue += client.totalRevenue || 0;
      stats.totalBookings += client.totalBookings || 0;
    });
    
    const clientsWithRating = this.clients.filter(c => c.rating > 0);
    if (clientsWithRating.length > 0) {
      stats.averageRating = clientsWithRating.reduce((sum, c) => sum + c.rating, 0) / clientsWithRating.length;
    }
    
    return {
      success: true,
      data: stats
    };
  }

  // Obtener historial de reservas del cliente
  async getClientBookings(clientId, filters = {}) {
    await this.simulateDelay();
    
    const client = this.clients.find(c => c.id === clientId);
    
    if (!client) {
      return {
        success: false,
        error: 'Cliente no encontrado'
      };
    }
    
    // Mock: generar reservas simuladas
    const bookings = [];
    const numBookings = Math.min(client.totalBookings, 10);
    
    for (let i = 0; i < numBookings; i++) {
      bookings.push({
        id: `booking-${clientId}-${i}`,
        clientId,
        tourName: `Tour ${i + 1}`,
        date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
        amount: Math.floor(Math.random() * 200) + 50,
        status: i === 0 ? 'pendiente' : 'completado'
      });
    }
    
    return {
      success: true,
      data: bookings
    };
  }

  // Actualizar crédito del cliente
  async updateClientCredit(id, creditData) {
    await this.simulateDelay();
    
    const client = this.clients.find(c => c.id === id);
    
    if (!client) {
      return {
        success: false,
        error: 'Cliente no encontrado'
      };
    }
    
    if (client.type !== 'agency' && client.type !== 'corporate') {
      return {
        success: false,
        error: 'Solo clientes de tipo agencia o corporativo pueden tener crédito'
      };
    }
    
    return this.updateClient(id, creditData);
  }

  // Registrar nueva reserva para el cliente
  async registerBooking(clientId, amount) {
    await this.simulateDelay();
    
    const client = this.clients.find(c => c.id === clientId);
    
    if (!client) {
      return {
        success: false,
        error: 'Cliente no encontrado'
      };
    }
    
    return this.updateClient(clientId, {
      totalBookings: client.totalBookings + 1,
      totalRevenue: client.totalRevenue + amount,
      creditUsed: client.creditUsed ? client.creditUsed + amount : amount
    });
  }

  // Buscar clientes por tipo de preferencia (para clientes directos)
  async getClientsByPreference(preference) {
    await this.simulateDelay();
    
    const filtered = this.clients.filter(client =>
      client.type === 'direct' && 
      client.preferences && 
      client.preferences.includes(preference)
    );
    
    return {
      success: true,
      data: filtered
    };
  }

  // Obtener tipos de cliente
  async getClientTypes() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: [
        { id: 'agency', label: 'Agencia de Viajes', icon: 'building' },
        { id: 'company', label: 'Empresa', icon: 'office' },
        { id: 'individual', label: 'Particular', icon: 'user' }
      ]
    };
  }

  // Validar documento (RUC/DNI)
  async validateDocument(type, number) {
    await this.simulateDelay();
    
    const exists = this.clients.some(c => 
      c.documentNumber === number && c.documentType === type
    );
    
    return {
      success: true,
      data: {
        valid: type === 'ruc' ? number.length === 11 : number.length === 8,
        exists,
        type,
        number
      }
    };
  }

  // Obtener clientes con crédito
  async getClientsWithCredit() {
    await this.simulateDelay();
    
    const filtered = this.clients.filter(client => 
      client.creditLimit && client.creditLimit > 0
    );
    
    return {
      success: true,
      data: filtered
    };
  }
}

export const mockClientsService = new MockClientsService();
export default mockClientsService;