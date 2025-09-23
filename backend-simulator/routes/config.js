const express = require('express');

module.exports = (router) => {
  const configRouter = express.Router();

  // Get all app constants and configurations
  configRouter.get('/constants', (req, res) => {
    try {
      const constants = {
        // User roles
        USER_ROLES: {
          ADMIN: 'admin',
          AGENCY: 'agency',
          GUIDE: 'guide',
          CLIENT: 'client'
        },

        // Reservation statuses
        RESERVATION_STATUS: {
          PENDING: 'pending',
          CONFIRMED: 'confirmed',
          IN_PROGRESS: 'in_progress',
          COMPLETED: 'completed',
          CANCELLED: 'cancelled'
        },

        // Payment statuses
        PAYMENT_STATUS: {
          PENDING: 'pending',
          PAID: 'paid',
          FAILED: 'failed',
          REFUNDED: 'refunded'
        },

        // Service categories
        SERVICE_CATEGORIES: {
          TOURS: 'tours',
          ACCOMMODATION: 'accommodation',
          TRANSPORT: 'transport',
          ACTIVITIES: 'activities',
          MEALS: 'meals'
        },

        // Tour types
        TOUR_TYPES: {
          CULTURAL: 'cultural',
          ADVENTURE: 'adventure',
          GASTRONOMIC: 'gastronomic',
          NATURE: 'nature',
          HISTORICAL: 'historical'
        },

        // Group types
        GROUP_TYPES: {
          INDIVIDUAL: 'individual',
          COUPLE: 'couple',
          FAMILY: 'family',
          GROUP: 'group',
          CORPORATE: 'corporate'
        },

        // Currencies
        CURRENCIES: {
          USD: 'USD',
          PEN: 'PEN',
          EUR: 'EUR'
        },

        // Languages
        LANGUAGES: {
          ES: 'es',
          EN: 'en',
          FR: 'fr',
          PT: 'pt'
        },

        // Emergency types
        EMERGENCY_TYPES: {
          MEDICAL: 'medical',
          SECURITY: 'security',
          WEATHER: 'weather',
          TRANSPORT: 'transport',
          OTHER: 'other'
        },

        // Notification types
        NOTIFICATION_TYPES: {
          INFO: 'info',
          WARNING: 'warning',
          SUCCESS: 'success',
          ERROR: 'error',
          EMERGENCY: 'emergency'
        }
      };

      res.json({
        success: true,
        data: constants
      });

    } catch (error) {
      console.error('Error fetching constants:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener constantes'
      });
    }
  });

  // Get work zones
  configRouter.get('/work-zones', (req, res) => {
    try {
      const db = router.db;
      let workZones = db.get('work_zones').value();

      if (!workZones || workZones.length === 0) {
        workZones = [
          { id: 'zone-1', name: 'Lima Centro', code: 'LIM-C', active: true },
          { id: 'zone-2', name: 'Cusco', code: 'CUS', active: true },
          { id: 'zone-3', name: 'Arequipa', code: 'AQP', active: true },
          { id: 'zone-4', name: 'Trujillo', code: 'TRU', active: true },
          { id: 'zone-5', name: 'Piura', code: 'PIU', active: true }
        ];
      }

      res.json({
        success: true,
        data: workZones
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener zonas de trabajo'
      });
    }
  });

  // Get tour types with details
  configRouter.get('/tour-types', (req, res) => {
    try {
      const db = router.db;
      let tourTypes = db.get('tour_types').value();

      if (!tourTypes || tourTypes.length === 0) {
        tourTypes = [
          {
            id: 'cultural',
            name: 'Cultural',
            description: 'Tours enfocados en historia y cultura',
            icon: '🏛️',
            active: true
          },
          {
            id: 'adventure',
            name: 'Aventura',
            description: 'Actividades de aventura y deportes extremos',
            icon: '🏔️',
            active: true
          },
          {
            id: 'gastronomic',
            name: 'Gastronómico',
            description: 'Experiencias culinarias y gastronómicas',
            icon: '🍽️',
            active: true
          },
          {
            id: 'nature',
            name: 'Naturaleza',
            description: 'Tours en contacto con la naturaleza',
            icon: '🌿',
            active: true
          },
          {
            id: 'historical',
            name: 'Histórico',
            description: 'Sitios históricos y arqueológicos',
            icon: '🏺',
            active: true
          }
        ];
      }

      res.json({
        success: true,
        data: tourTypes
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de tour'
      });
    }
  });

  // Get group types with details
  configRouter.get('/group-types', (req, res) => {
    try {
      const db = router.db;
      let groupTypes = db.get('group_types').value();

      if (!groupTypes || groupTypes.length === 0) {
        groupTypes = [
          {
            id: 'individual',
            name: 'Individual',
            min_size: 1,
            max_size: 1,
            active: true
          },
          {
            id: 'couple',
            name: 'Pareja',
            min_size: 2,
            max_size: 2,
            active: true
          },
          {
            id: 'family',
            name: 'Familia',
            min_size: 3,
            max_size: 6,
            active: true
          },
          {
            id: 'group',
            name: 'Grupo',
            min_size: 7,
            max_size: 15,
            active: true
          },
          {
            id: 'corporate',
            name: 'Corporativo',
            min_size: 10,
            max_size: 50,
            active: true
          }
        ];
      }

      res.json({
        success: true,
        data: groupTypes
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de grupo'
      });
    }
  });

  // Get supported languages
  configRouter.get('/languages', (req, res) => {
    try {
      const db = router.db;
      let languages = db.get('languages').value();

      if (!languages || languages.length === 0) {
        languages = [
          {
            id: 'es',
            name: 'Español',
            native_name: 'Español',
            flag: '🇪🇸',
            active: true
          },
          {
            id: 'en',
            name: 'English',
            native_name: 'English',
            flag: '🇺🇸',
            active: true
          },
          {
            id: 'fr',
            name: 'Français',
            native_name: 'Français',
            flag: '🇫🇷',
            active: true
          },
          {
            id: 'pt',
            name: 'Português',
            native_name: 'Português',
            flag: '🇧🇷',
            active: true
          },
          {
            id: 'de',
            name: 'Deutsch',
            native_name: 'Deutsch',
            flag: '🇩🇪',
            active: false
          }
        ];
      }

      res.json({
        success: true,
        data: languages
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener idiomas'
      });
    }
  });

  // Get app settings/configuration
  configRouter.get('/settings', (req, res) => {
    try {
      const settings = {
        app: {
          name: 'Futurismo',
          version: process.env.APP_VERSION || '25.07.0001',
          environment: process.env.NODE_ENV || 'development'
        },
        contact: {
          whatsapp: process.env.WHATSAPP_NUMBER || '+51999888777',
          email: process.env.COMPANY_EMAIL || 'info@futurismo.com',
          website: process.env.COMPANY_WEBSITE || 'https://futurismo.com',
          emergency: {
            police: process.env.EMERGENCY_POLICE || '105',
            fire: process.env.EMERGENCY_FIRE || '116',
            medical: process.env.EMERGENCY_MEDICAL || '106',
            company: process.env.EMERGENCY_COMPANY || '+51 999 888 777'
          }
        },
        api: {
          baseUrl: process.env.API_BASE_URL || 'http://localhost:4050/api',
          wsUrl: process.env.WEBSOCKET_URL || 'http://localhost:3000',
          timeout: parseInt(process.env.API_TIMEOUT) || 30000
        },
        features: {
          notifications: process.env.FEATURE_NOTIFICATIONS !== 'false',
          emergency_alerts: process.env.FEATURE_EMERGENCY !== 'false',
          multi_language: process.env.FEATURE_MULTILANG !== 'false',
          payment_gateway: process.env.FEATURE_PAYMENTS === 'true',
          real_time_tracking: process.env.FEATURE_TRACKING !== 'false'
        },
        limits: {
          max_file_size: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
          max_group_size: parseInt(process.env.MAX_GROUP_SIZE) || 50,
          max_tour_capacity: parseInt(process.env.MAX_TOUR_CAPACITY) || 20,
          reservation_days_ahead: parseInt(process.env.RESERVATION_DAYS_AHEAD) || 365,
          cancellation_hours: parseInt(process.env.CANCELLATION_HOURS) || 24,
          session_timeout: parseInt(process.env.SESSION_TIMEOUT) || 1800000,
          whatsapp_cutoff_hour: parseInt(process.env.WHATSAPP_CUTOFF_HOUR) || 17
        },
        intervals: {
          fast_update: parseInt(process.env.UPDATE_INTERVAL_FAST) || 30000,
          medium_update: parseInt(process.env.UPDATE_INTERVAL_MEDIUM) || 60000,
          slow_update: parseInt(process.env.UPDATE_INTERVAL_SLOW) || 300000,
          debounce_delay: parseInt(process.env.DEBOUNCE_DELAY) || 300
        },
        formats: {
          date: process.env.DATE_FORMAT || 'DD/MM/YYYY',
          time: process.env.TIME_FORMAT || 'HH:mm',
          currency: process.env.DEFAULT_CURRENCY || 'USD',
          timezone: process.env.TIMEZONE || 'America/Lima'
        },
        external_services: {
          google_maps_api: process.env.GOOGLE_MAPS_API_KEY || '',
          avatars_service: process.env.AVATARS_SERVICE_URL || 'https://ui-avatars.com/api/',
          osm_tiles: process.env.OSM_TILES_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }
      };

      res.json({
        success: true,
        data: settings
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración'
      });
    }
  });

  return configRouter;
};