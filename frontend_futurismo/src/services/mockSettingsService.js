/**
 * Servicio mock de configuraciones del sistema
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';
import {
  DEFAULT_COMPANY_INFO,
  DEFAULT_TOURS_CONFIG,
  DEFAULT_AGENCIES_CONFIG,
  DEFAULT_GUIDES_CONFIG,
  DEFAULT_MONITORING_CONFIG,
  DEFAULT_REPORTS_CONFIG,
  DEFAULT_SECURITY_CONFIG,
  CURRENCIES,
  TIMEZONES,
  LANGUAGES,
  DATE_FORMATS,
  TIME_FORMATS
} from '../constants/settingsConstants';

// Configuraciones por defecto del sistema
const DEFAULT_SETTINGS = {
  general: {
    companyName: DEFAULT_COMPANY_INFO.NAME,
    companyPhone: DEFAULT_COMPANY_INFO.PHONE,
    companyEmail: DEFAULT_COMPANY_INFO.EMAIL,
    companyAddress: DEFAULT_COMPANY_INFO.ADDRESS,
    companyWebsite: DEFAULT_COMPANY_INFO.WEBSITE,
    currency: CURRENCIES.PEN.value,
    timezone: TIMEZONES.LIMA.value,
    language: LANGUAGES.ES.value,
    dateFormat: DATE_FORMATS.DD_MM_YYYY,
    timeFormat: TIME_FORMATS.H24,
    logoUrl: '/assets/logo.png',
    theme: 'light',
    updatedAt: '2024-03-12T10:30:00Z'
  },
  tours: {
    maxCapacityPerTour: DEFAULT_TOURS_CONFIG.MAX_CAPACITY,
    minAdvanceBooking: DEFAULT_TOURS_CONFIG.MIN_ADVANCE_BOOKING_HOURS,
    maxAdvanceBooking: DEFAULT_TOURS_CONFIG.MAX_ADVANCE_BOOKING_DAYS,
    cancellationPolicy: DEFAULT_TOURS_CONFIG.CANCELLATION_POLICY_HOURS,
    defaultDuration: DEFAULT_TOURS_CONFIG.DEFAULT_DURATION_HOURS,
    allowPartialPayments: true,
    requireGuideAssignment: true,
    autoAssignGuides: false,
    workingHours: DEFAULT_TOURS_CONFIG.WORKING_HOURS,
    priceRanges: DEFAULT_TOURS_CONFIG.PRICE_RANGES,
    enableWaitlist: true,
    waitlistBuffer: 20, // porcentaje adicional para lista de espera
    updatedAt: '2024-03-10T15:20:00Z'
  },
  agencies: {
    defaultCreditLimit: DEFAULT_AGENCIES_CONFIG.DEFAULT_CREDIT_LIMIT,
    requireCreditApproval: true,
    commissionRate: DEFAULT_AGENCIES_CONFIG.COMMISSION_RATE_PERCENT,
    paymentTerms: DEFAULT_AGENCIES_CONFIG.PAYMENT_TERMS_DAYS,
    allowDirectBooking: true,
    requireContractSigning: true,
    maxActiveReservations: DEFAULT_AGENCIES_CONFIG.MAX_ACTIVE_RESERVATIONS,
    enablePoints: true,
    pointsConversionRate: 100, // 1 PEN = 100 puntos
    updatedAt: '2024-03-08T09:45:00Z'
  },
  guides: {
    maxToursPerDay: DEFAULT_GUIDES_CONFIG.MAX_TOURS_PER_DAY,
    restTimeBetweenTours: DEFAULT_GUIDES_CONFIG.REST_TIME_BETWEEN_TOURS_HOURS,
    allowOverlappingTours: false,
    requireCertification: true,
    freelanceRequireAgenda: true,
    evaluationPeriod: DEFAULT_GUIDES_CONFIG.EVALUATION_PERIOD_DAYS,
    minRatingRequired: DEFAULT_GUIDES_CONFIG.MIN_RATING_REQUIRED,
    autoSuspendLowRating: false,
    enableAvailabilityCalendar: true,
    enableGeoTracking: true,
    updatedAt: '2024-03-11T14:00:00Z'
  },
  notifications: {
    email: {
      enabled: true,
      newReservation: true,
      cancellation: true,
      reminder24h: true,
      reminder2h: true,
      tourComplete: true,
      paymentReceived: true,
      lowCredit: true,
      systemAlerts: true,
      provider: 'sendgrid',
      fromEmail: 'noreply@futurismo.com'
    },
    sms: {
      enabled: false,
      newReservation: false,
      cancellation: true,
      reminder2h: true,
      emergencyOnly: true,
      provider: 'twilio',
      fromNumber: ''
    },
    push: {
      enabled: true,
      newReservation: true,
      tourUpdates: true,
      chat: true,
      systemAlerts: true,
      provider: 'firebase'
    },
    whatsapp: {
      enabled: false,
      newReservation: false,
      reminder24h: false,
      tourComplete: false,
      provider: 'twilio'
    },
    updatedAt: '2024-03-09T11:30:00Z'
  },
  monitoring: {
    enableRealTimeTracking: true,
    updateIntervalSeconds: DEFAULT_MONITORING_CONFIG.UPDATE_INTERVAL_SECONDS,
    enableGeofencing: true,
    alertRadiusMeters: DEFAULT_MONITORING_CONFIG.ALERT_RADIUS_METERS,
    enableEmergencyButton: true,
    enableOfflineMode: true,
    batteryAlertThreshold: DEFAULT_MONITORING_CONFIG.BATTERY_ALERT_THRESHOLD_PERCENT,
    enableAutoCheckpoints: true,
    checkpointInterval: 15, // minutos
    dataRetentionDays: 30,
    updatedAt: '2024-03-07T16:20:00Z'
  },
  reports: {
    enableAutoGeneration: true,
    dailyReportTime: DEFAULT_REPORTS_CONFIG.DAILY_REPORT_TIME,
    weeklyReportDay: DEFAULT_REPORTS_CONFIG.WEEKLY_REPORT_DAY,
    monthlyReportDay: DEFAULT_REPORTS_CONFIG.MONTHLY_REPORT_DAY,
    includePhotos: true,
    includeCustomerFeedback: true,
    enableDataExport: true,
    retentionPeriodMonths: DEFAULT_REPORTS_CONFIG.RETENTION_PERIOD_MONTHS,
    exportFormats: ['pdf', 'excel', 'csv'],
    emailReports: true,
    updatedAt: '2024-03-06T08:00:00Z'
  },
  security: {
    sessionTimeoutMinutes: DEFAULT_SECURITY_CONFIG.SESSION_TIMEOUT_MINUTES,
    passwordMinLength: DEFAULT_SECURITY_CONFIG.PASSWORD_MIN_LENGTH,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    enableTwoFactor: false,
    maxLoginAttempts: DEFAULT_SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS,
    lockoutDurationMinutes: DEFAULT_SECURITY_CONFIG.LOCKOUT_DURATION_MINUTES,
    enableIPWhitelist: false,
    enableAuditLog: true,
    passwordExpiryDays: 90,
    enableSSO: false,
    updatedAt: '2024-03-05T12:15:00Z'
  },
  integrations: {
    googleMaps: {
      enabled: true,
      apiKey: 'AIzaSy...(mock)',
      enableDirections: true,
      enablePlaces: true,
      enableStreetView: true
    },
    whatsapp: {
      enabled: false,
      businessPhone: '',
      apiToken: '',
      enableTemplates: false
    },
    mailchimp: {
      enabled: false,
      apiKey: '',
      listId: '',
      enableAutomation: false
    },
    stripe: {
      enabled: false,
      publicKey: '',
      secretKey: '',
      webhookSecret: '',
      enableSubscriptions: false
    },
    paypal: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      mode: 'sandbox'
    },
    updatedAt: '2024-03-04T14:30:00Z'
  }
};

// Historial de cambios mock
const MOCK_SETTINGS_HISTORY = [
  {
    id: 'history-001',
    category: 'general',
    changes: {
      companyPhone: { old: '+51 999 888 777', new: '+51 987 654 321' }
    },
    changedBy: 'admin@futurismo.com',
    changedAt: '2024-03-12T10:30:00Z',
    reason: 'Actualización de número de contacto principal'
  },
  {
    id: 'history-002',
    category: 'tours',
    changes: {
      cancellationPolicy: { old: 48, new: 24 }
    },
    changedBy: 'admin@futurismo.com',
    changedAt: '2024-03-10T15:20:00Z',
    reason: 'Política más flexible para cancelaciones'
  },
  {
    id: 'history-003',
    category: 'security',
    changes: {
      passwordMinLength: { old: 6, new: 8 },
      enableTwoFactor: { old: true, new: false }
    },
    changedBy: 'security@futurismo.com',
    changedAt: '2024-03-05T12:15:00Z',
    reason: 'Reforzamiento de política de contraseñas'
  }
];

class MockSettingsService {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.history = [...MOCK_SETTINGS_HISTORY];
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_settings`;
    const historyKey = `${APP_CONFIG.storage.prefix}mock_settings_history`;
    
    const storedSettings = localStorage.getItem(storageKey);
    const storedHistory = localStorage.getItem(historyKey);
    
    if (storedSettings) {
      try {
        this.settings = JSON.parse(storedSettings);
      } catch (error) {
        console.warn('Error loading mock settings from storage:', error);
      }
    }
    
    if (storedHistory) {
      try {
        this.history = JSON.parse(storedHistory);
      } catch (error) {
        console.warn('Error loading settings history from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_settings`;
    const historyKey = `${APP_CONFIG.storage.prefix}mock_settings_history`;
    
    localStorage.setItem(storageKey, JSON.stringify(this.settings));
    localStorage.setItem(historyKey, JSON.stringify(this.history));
  }

  async simulateDelay(ms = 300) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // Obtener todas las configuraciones
  async getSettings() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: this.settings
    };
  }

  // Obtener configuración por categoría
  async getSettingsByCategory(category) {
    await this.simulateDelay();
    
    if (!this.settings[category]) {
      return {
        success: false,
        error: 'Categoría no encontrada'
      };
    }
    
    return {
      success: true,
      data: this.settings[category]
    };
  }

  // Actualizar configuraciones
  async updateSettings(updates) {
    await this.simulateDelay();
    
    const changedCategories = [];
    const historyEntries = [];
    
    // Procesar actualizaciones por categoría
    Object.keys(updates).forEach(category => {
      if (this.settings[category]) {
        const oldValues = { ...this.settings[category] };
        const changes = {};
        
        // Detectar cambios
        Object.keys(updates[category]).forEach(key => {
          if (oldValues[key] !== updates[category][key]) {
            changes[key] = {
              old: oldValues[key],
              new: updates[category][key]
            };
          }
        });
        
        if (Object.keys(changes).length > 0) {
          changedCategories.push(category);
          
          // Crear entrada de historial
          historyEntries.push({
            id: `history-${Date.now()}`,
            category,
            changes,
            changedBy: 'admin@futurismo.com', // En producción vendría del usuario autenticado
            changedAt: new Date().toISOString(),
            reason: updates.reason || 'Actualización de configuración'
          });
          
          // Aplicar cambios
          this.settings[category] = {
            ...this.settings[category],
            ...updates[category],
            updatedAt: new Date().toISOString()
          };
        }
      }
    });
    
    if (changedCategories.length > 0) {
      // Agregar al historial
      this.history = [...historyEntries, ...this.history].slice(0, 100); // Mantener últimos 100 cambios
      
      this.saveToStorage();
      
      return {
        success: true,
        data: {
          updatedCategories: changedCategories,
          settings: this.settings
        }
      };
    }
    
    return {
      success: true,
      message: 'No se detectaron cambios'
    };
  }

  // Actualizar configuración específica de una categoría
  async updateCategorySettings(category, settings) {
    await this.simulateDelay();
    
    if (!this.settings[category]) {
      return {
        success: false,
        error: 'Categoría no encontrada'
      };
    }
    
    return this.updateSettings({ [category]: settings });
  }

  // Restablecer configuraciones por defecto
  async resetSettings(category = null) {
    await this.simulateDelay();
    
    if (category) {
      if (!DEFAULT_SETTINGS[category]) {
        return {
          success: false,
          error: 'Categoría no encontrada'
        };
      }
      
      this.settings[category] = {
        ...DEFAULT_SETTINGS[category],
        updatedAt: new Date().toISOString()
      };
      
      // Registrar en historial
      this.history.unshift({
        id: `history-${Date.now()}`,
        category,
        changes: { _action: 'reset' },
        changedBy: 'admin@futurismo.com',
        changedAt: new Date().toISOString(),
        reason: `Restablecimiento de configuración ${category}`
      });
    } else {
      // Restablecer todas las configuraciones
      this.settings = { ...DEFAULT_SETTINGS };
      
      // Registrar en historial
      this.history.unshift({
        id: `history-${Date.now()}`,
        category: 'all',
        changes: { _action: 'reset_all' },
        changedBy: 'admin@futurismo.com',
        changedAt: new Date().toISOString(),
        reason: 'Restablecimiento completo de configuraciones'
      });
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: category ? this.settings[category] : this.settings
    };
  }

  // Obtener historial de cambios
  async getSettingsHistory(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.history];
    
    // Filtrar por categoría
    if (filters.category) {
      filtered = filtered.filter(h => h.category === filters.category);
    }
    
    // Filtrar por fecha
    if (filters.startDate) {
      filtered = filtered.filter(h => 
        new Date(h.changedAt) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(h => 
        new Date(h.changedAt) <= new Date(filters.endDate)
      );
    }
    
    // Filtrar por usuario
    if (filters.changedBy) {
      filtered = filtered.filter(h => 
        h.changedBy.toLowerCase().includes(filters.changedBy.toLowerCase())
      );
    }
    
    // Paginación
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = filtered.slice(start, end);
    
    return {
      success: true,
      data: {
        history: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  // Exportar configuraciones
  async exportSettings(format = 'json') {
    await this.simulateDelay();
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case 'json':
        return {
          success: true,
          data: {
            filename: `settings_export_${timestamp}.json`,
            content: JSON.stringify(this.settings, null, 2),
            mimeType: 'application/json'
          }
        };
        
      case 'csv':
        // Convertir a formato plano para CSV
        const csvData = this.settingsToCSV();
        return {
          success: true,
          data: {
            filename: `settings_export_${timestamp}.csv`,
            content: csvData,
            mimeType: 'text/csv'
          }
        };
        
      default:
        return {
          success: false,
          error: 'Formato de exportación no soportado'
        };
    }
  }

  // Importar configuraciones
  async importSettings(data, format = 'json') {
    await this.simulateDelay();
    
    try {
      let importedSettings;
      
      if (format === 'json') {
        importedSettings = typeof data === 'string' ? JSON.parse(data) : data;
      } else {
        return {
          success: false,
          error: 'Formato de importación no soportado'
        };
      }
      
      // Validar estructura básica
      const requiredCategories = ['general', 'tours', 'agencies', 'guides'];
      const missingCategories = requiredCategories.filter(cat => !importedSettings[cat]);
      
      if (missingCategories.length > 0) {
        return {
          success: false,
          error: `Categorías faltantes: ${missingCategories.join(', ')}`
        };
      }
      
      // Aplicar configuraciones importadas
      const oldSettings = { ...this.settings };
      this.settings = {
        ...DEFAULT_SETTINGS,
        ...importedSettings
      };
      
      // Registrar en historial
      this.history.unshift({
        id: `history-${Date.now()}`,
        category: 'all',
        changes: { _action: 'import', _from: format },
        changedBy: 'admin@futurismo.com',
        changedAt: new Date().toISOString(),
        reason: 'Importación de configuraciones'
      });
      
      this.saveToStorage();
      
      return {
        success: true,
        data: {
          settings: this.settings,
          categoriesUpdated: Object.keys(importedSettings)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al procesar archivo de importación: ' + error.message
      };
    }
  }

  // Validar configuraciones
  async validateSettings(settings = null) {
    await this.simulateDelay();
    
    const toValidate = settings || this.settings;
    const errors = [];
    const warnings = [];
    
    // Validar configuración general
    if (!toValidate.general?.companyName?.trim()) {
      errors.push({
        category: 'general',
        field: 'companyName',
        message: 'El nombre de la empresa es requerido'
      });
    }
    
    if (!toValidate.general?.companyEmail?.trim() || 
        !/\S+@\S+\.\S+/.test(toValidate.general.companyEmail)) {
      errors.push({
        category: 'general',
        field: 'companyEmail',
        message: 'Email de empresa inválido'
      });
    }
    
    // Validar configuración de tours
    if (toValidate.tours?.maxCapacityPerTour < 1) {
      errors.push({
        category: 'tours',
        field: 'maxCapacityPerTour',
        message: 'La capacidad máxima debe ser al menos 1'
      });
    }
    
    if (toValidate.tours?.minAdvanceBooking < 0) {
      errors.push({
        category: 'tours',
        field: 'minAdvanceBooking',
        message: 'El tiempo mínimo de reserva no puede ser negativo'
      });
    }
    
    // Validar configuración de seguridad
    if (toValidate.security?.passwordMinLength < 6) {
      errors.push({
        category: 'security',
        field: 'passwordMinLength',
        message: 'La longitud mínima de contraseña debe ser al menos 6'
      });
    }
    
    if (toValidate.security?.sessionTimeoutMinutes < 5) {
      warnings.push({
        category: 'security',
        field: 'sessionTimeoutMinutes',
        message: 'Timeout de sesión muy corto puede afectar la experiencia del usuario'
      });
    }
    
    // Validar integraciones
    if (toValidate.integrations?.googleMaps?.enabled && 
        !toValidate.integrations.googleMaps.apiKey) {
      errors.push({
        category: 'integrations',
        field: 'googleMaps.apiKey',
        message: 'API Key de Google Maps requerida cuando está habilitado'
      });
    }
    
    return {
      success: errors.length === 0,
      data: {
        isValid: errors.length === 0,
        errors,
        warnings
      }
    };
  }

  // Obtener configuraciones disponibles
  async getAvailableOptions() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: {
        currencies: Object.values(CURRENCIES),
        timezones: Object.values(TIMEZONES),
        languages: Object.values(LANGUAGES),
        dateFormats: Object.values(DATE_FORMATS),
        timeFormats: Object.values(TIME_FORMATS),
        reportDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        exportFormats: ['pdf', 'excel', 'csv', 'json'],
        notificationProviders: {
          email: ['sendgrid', 'mailgun', 'ses', 'smtp'],
          sms: ['twilio', 'nexmo', 'sns'],
          push: ['firebase', 'onesignal', 'pusher']
        }
      }
    };
  }

  // Helper: Convertir configuraciones a CSV
  settingsToCSV() {
    const rows = ['Category,Setting,Value'];
    
    Object.entries(this.settings).forEach(([category, settings]) => {
      Object.entries(settings).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          rows.push(`${category},${key},"${value}"`);
        }
      });
    });
    
    return rows.join('\n');
  }
}

export const mockSettingsService = new MockSettingsService();
export default mockSettingsService;