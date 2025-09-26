/**
 * Servicio mock de marketplace
 * Simula las respuestas del backend para desarrollo
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import {
  WORK_ZONES,
  TOUR_TYPES,
  GROUP_TYPES,
  LANGUAGE_LEVELS,
  EXPERIENCE_LEVELS,
  DEFAULT_PRICING,
  AVAILABILITY_CONFIG,
  RATING_CATEGORIES,
  AVATAR_CONFIG,
  COMMON_CERTIFICATIONS
} from '../constants/marketplaceConstants';

// Base de datos mock de guías freelance
const MOCK_FREELANCE_GUIDES_DB = [
  {
    id: 'guide-001',
    fullName: 'María Elena Torres Vásquez',
    dni: '12345678',
    phone: '+51 987 654 321',
    email: 'freelance@test.com',
    address: 'Av. Grau 123, Cusco',
    guideType: 'freelance',
    
    profile: {
      avatar: `${AVATAR_CONFIG.BASE_URL}?name=Maria+Torres&background=${AVATAR_CONFIG.DEFAULT_PARAMS.BACKGROUND}&color=${AVATAR_CONFIG.DEFAULT_PARAMS.COLOR}`,
      bio: 'Guía profesional con 5 años de experiencia en tours culturales y gastronómicos. Especializada en historia Inca y cocina tradicional cusqueña.',
      photos: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3'
      ],
      videoPresentation: 'https://youtube.com/watch?v=example'
    },
    
    specializations: {
      languages: [
        { code: 'es', level: LANGUAGE_LEVELS.NATIVE, certified: true, certificationDate: '2019-01-15' },
        { code: 'en', level: LANGUAGE_LEVELS.ADVANCED, certified: true, certificationDate: '2020-03-20' },
        { code: 'fr', level: LANGUAGE_LEVELS.INTERMEDIATE, certified: false }
      ],
      tourTypes: ['cultural', 'gastronomico'],
      workZones: ['cusco-ciudad', 'valle-sagrado'],
      museums: ['larco', 'national', 'art'],
      museumRatings: {
        larco: 5,
        national: 4,
        art: 5
      },
      groupExperience: {
        children: { level: EXPERIENCE_LEVELS.EXPERT, yearsExperience: 3 },
        schools: { level: EXPERIENCE_LEVELS.INTERMEDIATE, yearsExperience: 2 },
        elderly: { level: EXPERIENCE_LEVELS.EXPERT, yearsExperience: 4 },
        corporate: { level: EXPERIENCE_LEVELS.BASIC, yearsExperience: 1 },
        vip: { level: EXPERIENCE_LEVELS.INTERMEDIATE, yearsExperience: 2 },
        specialNeeds: { level: EXPERIENCE_LEVELS.BASIC, yearsExperience: 1 }
      }
    },
    
    certifications: [
      {
        id: 'cert001',
        name: COMMON_CERTIFICATIONS.OFFICIAL_GUIDE,
        issuer: 'MINCETUR',
        issueDate: '2019-01-15',
        expiryDate: '2025-01-15',
        verified: true
      },
      {
        id: 'cert002',
        name: COMMON_CERTIFICATIONS.FIRST_AID,
        issuer: 'Cruz Roja',
        issueDate: '2023-06-10',
        expiryDate: '2025-06-10',
        verified: true
      }
    ],
    
    availability: {
      calendar: {},
      workingDays: AVAILABILITY_CONFIG.DEFAULT_WORKING_DAYS,
      advanceBooking: AVAILABILITY_CONFIG.DEFAULT_ADVANCE_BOOKING_DAYS
    },
    
    pricing: {
      hourlyRate: DEFAULT_PRICING.HOURLY_RATE,
      fullDayRate: DEFAULT_PRICING.FULL_DAY_RATE,
      halfDayRate: DEFAULT_PRICING.HALF_DAY_RATE,
      specialRates: [
        { groupType: 'vip', rate: DEFAULT_PRICING.VIP_RATE },
        { groupType: 'children', rate: DEFAULT_PRICING.CHILDREN_RATE }
      ]
    },
    
    marketplaceStats: {
      totalBookings: 156,
      completedServices: 150,
      cancelledServices: 6,
      responseTime: 30,
      acceptanceRate: 85,
      repeatClients: 45,
      totalEarnings: 25000,
      joinedDate: '2019-03-15'
    },
    
    ratings: {
      overall: 4.8,
      communication: 4.9,
      knowledge: 4.8,
      punctuality: 4.7,
      professionalism: 4.9,
      valueForMoney: 4.6,
      totalReviews: 89
    },
    
    preferences: {
      maxGroupSize: AVAILABILITY_CONFIG.MAX_GROUP_SIZE,
      minBookingHours: 2,
      cancellationPolicy: '24 horas de anticipación',
      instantBooking: true,
      requiresDeposit: true,
      depositPercentage: 30
    },
    
    marketplaceStatus: {
      active: true,
      verified: true,
      featured: true,
      suspendedUntil: null
    }
  }
];

// Base de datos mock de solicitudes de servicio
const MOCK_SERVICE_REQUESTS_DB = [];

// Base de datos mock de reseñas
const MOCK_REVIEWS_DB = [];

class MockMarketplaceService extends BaseService {
  constructor() {
    super();
    this.guides = [...MOCK_FREELANCE_GUIDES_DB];
    this.serviceRequests = [...MOCK_SERVICE_REQUESTS_DB];
    this.reviews = [...MOCK_REVIEWS_DB];
    this.initializeStorage();
  }

  initializeStorage() {
    const storagePrefix = APP_CONFIG.storage.prefix;
    
    // Cargar guías
    const guidesKey = `${storagePrefix}mock_marketplace_guides`;
    const storedGuides = localStorage.getItem(guidesKey);
    if (storedGuides) {
      try {
        this.guides = JSON.parse(storedGuides);
      } catch (error) {
        console.warn('Error loading mock guides:', error);
      }
    }
    
    // Cargar solicitudes
    const requestsKey = `${storagePrefix}mock_service_requests`;
    const storedRequests = localStorage.getItem(requestsKey);
    if (storedRequests) {
      try {
        this.serviceRequests = JSON.parse(storedRequests);
      } catch (error) {
        console.warn('Error loading mock service requests:', error);
      }
    }
    
    // Cargar reseñas
    const reviewsKey = `${storagePrefix}mock_reviews`;
    const storedReviews = localStorage.getItem(reviewsKey);
    if (storedReviews) {
      try {
        this.reviews = JSON.parse(storedReviews);
      } catch (error) {
        console.warn('Error loading mock reviews:', error);
      }
    }
  }

  saveToStorage() {
    const storagePrefix = APP_CONFIG.storage.prefix;
    
    localStorage.setItem(
      `${storagePrefix}mock_marketplace_guides`,
      JSON.stringify(this.guides)
    );
    localStorage.setItem(
      `${storagePrefix}mock_service_requests`,
      JSON.stringify(this.serviceRequests)
    );
    localStorage.setItem(
      `${storagePrefix}mock_reviews`,
      JSON.stringify(this.reviews)
    );
  }

  async simulateDelay(ms = 500) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  async getFreelanceGuides(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.guides];
    
    // Aplicar filtros
    if (filters.languages && filters.languages.length > 0) {
      filtered = filtered.filter(guide =>
        filters.languages.some(lang =>
          guide.specializations.languages.some(guideLang => guideLang.code === lang)
        )
      );
    }
    
    if (filters.tourTypes && filters.tourTypes.length > 0) {
      filtered = filtered.filter(guide =>
        filters.tourTypes.some(type =>
          guide.specializations.tourTypes.includes(type)
        )
      );
    }
    
    if (filters.workZones && filters.workZones.length > 0) {
      filtered = filtered.filter(guide =>
        filters.workZones.some(zone =>
          guide.specializations.workZones.includes(zone)
        )
      );
    }
    
    if (filters.minRating) {
      filtered = filtered.filter(guide => guide.ratings.overall >= filters.minRating);
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(guide => guide.pricing.hourlyRate <= filters.maxPrice);
    }
    
    if (filters.instantBooking) {
      filtered = filtered.filter(guide => guide.preferences.instantBooking);
    }
    
    if (filters.verified) {
      filtered = filtered.filter(guide => guide.marketplaceStatus.verified);
    }
    
    // Ordenar
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating':
            return b.ratings.overall - a.ratings.overall;
          case 'price':
            return a.pricing.hourlyRate - b.pricing.hourlyRate;
          case 'experience':
            return b.marketplaceStats.totalBookings - a.marketplaceStats.totalBookings;
          case 'reviews':
            return b.ratings.totalReviews - a.ratings.totalReviews;
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
        guides: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  async getGuideProfile(guideId) {
    await this.simulateDelay();
    
    const guide = this.guides.find(g => g.id === guideId);
    
    if (!guide) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    // Incluir reseñas recientes
    const recentReviews = this.reviews
      .filter(r => r.guideId === guideId)
      .sort((a, b) => new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt))
      .slice(0, 5);
    
    return {
      success: true,
      data: {
        ...guide,
        recentReviews
      }
    };
  }

  async getGuideAvailability(guideId, params = {}) {
    await this.simulateDelay();
    
    const guide = this.guides.find(g => g.id === guideId);
    
    if (!guide) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    // Simular disponibilidad
    const availability = {
      guideId,
      calendar: guide.availability.calendar || {},
      workingDays: guide.availability.workingDays,
      advanceBooking: guide.availability.advanceBooking,
      blockedDates: [],
      specialDates: []
    };
    
    return {
      success: true,
      data: availability
    };
  }

  async updateGuideAvailability(guideId, availability) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === guideId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    this.guides[index].availability = {
      ...this.guides[index].availability,
      ...availability
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.guides[index].availability
    };
  }

  async getGuideReviews(guideId, params = {}) {
    await this.simulateDelay();
    
    const guideReviews = this.reviews.filter(r => r.guideId === guideId);
    
    // Ordenar por fecha
    guideReviews.sort((a, b) => 
      new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt)
    );
    
    // Paginación
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedReviews = guideReviews.slice(start, end);
    
    return {
      success: true,
      data: {
        reviews: paginatedReviews,
        total: guideReviews.length,
        page,
        pageSize,
        totalPages: Math.ceil(guideReviews.length / pageSize)
      }
    };
  }

  async createServiceRequest(requestData) {
    await this.simulateDelay();
    
    const newRequest = {
      id: `req-${Date.now()}`,
      requestCode: `SR-2024-${String(this.serviceRequests.length + 1).padStart(3, '0')}`,
      ...requestData,
      status: 'pending',
      timeline: {
        requestedAt: new Date().toISOString()
      },
      messages: []
    };
    
    this.serviceRequests.push(newRequest);
    this.saveToStorage();
    
    return {
      success: true,
      data: newRequest
    };
  }

  async getServiceRequests(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.serviceRequests];
    
    // Aplicar filtros
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    
    if (filters.guideId) {
      filtered = filtered.filter(r => r.guideId === filters.guideId);
    }
    
    if (filters.agencyId) {
      filtered = filtered.filter(r => r.agencyId === filters.agencyId);
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(r => 
        new Date(r.serviceDetails.date) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(r => 
        new Date(r.serviceDetails.date) <= new Date(filters.dateTo)
      );
    }
    
    // Ordenar por fecha de solicitud descendente
    filtered.sort((a, b) => 
      new Date(b.timeline.requestedAt) - new Date(a.timeline.requestedAt)
    );
    
    return {
      success: true,
      data: filtered
    };
  }

  async getServiceRequestById(requestId) {
    await this.simulateDelay();
    
    const request = this.serviceRequests.find(r => r.id === requestId);
    
    if (!request) {
      return {
        success: false,
        error: 'Solicitud no encontrada'
      };
    }
    
    return {
      success: true,
      data: request
    };
  }

  async updateServiceRequest(requestId, updates) {
    await this.simulateDelay();
    
    const index = this.serviceRequests.findIndex(r => r.id === requestId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Solicitud no encontrada'
      };
    }
    
    this.serviceRequests[index] = {
      ...this.serviceRequests[index],
      ...updates,
      timeline: {
        ...this.serviceRequests[index].timeline,
        updatedAt: new Date().toISOString()
      }
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.serviceRequests[index]
    };
  }

  async respondToServiceRequest(requestId, response) {
    await this.simulateDelay();
    
    const index = this.serviceRequests.findIndex(r => r.id === requestId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Solicitud no encontrada'
      };
    }
    
    const status = response.accepted ? 'accepted' : 'rejected';
    
    this.serviceRequests[index] = {
      ...this.serviceRequests[index],
      status,
      timeline: {
        ...this.serviceRequests[index].timeline,
        respondedAt: new Date().toISOString(),
        acceptedAt: response.accepted ? new Date().toISOString() : null
      },
      pricing: {
        ...this.serviceRequests[index].pricing,
        finalRate: response.proposedRate || this.serviceRequests[index].pricing.proposedRate
      },
      messages: [
        ...this.serviceRequests[index].messages,
        {
          from: 'guide',
          message: response.message,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.serviceRequests[index]
    };
  }

  async cancelServiceRequest(requestId, reason) {
    await this.simulateDelay();
    
    const index = this.serviceRequests.findIndex(r => r.id === requestId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Solicitud no encontrada'
      };
    }
    
    this.serviceRequests[index] = {
      ...this.serviceRequests[index],
      status: 'cancelled',
      cancellationReason: reason,
      timeline: {
        ...this.serviceRequests[index].timeline,
        cancelledAt: new Date().toISOString()
      }
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.serviceRequests[index]
    };
  }

  async completeService(requestId, completionData) {
    await this.simulateDelay();
    
    const index = this.serviceRequests.findIndex(r => r.id === requestId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Solicitud no encontrada'
      };
    }
    
    this.serviceRequests[index] = {
      ...this.serviceRequests[index],
      status: 'completed',
      completion: completionData,
      timeline: {
        ...this.serviceRequests[index].timeline,
        completedAt: new Date().toISOString()
      }
    };
    
    // Actualizar estadísticas del guía
    const guideIndex = this.guides.findIndex(g => g.id === this.serviceRequests[index].guideId);
    if (guideIndex !== -1) {
      this.guides[guideIndex].marketplaceStats.completedServices++;
      this.guides[guideIndex].marketplaceStats.totalBookings++;
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.serviceRequests[index]
    };
  }

  async createReview(reviewData) {
    await this.simulateDelay();
    
    const newReview = {
      id: `review-${Date.now()}`,
      ...reviewData,
      metadata: {
        ...reviewData.metadata,
        verified: true,
        helpful: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    this.reviews.push(newReview);
    
    // Actualizar rating del guía
    const guideIndex = this.guides.findIndex(g => g.id === reviewData.guideId);
    if (guideIndex !== -1) {
      const guideReviews = this.reviews.filter(r => r.guideId === reviewData.guideId);
      const totalReviews = guideReviews.length;
      
      // Calcular promedios
      const ratings = RATING_CATEGORIES.reduce((acc, category) => {
        const sum = guideReviews.reduce((s, r) => s + r.ratings[category], 0);
        acc[category] = sum / totalReviews;
        return acc;
      }, {});
      
      this.guides[guideIndex].ratings = {
        ...ratings,
        totalReviews
      };
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: newReview
    };
  }

  async respondToReview(reviewId, response) {
    await this.simulateDelay();
    
    const index = this.reviews.findIndex(r => r.id === reviewId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Reseña no encontrada'
      };
    }
    
    this.reviews[index].response = {
      content: response,
      timestamp: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.reviews[index]
    };
  }

  async markReviewHelpful(reviewId) {
    await this.simulateDelay();
    
    const index = this.reviews.findIndex(r => r.id === reviewId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Reseña no encontrada'
      };
    }
    
    this.reviews[index].metadata.helpful++;
    this.saveToStorage();
    
    return {
      success: true,
      data: {
        helpful: this.reviews[index].metadata.helpful
      }
    };
  }

  async getMarketplaceStats() {
    await this.simulateDelay();
    
    const activeGuides = this.guides.filter(g => g.marketplaceStatus.active);
    const verifiedGuides = this.guides.filter(g => g.marketplaceStatus.verified);
    const completedRequests = this.serviceRequests.filter(r => r.status === 'completed');
    
    const stats = {
      totalGuides: this.guides.length,
      activeGuides: activeGuides.length,
      verifiedGuides: verifiedGuides.length,
      featuredGuides: this.guides.filter(g => g.marketplaceStatus.featured).length,
      totalRequests: this.serviceRequests.length,
      completedRequests: completedRequests.length,
      pendingRequests: this.serviceRequests.filter(r => r.status === 'pending').length,
      totalReviews: this.reviews.length,
      averageRating: activeGuides.reduce((acc, g) => acc + g.ratings.overall, 0) / activeGuides.length || 0,
      totalRevenue: completedRequests.reduce((acc, r) => acc + (r.pricing.finalRate || 0), 0)
    };
    
    return {
      success: true,
      data: stats
    };
  }

  async getGuideStats(guideId) {
    await this.simulateDelay();
    
    const guide = this.guides.find(g => g.id === guideId);
    
    if (!guide) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    const guideRequests = this.serviceRequests.filter(r => r.guideId === guideId);
    const completedRequests = guideRequests.filter(r => r.status === 'completed');
    const guideReviews = this.reviews.filter(r => r.guideId === guideId);
    
    const stats = {
      ...guide.marketplaceStats,
      currentMonthBookings: completedRequests.filter(r => {
        const requestDate = new Date(r.timeline.completedAt);
        const currentDate = new Date();
        return requestDate.getMonth() === currentDate.getMonth() &&
               requestDate.getFullYear() === currentDate.getFullYear();
      }).length,
      averageServiceDuration: completedRequests.reduce((acc, r) => 
        acc + r.serviceDetails.duration, 0
      ) / completedRequests.length || 0,
      topTourTypes: guide.specializations.tourTypes.slice(0, 3),
      clientSatisfaction: guide.ratings.overall,
      recentReviews: guideReviews.slice(0, 5)
    };
    
    return {
      success: true,
      data: stats
    };
  }

  async updateGuideMarketplaceProfile(guideId, profileData) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === guideId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    this.guides[index] = {
      ...this.guides[index],
      ...profileData,
      profile: {
        ...this.guides[index].profile,
        ...(profileData.profile || {})
      },
      specializations: {
        ...this.guides[index].specializations,
        ...(profileData.specializations || {})
      }
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.guides[index]
    };
  }

  async updateGuidePricing(guideId, pricing) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === guideId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    this.guides[index].pricing = {
      ...this.guides[index].pricing,
      ...pricing
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.guides[index].pricing
    };
  }

  async verifyGuide(guideId, verificationData) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === guideId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    this.guides[index].marketplaceStatus.verified = true;
    this.guides[index].marketplaceStatus.verificationDate = new Date().toISOString();
    this.guides[index].marketplaceStatus.verificationDocuments = verificationData.documents || [];
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.guides[index].marketplaceStatus
    };
  }

  async suspendGuide(guideId, suspensionData) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === guideId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    this.guides[index].marketplaceStatus.active = false;
    this.guides[index].marketplaceStatus.suspendedUntil = suspensionData.until;
    this.guides[index].marketplaceStatus.suspensionReason = suspensionData.reason;
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.guides[index].marketplaceStatus
    };
  }

  async reactivateGuide(guideId) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === guideId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    this.guides[index].marketplaceStatus.active = true;
    this.guides[index].marketplaceStatus.suspendedUntil = null;
    this.guides[index].marketplaceStatus.suspensionReason = null;
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.guides[index].marketplaceStatus
    };
  }

  async getFeaturedGuides() {
    await this.simulateDelay();
    
    const featured = this.guides.filter(g => 
      g.marketplaceStatus.active && 
      g.marketplaceStatus.featured
    );
    
    return {
      success: true,
      data: featured
    };
  }

  async searchGuidesByCompetencies(requirements) {
    await this.simulateDelay();
    
    let results = [...this.guides];
    
    // Filtrar por museos
    if (requirements.museums && requirements.museums.length > 0) {
      results = results.filter(guide =>
        requirements.museums.every(museum =>
          guide.specializations.museums.includes(museum) &&
          guide.specializations.museumRatings[museum] >= 4
        )
      );
    }
    
    // Filtrar por idiomas
    if (requirements.languages && requirements.languages.length > 0) {
      results = results.filter(guide =>
        requirements.languages.every(lang =>
          guide.specializations.languages.some(guideLang => 
            guideLang.code === lang && 
            (guideLang.level === LANGUAGE_LEVELS.ADVANCED || 
             guideLang.level === LANGUAGE_LEVELS.NATIVE)
          )
        )
      );
    }
    
    // Filtrar por tipos de tour
    if (requirements.tourTypes && requirements.tourTypes.length > 0) {
      results = results.filter(guide =>
        requirements.tourTypes.every(type =>
          guide.specializations.tourTypes.includes(type)
        )
      );
    }
    
    // Filtrar por experiencia con grupos
    if (requirements.groupType) {
      results = results.filter(guide =>
        guide.specializations.groupExperience[requirements.groupType] &&
        guide.specializations.groupExperience[requirements.groupType].level !== EXPERIENCE_LEVELS.BASIC
      );
    }
    
    // Ordenar por mejor match
    results.sort((a, b) => {
      const scoreA = a.ratings.overall + (a.marketplaceStatus.verified ? 0.5 : 0);
      const scoreB = b.ratings.overall + (b.marketplaceStatus.verified ? 0.5 : 0);
      return scoreB - scoreA;
    });
    
    return {
      success: true,
      data: results
    };
  }
}

export const mockMarketplaceService = new MockMarketplaceService();
export default mockMarketplaceService;