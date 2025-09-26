/**
 * Servicio mock de estadísticas
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';

class MockStatisticsService {
  constructor() {
    this.initializeStorage();
  }

  async simulateDelay(ms = 300) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  initializeStorage() {
    // Las estadísticas se generan dinámicamente, no necesitan storage
  }

  // Generar número aleatorio en rango
  randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generar tendencia (positiva o negativa)
  generateTrend() {
    const trend = Math.random() > 0.5 ? 1 : -1;
    return trend * this.randomInRange(5, 25);
  }

  // Obtener estadísticas diarias
  async getDailyStatistics(date = new Date()) {
    await this.simulateDelay();
    
    return {
      success: true,
      data: {
        date: date.toISOString(),
        reservations: this.randomInRange(5, 15),
        tourists: this.randomInRange(20, 60),
        revenue: this.randomInRange(1500, 4000),
        tours: this.randomInRange(3, 8),
        occupancy: this.randomInRange(65, 95),
        newClients: this.randomInRange(0, 5),
        cancelations: this.randomInRange(0, 2)
      }
    };
  }

  // Obtener estadísticas semanales
  async getWeeklyStatistics(startDate = new Date()) {
    await this.simulateDelay();
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    return {
      success: true,
      data: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reservations: this.randomInRange(35, 60),
        tourists: this.randomInRange(150, 350),
        revenue: this.randomInRange(12000, 25000),
        tours: this.randomInRange(20, 40),
        occupancy: this.randomInRange(70, 90),
        trend: {
          reservations: this.generateTrend(),
          revenue: this.generateTrend(),
          occupancy: this.generateTrend()
        },
        topTours: [
          { id: '1', name: 'City Tour Lima', count: this.randomInRange(8, 15), revenue: this.randomInRange(3000, 5000) },
          { id: '3', name: 'Islas Palomino', count: this.randomInRange(6, 12), revenue: this.randomInRange(4000, 7000) },
          { id: '2', name: 'Tour Gastronómico', count: this.randomInRange(5, 10), revenue: this.randomInRange(2500, 4500) }
        ]
      }
    };
  }

  // Obtener estadísticas mensuales
  async getMonthlyStatistics(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
    await this.simulateDelay();
    
    return {
      success: true,
      data: {
        year,
        month,
        reservations: this.randomInRange(150, 250),
        tourists: this.randomInRange(800, 1500),
        revenue: this.randomInRange(50000, 100000),
        tours: this.randomInRange(100, 180),
        occupancy: this.randomInRange(75, 92),
        trend: {
          reservations: this.generateTrend(),
          revenue: this.generateTrend(),
          occupancy: this.generateTrend()
        },
        topTours: [
          { id: '1', name: 'City Tour Lima', count: this.randomInRange(35, 50), revenue: this.randomInRange(12000, 18000) },
          { id: '3', name: 'Islas Palomino', count: this.randomInRange(28, 42), revenue: this.randomInRange(20000, 35000) },
          { id: '2', name: 'Tour Gastronómico', count: this.randomInRange(25, 38), revenue: this.randomInRange(15000, 25000) },
          { id: '4', name: 'Pachacámac y Barranco', count: this.randomInRange(20, 30), revenue: this.randomInRange(8000, 14000) }
        ],
        topGuides: [
          { id: '1', name: 'Juan Pérez', tours: this.randomInRange(40, 55), rating: 4.7 },
          { id: '2', name: 'María García', tours: this.randomInRange(38, 48), rating: 4.9 },
          { id: '3', name: 'Carlos Mendoza', tours: this.randomInRange(30, 42), rating: 4.8 }
        ],
        topClients: [
          { id: '1', name: 'Viajes El Dorado', bookings: this.randomInRange(15, 25), revenue: this.randomInRange(8000, 15000) },
          { id: '2', name: 'Peru Travel Experience', bookings: this.randomInRange(12, 20), revenue: this.randomInRange(10000, 18000) }
        ]
      }
    };
  }

  // Obtener estadísticas anuales
  async getYearlyStatistics(year = new Date().getFullYear()) {
    await this.simulateDelay();
    
    const monthlyData = [];
    for (let i = 1; i <= 12; i++) {
      monthlyData.push({
        month: i,
        reservations: this.randomInRange(120, 250),
        revenue: this.randomInRange(40000, 100000),
        tourists: this.randomInRange(600, 1500)
      });
    }
    
    return {
      success: true,
      data: {
        year,
        totalReservations: monthlyData.reduce((sum, m) => sum + m.reservations, 0),
        totalRevenue: monthlyData.reduce((sum, m) => sum + m.revenue, 0),
        totalTourists: monthlyData.reduce((sum, m) => sum + m.tourists, 0),
        averageOccupancy: this.randomInRange(78, 88),
        monthlyData,
        quarterlyData: [
          { quarter: 1, revenue: this.randomInRange(150000, 250000), growth: this.generateTrend() },
          { quarter: 2, revenue: this.randomInRange(180000, 300000), growth: this.generateTrend() },
          { quarter: 3, revenue: this.randomInRange(200000, 350000), growth: this.generateTrend() },
          { quarter: 4, revenue: this.randomInRange(160000, 280000), growth: this.generateTrend() }
        ]
      }
    };
  }

  // Obtener estadísticas personalizadas por rango de fechas
  async getCustomStatistics(startDate, endDate, groupBy = 'day') {
    await this.simulateDelay();
    
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const data = [];
    
    if (groupBy === 'day') {
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          reservations: this.randomInRange(5, 15),
          revenue: this.randomInRange(1500, 4000),
          tourists: this.randomInRange(20, 60)
        });
      }
    }
    
    return {
      success: true,
      data: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        groupBy,
        data,
        summary: {
          totalReservations: data.reduce((sum, d) => sum + d.reservations, 0),
          totalRevenue: data.reduce((sum, d) => sum + d.revenue, 0),
          totalTourists: data.reduce((sum, d) => sum + d.tourists, 0),
          averagePerDay: {
            reservations: Math.round(data.reduce((sum, d) => sum + d.reservations, 0) / days),
            revenue: Math.round(data.reduce((sum, d) => sum + d.revenue, 0) / days),
            tourists: Math.round(data.reduce((sum, d) => sum + d.tourists, 0) / days)
          }
        }
      }
    };
  }

  // Obtener estadísticas por tour
  async getTourStatistics(tourId, period = 'month') {
    await this.simulateDelay();
    
    return {
      success: true,
      data: {
        tourId,
        period,
        totalReservations: this.randomInRange(30, 60),
        totalTourists: this.randomInRange(150, 300),
        totalRevenue: this.randomInRange(8000, 20000),
        averageRating: (Math.random() * 0.5 + 4.5).toFixed(1),
        occupancyRate: this.randomInRange(70, 95),
        cancelationRate: this.randomInRange(2, 8),
        popularDays: ['Sábado', 'Domingo', 'Viernes'],
        popularTimes: ['09:00', '10:00', '11:00'],
        demographics: {
          national: this.randomInRange(40, 60),
          international: this.randomInRange(40, 60)
        }
      }
    };
  }

  // Obtener estadísticas por guía
  async getGuideStatistics(guideId, period = 'month') {
    await this.simulateDelay();
    
    return {
      success: true,
      data: {
        guideId,
        period,
        totalTours: this.randomInRange(20, 40),
        totalTourists: this.randomInRange(100, 250),
        totalRevenue: this.randomInRange(5000, 15000),
        averageRating: (Math.random() * 0.3 + 4.6).toFixed(1),
        punctualityRate: this.randomInRange(92, 100),
        completionRate: this.randomInRange(95, 100),
        topTours: [
          { tourId: '1', name: 'City Tour Lima', count: this.randomInRange(8, 15) },
          { tourId: '2', name: 'Tour Gastronómico', count: this.randomInRange(5, 10) }
        ],
        performance: {
          excellent: this.randomInRange(70, 85),
          good: this.randomInRange(10, 20),
          regular: this.randomInRange(0, 10)
        }
      }
    };
  }

  // Obtener estadísticas de ocupación
  async getOccupancyStatistics(period = 'week') {
    await this.simulateDelay();
    
    const data = [];
    const days = period === 'week' ? 7 : 30;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      data.push({
        date: date.toISOString().split('T')[0],
        occupancy: this.randomInRange(60, 95),
        available: this.randomInRange(100, 150),
        booked: this.randomInRange(60, 140)
      });
    }
    
    return {
      success: true,
      data: {
        period,
        averageOccupancy: this.randomInRange(75, 85),
        data,
        peakDays: ['Sábado', 'Domingo'],
        lowDays: ['Martes', 'Miércoles']
      }
    };
  }

  // Obtener KPIs principales
  async getKPIs() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: {
        revenue: {
          current: this.randomInRange(80000, 120000),
          previous: this.randomInRange(70000, 100000),
          trend: this.generateTrend()
        },
        reservations: {
          current: this.randomInRange(180, 250),
          previous: this.randomInRange(150, 220),
          trend: this.generateTrend()
        },
        tourists: {
          current: this.randomInRange(1000, 1500),
          previous: this.randomInRange(900, 1400),
          trend: this.generateTrend()
        },
        satisfaction: {
          current: (Math.random() * 0.3 + 4.5).toFixed(1),
          previous: (Math.random() * 0.3 + 4.4).toFixed(1),
          trend: this.randomInRange(1, 5)
        },
        occupancy: {
          current: this.randomInRange(80, 92),
          previous: this.randomInRange(75, 88),
          trend: this.generateTrend()
        },
        averageTicket: {
          current: this.randomInRange(65, 85),
          previous: this.randomInRange(60, 80),
          trend: this.generateTrend()
        }
      }
    };
  }

  // Obtener proyecciones
  async getProjections(months = 3) {
    await this.simulateDelay();
    
    const projections = [];
    const baseRevenue = this.randomInRange(80000, 100000);
    const growthRate = (Math.random() * 0.1 + 0.05); // 5-15% growth
    
    for (let i = 1; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      projections.push({
        month: date.toISOString().substring(0, 7),
        revenue: Math.round(baseRevenue * Math.pow(1 + growthRate, i)),
        reservations: this.randomInRange(180 + i * 10, 250 + i * 15),
        tourists: this.randomInRange(1000 + i * 50, 1500 + i * 80),
        confidence: this.randomInRange(75, 90)
      });
    }
    
    return {
      success: true,
      data: {
        projections,
        assumptions: {
          growthRate: (growthRate * 100).toFixed(1) + '%',
          seasonalityAdjusted: true,
          marketTrends: 'positive'
        }
      }
    };
  }
}

export const mockStatisticsService = new MockStatisticsService();
export default mockStatisticsService;