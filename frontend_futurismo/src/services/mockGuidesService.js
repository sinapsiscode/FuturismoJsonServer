/**
 * Servicio mock de guías
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';
import {
  GUIDE_TYPES,
  GUIDE_STATUS_VALUES,
  LANGUAGE_LEVELS,
  EXPERTISE_LEVELS,
  COMMON_MUSEUMS
} from '../constants/guidesConstants';

// Base de datos mock de guías
const MOCK_GUIDES_DB = [
  {
    id: 'guide-001',
    fullName: 'María Elena Torres Vásquez',
    dni: '12345678',
    phone: '+51 987 654 321',
    email: 'maria.torres@futurismo.com',
    address: 'Av. Grau 123, Miraflores, Lima',
    guideType: GUIDE_TYPES.FREELANCE,
    specializations: {
      languages: [
        { code: 'es', level: LANGUAGE_LEVELS.NATIVE },
        { code: 'en', level: LANGUAGE_LEVELS.ADVANCED },
        { code: 'fr', level: LANGUAGE_LEVELS.INTERMEDIATE }
      ],
      museums: [
        { name: COMMON_MUSEUMS[0], expertise: EXPERTISE_LEVELS.EXPERT },
        { name: COMMON_MUSEUMS[1], expertise: EXPERTISE_LEVELS.ADVANCED },
        { name: COMMON_MUSEUMS[2], expertise: EXPERTISE_LEVELS.INTERMEDIATE }
      ]
    },
    stats: {
      toursCompleted: 156,
      yearsExperience: 5,
      rating: 4.8,
      certifications: 3
    },
    certifications: [
      {
        id: 'cert-001',
        name: 'Guía Oficial de Turismo',
        issuer: 'MINCETUR',
        issueDate: '2019-01-15',
        expiryDate: '2025-01-15',
        verified: true
      },
      {
        id: 'cert-002',
        name: 'Primeros Auxilios',
        issuer: 'Cruz Roja',
        issueDate: '2023-06-10',
        expiryDate: '2025-06-10',
        verified: true
      }
    ],
    availability: {
      monday: { available: true, startTime: '08:00', endTime: '18:00' },
      tuesday: { available: true, startTime: '08:00', endTime: '18:00' },
      wednesday: { available: true, startTime: '08:00', endTime: '18:00' },
      thursday: { available: true, startTime: '08:00', endTime: '18:00' },
      friday: { available: true, startTime: '08:00', endTime: '18:00' },
      saturday: { available: true, startTime: '09:00', endTime: '14:00' },
      sunday: { available: false }
    },
    status: GUIDE_STATUS_VALUES.ACTIVE,
    createdAt: '2019-03-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'guide-002',
    fullName: 'Carlos Alberto Mendoza Silva',
    dni: '87654321',
    phone: '+51 987 654 322',
    email: 'carlos.mendoza@futurismo.com',
    address: 'Jr. Lima 456, San Isidro, Lima',
    guideType: GUIDE_TYPES.PLANTA,
    specializations: {
      languages: [
        { code: 'es', level: LANGUAGE_LEVELS.NATIVE },
        { code: 'en', level: LANGUAGE_LEVELS.EXPERT },
        { code: 'de', level: LANGUAGE_LEVELS.ADVANCED }
      ],
      museums: [
        { name: COMMON_MUSEUMS[3], expertise: EXPERTISE_LEVELS.EXPERT },
        { name: COMMON_MUSEUMS[4], expertise: EXPERTISE_LEVELS.ADVANCED }
      ]
    },
    stats: {
      toursCompleted: 234,
      yearsExperience: 8,
      rating: 4.9,
      certifications: 5
    },
    certifications: [
      {
        id: 'cert-003',
        name: 'Guía de Alta Montaña',
        issuer: 'AGMP',
        issueDate: '2018-03-20',
        expiryDate: '2024-03-20',
        verified: true
      }
    ],
    availability: {
      monday: { available: true, startTime: '07:00', endTime: '19:00' },
      tuesday: { available: true, startTime: '07:00', endTime: '19:00' },
      wednesday: { available: true, startTime: '07:00', endTime: '19:00' },
      thursday: { available: true, startTime: '07:00', endTime: '19:00' },
      friday: { available: true, startTime: '07:00', endTime: '19:00' },
      saturday: { available: true, startTime: '08:00', endTime: '16:00' },
      sunday: { available: true, startTime: '08:00', endTime: '14:00' }
    },
    status: GUIDE_STATUS_VALUES.ACTIVE,
    createdAt: '2016-08-20T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  }
];

// Base de datos mock de tours asignados
const MOCK_GUIDE_TOURS_DB = [
  {
    id: 'tour-001',
    guideId: 'guide-001',
    tourName: 'City Tour Lima',
    date: '2024-03-15',
    time: '09:00',
    duration: 4,
    touristsCount: 15,
    status: 'completed'
  },
  {
    id: 'tour-002',
    guideId: 'guide-001',
    tourName: 'Museo Larco',
    date: '2024-03-16',
    time: '14:00',
    duration: 2,
    touristsCount: 8,
    status: 'pending'
  }
];

class MockGuidesService {
  constructor() {
    this.guides = [...MOCK_GUIDES_DB];
    this.tours = [...MOCK_GUIDE_TOURS_DB];
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_guides`;
    const toursKey = `${APP_CONFIG.storage.prefix}mock_guide_tours`;
    
    const storedGuides = localStorage.getItem(storageKey);
    const storedTours = localStorage.getItem(toursKey);
    
    if (storedGuides) {
      try {
        this.guides = JSON.parse(storedGuides);
      } catch (error) {
        console.warn('Error loading mock guides from storage:', error);
      }
    }
    
    if (storedTours) {
      try {
        this.tours = JSON.parse(storedTours);
      } catch (error) {
        console.warn('Error loading mock guide tours from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_guides`;
    const toursKey = `${APP_CONFIG.storage.prefix}mock_guide_tours`;
    
    localStorage.setItem(storageKey, JSON.stringify(this.guides));
    localStorage.setItem(toursKey, JSON.stringify(this.tours));
  }

  async simulateDelay(ms = 500) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId() {
    return `guide-${Date.now()}`;
  }

  async getGuides(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.guides];
    
    // Aplicar filtros
    if (filters.status) {
      filtered = filtered.filter(g => g.status === filters.status);
    }
    
    if (filters.guideType) {
      filtered = filtered.filter(g => g.guideType === filters.guideType);
    }
    
    if (filters.languages && filters.languages.length > 0) {
      filtered = filtered.filter(guide =>
        filters.languages.some(lang =>
          guide.specializations.languages.some(guideLang => guideLang.code === lang)
        )
      );
    }
    
    if (filters.museums && filters.museums.length > 0) {
      filtered = filtered.filter(guide =>
        filters.museums.some(museum =>
          guide.specializations.museums.some(guideMuseum => guideMuseum.name === museum)
        )
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(g =>
        g.fullName.toLowerCase().includes(searchTerm) ||
        g.email.toLowerCase().includes(searchTerm) ||
        g.dni.includes(searchTerm)
      );
    }
    
    // Ordenar
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.fullName.localeCompare(b.fullName);
          case 'rating':
            return b.stats.rating - a.stats.rating;
          case 'experience':
            return b.stats.yearsExperience - a.stats.yearsExperience;
          case 'tours':
            return b.stats.toursCompleted - a.stats.toursCompleted;
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

  async getGuideById(id) {
    await this.simulateDelay();
    
    const guide = this.guides.find(g => g.id === id);
    
    if (!guide) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    return {
      success: true,
      data: guide
    };
  }

  async createGuide(guideData) {
    await this.simulateDelay();
    
    // Verificar si el DNI ya existe
    if (this.guides.some(g => g.dni === guideData.dni)) {
      return {
        success: false,
        error: 'Ya existe un guía con este DNI'
      };
    }
    
    const newGuide = {
      id: this.generateId(),
      ...guideData,
      stats: {
        toursCompleted: 0,
        yearsExperience: 0,
        rating: 0,
        certifications: 0
      },
      certifications: [],
      status: GUIDE_STATUS_VALUES.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.guides.push(newGuide);
    this.saveToStorage();
    
    return {
      success: true,
      data: newGuide
    };
  }

  async updateGuide(id, updateData) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    // Verificar DNI único si se está actualizando
    if (updateData.dni && updateData.dni !== this.guides[index].dni) {
      if (this.guides.some(g => g.dni === updateData.dni)) {
        return {
          success: false,
          error: 'Ya existe un guía con este DNI'
        };
      }
    }
    
    this.guides[index] = {
      ...this.guides[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.guides[index]
    };
  }

  async deleteGuide(id) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    // Verificar si tiene tours asignados
    const hasActiveTours = this.tours.some(t => 
      t.guideId === id && t.status === 'pending'
    );
    
    if (hasActiveTours) {
      return {
        success: false,
        error: 'No se puede eliminar un guía con tours pendientes'
      };
    }
    
    this.guides.splice(index, 1);
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  async updateGuideStatus(id, status) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    this.guides[index].status = status;
    this.guides[index].updatedAt = new Date().toISOString();
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.guides[index]
    };
  }

  async getGuideAgenda(guideId, params = {}) {
    await this.simulateDelay();
    
    const guide = this.guides.find(g => g.id === guideId);
    
    if (!guide) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    // Filtrar tours del guía
    let guideTours = this.tours.filter(t => t.guideId === guideId);
    
    if (params.startDate) {
      guideTours = guideTours.filter(t => t.date >= params.startDate);
    }
    
    if (params.endDate) {
      guideTours = guideTours.filter(t => t.date <= params.endDate);
    }
    
    return {
      success: true,
      data: {
        guideId,
        availability: guide.availability,
        tours: guideTours
      }
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
    
    this.guides[index].availability = availability;
    this.guides[index].updatedAt = new Date().toISOString();
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.guides[index].availability
    };
  }

  async getGuideStats(guideId, params = {}) {
    await this.simulateDelay();
    
    const guide = this.guides.find(g => g.id === guideId);
    
    if (!guide) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    const guideTours = this.tours.filter(t => t.guideId === guideId);
    const completedTours = guideTours.filter(t => t.status === 'completed');
    
    const stats = {
      ...guide.stats,
      currentMonthTours: completedTours.filter(t => {
        const tourDate = new Date(t.date);
        const currentDate = new Date();
        return tourDate.getMonth() === currentDate.getMonth() &&
               tourDate.getFullYear() === currentDate.getFullYear();
      }).length,
      upcomingTours: guideTours.filter(t => t.status === 'pending').length,
      totalHours: completedTours.reduce((acc, t) => acc + t.duration, 0),
      averageTouristsPerTour: completedTours.length > 0
        ? completedTours.reduce((acc, t) => acc + t.touristsCount, 0) / completedTours.length
        : 0
    };
    
    return {
      success: true,
      data: stats
    };
  }

  async getGuideCertifications(guideId) {
    await this.simulateDelay();
    
    const guide = this.guides.find(g => g.id === guideId);
    
    if (!guide) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    return {
      success: true,
      data: guide.certifications || []
    };
  }

  async addGuideCertification(guideId, certification) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === guideId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    const newCertification = {
      id: `cert-${Date.now()}`,
      ...certification,
      createdAt: new Date().toISOString()
    };
    
    if (!this.guides[index].certifications) {
      this.guides[index].certifications = [];
    }
    
    this.guides[index].certifications.push(newCertification);
    this.guides[index].stats.certifications = this.guides[index].certifications.length;
    this.guides[index].updatedAt = new Date().toISOString();
    
    this.saveToStorage();
    
    return {
      success: true,
      data: newCertification
    };
  }

  async removeGuideCertification(guideId, certificationId) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === guideId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    if (!this.guides[index].certifications) {
      return {
        success: false,
        error: 'Certificación no encontrada'
      };
    }
    
    const certIndex = this.guides[index].certifications.findIndex(c => c.id === certificationId);
    
    if (certIndex === -1) {
      return {
        success: false,
        error: 'Certificación no encontrada'
      };
    }
    
    this.guides[index].certifications.splice(certIndex, 1);
    this.guides[index].stats.certifications = this.guides[index].certifications.length;
    this.guides[index].updatedAt = new Date().toISOString();
    
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  async getGuideTours(guideId, filters = {}) {
    await this.simulateDelay();
    
    let guideTours = this.tours.filter(t => t.guideId === guideId);
    
    // Aplicar filtros
    if (filters.status) {
      guideTours = guideTours.filter(t => t.status === filters.status);
    }
    
    if (filters.dateFrom) {
      guideTours = guideTours.filter(t => t.date >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      guideTours = guideTours.filter(t => t.date <= filters.dateTo);
    }
    
    // Ordenar por fecha descendente
    guideTours.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return {
      success: true,
      data: guideTours
    };
  }

  async updateGuideSpecialization(guideId, specialization) {
    await this.simulateDelay();
    
    const index = this.guides.findIndex(g => g.id === guideId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Guía no encontrado'
      };
    }
    
    this.guides[index].specializations = {
      ...this.guides[index].specializations,
      ...specialization
    };
    this.guides[index].updatedAt = new Date().toISOString();
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.guides[index].specializations
    };
  }

  async searchByCompetencies(requirements) {
    await this.simulateDelay();
    
    let results = [...this.guides];
    
    // Solo guías activos
    results = results.filter(g => g.status === GUIDE_STATUS_VALUES.ACTIVE);
    
    // Filtrar por idiomas
    if (requirements.languages && requirements.languages.length > 0) {
      results = results.filter(guide =>
        requirements.languages.every(lang =>
          guide.specializations.languages.some(guideLang =>
            guideLang.code === lang &&
            (guideLang.level === LANGUAGE_LEVELS.ADVANCED ||
             guideLang.level === LANGUAGE_LEVELS.EXPERT ||
             guideLang.level === LANGUAGE_LEVELS.NATIVE)
          )
        )
      );
    }
    
    // Filtrar por museos
    if (requirements.museums && requirements.museums.length > 0) {
      results = results.filter(guide =>
        requirements.museums.every(museum =>
          guide.specializations.museums.some(guideMuseum =>
            guideMuseum.name === museum &&
            (guideMuseum.expertise === EXPERTISE_LEVELS.ADVANCED ||
             guideMuseum.expertise === EXPERTISE_LEVELS.EXPERT)
          )
        )
      );
    }
    
    // Filtrar por tipo de guía
    if (requirements.guideType) {
      results = results.filter(g => g.guideType === requirements.guideType);
    }
    
    // Filtrar por rating mínimo
    if (requirements.minRating) {
      results = results.filter(g => g.stats.rating >= requirements.minRating);
    }
    
    // Ordenar por mejor match (rating y experiencia)
    results.sort((a, b) => {
      const scoreA = a.stats.rating + (a.stats.yearsExperience / 10);
      const scoreB = b.stats.rating + (b.stats.yearsExperience / 10);
      return scoreB - scoreA;
    });
    
    return {
      success: true,
      data: results
    };
  }

  async importGuides(file) {
    await this.simulateDelay(2000);
    
    // Simular importación
    console.log('[MOCK] Importando guías desde archivo:', file.name);
    
    return {
      success: true,
      data: {
        imported: 5,
        errors: 0,
        message: 'Guías importados exitosamente'
      }
    };
  }

  async exportGuides(filters = {}, format = 'excel') {
    await this.simulateDelay(1500);
    
    // Simular exportación
    console.log('[MOCK] Exportando guías en formato:', format, filters);
    
    return {
      success: true,
      message: `Guías exportados en formato ${format}`
    };
  }

  async getGuidesSummary() {
    await this.simulateDelay();
    
    const activeGuides = this.guides.filter(g => g.status === GUIDE_STATUS_VALUES.ACTIVE);
    const plantaGuides = this.guides.filter(g => g.guideType === GUIDE_TYPES.PLANTA);
    const freelanceGuides = this.guides.filter(g => g.guideType === GUIDE_TYPES.FREELANCE);
    
    const summary = {
      totalGuides: this.guides.length,
      activeGuides: activeGuides.length,
      inactiveGuides: this.guides.length - activeGuides.length,
      plantaGuides: plantaGuides.length,
      freelanceGuides: freelanceGuides.length,
      averageRating: activeGuides.reduce((acc, g) => acc + g.stats.rating, 0) / activeGuides.length || 0,
      totalTours: this.guides.reduce((acc, g) => acc + g.stats.toursCompleted, 0),
      totalCertifications: this.guides.reduce((acc, g) => acc + g.stats.certifications, 0),
      languageStats: this.calculateLanguageStats(),
      museumStats: this.calculateMuseumStats()
    };
    
    return {
      success: true,
      data: summary
    };
  }

  calculateLanguageStats() {
    const languageCount = {};
    
    this.guides.forEach(guide => {
      guide.specializations.languages.forEach(lang => {
        if (!languageCount[lang.code]) {
          languageCount[lang.code] = 0;
        }
        languageCount[lang.code]++;
      });
    });
    
    return languageCount;
  }

  calculateMuseumStats() {
    const museumCount = {};
    
    this.guides.forEach(guide => {
      guide.specializations.museums.forEach(museum => {
        if (!museumCount[museum.name]) {
          museumCount[museum.name] = 0;
        }
        museumCount[museum.name]++;
      });
    });
    
    return museumCount;
  }

  async checkGuidesAvailability(params) {
    await this.simulateDelay();
    
    const { date, time, duration, languages, museums } = params;
    
    // Filtrar guías disponibles
    let availableGuides = this.guides.filter(g => g.status === GUIDE_STATUS_VALUES.ACTIVE);
    
    // Filtrar por idiomas requeridos
    if (languages && languages.length > 0) {
      availableGuides = availableGuides.filter(guide =>
        languages.some(lang =>
          guide.specializations.languages.some(guideLang => guideLang.code === lang)
        )
      );
    }
    
    // Filtrar por museos requeridos
    if (museums && museums.length > 0) {
      availableGuides = availableGuides.filter(guide =>
        museums.some(museum =>
          guide.specializations.museums.some(guideMuseum => guideMuseum.name === museum)
        )
      );
    }
    
    // Verificar disponibilidad en la fecha/hora específica
    const dayOfWeek = new Date(date).toLocaleLowerCase('en-US', { weekday: 'long' });
    availableGuides = availableGuides.filter(guide => {
      const dayAvailability = guide.availability[dayOfWeek];
      if (!dayAvailability || !dayAvailability.available) return false;
      
      // Verificar horario
      const tourStartTime = parseInt(time.split(':')[0]);
      const tourEndTime = tourStartTime + duration;
      const guideStartTime = parseInt(dayAvailability.startTime.split(':')[0]);
      const guideEndTime = parseInt(dayAvailability.endTime.split(':')[0]);
      
      return tourStartTime >= guideStartTime && tourEndTime <= guideEndTime;
    });
    
    // Verificar que no tengan tours asignados en ese horario
    availableGuides = availableGuides.filter(guide => {
      const conflictingTours = this.tours.filter(tour =>
        tour.guideId === guide.id &&
        tour.date === date &&
        tour.status === 'pending'
      );
      
      return conflictingTours.length === 0;
    });
    
    return {
      success: true,
      data: {
        availableGuides: availableGuides.map(g => ({
          id: g.id,
          fullName: g.fullName,
          rating: g.stats.rating,
          languages: g.specializations.languages,
          museums: g.specializations.museums
        })),
        total: availableGuides.length
      }
    };
  }
}

export const mockGuidesService = new MockGuidesService();
export default mockGuidesService;