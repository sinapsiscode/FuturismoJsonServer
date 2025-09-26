/**
 * Servicio de tours
 * Maneja toda la lógica de tours con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockToursService } from './mockToursService';

class ToursService extends BaseService {
  constructor() {
    super('/tours');
  }

  /**
   * Obtener todos los tours
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getTours(filters = {}) {
    if (this.isUsingMockData) {
      return mockToursService.getTours(filters);
    }

    return this.get('', filters);
  }

  /**
   * Obtener tour por ID
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async getTourById(id) {
    if (this.isUsingMockData) {
      return mockToursService.getTourById(id);
    }

    return this.get(`/${id}`);
  }

  /**
   * Crear nuevo tour
   * @param {Object} tourData - Datos del tour
   * @returns {Promise<Object>}
   */
  async createTour(tourData) {
    if (this.isUsingMockData) {
      return mockToursService.createTour(tourData);
    }

    return this.post('', tourData);
  }

  /**
   * Actualizar tour
   * @param {string} id - ID del tour
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateTour(id, updateData) {
    if (this.isUsingMockData) {
      return mockToursService.updateTour(id, updateData);
    }

    return this.put(`/${id}`, updateData);
  }

  /**
   * Eliminar tour
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async deleteTour(id) {
    if (this.isUsingMockData) {
      return mockToursService.deleteTour(id);
    }

    return this.delete(`/${id}`);
  }

  /**
   * Cambiar estado del tour
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async toggleTourStatus(id) {
    if (this.isUsingMockData) {
      return mockToursService.toggleTourStatus(id);
    }

    return this.put(`/${id}/toggle-status`);
  }

  /**
   * Destacar/Quitar destacado del tour
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async toggleTourFeatured(id) {
    if (this.isUsingMockData) {
      return mockToursService.toggleTourFeatured(id);
    }

    return this.put(`/${id}/toggle-featured`);
  }

  /**
   * Obtener categorías de tours
   * @returns {Promise<Object>}
   */
  async getCategories() {
    if (this.isUsingMockData) {
      return mockToursService.getCategories();
    }

    return this.get('/categories');
  }

  /**
   * Obtener estadísticas de tours
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    if (this.isUsingMockData) {
      return mockToursService.getStatistics();
    }

    return this.get('/statistics');
  }

  /**
   * Obtener tours disponibles para una fecha
   * @param {Date} date - Fecha a consultar
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise<Object>}
   */
  async getAvailableTours(date, filters = {}) {
    if (this.isUsingMockData) {
      return mockToursService.getAvailableTours(date, filters);
    }

    return this.get('/available', { date: date.toISOString(), ...filters });
  }

  /**
   * Duplicar tour
   * @param {string} id - ID del tour a duplicar
   * @returns {Promise<Object>}
   */
  async duplicateTour(id) {
    if (this.isUsingMockData) {
      return mockToursService.duplicateTour(id);
    }

    return this.post(`/${id}/duplicate`);
  }

  /**
   * Obtener idiomas disponibles
   * @returns {Promise<Object>}
   */
  async getLanguages() {
    if (this.isUsingMockData) {
      // Mock: retornar idiomas comunes
      return {
        success: true,
        data: [
          { id: 'es', name: 'Español', code: 'ES' },
          { id: 'en', name: 'Inglés', code: 'EN' },
          { id: 'pt', name: 'Portugués', code: 'PT' },
          { id: 'fr', name: 'Francés', code: 'FR' },
          { id: 'de', name: 'Alemán', code: 'DE' },
          { id: 'it', name: 'Italiano', code: 'IT' },
          { id: 'ja', name: 'Japonés', code: 'JA' },
          { id: 'zh', name: 'Chino', code: 'ZH' }
        ]
      };
    }

    return this.get('/languages');
  }

  /**
   * Buscar tours por texto
   * @param {string} searchTerm - Término de búsqueda
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise<Object>}
   */
  async searchTours(searchTerm, filters = {}) {
    if (this.isUsingMockData) {
      return mockToursService.getTours({ ...filters, search: searchTerm });
    }

    return this.get('/search', { q: searchTerm, ...filters });
  }

  /**
   * Obtener itinerario detallado del tour
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async getTourItinerary(id) {
    if (this.isUsingMockData) {
      const tour = await mockToursService.getTourById(id);
      if (!tour.success) return tour;

      return {
        success: true,
        data: tour.data.itinerary || []
      };
    }

    return this.get(`/${id}/itinerary`);
  }

  /**
   * Actualizar itinerario del tour
   * @param {string} id - ID del tour
   * @param {Array} itinerary - Nuevo itinerario
   * @returns {Promise<Object>}
   */
  async updateTourItinerary(id, itinerary) {
    if (this.isUsingMockData) {
      return mockToursService.updateTour(id, { itinerary });
    }

    return this.put(`/${id}/itinerary`, { itinerary });
  }

  /**
   * Obtener precios especiales del tour
   * @param {string} id - ID del tour
   * @returns {Promise<Object>}
   */
  async getTourPricing(id) {
    if (this.isUsingMockData) {
      // Mock: generar precios especiales
      return {
        success: true,
        data: {
          basePrice: 100,
          childPrice: 70,
          groupPrice: 85,
          seasonalPrices: [
            { season: 'alta', price: 120, startDate: '2024-06-01', endDate: '2024-08-31' },
            { season: 'baja', price: 90, startDate: '2024-03-01', endDate: '2024-05-31' }
          ]
        }
      };
    }

    return this.get(`/${id}/pricing`);
  }

  /**
   * Actualizar precios del tour
   * @param {string} id - ID del tour
   * @param {Object} pricing - Nuevos precios
   * @returns {Promise<Object>}
   */
  async updateTourPricing(id, pricing) {
    if (this.isUsingMockData) {
      return mockToursService.updateTour(id, { pricing });
    }

    return this.put(`/${id}/pricing`, pricing);
  }

  /**
   * Obtener disponibilidad del tour
   * @param {string} id - ID del tour
   * @param {Date} startDate - Fecha inicial
   * @param {Date} endDate - Fecha final
   * @returns {Promise<Object>}
   */
  async getTourAvailability(id, startDate, endDate) {
    if (this.isUsingMockData) {
      // Mock: generar disponibilidad simulada
      const availability = [];
      const current = new Date(startDate);
      
      while (current <= endDate) {
        availability.push({
          date: current.toISOString().split('T')[0],
          available: Math.random() > 0.3,
          capacity: 20,
          booked: Math.floor(Math.random() * 15)
        });
        current.setDate(current.getDate() + 1);
      }

      return {
        success: true,
        data: availability
      };
    }

    return this.get(`/${id}/availability`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
  }

  /**
   * Importar tours desde archivo
   * @param {File} file - Archivo a importar
   * @returns {Promise<Object>}
   */
  async importTours(file) {
    if (this.isUsingMockData) {
      // Mock: simular importación exitosa
      return {
        success: true,
        data: {
          imported: 5,
          failed: 0,
          errors: []
        }
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    
    return this.post('/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * Exportar tours
   * @param {Object} filters - Filtros para exportación
   * @returns {Promise<Blob>}
   */
  async exportTours(filters = {}) {
    if (this.isUsingMockData) {
      // Mock: generar CSV simulado
      const tours = await mockToursService.getTours(filters);
      const csv = this.generateCSV(tours.data);
      return new Blob([csv], { type: 'text/csv' });
    }

    const response = await this.get('/export', filters, {
      responseType: 'blob'
    });

    return response.data;
  }

  /**
   * Verificar disponibilidad de guía para un tour
   * @param {string} tourId - ID del tour
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async checkGuideAvailability(tourId, guideId) {
    if (this.isUsingMockData) {
      return mockToursService.checkGuideAvailability(tourId, guideId);
    }

    return this.post(`/${tourId}/check-guide-availability`, { guideId });
  }

  /**
   * Verificar competencias del guía para un tour
   * @param {string} tourId - ID del tour
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async checkGuideCompetences(tourId, guideId) {
    if (this.isUsingMockData) {
      return mockToursService.checkGuideCompetences(tourId, guideId);
    }

    return this.post(`/${tourId}/check-guide-competences`, { guideId });
  }

  /**
   * Asignar guía a tour
   * @param {string} tourId - ID del tour
   * @param {string} guideId - ID del guía
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  async assignGuideToTour(tourId, guideId, options = {}) {
    if (this.isUsingMockData) {
      return mockToursService.assignGuideToTour(tourId, guideId, options);
    }

    return this.post(`/${tourId}/assign-guide`, { guideId, ...options });
  }

  /**
   * Asignar tour a agencia
   * @param {string} tourId - ID del tour
   * @param {string} agencyId - ID de la agencia
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  async assignTourToAgency(tourId, agencyId, options = {}) {
    if (this.isUsingMockData) {
      return mockToursService.assignTourToAgency(tourId, agencyId, options);
    }

    return this.post(`/${tourId}/assign-agency`, { agencyId, ...options });
  }

  /**
   * Obtener guías disponibles para un tour
   * @param {string} tourId - ID del tour
   * @param {string} date - Fecha del tour
   * @returns {Promise<Object>}
   */
  async getAvailableGuidesForTour(tourId, date) {
    if (this.isUsingMockData) {
      return mockToursService.getAvailableGuidesForTour(tourId, date);
    }

    return this.get(`/${tourId}/available-guides`, { date });
  }

  /**
   * Remover asignación de tour
   * @param {string} tourId - ID del tour
   * @param {string} assignmentType - Tipo de asignación ('guide' o 'agency')
   * @returns {Promise<Object>}
   */
  async removeAssignment(tourId, assignmentType = 'guide') {
    if (this.isUsingMockData) {
      return mockToursService.removeAssignment(tourId, assignmentType);
    }

    return this.delete(`/${tourId}/assignment/${assignmentType}`);
  }

  /**
   * Obtener tours asignados a un guía específico
   * @param {string} guideId - ID del guía
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getGuideTours(guideId, filters = {}) {
    if (this.isUsingMockData) {
      // Mock data para tours del guía
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Tour Lima Histórica',
            status: 'asignado',
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            tourists: 8,
            agency: 'Turismo Aventura',
            location: 'Plaza de Armas',
            estimatedDuration: '3 horas',
            isActive: false,
            guideId: guideId,
            checkpoints: [
              {
                id: 'cp-1',
                name: 'Plaza de Armas',
                description: 'Punto de encuentro inicial',
                location: { lat: -12.0464, lng: -77.0428 },
                order: 1,
                photoTaken: false,
                photoUrl: null,
                isRecommended: true
              },
              {
                id: 'cp-2', 
                name: 'Catedral de Lima',
                description: 'Visita a la catedral principal',
                location: { lat: -12.0458, lng: -77.0428 },
                order: 2,
                photoTaken: false,
                photoUrl: null,
                isRecommended: true
              },
              {
                id: 'cp-3',
                name: 'Palacio de Gobierno',
                description: 'Cambio de guardia',
                location: { lat: -12.0461, lng: -77.0434 },
                order: 3,
                photoTaken: false,
                photoUrl: null,
                isRecommended: true
              }
            ]
          },
          {
            id: 2,
            name: 'Tour Barranco Bohemio',
            status: 'asignado',
            date: new Date().toISOString().split('T')[0],
            time: '14:30',
            tourists: 6,
            agency: 'Lima Tours',
            location: 'Puente de los Suspiros',
            estimatedDuration: '2.5 horas',
            isActive: false,
            guideId: guideId,
            checkpoints: [
              {
                id: 'cp-4',
                name: 'Puente de los Suspiros',
                description: 'Icónico puente de Barranco',
                location: { lat: -12.1485, lng: -77.0203 },
                order: 1,
                photoTaken: false,
                photoUrl: null,
                isRecommended: true
              },
              {
                id: 'cp-5',
                name: 'Iglesia La Ermita',
                description: 'Iglesia histórica del distrito',
                location: { lat: -12.1489, lng: -77.0195 },
                order: 2,
                photoTaken: false,
                photoUrl: null,
                isRecommended: true
              }
            ]
          }
        ]
      };
    }

    return this.get('/guide-tours', { guideId, ...filters });
  }

  /**
   * Actualizar estado de tour del guía
   * @param {string} tourId - ID del tour
   * @param {string} status - Nuevo estado
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async updateTourStatus(tourId, status, guideId) {
    if (this.isUsingMockData) {
      return {
        success: true,
        data: {
          tourId,
          status,
          updatedAt: new Date().toISOString()
        }
      };
    }

    return this.put(`/${tourId}/status`, { status, guideId });
  }

  // Método auxiliar para generar CSV
  generateCSV(tours) {
    const headers = ['Código', 'Nombre', 'Categoría', 'Precio', 'Duración', 'Capacidad', 'Estado'];
    const rows = tours.map(tour => [
      tour.code,
      tour.name,
      tour.category,
      tour.price,
      tour.duration,
      tour.capacity,
      tour.status
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export const toursService = new ToursService();
export default toursService;