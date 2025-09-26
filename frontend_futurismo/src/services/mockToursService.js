/**
 * Servicio mock de tours
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';

// Tipos de tours
export const TOUR_TYPES = {
  REGULAR: 'regular',
  FULLDAY: 'fullday'
};

// Base de datos mock de tours
const MOCK_TOURS_DB = [
  {
    id: '1',
    code: 'TL001',
    name: 'City Tour Lima Histórica',
    description: 'Recorrido por el centro histórico de Lima, visitando los principales monumentos y museos',
    duration: 4,
    price: 35,
    capacity: 20,
    includes: ['Transporte', 'Guía profesional', 'Entradas a museos', 'Snack'],
    itinerary: [
      { time: '09:00', activity: 'Recojo en hotel' },
      { time: '09:30', activity: 'Plaza de Armas' },
      { time: '10:30', activity: 'Catedral de Lima' },
      { time: '11:30', activity: 'Palacio de Gobierno' },
      { time: '12:30', activity: 'Museo de Arte' },
      { time: '13:00', activity: 'Retorno al hotel' }
    ],
    images: ['/tours/lima-historica-1.jpg', '/tours/lima-historica-2.jpg'],
    rating: 4.8,
    reviews: 156,
    category: 'cultural',
    difficulty: 'fácil',
    languages: ['Español', 'Inglés', 'Portugués'],
    status: 'activo',
    featured: true,
    type: TOUR_TYPES.REGULAR,
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString()
  },
  {
    id: '2',
    code: 'TG001',
    name: 'Tour Gastronómico Miraflores',
    description: 'Experiencia culinaria por los mejores restaurantes y mercados de Miraflores',
    duration: 5,
    price: 65,
    capacity: 12,
    includes: ['Transporte', 'Guía gastronómico', 'Degustaciones', 'Bebidas'],
    itinerary: [
      { time: '11:00', activity: 'Mercado de Surquillo' },
      { time: '12:00', activity: 'Clase de ceviche' },
      { time: '13:00', activity: 'Almuerzo en restaurante 5 estrellas' },
      { time: '15:00', activity: 'Degustación de piscos' },
      { time: '16:00', activity: 'Dulces tradicionales' }
    ],
    images: ['/tours/gastronomico-1.jpg', '/tours/gastronomico-2.jpg'],
    rating: 4.9,
    reviews: 203,
    category: 'gastronómico',
    difficulty: 'fácil',
    languages: ['Español', 'Inglés'],
    status: 'activo',
    featured: true,
    type: TOUR_TYPES.REGULAR,
    createdAt: new Date('2023-02-20').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString()
  },
  {
    id: '3',
    code: 'IP001',
    name: 'Islas Palomino - Lobos Marinos',
    description: 'Aventura marina nadando con lobos marinos en las Islas Palomino',
    duration: 8,
    price: 85,
    capacity: 15,
    includes: ['Transporte', 'Embarcación', 'Traje de neopreno', 'Guía marino', 'Almuerzo', 'Seguro'],
    itinerary: [
      { time: '06:00', activity: 'Recojo en hotel' },
      { time: '07:00', activity: 'Llegada al Callao' },
      { time: '08:00', activity: 'Navegación a Islas Palomino' },
      { time: '10:00', activity: 'Nado con lobos marinos' },
      { time: '12:00', activity: 'Almuerzo a bordo' },
      { time: '14:00', activity: 'Retorno al puerto' }
    ],
    images: ['/tours/palomino-1.jpg', '/tours/palomino-2.jpg'],
    rating: 4.7,
    reviews: 342,
    category: 'aventura',
    difficulty: 'moderado',
    languages: ['Español', 'Inglés', 'Francés'],
    status: 'activo',
    featured: false,
    type: TOUR_TYPES.FULLDAY,
    createdAt: new Date('2023-03-10').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString()
  },
  {
    id: '4',
    code: 'PB001',
    name: 'Pachacámac y Barranco Bohemio',
    description: 'Visita al santuario arqueológico de Pachacámac y tour por el distrito bohemio de Barranco',
    duration: 6,
    price: 45,
    capacity: 18,
    includes: ['Transporte', 'Guía arqueológico', 'Entradas', 'Almuerzo'],
    itinerary: [
      { time: '09:00', activity: 'Recojo en hotel' },
      { time: '10:00', activity: 'Santuario de Pachacámac' },
      { time: '12:00', activity: 'Museo de sitio' },
      { time: '13:00', activity: 'Almuerzo tradicional' },
      { time: '14:30', activity: 'Tour por Barranco' },
      { time: '16:00', activity: 'Puente de los Suspiros' }
    ],
    images: ['/tours/pachacamac-1.jpg', '/tours/barranco-1.jpg'],
    rating: 4.6,
    reviews: 189,
    category: 'cultural',
    difficulty: 'fácil',
    languages: ['Español', 'Inglés'],
    status: 'activo',
    featured: false,
    type: TOUR_TYPES.REGULAR,
    createdAt: new Date('2023-04-15').toISOString(),
    updatedAt: new Date('2024-01-28').toISOString()
  }
];

// Categorías de tours
const TOUR_CATEGORIES = [
  { id: 'cultural', name: 'Cultural', icon: 'museum' },
  { id: 'gastronómico', name: 'Gastronómico', icon: 'restaurant' },
  { id: 'aventura', name: 'Aventura', icon: 'terrain' },
  { id: 'naturaleza', name: 'Naturaleza', icon: 'nature' },
  { id: 'histórico', name: 'Histórico', icon: 'account_balance' },
  { id: 'urbano', name: 'Urbano', icon: 'location_city' }
];

class MockToursService {
  constructor() {
    this.tours = [...MOCK_TOURS_DB];
    this.categories = [...TOUR_CATEGORIES];
    this.initializeStorage();
  }

  initializeStorage() {
    const toursKey = `${APP_CONFIG.storage.prefix}mock_tours`;
    const storedTours = localStorage.getItem(toursKey);
    
    if (storedTours) {
      try {
        this.tours = JSON.parse(storedTours);
      } catch (error) {
        console.warn('Error loading mock tours from storage:', error);
      }
    }
  }

  saveToStorage() {
    const toursKey = `${APP_CONFIG.storage.prefix}mock_tours`;
    localStorage.setItem(toursKey, JSON.stringify(this.tours));
  }

  async simulateDelay(ms = 300) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId() {
    return String(Date.now());
  }

  generateCode(category) {
    const prefix = category ? category.substring(0, 2).toUpperCase() : 'TR';
    const number = this.tours.filter(t => t.category === category).length + 1;
    return `${prefix}${String(number).padStart(3, '0')}`;
  }

  // Obtener todos los tours
  async getTours(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.tours];
    
    // Filtrar por categoría
    if (filters.category) {
      filtered = filtered.filter(tour => tour.category === filters.category);
    }
    
    // Filtrar por rango de precio
    if (filters.priceRange) {
      filtered = filtered.filter(tour => 
        tour.price >= filters.priceRange.min && 
        tour.price <= filters.priceRange.max
      );
    }
    
    // Filtrar por duración
    if (filters.duration) {
      filtered = filtered.filter(tour => tour.duration <= filters.duration);
    }
    
    // Filtrar por idioma
    if (filters.language) {
      filtered = filtered.filter(tour => tour.languages.includes(filters.language));
    }
    
    // Filtrar por dificultad
    if (filters.difficulty) {
      filtered = filtered.filter(tour => tour.difficulty === filters.difficulty);
    }
    
    // Filtrar por estado
    if (filters.status) {
      filtered = filtered.filter(tour => tour.status === filters.status);
    }
    
    // Filtrar por destacados
    if (filters.featured !== undefined) {
      filtered = filtered.filter(tour => tour.featured === filters.featured);
    }
    
    // Búsqueda por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(tour =>
        tour.name.toLowerCase().includes(searchTerm) ||
        tour.description.toLowerCase().includes(searchTerm) ||
        tour.code.toLowerCase().includes(searchTerm)
      );
    }
    
    // Ordenamiento
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'popularity':
            return b.reviews - a.reviews;
          case 'duration':
            return a.duration - b.duration;
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

  // Obtener tour por ID
  async getTourById(id) {
    await this.simulateDelay();
    
    const tour = this.tours.find(t => t.id === id);
    
    if (!tour) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }
    
    return {
      success: true,
      data: tour
    };
  }

  // Crear nuevo tour
  async createTour(tourData) {
    await this.simulateDelay();
    
    const newTour = {
      id: this.generateId(),
      code: this.generateCode(tourData.category),
      ...tourData,
      rating: 0,
      reviews: 0,
      status: 'activo',
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.tours.push(newTour);
    this.saveToStorage();
    
    return {
      success: true,
      data: newTour
    };
  }

  // Actualizar tour
  async updateTour(id, updates) {
    await this.simulateDelay();
    
    const index = this.tours.findIndex(t => t.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }
    
    this.tours[index] = {
      ...this.tours[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.tours[index]
    };
  }

  // Eliminar tour
  async deleteTour(id) {
    await this.simulateDelay();
    
    const index = this.tours.findIndex(t => t.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }
    
    this.tours.splice(index, 1);
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  // Cambiar estado del tour
  async toggleTourStatus(id) {
    await this.simulateDelay();
    
    const tour = this.tours.find(t => t.id === id);
    
    if (!tour) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }
    
    const newStatus = tour.status === 'activo' ? 'inactivo' : 'activo';
    
    return this.updateTour(id, { status: newStatus });
  }

  // Destacar/Quitar destacado del tour
  async toggleTourFeatured(id) {
    await this.simulateDelay();
    
    const tour = this.tours.find(t => t.id === id);
    
    if (!tour) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }
    
    return this.updateTour(id, { featured: !tour.featured });
  }

  // Obtener categorías
  async getCategories() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: this.categories
    };
  }

  // Obtener estadísticas de tours
  async getStatistics() {
    await this.simulateDelay();
    
    const stats = {
      total: this.tours.length,
      active: this.tours.filter(t => t.status === 'activo').length,
      featured: this.tours.filter(t => t.featured).length,
      byCategory: {},
      averagePrice: 0,
      averageRating: 0
    };
    
    // Estadísticas por categoría
    this.categories.forEach(cat => {
      stats.byCategory[cat.id] = this.tours.filter(t => t.category === cat.id).length;
    });
    
    // Promedios
    if (this.tours.length > 0) {
      stats.averagePrice = this.tours.reduce((sum, t) => sum + t.price, 0) / this.tours.length;
      const toursWithRating = this.tours.filter(t => t.rating > 0);
      if (toursWithRating.length > 0) {
        stats.averageRating = toursWithRating.reduce((sum, t) => sum + t.rating, 0) / toursWithRating.length;
      }
    }
    
    return {
      success: true,
      data: stats
    };
  }

  // Obtener tours disponibles para una fecha
  async getAvailableTours(date, filters = {}) {
    await this.simulateDelay();
    
    // En un sistema real, aquí se verificaría disponibilidad por fecha
    // Por ahora retornamos tours activos
    const activeFilters = {
      ...filters,
      status: 'activo'
    };
    
    return this.getTours(activeFilters);
  }

  // Duplicar tour
  async duplicateTour(id) {
    await this.simulateDelay();
    
    const tour = this.tours.find(t => t.id === id);
    
    if (!tour) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }
    
    const duplicatedTour = {
      ...tour,
      id: this.generateId(),
      code: this.generateCode(tour.category),
      name: `${tour.name} (Copia)`,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.tours.push(duplicatedTour);
    this.saveToStorage();
    
    return {
      success: true,
      data: duplicatedTour
    };
  }

  /**
   * Verificar disponibilidad de guía
   */
  async checkGuideAvailability(tourId, guideId) {
    await this.simulateNetworkDelay();
    
    const tour = this.tours.find(t => t.id === tourId);
    if (!tour) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }

    // Simular verificación de disponibilidad
    // En un sistema real, esto verificaría conflictos con otros tours
    const isAvailable = Math.random() > 0.2; // 80% de probabilidad de estar disponible
    const conflicts = !isAvailable ? ['Tour City Tour Lima - 09:00 a 13:00'] : [];

    return {
      success: true,
      data: {
        isAvailable,
        conflicts,
        guideId,
        tourId,
        date: tour.date || new Date().toISOString()
      }
    };
  }

  /**
   * Verificar competencias del guía
   */
  async checkGuideCompetences(tourId, guideId) {
    await this.simulateNetworkDelay();
    
    const tour = this.tours.find(t => t.id === tourId);
    if (!tour) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }

    // Simular verificación de competencias
    const hasRequiredCompetences = Math.random() > 0.1; // 90% de probabilidad de tener competencias
    const missingCompetences = !hasRequiredCompetences ? 
      ['Certificación en primeros auxilios', 'Licencia de guía turístico'] : [];

    return {
      success: true,
      data: {
        hasRequiredCompetences,
        missingCompetences,
        guideId,
        tourId
      }
    };
  }

  /**
   * Asignar guía a tour
   */
  async assignGuideToTour(tourId, guideId, options = {}) {
    await this.simulateNetworkDelay();
    
    const tour = this.tours.find(t => t.id === tourId);
    if (!tour) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }

    // Actualizar tour con asignación
    const updatedTour = {
      ...tour,
      assignedGuide: {
        id: guideId,
        name: `Guía ${guideId}`, // En un sistema real vendría del store de guías
        assignedAt: new Date().toISOString(),
        role: options.role || 'principal'
      },
      status: 'assigned',
      updatedAt: new Date().toISOString()
    };

    const index = this.tours.findIndex(t => t.id === tourId);
    this.tours[index] = updatedTour;
    this.saveToStorage();

    return {
      success: true,
      data: updatedTour
    };
  }

  /**
   * Asignar tour a agencia
   */
  async assignTourToAgency(tourId, agencyId, options = {}) {
    await this.simulateNetworkDelay();
    
    const tour = this.tours.find(t => t.id === tourId);
    if (!tour) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }

    // Actualizar tour con asignación de agencia
    const updatedTour = {
      ...tour,
      assignedAgency: {
        id: agencyId,
        name: `Agencia ${agencyId}`, // En un sistema real vendría del store de agencias
        assignedAt: new Date().toISOString(),
        commission: options.commission || 10,
        contractType: options.contractType || 'standard'
      },
      updatedAt: new Date().toISOString()
    };

    const index = this.tours.findIndex(t => t.id === tourId);
    this.tours[index] = updatedTour;
    this.saveToStorage();

    return {
      success: true,
      data: updatedTour
    };
  }

  /**
   * Obtener guías disponibles para un tour
   */
  async getAvailableGuidesForTour(tourId, date) {
    await this.simulateNetworkDelay();
    
    const tour = this.tours.find(t => t.id === tourId);
    if (!tour) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }

    // Simular lista de guías disponibles
    const availableGuides = [
      {
        id: '1',
        name: 'Juan Pérez',
        languages: ['Español', 'Inglés'],
        specialties: ['Cultural', 'Histórico'],
        rating: 4.8,
        toursCompleted: 156,
        availability: 'available'
      },
      {
        id: '2', 
        name: 'María García',
        languages: ['Español', 'Portugués', 'Inglés'],
        specialties: ['Gastronómico', 'Cultural'],
        rating: 4.9,
        toursCompleted: 203,
        availability: 'available'
      },
      {
        id: '3',
        name: 'Carlos López',
        languages: ['Español', 'Francés'],
        specialties: ['Aventura', 'Naturaleza'],
        rating: 4.7,
        toursCompleted: 98,
        availability: 'busy',
        busyUntil: '14:00'
      }
    ];

    return {
      success: true,
      data: {
        guides: availableGuides,
        tourId,
        date,
        totalAvailable: availableGuides.filter(g => g.availability === 'available').length
      }
    };
  }

  /**
   * Remover asignación
   */
  async removeAssignment(tourId, assignmentType = 'guide') {
    await this.simulateNetworkDelay();
    
    const tour = this.tours.find(t => t.id === tourId);
    if (!tour) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }

    // Remover asignación según tipo
    const updatedTour = { ...tour };
    
    if (assignmentType === 'guide') {
      delete updatedTour.assignedGuide;
      updatedTour.status = 'pending';
    } else if (assignmentType === 'agency') {
      delete updatedTour.assignedAgency;
    }
    
    updatedTour.updatedAt = new Date().toISOString();

    const index = this.tours.findIndex(t => t.id === tourId);
    this.tours[index] = updatedTour;
    this.saveToStorage();

    return {
      success: true,
      data: updatedTour
    };
  }
}

export const mockToursService = new MockToursService();
export default mockToursService;