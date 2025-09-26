/**
 * Servicio mock de proveedores
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';

// Categorías del sistema
const PROVIDER_CATEGORIES = [
  { id: 'hoteles', name: 'Hoteles', icon: '🏨', color: 'blue' },
  { id: 'restaurantes', name: 'Restaurantes', icon: '🍽️', color: 'green' },
  { id: 'transporte', name: 'Transporte', icon: '🚐', color: 'yellow' },
  { id: 'actividades', name: 'Actividades', icon: '🎯', color: 'purple' },
  { id: 'guias_locales', name: 'Guías Locales', icon: '👨‍🦱', color: 'orange' },
  { id: 'artesanias', name: 'Artesanías', icon: '🎨', color: 'pink' }
];

// Ubicaciones disponibles
const PROVIDER_LOCATIONS = [
  {
    id: 'ica',
    name: 'Ica',
    region: 'Ica',
    country: 'Perú',
    categories: ['hoteles', 'restaurantes', 'transporte', 'actividades', 'guias_locales']
  },
  {
    id: 'cusco',
    name: 'Cusco',
    region: 'Cusco',
    country: 'Perú',
    categories: ['hoteles', 'restaurantes', 'transporte', 'actividades', 'guias_locales', 'artesanias']
  },
  {
    id: 'arequipa',
    name: 'Arequipa',
    region: 'Arequipa',
    country: 'Perú',
    categories: ['hoteles', 'restaurantes', 'transporte', 'actividades']
  },
  {
    id: 'lima',
    name: 'Lima',
    region: 'Lima',
    country: 'Perú',
    categories: ['hoteles', 'restaurantes', 'transporte', 'actividades', 'guias_locales']
  }
];

// Base de datos mock de proveedores
const MOCK_PROVIDERS_DB = [
  // Ica - Hoteles
  {
    id: 'hotel_las_dunas_ica',
    name: 'Hotel Las Dunas',
    category: 'hoteles',
    location: 'ica',
    contact: {
      phone: '+51 956 123 456',
      email: 'reservas@hotellasdunasica.com',
      address: 'Av. La Angostura 400, Ica',
      contactPerson: 'María González'
    },
    services: ['Hospedaje', 'Desayuno', 'Piscina', 'Spa'],
    pricing: {
      type: 'per_night',
      basePrice: 120,
      currency: 'PEN'
    },
    rating: 4.5,
    capacity: 80,
    status: 'active',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'hotel_vinas_queirolo_ica',
    name: 'Hotel Viñas Queirolo',
    category: 'hoteles',
    location: 'ica',
    contact: {
      phone: '+51 956 789 012',
      email: 'info@vinasqueirolo.com',
      address: 'Fundo Tres Esquinas s/n, Ica',
      contactPerson: 'Carlos Mendoza'
    },
    services: ['Hospedaje', 'Tour de viñedos', 'Degustación', 'Restaurante'],
    pricing: {
      type: 'per_night',
      basePrice: 180,
      currency: 'PEN'
    },
    rating: 4.8,
    capacity: 40,
    status: 'active',
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  // Ica - Restaurantes
  {
    id: 'restaurant_el_catador_ica',
    name: 'El Catador',
    category: 'restaurantes',
    location: 'ica',
    contact: {
      phone: '+51 956 345 678',
      email: 'reservas@elcatador.com',
      address: 'Av. Municipalidad 142, Ica',
      contactPerson: 'Ana Flores'
    },
    services: ['Almuerzo', 'Cena', 'Comida criolla', 'Parrillas'],
    pricing: {
      type: 'per_person',
      basePrice: 35,
      currency: 'PEN'
    },
    rating: 4.3,
    capacity: 60,
    status: 'active',
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  // Cusco - Hoteles
  {
    id: 'hotel_monasterio_cusco',
    name: 'Hotel Monasterio',
    category: 'hoteles',
    location: 'cusco',
    contact: {
      phone: '+51 984 123 456',
      email: 'reservas@monasterio.com',
      address: 'Calle Palacios 136, Cusco',
      contactPerson: 'José Quispe'
    },
    services: ['Hospedaje de lujo', 'Spa', 'Oxígeno', 'Restaurante gourmet'],
    pricing: {
      type: 'per_night',
      basePrice: 450,
      currency: 'PEN'
    },
    rating: 4.9,
    capacity: 120,
    status: 'active',
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z'
  },
  // Cusco - Guías Locales
  {
    id: 'guia_local_cusco_1',
    name: 'Amaru Quispe',
    category: 'guias_locales',
    location: 'cusco',
    contact: {
      phone: '+51 984 567 890',
      email: 'amaru.quispe@gmail.com',
      address: 'Barrio San Blas, Cusco',
      contactPerson: 'Amaru Quispe'
    },
    services: ['Guía en quechua', 'Historia incaica', 'Sitios arqueológicos'],
    pricing: {
      type: 'per_day',
      basePrice: 150,
      currency: 'PEN'
    },
    rating: 4.7,
    specialties: ['Machu Picchu', 'Valle Sagrado', 'Ciudad del Cusco'],
    languages: ['Español', 'Quechua', 'Inglés'],
    status: 'active',
    createdAt: '2023-04-15T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z'
  },
  // Lima - Transporte
  {
    id: 'transport_lima_tours',
    name: 'Lima Tours Transport',
    category: 'transporte',
    location: 'lima',
    contact: {
      phone: '+51 987 654 321',
      email: 'info@limatourstransport.com',
      address: 'Av. Javier Prado 123, San Isidro',
      contactPerson: 'Roberto Sánchez'
    },
    services: ['Minivans', 'Buses turísticos', 'Traslados aeropuerto', 'City tours'],
    pricing: {
      type: 'per_trip',
      basePrice: 80,
      currency: 'PEN'
    },
    fleet: [
      { type: 'Minivan', capacity: 15, quantity: 5 },
      { type: 'Bus', capacity: 40, quantity: 3 }
    ],
    rating: 4.6,
    status: 'active',
    createdAt: '2023-05-20T00:00:00Z',
    updatedAt: '2024-03-08T00:00:00Z'
  }
];

// Base de datos mock de asignaciones
const MOCK_ASSIGNMENTS_DB = [
  {
    id: 'assignment_001',
    tourId: 'tour_ica_fullday',
    tourName: 'Ica Full Day',
    date: '2024-03-15',
    providers: [
      {
        providerId: 'hotel_las_dunas_ica',
        startTime: '08:00',
        endTime: '10:00',
        service: 'Desayuno',
        notes: 'Desayuno buffet para 25 personas',
        status: 'confirmed'
      },
      {
        providerId: 'restaurant_el_catador_ica',
        startTime: '13:00',
        endTime: '15:00',
        service: 'Almuerzo',
        notes: 'Menú especial turistas, incluye bebida',
        status: 'confirmed'
      }
    ],
    status: 'confirmed',
    totalCost: 1350,
    currency: 'PEN',
    createdAt: '2024-03-10T10:00:00Z',
    createdBy: 'user-001',
    confirmedAt: '2024-03-11T15:30:00Z'
  },
  {
    id: 'assignment_002',
    tourId: 'tour_cusco_machupichu',
    tourName: 'Cusco - Machu Picchu 3D/2N',
    date: '2024-03-20',
    providers: [
      {
        providerId: 'hotel_monasterio_cusco',
        startTime: '14:00',
        endTime: '12:00',
        service: 'Hospedaje 2 noches',
        notes: '15 habitaciones dobles',
        status: 'pending'
      },
      {
        providerId: 'guia_local_cusco_1',
        startTime: '08:00',
        endTime: '18:00',
        service: 'Guía especializado',
        notes: 'Tour en español e inglés',
        status: 'pending'
      }
    ],
    status: 'draft',
    totalCost: 8250,
    currency: 'PEN',
    createdAt: '2024-03-12T14:20:00Z',
    createdBy: 'user-002'
  }
];

class MockProvidersService {
  constructor() {
    this.providers = [...MOCK_PROVIDERS_DB];
    this.assignments = [...MOCK_ASSIGNMENTS_DB];
    this.locations = [...PROVIDER_LOCATIONS];
    this.categories = [...PROVIDER_CATEGORIES];
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_providers`;
    const assignmentsKey = `${APP_CONFIG.storage.prefix}mock_assignments`;
    
    const storedProviders = localStorage.getItem(storageKey);
    const storedAssignments = localStorage.getItem(assignmentsKey);
    
    if (storedProviders) {
      try {
        this.providers = JSON.parse(storedProviders);
      } catch (error) {
        console.warn('Error loading mock providers from storage:', error);
      }
    }
    
    if (storedAssignments) {
      try {
        this.assignments = JSON.parse(storedAssignments);
      } catch (error) {
        console.warn('Error loading mock assignments from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_providers`;
    const assignmentsKey = `${APP_CONFIG.storage.prefix}mock_assignments`;
    
    localStorage.setItem(storageKey, JSON.stringify(this.providers));
    localStorage.setItem(assignmentsKey, JSON.stringify(this.assignments));
  }

  async simulateDelay(ms = 500) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId(prefix = 'provider') {
    return `${prefix}-${Date.now()}`;
  }

  // Ubicaciones y categorías
  async getLocations() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: this.locations
    };
  }

  async getCategories() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: this.categories
    };
  }

  // CRUD de proveedores
  async getProviders(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.providers];
    
    // Solo proveedores activos por defecto
    if (filters.includeInactive !== true) {
      filtered = filtered.filter(p => p.status === 'active');
    }
    
    // Filtrar por ubicación
    if (filters.location) {
      filtered = filtered.filter(p => p.location === filters.location);
    }
    
    // Filtrar por categoría
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Filtrar por rating mínimo
    if (filters.minRating) {
      filtered = filtered.filter(p => p.rating >= filters.minRating);
    }
    
    // Búsqueda por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.contact.contactPerson.toLowerCase().includes(searchTerm) ||
        p.services.some(s => s.toLowerCase().includes(searchTerm))
      );
    }
    
    // Ordenar
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return a.pricing.basePrice - b.pricing.basePrice;
          default:
            return 0;
        }
      });
    }
    
    // Paginación
    const page = filters.page || 1;
    const pageSize = filters.pageSize || APP_CONFIG.pagination.defaultPageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = filtered.slice(start, end);
    
    return {
      success: true,
      data: {
        providers: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  async getProviderById(id) {
    await this.simulateDelay();
    
    const provider = this.providers.find(p => p.id === id);
    
    if (!provider) {
      return {
        success: false,
        error: 'Proveedor no encontrado'
      };
    }
    
    return {
      success: true,
      data: provider
    };
  }

  async createProvider(providerData) {
    await this.simulateDelay();
    
    // Validaciones básicas
    if (!providerData.name || !providerData.category || !providerData.location) {
      return {
        success: false,
        error: 'Datos incompletos'
      };
    }
    
    const newProvider = {
      id: this.generateId(),
      ...providerData,
      status: 'active',
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.providers.push(newProvider);
    this.saveToStorage();
    
    return {
      success: true,
      data: newProvider
    };
  }

  async updateProvider(id, updateData) {
    await this.simulateDelay();
    
    const index = this.providers.findIndex(p => p.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Proveedor no encontrado'
      };
    }
    
    this.providers[index] = {
      ...this.providers[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.providers[index]
    };
  }

  async deleteProvider(id) {
    await this.simulateDelay();
    
    const index = this.providers.findIndex(p => p.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Proveedor no encontrado'
      };
    }
    
    // Verificar si tiene asignaciones activas
    const hasActiveAssignments = this.assignments.some(a =>
      a.status !== 'cancelled' &&
      a.providers.some(p => p.providerId === id)
    );
    
    if (hasActiveAssignments) {
      return {
        success: false,
        error: 'No se puede eliminar un proveedor con asignaciones activas'
      };
    }
    
    // Soft delete
    this.providers[index].status = 'inactive';
    this.providers[index].deletedAt = new Date().toISOString();
    
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  async toggleProviderStatus(id, status) {
    await this.simulateDelay();
    
    const index = this.providers.findIndex(p => p.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Proveedor no encontrado'
      };
    }
    
    this.providers[index].status = status;
    this.providers[index].updatedAt = new Date().toISOString();
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.providers[index]
    };
  }

  // Asignaciones
  async getAssignments(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.assignments];
    
    // Filtrar por tour
    if (filters.tourId) {
      filtered = filtered.filter(a => a.tourId === filters.tourId);
    }
    
    // Filtrar por fecha
    if (filters.dateFrom) {
      filtered = filtered.filter(a => a.date >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(a => a.date <= filters.dateTo);
    }
    
    // Filtrar por estado
    if (filters.status) {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    
    // Ordenar por fecha descendente
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
        assignments: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  async getAssignmentById(id) {
    await this.simulateDelay();
    
    const assignment = this.assignments.find(a => a.id === id);
    
    if (!assignment) {
      return {
        success: false,
        error: 'Asignación no encontrada'
      };
    }
    
    // Incluir información completa de proveedores
    const enrichedAssignment = {
      ...assignment,
      providers: assignment.providers.map(ap => {
        const provider = this.providers.find(p => p.id === ap.providerId);
        return {
          ...ap,
          providerDetails: provider
        };
      })
    };
    
    return {
      success: true,
      data: enrichedAssignment
    };
  }

  async createAssignment(assignmentData) {
    await this.simulateDelay();
    
    // Validaciones
    if (!assignmentData.tourId || !assignmentData.date || !assignmentData.providers?.length) {
      return {
        success: false,
        error: 'Datos incompletos'
      };
    }
    
    // Calcular costo total
    let totalCost = 0;
    for (const ap of assignmentData.providers) {
      const provider = this.providers.find(p => p.id === ap.providerId);
      if (provider) {
        totalCost += provider.pricing.basePrice;
      }
    }
    
    const newAssignment = {
      id: this.generateId('assignment'),
      ...assignmentData,
      status: 'draft',
      totalCost,
      currency: 'PEN',
      createdAt: new Date().toISOString(),
      createdBy: 'current-user' // En producción vendría del token
    };
    
    this.assignments.push(newAssignment);
    this.saveToStorage();
    
    return {
      success: true,
      data: newAssignment
    };
  }

  async updateAssignment(id, updateData) {
    await this.simulateDelay();
    
    const index = this.assignments.findIndex(a => a.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Asignación no encontrada'
      };
    }
    
    // Recalcular costo si se actualizan los proveedores
    if (updateData.providers) {
      let totalCost = 0;
      for (const ap of updateData.providers) {
        const provider = this.providers.find(p => p.id === ap.providerId);
        if (provider) {
          totalCost += provider.pricing.basePrice;
        }
      }
      updateData.totalCost = totalCost;
    }
    
    this.assignments[index] = {
      ...this.assignments[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.assignments[index]
    };
  }

  async confirmAssignment(id) {
    await this.simulateDelay();
    
    const index = this.assignments.findIndex(a => a.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Asignación no encontrada'
      };
    }
    
    if (this.assignments[index].status === 'confirmed') {
      return {
        success: false,
        error: 'La asignación ya está confirmada'
      };
    }
    
    this.assignments[index].status = 'confirmed';
    this.assignments[index].confirmedAt = new Date().toISOString();
    this.assignments[index].confirmedBy = 'current-user';
    
    // Marcar todos los proveedores como confirmados
    this.assignments[index].providers = this.assignments[index].providers.map(p => ({
      ...p,
      status: 'confirmed'
    }));
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.assignments[index]
    };
  }

  async cancelAssignment(id, reason = '') {
    await this.simulateDelay();
    
    const index = this.assignments.findIndex(a => a.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Asignación no encontrada'
      };
    }
    
    this.assignments[index].status = 'cancelled';
    this.assignments[index].cancelledAt = new Date().toISOString();
    this.assignments[index].cancelledBy = 'current-user';
    this.assignments[index].cancellationReason = reason;
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.assignments[index]
    };
  }

  // Búsqueda y filtros
  async searchProviders(query, filters = {}) {
    await this.simulateDelay();
    
    const allFilters = {
      ...filters,
      search: query
    };
    
    return this.getProviders(allFilters);
  }

  async getProvidersByLocationAndCategory(locationId, categoryId = null) {
    await this.simulateDelay();
    
    const filters = {
      location: locationId
    };
    
    if (categoryId) {
      filters.category = categoryId;
    }
    
    return this.getProviders(filters);
  }

  // Estadísticas
  async getProvidersStats() {
    await this.simulateDelay();
    
    const activeProviders = this.providers.filter(p => p.status === 'active');
    const totalAssignments = this.assignments.length;
    const confirmedAssignments = this.assignments.filter(a => a.status === 'confirmed').length;
    
    // Proveedores por categoría
    const providersByCategory = {};
    this.categories.forEach(cat => {
      providersByCategory[cat.name] = activeProviders.filter(p => p.category === cat.id).length;
    });
    
    // Proveedores por ubicación
    const providersByLocation = {};
    this.locations.forEach(loc => {
      providersByLocation[loc.name] = activeProviders.filter(p => p.location === loc.id).length;
    });
    
    // Top proveedores por rating
    const topProviders = activeProviders
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    
    // Costo promedio por asignación
    const totalCost = this.assignments.reduce((sum, a) => sum + (a.totalCost || 0), 0);
    const averageCost = totalAssignments > 0 ? totalCost / totalAssignments : 0;
    
    return {
      success: true,
      data: {
        totalProviders: this.providers.length,
        activeProviders: activeProviders.length,
        totalAssignments,
        confirmedAssignments,
        pendingAssignments: this.assignments.filter(a => a.status === 'draft').length,
        providersByCategory,
        providersByLocation,
        topProviders,
        averageCost,
        totalRevenue: totalCost
      }
    };
  }

  // Validaciones
  async checkProviderAvailability(providerId, date, startTime, endTime) {
    await this.simulateDelay();
    
    const provider = this.providers.find(p => p.id === providerId);
    
    if (!provider) {
      return {
        success: false,
        error: 'Proveedor no encontrado'
      };
    }
    
    // Verificar si tiene asignaciones en esa fecha/hora
    const conflicts = this.assignments.filter(a =>
      a.date === date &&
      a.status !== 'cancelled' &&
      a.providers.some(p =>
        p.providerId === providerId &&
        p.status !== 'cancelled' &&
        // Verificar solapamiento de horarios
        ((p.startTime >= startTime && p.startTime < endTime) ||
         (p.endTime > startTime && p.endTime <= endTime) ||
         (p.startTime <= startTime && p.endTime >= endTime))
      )
    );
    
    return {
      success: true,
      data: {
        available: conflicts.length === 0,
        conflicts: conflicts.map(a => ({
          assignmentId: a.id,
          tourName: a.tourName,
          time: `${a.providers.find(p => p.providerId === providerId).startTime} - ${a.providers.find(p => p.providerId === providerId).endTime}`
        }))
      }
    };
  }

  // Exportación
  async exportAssignmentPDF(assignmentId) {
    await this.simulateDelay();
    
    const result = await this.getAssignmentById(assignmentId);
    
    if (!result.success) {
      return result;
    }
    
    // En producción esto generaría un PDF real
    console.log('[MOCK] Generando PDF para asignación:', assignmentId);
    
    return {
      success: true,
      message: 'PDF generado exitosamente'
    };
  }

  async importProviders(file) {
    await this.simulateDelay(2000);
    
    // Simular importación
    console.log('[MOCK] Importando proveedores desde archivo:', file.name);
    
    return {
      success: true,
      data: {
        imported: 8,
        failed: 2,
        errors: [
          { row: 3, error: 'Categoría no válida' },
          { row: 7, error: 'Ubicación no encontrada' }
        ]
      }
    };
  }

  async exportProviders(filters = {}, format = 'excel') {
    await this.simulateDelay(1500);
    
    // Simular exportación
    console.log('[MOCK] Exportando proveedores en formato:', format, filters);
    
    return {
      success: true,
      message: `Proveedores exportados en formato ${format}`
    };
  }
}

export const mockProvidersService = new MockProvidersService();
export default mockProvidersService;