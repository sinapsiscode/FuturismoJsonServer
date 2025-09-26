/**
 * Servicio de agenda independiente para guías
 * Maneja toda la lógica de agenda personal y tours asignados
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mockIndependentAgendaService } from './mockIndependentAgendaService';

class IndependentAgendaService extends BaseService {
  constructor() {
    super('/agenda');
  }

  /**
   * Obtener eventos personales del guía
   * @param {string} guideId - ID del guía
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getPersonalEvents(guideId, filters = {}) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.getPersonalEvents(guideId, filters);
    }

    return this.get(`/guides/${guideId}/personal-events`, filters);
  }

  /**
   * Crear evento personal
   * @param {string} guideId - ID del guía
   * @param {Object} eventData - Datos del evento
   * @returns {Promise<Object>}
   */
  async createPersonalEvent(guideId, eventData) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.createPersonalEvent(guideId, eventData);
    }

    return this.post(`/guides/${guideId}/personal-events`, eventData);
  }

  /**
   * Actualizar evento personal
   * @param {string} guideId - ID del guía
   * @param {string} eventId - ID del evento
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updatePersonalEvent(guideId, eventId, updateData) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.updatePersonalEvent(guideId, eventId, updateData);
    }

    return this.put(`/guides/${guideId}/personal-events/${eventId}`, updateData);
  }

  /**
   * Eliminar evento personal
   * @param {string} guideId - ID del guía
   * @param {string} eventId - ID del evento
   * @returns {Promise<Object>}
   */
  async deletePersonalEvent(guideId, eventId) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.deletePersonalEvent(guideId, eventId);
    }

    return this.delete(`/guides/${guideId}/personal-events/${eventId}`);
  }

  /**
   * Marcar tiempo como ocupado
   * @param {string} guideId - ID del guía
   * @param {Object} timeSlotData - Datos del slot de tiempo
   * @returns {Promise<Object>}
   */
  async markTimeAsOccupied(guideId, timeSlotData) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.markTimeAsOccupied(guideId, timeSlotData);
    }

    return this.post(`/guides/${guideId}/occupied-time`, timeSlotData);
  }

  /**
   * Obtener tours asignados del guía
   * @param {string} guideId - ID del guía
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getAssignedTours(guideId, filters = {}) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.getAssignedTours(guideId, filters);
    }

    return this.get(`/guides/${guideId}/assigned-tours`, filters);
  }

  /**
   * Asignar tour a guía
   * @param {string} guideId - ID del guía
   * @param {Object} tourData - Datos del tour
   * @returns {Promise<Object>}
   */
  async assignTourToGuide(guideId, tourData) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.assignTourToGuide(guideId, tourData);
    }

    return this.post(`/guides/${guideId}/assigned-tours`, tourData);
  }

  /**
   * Actualizar tour asignado
   * @param {string} guideId - ID del guía
   * @param {string} tourId - ID del tour
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateAssignedTour(guideId, tourId, updateData) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.updateAssignedTour(guideId, tourId, updateData);
    }

    return this.put(`/guides/${guideId}/assigned-tours/${tourId}`, updateData);
  }

  /**
   * Remover tour asignado
   * @param {string} guideId - ID del guía
   * @param {string} tourId - ID del tour
   * @returns {Promise<Object>}
   */
  async removeAssignedTour(guideId, tourId) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.removeAssignedTour(guideId, tourId);
    }

    return this.delete(`/guides/${guideId}/assigned-tours/${tourId}`);
  }

  /**
   * Obtener horarios de trabajo del guía
   * @param {string} guideId - ID del guía
   * @returns {Promise<Object>}
   */
  async getWorkingHours(guideId) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.getWorkingHours(guideId);
    }

    return this.get(`/guides/${guideId}/working-hours`);
  }

  /**
   * Actualizar horarios de trabajo
   * @param {string} guideId - ID del guía
   * @param {Object} schedule - Horarios por día
   * @returns {Promise<Object>}
   */
  async updateWorkingHours(guideId, schedule) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.updateWorkingHours(guideId, schedule);
    }

    return this.put(`/guides/${guideId}/working-hours`, schedule);
  }

  /**
   * Obtener disponibilidad del guía para una fecha
   * @param {string} guideId - ID del guía
   * @param {string} date - Fecha a consultar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  async getGuideAvailability(guideId, date, options = {}) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.getGuideAvailability(guideId, date, options);
    }

    return this.get(`/guides/${guideId}/availability`, { date, ...options });
  }

  /**
   * Obtener disponibilidad de múltiples guías
   * @param {Array<string>} guideIds - IDs de los guías
   * @param {string} date - Fecha a consultar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>}
   */
  async getMultipleGuidesAvailability(guideIds, date, options = {}) {
    if (this.isUsingMockData) {
      // Mock: obtener disponibilidad de cada guía
      const availabilities = {};
      
      for (const guideId of guideIds) {
        const result = await mockIndependentAgendaService.getGuideAvailability(guideId, date, options);
        if (result.success) {
          availabilities[guideId] = result.data;
        }
      }
      
      return {
        success: true,
        data: availabilities
      };
    }

    return this.post('/guides/availability/multiple', {
      guideIds,
      date,
      ...options
    });
  }

  /**
   * Obtener agenda completa del guía
   * @param {string} guideId - ID del guía
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getGuideCompleteAgenda(guideId, filters = {}) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.getGuideCompleteAgenda(guideId, filters);
    }

    return this.get(`/guides/${guideId}/complete-agenda`, filters);
  }

  /**
   * Obtener estadísticas del guía
   * @param {string} guideId - ID del guía
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getGuideStats(guideId, filters = {}) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.getGuideStats(guideId, filters);
    }

    return this.get(`/guides/${guideId}/stats`, filters);
  }

  /**
   * Buscar slots disponibles para un tour
   * @param {Object} requirements - Requisitos del tour
   * @returns {Promise<Object>}
   */
  async findAvailableSlots(requirements) {
    if (this.isUsingMockData) {
      // Mock: buscar slots disponibles basado en requisitos
      const { date, duration, guideIds } = requirements;
      const availableGuides = [];
      
      for (const guideId of (guideIds || [])) {
        const availability = await mockIndependentAgendaService.getGuideAvailability(
          guideId, 
          date, 
          { minDuration: duration }
        );
        
        if (availability.success && availability.data.availableSlots.length > 0) {
          availableGuides.push({
            guideId,
            availableSlots: availability.data.availableSlots
          });
        }
      }
      
      return {
        success: true,
        data: availableGuides
      };
    }

    return this.post('/availability/search', requirements);
  }

  /**
   * Verificar conflictos de horario
   * @param {string} guideId - ID del guía
   * @param {Object} eventData - Datos del evento a verificar
   * @returns {Promise<Object>}
   */
  async checkScheduleConflicts(guideId, eventData) {
    if (this.isUsingMockData) {
      // Mock: verificar conflictos
      const { date, startTime, endTime } = eventData;
      const availability = await mockIndependentAgendaService.getGuideAvailability(guideId, date);
      
      if (!availability.success) return availability;
      
      const conflicts = availability.data.occupiedSlots.filter(slot => {
        if (slot.allDay) return true;
        
        // Verificar superposición de horarios
        const slotStart = new Date(`2000-01-01T${slot.startTime}`);
        const slotEnd = new Date(`2000-01-01T${slot.endTime}`);
        const eventStart = new Date(`2000-01-01T${startTime}`);
        const eventEnd = new Date(`2000-01-01T${endTime}`);
        
        return (eventStart < slotEnd && eventEnd > slotStart);
      });
      
      return {
        success: true,
        data: {
          hasConflicts: conflicts.length > 0,
          conflicts
        }
      };
    }

    return this.post(`/guides/${guideId}/check-conflicts`, eventData);
  }

  /**
   * Exportar agenda del guía
   * @param {string} guideId - ID del guía
   * @param {Object} options - Opciones de exportación
   * @returns {Promise<Object>}
   */
  async exportAgenda(guideId, options = {}) {
    if (this.isUsingMockData) {
      // Mock: generar datos para exportación
      const agenda = await mockIndependentAgendaService.getGuideCompleteAgenda(guideId, options);
      
      if (!agenda.success) return agenda;
      
      const format = options.format || 'ical';
      const filename = `agenda_${guideId}_${new Date().toISOString().split('T')[0]}.${format === 'ical' ? 'ics' : format}`;
      
      return {
        success: true,
        data: {
          filename,
          content: JSON.stringify(agenda.data, null, 2), // En producción sería el formato real
          mimeType: format === 'ical' ? 'text/calendar' : 'application/json'
        }
      };
    }

    return this.get(`/guides/${guideId}/export`, options);
  }

  /**
   * Sincronizar con calendario externo
   * @param {string} guideId - ID del guía
   * @param {Object} syncData - Datos de sincronización
   * @returns {Promise<Object>}
   */
  async syncWithExternalCalendar(guideId, syncData) {
    if (this.isUsingMockData) {
      // Mock: simular sincronización
      return {
        success: true,
        data: {
          synced: true,
          lastSync: new Date().toISOString(),
          eventsImported: 0,
          eventsExported: 0
        }
      };
    }

    return this.post(`/guides/${guideId}/sync`, syncData);
  }

  /**
   * Limpiar eventos antiguos
   * @param {string} guideId - ID del guía
   * @param {number} daysToKeep - Días a mantener
   * @returns {Promise<Object>}
   */
  async clearOldEvents(guideId, daysToKeep = 30) {
    if (this.isUsingMockData) {
      return mockIndependentAgendaService.clearOldEvents(guideId, daysToKeep);
    }

    return this.delete(`/guides/${guideId}/events/old`, { daysToKeep });
  }

  /**
   * Obtener plantillas de eventos
   * @returns {Promise<Object>}
   */
  async getEventTemplates() {
    if (this.isUsingMockData) {
      return {
        success: true,
        data: [
          {
            id: 'template-001',
            name: 'Día libre',
            type: 'personal',
            allDay: true,
            description: 'Día personal completo'
          },
          {
            id: 'template-002',
            name: 'Cita médica',
            type: 'personal',
            duration: 90,
            description: 'Cita médica rutinaria'
          },
          {
            id: 'template-003',
            name: 'Capacitación',
            type: 'personal',
            duration: 240,
            description: 'Sesión de capacitación'
          }
        ]
      };
    }

    return this.get('/event-templates');
  }
}

export const independentAgendaService = new IndependentAgendaService();
export default independentAgendaService;