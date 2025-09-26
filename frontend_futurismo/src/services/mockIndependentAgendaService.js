/**
 * Servicio mock de agenda independiente para guías
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';
import { format, addDays, subDays, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Constantes
const VISIBILITY_LEVELS = {
  PRIVATE: 'private',        // Solo el guía lo ve
  OCCUPIED: 'occupied',      // Admin ve "ocupado" sin detalles  
  COMPANY: 'company',        // Todos ven detalles (tours oficiales)
  PUBLIC: 'public'           // Cliente puede ver disponibilidad
};

const EVENT_TYPES = {
  PERSONAL: 'personal',
  COMPANY_TOUR: 'company_tour', 
  OCCUPIED: 'occupied',
  AVAILABLE: 'available'
};

// Base de datos mock de eventos personales
const MOCK_PERSONAL_EVENTS_DB = {
  'user123': {
    '2024-03-15': [
      {
        id: 'personal-001',
        title: 'Cita médica',
        description: 'Revisión médica anual',
        startTime: '08:00',
        endTime: '09:30',
        date: '2024-03-15',
        type: EVENT_TYPES.PERSONAL,
        visibility: VISIBILITY_LEVELS.PRIVATE,
        location: 'Clínica San Pedro',
        createdAt: '2024-03-01T10:00:00Z',
        guideId: 'user123'
      },
      {
        id: 'occupied-001',
        title: 'Ocupado',
        startTime: '12:00',
        endTime: '13:30',
        date: '2024-03-15',
        type: EVENT_TYPES.OCCUPIED,
        visibility: VISIBILITY_LEVELS.OCCUPIED,
        createdAt: '2024-03-01T10:00:00Z',
        guideId: 'user123'
      }
    ]
  },
  'guide-001': {
    '2024-03-15': [
      {
        id: 'personal-002',
        title: 'Día libre',
        description: 'Día personal completo',
        allDay: true,
        date: '2024-03-15',
        type: EVENT_TYPES.PERSONAL,
        visibility: VISIBILITY_LEVELS.PRIVATE,
        createdAt: '2024-03-01T10:00:00Z',
        guideId: 'guide-001'
      }
    ]
  }
};

// Base de datos mock de tours asignados
const MOCK_ASSIGNED_TOURS_DB = {
  'user123': {
    '2024-03-15': [
      {
        id: 'tour-001',
        title: 'City Tour Cusco',
        client: 'Familia Rodríguez',
        description: 'Tour completo por el centro histórico de Cusco',
        startTime: '09:30',
        endTime: '12:00',
        date: '2024-03-15',
        type: EVENT_TYPES.COMPANY_TOUR,
        visibility: VISIBILITY_LEVELS.COMPANY,
        location: 'Plaza de Armas',
        price: '150',
        status: 'confirmed',
        assignedAt: '2024-03-10T14:00:00Z',
        guideId: 'user123',
        reservationId: 'RES-2024-001'
      },
      {
        id: 'tour-002',
        title: 'Qorikancha y San Pedro',
        client: 'Sr. Anderson',
        description: 'Visita al templo del sol y mercado tradicional',
        startTime: '14:00',
        endTime: '17:00',
        date: '2024-03-15',
        type: EVENT_TYPES.COMPANY_TOUR,
        visibility: VISIBILITY_LEVELS.COMPANY,
        location: 'Qorikancha',
        price: '120',
        status: 'confirmed',
        assignedAt: '2024-03-10T14:00:00Z',
        guideId: 'user123',
        reservationId: 'RES-2024-002'
      }
    ]
  },
  'guide-001': {
    '2024-03-16': [
      {
        id: 'tour-003',
        title: 'Machu Picchu Full Day',
        client: 'Familia Johnson',
        description: 'Tour completo a Machu Picchu con tren',
        startTime: '06:00',
        endTime: '19:00',
        date: '2024-03-16',
        type: EVENT_TYPES.COMPANY_TOUR,
        visibility: VISIBILITY_LEVELS.COMPANY,
        location: 'Estación San Pedro',
        price: '300',
        status: 'confirmed',
        assignedAt: '2024-03-10T14:00:00Z',
        guideId: 'guide-001',
        reservationId: 'RES-2024-003'
      }
    ]
  }
};

// Base de datos mock de horarios de trabajo
const MOCK_WORKING_HOURS_DB = {
  'user123': {
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: true, start: '10:00', end: '14:00' },
    sunday: { enabled: false, start: '10:00', end: '14:00' }
  },
  'guide-001': {
    monday: { enabled: true, start: '08:00', end: '18:00' },
    tuesday: { enabled: true, start: '08:00', end: '18:00' },
    wednesday: { enabled: true, start: '08:00', end: '18:00' },
    thursday: { enabled: true, start: '08:00', end: '18:00' },
    friday: { enabled: true, start: '08:00', end: '18:00' },
    saturday: { enabled: true, start: '08:00', end: '16:00' },
    sunday: { enabled: true, start: '08:00', end: '16:00' }
  }
};

class MockIndependentAgendaService {
  constructor() {
    this.personalEvents = { ...MOCK_PERSONAL_EVENTS_DB };
    this.assignedTours = { ...MOCK_ASSIGNED_TOURS_DB };
    this.workingHours = { ...MOCK_WORKING_HOURS_DB };
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_agenda`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.personalEvents = data.personalEvents || this.personalEvents;
        this.assignedTours = data.assignedTours || this.assignedTours;
        this.workingHours = data.workingHours || this.workingHours;
      } catch (error) {
        console.warn('Error loading mock agenda data from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_agenda`;
    localStorage.setItem(storageKey, JSON.stringify({
      personalEvents: this.personalEvents,
      assignedTours: this.assignedTours,
      workingHours: this.workingHours
    }));
  }

  async simulateDelay(ms = 300) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId(prefix = 'event') {
    return `${prefix}-${Date.now()}`;
  }

  // === EVENTOS PERSONALES ===
  async getPersonalEvents(guideId, filters = {}) {
    await this.simulateDelay();
    
    const guideEvents = this.personalEvents[guideId] || {};
    let events = [];
    
    // Aplicar filtros de fecha
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      
      Object.entries(guideEvents).forEach(([date, dateEvents]) => {
        const eventDate = new Date(date);
        if (eventDate >= start && eventDate <= end) {
          events.push(...dateEvents);
        }
      });
    } else if (filters.date) {
      events = guideEvents[filters.date] || [];
    } else {
      // Todos los eventos
      Object.values(guideEvents).forEach(dateEvents => {
        events.push(...dateEvents);
      });
    }
    
    // Filtrar por tipo
    if (filters.type) {
      events = events.filter(e => e.type === filters.type);
    }
    
    // Ordenar por fecha y hora
    events.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      
      // Si son del mismo día, ordenar por hora
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
    
    return {
      success: true,
      data: events
    };
  }

  async createPersonalEvent(guideId, eventData) {
    await this.simulateDelay();
    
    const newEvent = {
      id: this.generateId('personal'),
      ...eventData,
      type: eventData.type || EVENT_TYPES.PERSONAL,
      visibility: eventData.visibility || VISIBILITY_LEVELS.PRIVATE,
      createdAt: new Date().toISOString(),
      guideId
    };
    
    if (!this.personalEvents[guideId]) {
      this.personalEvents[guideId] = {};
    }
    
    if (!this.personalEvents[guideId][eventData.date]) {
      this.personalEvents[guideId][eventData.date] = [];
    }
    
    this.personalEvents[guideId][eventData.date].push(newEvent);
    this.saveToStorage();
    
    return {
      success: true,
      data: newEvent
    };
  }

  async updatePersonalEvent(guideId, eventId, updateData) {
    await this.simulateDelay();
    
    const guideEvents = this.personalEvents[guideId] || {};
    let eventFound = false;
    let updatedEvent = null;
    
    Object.keys(guideEvents).forEach(date => {
      const index = guideEvents[date].findIndex(e => e.id === eventId);
      if (index !== -1) {
        guideEvents[date][index] = {
          ...guideEvents[date][index],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        updatedEvent = guideEvents[date][index];
        eventFound = true;
        
        // Si cambió la fecha, mover el evento
        if (updateData.date && updateData.date !== date) {
          const event = guideEvents[date].splice(index, 1)[0];
          if (!guideEvents[updateData.date]) {
            guideEvents[updateData.date] = [];
          }
          guideEvents[updateData.date].push(event);
        }
      }
    });
    
    if (!eventFound) {
      return {
        success: false,
        error: 'Evento no encontrado'
      };
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: updatedEvent
    };
  }

  async deletePersonalEvent(guideId, eventId) {
    await this.simulateDelay();
    
    const guideEvents = this.personalEvents[guideId] || {};
    let eventDeleted = false;
    
    Object.keys(guideEvents).forEach(date => {
      const index = guideEvents[date].findIndex(e => e.id === eventId);
      if (index !== -1) {
        guideEvents[date].splice(index, 1);
        eventDeleted = true;
      }
    });
    
    if (!eventDeleted) {
      return {
        success: false,
        error: 'Evento no encontrado'
      };
    }
    
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  // === TIEMPO OCUPADO ===
  async markTimeAsOccupied(guideId, timeSlotData) {
    await this.simulateDelay();
    
    const occupiedEvent = {
      id: this.generateId('occupied'),
      title: 'Ocupado',
      startTime: timeSlotData.startTime,
      endTime: timeSlotData.endTime,
      date: timeSlotData.date,
      type: EVENT_TYPES.OCCUPIED,
      visibility: VISIBILITY_LEVELS.OCCUPIED,
      createdAt: new Date().toISOString(),
      guideId
    };
    
    if (!this.personalEvents[guideId]) {
      this.personalEvents[guideId] = {};
    }
    
    if (!this.personalEvents[guideId][timeSlotData.date]) {
      this.personalEvents[guideId][timeSlotData.date] = [];
    }
    
    this.personalEvents[guideId][timeSlotData.date].push(occupiedEvent);
    this.saveToStorage();
    
    return {
      success: true,
      data: occupiedEvent
    };
  }

  // === TOURS ASIGNADOS ===
  async getAssignedTours(guideId, filters = {}) {
    await this.simulateDelay();
    
    const guideTours = this.assignedTours[guideId] || {};
    let tours = [];
    
    // Aplicar filtros de fecha
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      
      Object.entries(guideTours).forEach(([date, dateTours]) => {
        const tourDate = new Date(date);
        if (tourDate >= start && tourDate <= end) {
          tours.push(...dateTours);
        }
      });
    } else if (filters.date) {
      tours = guideTours[filters.date] || [];
    } else {
      // Todos los tours
      Object.values(guideTours).forEach(dateTours => {
        tours.push(...dateTours);
      });
    }
    
    // Filtrar por estado
    if (filters.status) {
      tours = tours.filter(t => t.status === filters.status);
    }
    
    // Ordenar por fecha y hora
    tours.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
    
    return {
      success: true,
      data: tours
    };
  }

  async assignTourToGuide(guideId, tourData) {
    await this.simulateDelay();
    
    const newTour = {
      id: this.generateId('tour'),
      ...tourData,
      type: EVENT_TYPES.COMPANY_TOUR,
      visibility: VISIBILITY_LEVELS.COMPANY,
      assignedAt: new Date().toISOString(),
      guideId
    };
    
    if (!this.assignedTours[guideId]) {
      this.assignedTours[guideId] = {};
    }
    
    if (!this.assignedTours[guideId][tourData.date]) {
      this.assignedTours[guideId][tourData.date] = [];
    }
    
    this.assignedTours[guideId][tourData.date].push(newTour);
    this.saveToStorage();
    
    return {
      success: true,
      data: newTour
    };
  }

  async updateAssignedTour(guideId, tourId, updateData) {
    await this.simulateDelay();
    
    const guideTours = this.assignedTours[guideId] || {};
    let tourFound = false;
    let updatedTour = null;
    
    Object.keys(guideTours).forEach(date => {
      const index = guideTours[date].findIndex(t => t.id === tourId);
      if (index !== -1) {
        guideTours[date][index] = {
          ...guideTours[date][index],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        updatedTour = guideTours[date][index];
        tourFound = true;
        
        // Si cambió la fecha, mover el tour
        if (updateData.date && updateData.date !== date) {
          const tour = guideTours[date].splice(index, 1)[0];
          if (!guideTours[updateData.date]) {
            guideTours[updateData.date] = [];
          }
          guideTours[updateData.date].push(tour);
        }
      }
    });
    
    if (!tourFound) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: updatedTour
    };
  }

  async removeAssignedTour(guideId, tourId) {
    await this.simulateDelay();
    
    const guideTours = this.assignedTours[guideId] || {};
    let tourDeleted = false;
    
    Object.keys(guideTours).forEach(date => {
      const index = guideTours[date].findIndex(t => t.id === tourId);
      if (index !== -1) {
        guideTours[date].splice(index, 1);
        tourDeleted = true;
      }
    });
    
    if (!tourDeleted) {
      return {
        success: false,
        error: 'Tour no encontrado'
      };
    }
    
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  // === HORARIOS DE TRABAJO ===
  async getWorkingHours(guideId) {
    await this.simulateDelay();
    
    const workingHours = this.workingHours[guideId];
    
    if (!workingHours) {
      return {
        success: true,
        data: {
          monday: { enabled: true, start: '09:00', end: '17:00' },
          tuesday: { enabled: true, start: '09:00', end: '17:00' },
          wednesday: { enabled: true, start: '09:00', end: '17:00' },
          thursday: { enabled: true, start: '09:00', end: '17:00' },
          friday: { enabled: true, start: '09:00', end: '17:00' },
          saturday: { enabled: false, start: '09:00', end: '13:00' },
          sunday: { enabled: false, start: '09:00', end: '13:00' }
        }
      };
    }
    
    return {
      success: true,
      data: workingHours
    };
  }

  async updateWorkingHours(guideId, schedule) {
    await this.simulateDelay();
    
    this.workingHours[guideId] = {
      ...schedule,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.workingHours[guideId]
    };
  }

  // === DISPONIBILIDAD ===
  async getGuideAvailability(guideId, date, options = {}) {
    await this.simulateDelay();
    
    const dateKey = format(new Date(date), 'yyyy-MM-dd');
    
    // Obtener eventos y tours del día
    const personalEvents = this.personalEvents[guideId]?.[dateKey] || [];
    const assignedTours = this.assignedTours[guideId]?.[dateKey] || [];
    const allEvents = [...personalEvents, ...assignedTours];
    
    // Obtener horarios de trabajo
    const workingHours = this.workingHours[guideId];
    const dayOfWeek = format(new Date(date), 'EEEE').toLowerCase();
    const daySchedule = workingHours?.[dayOfWeek];
    
    // Si el guía no trabaja ese día
    if (!daySchedule?.enabled) {
      return {
        success: true,
        data: {
          date: dateKey,
          guideId,
          isAvailable: false,
          workingHours: null,
          occupiedSlots: [],
          availableSlots: []
        }
      };
    }
    
    // Filtrar eventos según visibilidad para admin
    const visibleEvents = options.adminView 
      ? allEvents.filter(e => 
          e.visibility === VISIBILITY_LEVELS.OCCUPIED || 
          e.visibility === VISIBILITY_LEVELS.COMPANY
        )
      : allEvents;
    
    // Calcular slots ocupados
    const occupiedSlots = visibleEvents.map(event => ({
      id: event.id,
      startTime: event.startTime,
      endTime: event.endTime,
      title: event.visibility === VISIBILITY_LEVELS.OCCUPIED ? 'Ocupado' : event.title,
      type: event.type,
      visibility: event.visibility,
      allDay: event.allDay || false
    }));
    
    // Calcular slots disponibles
    const availableSlots = this.calculateAvailableSlots(
      daySchedule,
      occupiedSlots,
      options.minDuration || 60
    );
    
    return {
      success: true,
      data: {
        date: dateKey,
        guideId,
        isAvailable: availableSlots.length > 0,
        workingHours: daySchedule,
        occupiedSlots,
        availableSlots
      }
    };
  }

  // === AGENDA COMPLETA ===
  async getGuideCompleteAgenda(guideId, filters = {}) {
    await this.simulateDelay();
    
    // Obtener todos los eventos personales
    const personalEventsResult = await this.getPersonalEvents(guideId, filters);
    const personalEvents = personalEventsResult.data || [];
    
    // Obtener todos los tours asignados
    const assignedToursResult = await this.getAssignedTours(guideId, filters);
    const assignedTours = assignedToursResult.data || [];
    
    // Combinar y ordenar
    const allEvents = [...personalEvents, ...assignedTours].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      
      // Eventos de todo el día primero
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      
      // Por hora de inicio
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      
      return 0;
    });
    
    return {
      success: true,
      data: {
        guideId,
        events: allEvents,
        total: allEvents.length,
        personalEventsCount: personalEvents.length,
        assignedToursCount: assignedTours.length
      }
    };
  }

  // === ESTADÍSTICAS ===
  async getGuideStats(guideId, filters = {}) {
    await this.simulateDelay();
    
    const year = filters.year || new Date().getFullYear();
    const month = filters.month; // Opcional
    
    let personalEventsCount = 0;
    let occupiedHours = 0;
    let assignedToursCount = 0;
    let tourRevenue = 0;
    
    const guidePersonalEvents = this.personalEvents[guideId] || {};
    const guideAssignedTours = this.assignedTours[guideId] || {};
    
    // Filtrar por año/mes
    Object.entries(guidePersonalEvents).forEach(([date, events]) => {
      const eventDate = new Date(date);
      if (eventDate.getFullYear() === year && 
          (!month || eventDate.getMonth() + 1 === month)) {
        personalEventsCount += events.length;
        
        // Calcular horas ocupadas
        events.forEach(event => {
          if (event.startTime && event.endTime && !event.allDay) {
            const start = new Date(`2000-01-01T${event.startTime}`);
            const end = new Date(`2000-01-01T${event.endTime}`);
            occupiedHours += (end - start) / (1000 * 60 * 60);
          }
        });
      }
    });
    
    Object.entries(guideAssignedTours).forEach(([date, tours]) => {
      const tourDate = new Date(date);
      if (tourDate.getFullYear() === year && 
          (!month || tourDate.getMonth() + 1 === month)) {
        assignedToursCount += tours.length;
        
        // Calcular ingresos
        tours.forEach(tour => {
          if (tour.price && tour.status === 'confirmed') {
            tourRevenue += parseFloat(tour.price);
          }
        });
      }
    });
    
    return {
      success: true,
      data: {
        guideId,
        period: month ? `${year}-${String(month).padStart(2, '0')}` : String(year),
        personalEventsCount,
        occupiedHours,
        assignedToursCount,
        tourRevenue,
        averageToursPerDay: assignedToursCount / (month ? 30 : 365)
      }
    };
  }

  // === UTILIDADES ===
  calculateAvailableSlots(daySchedule, occupiedSlots, minDuration = 60) {
    if (!daySchedule || !daySchedule.enabled) return [];
    
    const availableSlots = [];
    const workStart = new Date(`2000-01-01T${daySchedule.start}`);
    const workEnd = new Date(`2000-01-01T${daySchedule.end}`);
    
    // Ordenar slots ocupados por hora de inicio
    const sortedOccupied = occupiedSlots
      .filter(slot => !slot.allDay && slot.startTime && slot.endTime)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    let currentTime = new Date(workStart);
    
    sortedOccupied.forEach(occupied => {
      const occupiedStart = new Date(`2000-01-01T${occupied.startTime}`);
      const occupiedEnd = new Date(`2000-01-01T${occupied.endTime}`);
      
      // Si hay espacio antes del evento ocupado
      if (occupiedStart > currentTime) {
        const duration = (occupiedStart - currentTime) / (1000 * 60); // minutos
        if (duration >= minDuration) {
          availableSlots.push({
            startTime: format(currentTime, 'HH:mm'),
            endTime: format(occupiedStart, 'HH:mm'),
            duration
          });
        }
      }
      
      // Actualizar tiempo actual al final del evento ocupado
      if (occupiedEnd > currentTime) {
        currentTime = new Date(occupiedEnd);
      }
    });
    
    // Verificar si hay espacio al final del día
    if (currentTime < workEnd) {
      const duration = (workEnd - currentTime) / (1000 * 60);
      if (duration >= minDuration) {
        availableSlots.push({
          startTime: format(currentTime, 'HH:mm'),
          endTime: format(workEnd, 'HH:mm'),
          duration
        });
      }
    }
    
    return availableSlots;
  }

  // === LIMPIEZA ===
  async clearOldEvents(guideId, daysToKeep = 30) {
    await this.simulateDelay();
    
    const cutoffDate = subDays(new Date(), daysToKeep);
    
    // Limpiar eventos personales antiguos
    if (this.personalEvents[guideId]) {
      const cleanedPersonalEvents = {};
      Object.entries(this.personalEvents[guideId]).forEach(([date, events]) => {
        if (new Date(date) >= cutoffDate) {
          cleanedPersonalEvents[date] = events;
        }
      });
      this.personalEvents[guideId] = cleanedPersonalEvents;
    }
    
    // Limpiar tours antiguos
    if (this.assignedTours[guideId]) {
      const cleanedTours = {};
      Object.entries(this.assignedTours[guideId]).forEach(([date, tours]) => {
        if (new Date(date) >= cutoffDate) {
          cleanedTours[date] = tours;
        }
      });
      this.assignedTours[guideId] = cleanedTours;
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      message: `Eventos anteriores a ${format(cutoffDate, 'dd/MM/yyyy')} eliminados`
    };
  }
}

export const mockIndependentAgendaService = new MockIndependentAgendaService();
export default mockIndependentAgendaService;
export { VISIBILITY_LEVELS, EVENT_TYPES };