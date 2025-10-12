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

  /**
   * GET /api/config/system
   * Obtiene la configuración del sistema desde db.json
   */
  configRouter.get('/system', (req, res) => {
    try {
      const db = router.db;
      const systemConfig = db.get('system_config').value();

      if (!systemConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración del sistema no encontrada'
        });
      }

      res.json({
        success: true,
        data: systemConfig,
        meta: {
          version: systemConfig.version,
          lastUpdated: systemConfig.lastUpdated
        }
      });

    } catch (error) {
      console.error('System config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración del sistema'
      });
    }
  });

  /**
   * GET /api/config/emergency
   * Obtiene la configuración de emergencias desde db.json
   */
  configRouter.get('/emergency', (req, res) => {
    try {
      const db = router.db;
      const emergencyConfig = db.get('emergency_config').value();

      if (!emergencyConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de emergencias no encontrada'
        });
      }

      res.json({
        success: true,
        data: emergencyConfig,
        meta: {
          version: emergencyConfig.version,
          lastUpdated: emergencyConfig.lastUpdated
        }
      });

    } catch (error) {
      console.error('Emergency config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de emergencias'
      });
    }
  });

  /**
   * GET /api/config/guides
   * Obtiene la configuración de guías desde db.json
   */
  configRouter.get('/guides', (req, res) => {
    try {
      const db = router.db;
      const guidesConfig = db.get('guides_config').value();

      if (!guidesConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de guías no encontrada'
        });
      }

      res.json({
        success: true,
        data: guidesConfig,
        meta: {
          version: guidesConfig.version,
          lastUpdated: guidesConfig.lastUpdated
        }
      });

    } catch (error) {
      console.error('Guides config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de guías'
      });
    }
  });

  /**
   * GET /api/config/app
   * Obtiene la configuración de la aplicación desde db.json
   */
  configRouter.get('/app', (req, res) => {
    try {
      const db = router.db;
      const appConfig = db.get('app_config').value();

      if (!appConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de la aplicación no encontrada'
        });
      }

      // Filtrar datos sensibles en producción
      const publicConfig = {
        ...appConfig,
        external: {
          ...appConfig.external,
          googleMapsApiKey: appConfig.environment === 'production' ? '' : appConfig.external.googleMapsApiKey
        }
      };

      res.json({
        success: true,
        data: publicConfig,
        meta: {
          version: appConfig.version,
          environment: appConfig.environment
        }
      });

    } catch (error) {
      console.error('App config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de la aplicación'
      });
    }
  });

  /**
   * GET /api/config/validation-schemas
   * Obtiene los esquemas de validación desde db.json
   */
  configRouter.get('/validation-schemas', (req, res) => {
    try {
      const db = router.db;
      const validationSchemas = db.get('validation_schemas').value();

      if (!validationSchemas) {
        return res.status(404).json({
          success: false,
          error: 'Esquemas de validación no encontrados'
        });
      }

      res.json({
        success: true,
        data: validationSchemas,
        meta: {
          version: validationSchemas.version,
          lastUpdated: validationSchemas.lastUpdated
        }
      });

    } catch (error) {
      console.error('Validation schemas error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener esquemas de validación'
      });
    }
  });

  /**
   * GET /api/config/all
   * Obtiene toda la configuración en una sola llamada
   * (útil para inicialización de la app)
   */
  configRouter.get('/all', (req, res) => {
    try {
      const db = router.db;
      const systemConfig = db.get('system_config').value();
      const emergencyConfig = db.get('emergency_config').value();
      const guidesConfig = db.get('guides_config').value();
      const appConfig = db.get('app_config').value();
      const validationSchemas = db.get('validation_schemas').value();

      // Filtrar datos sensibles
      const publicAppConfig = appConfig ? {
        ...appConfig,
        external: {
          ...appConfig.external,
          googleMapsApiKey: appConfig.environment === 'production' ? '' : appConfig.external.googleMapsApiKey
        }
      } : null;

      res.json({
        success: true,
        data: {
          system: systemConfig || null,
          emergency: emergencyConfig || null,
          guides: guidesConfig || null,
          app: publicAppConfig,
          validationSchemas: validationSchemas || null
        },
        meta: {
          timestamp: new Date().toISOString(),
          loadedConfigs: [
            systemConfig && 'system',
            emergencyConfig && 'emergency',
            guidesConfig && 'guides',
            appConfig && 'app',
            validationSchemas && 'validationSchemas'
          ].filter(Boolean)
        }
      });

    } catch (error) {
      console.error('All config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener toda la configuración'
      });
    }
  });

  /**
   * GET /api/config/agencies
   * Obtiene la configuración de agencias desde db.json
   */
  configRouter.get('/agencies', (req, res) => {
    try {
      const db = router.db;
      const agenciesConfig = db.get('agencies_config').value();

      if (!agenciesConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de agencias no encontrada'
        });
      }

      res.json({
        success: true,
        data: agenciesConfig,
        meta: {
          version: agenciesConfig.version
        }
      });

    } catch (error) {
      console.error('Agencies config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de agencias'
      });
    }
  });

  /**
   * GET /api/config/calendar
   * Obtiene la configuración del calendario desde db.json
   */
  configRouter.get('/calendar', (req, res) => {
    try {
      const db = router.db;
      const calendarConfig = db.get('calendar_config').value();

      if (!calendarConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración del calendario no encontrada'
        });
      }

      res.json({
        success: true,
        data: calendarConfig,
        meta: {
          version: calendarConfig.version
        }
      });

    } catch (error) {
      console.error('Calendar config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración del calendario'
      });
    }
  });

  /**
   * GET /api/config/clients
   * Obtiene la configuración de clientes desde db.json
   */
  configRouter.get('/clients', (req, res) => {
    try {
      const db = router.db;
      const clientsConfig = db.get('clients_config').value();

      if (!clientsConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de clientes no encontrada'
        });
      }

      res.json({
        success: true,
        data: clientsConfig,
        meta: {
          version: clientsConfig.version
        }
      });

    } catch (error) {
      console.error('Clients config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de clientes'
      });
    }
  });

  /**
   * GET /api/config/drivers
   * Obtiene la configuración de conductores desde db.json
   */
  configRouter.get('/drivers', (req, res) => {
    try {
      const db = router.db;
      const driversConfig = db.get('drivers_config').value();

      if (!driversConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de conductores no encontrada'
        });
      }

      res.json({
        success: true,
        data: driversConfig,
        meta: {
          version: driversConfig.version
        }
      });

    } catch (error) {
      console.error('Drivers config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de conductores'
      });
    }
  });

  /**
   * GET /api/config/vehicles
   * Obtiene la configuración de vehículos desde db.json
   */
  configRouter.get('/vehicles', (req, res) => {
    try {
      const db = router.db;
      const vehiclesConfig = db.get('vehicles_config').value();

      if (!vehiclesConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de vehículos no encontrada'
        });
      }

      res.json({
        success: true,
        data: vehiclesConfig,
        meta: {
          version: vehiclesConfig.version
        }
      });

    } catch (error) {
      console.error('Vehicles config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de vehículos'
      });
    }
  });

  /**
   * GET /api/config/reservations
   * Obtiene la configuración de reservaciones desde db.json
   */
  configRouter.get('/reservations', (req, res) => {
    try {
      const db = router.db;
      const reservationsConfig = db.get('reservations_config').value();

      if (!reservationsConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de reservaciones no encontrada'
        });
      }

      res.json({
        success: true,
        data: reservationsConfig,
        meta: {
          version: reservationsConfig.version
        }
      });

    } catch (error) {
      console.error('Reservations config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de reservaciones'
      });
    }
  });

  /**
   * GET /api/config/marketplace
   * Obtiene la configuración del marketplace desde db.json
   */
  configRouter.get('/marketplace', (req, res) => {
    try {
      const db = router.db;
      const marketplaceConfig = db.get('marketplace_config').value();

      if (!marketplaceConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración del marketplace no encontrada'
        });
      }

      res.json({
        success: true,
        data: marketplaceConfig,
        meta: {
          version: marketplaceConfig.version
        }
      });

    } catch (error) {
      console.error('Marketplace config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración del marketplace'
      });
    }
  });

  /**
   * GET /api/config/monitoring
   * Obtiene la configuración del sistema de monitoreo desde db.json
   */
  configRouter.get('/monitoring', (req, res) => {
    try {
      const db = router.db;
      const monitoringConfig = db.get('monitoring_config').value();

      if (!monitoringConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración del monitoreo no encontrada'
        });
      }

      res.json({
        success: true,
        data: monitoringConfig,
        meta: {
          version: monitoringConfig.version
        }
      });

    } catch (error) {
      console.error('Monitoring config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración del monitoreo'
      });
    }
  });

  /**
   * GET /api/config/auth
   * Obtiene la configuración de autenticación desde db.json
   */
  configRouter.get('/auth', (req, res) => {
    try {
      const db = router.db;
      const authConfig = db.get('auth_config').value();

      if (!authConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de autenticación no encontrada'
        });
      }

      res.json({
        success: true,
        data: authConfig,
        meta: {
          version: authConfig.version
        }
      });

    } catch (error) {
      console.error('Auth config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de autenticación'
      });
    }
  });

  /**
   * GET /api/config/feedback
   * Obtiene la configuración de feedback desde db.json
   */
  configRouter.get('/feedback', (req, res) => {
    try {
      const db = router.db;
      const feedbackConfig = db.get('feedback_config').value();

      if (!feedbackConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de feedback no encontrada'
        });
      }

      res.json({
        success: true,
        data: feedbackConfig,
        meta: {
          version: feedbackConfig.version
        }
      });

    } catch (error) {
      console.error('Feedback config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de feedback'
      });
    }
  });

  /**
   * GET /api/config/ratings
   * Obtiene la configuración de ratings desde db.json
   */
  configRouter.get('/ratings', (req, res) => {
    try {
      const db = router.db;
      const ratingsConfig = db.get('ratings_config').value();

      if (!ratingsConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de ratings no encontrada'
        });
      }

      res.json({
        success: true,
        data: ratingsConfig,
        meta: {
          version: ratingsConfig.version
        }
      });

    } catch (error) {
      console.error('Ratings config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de ratings'
      });
    }
  });

  /**
   * GET /api/config/rewards
   * Obtiene la configuración de sistema de recompensas desde db.json
   */
  configRouter.get('/rewards', (req, res) => {
    try {
      const db = router.db;
      const rewardsConfig = db.get('rewards_config').value();

      if (!rewardsConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de recompensas no encontrada'
        });
      }

      res.json({
        success: true,
        data: rewardsConfig,
        meta: {
          version: rewardsConfig.version
        }
      });

    } catch (error) {
      console.error('Rewards config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de recompensas'
      });
    }
  });

  /**
   * GET /api/config/assignments
   * Obtiene la configuración de asignaciones desde db.json
   */
  configRouter.get('/assignments', (req, res) => {
    try {
      const db = router.db;
      const assignmentsConfig = db.get('assignments_config').value();

      if (!assignmentsConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de asignaciones no encontrada'
        });
      }

      res.json({
        success: true,
        data: assignmentsConfig,
        meta: {
          version: assignmentsConfig.version
        }
      });

    } catch (error) {
      console.error('Assignments config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de asignaciones'
      });
    }
  });

  /**
   * GET /api/config/providers
   * Obtiene la configuración de proveedores desde db.json
   */
  configRouter.get('/providers', (req, res) => {
    try {
      const db = router.db;
      const providersConfig = db.get('providers_config').value();

      if (!providersConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de proveedores no encontrada'
        });
      }

      res.json({
        success: true,
        data: providersConfig,
        meta: {
          version: providersConfig.version
        }
      });

    } catch (error) {
      console.error('Providers config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de proveedores'
      });
    }
  });

  /**
   * GET /api/config/settings
   * Obtiene la configuración de settings desde db.json
   */
  configRouter.get('/settings-config', (req, res) => {
    try {
      const db = router.db;
      const settingsConfig = db.get('settings_config').value();

      if (!settingsConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de settings no encontrada'
        });
      }

      res.json({
        success: true,
        data: settingsConfig,
        meta: {
          version: settingsConfig.version
        }
      });

    } catch (error) {
      console.error('Settings config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de settings'
      });
    }
  });

  /**
   * GET /api/config/profile
   * Obtiene la configuración de profile desde db.json
   */
  configRouter.get('/profile', (req, res) => {
    try {
      const db = router.db;
      const profileConfig = db.get('profile_config').value();

      if (!profileConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de profile no encontrada'
        });
      }

      res.json({
        success: true,
        data: profileConfig,
        meta: {
          version: profileConfig.version
        }
      });

    } catch (error) {
      console.error('Profile config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de profile'
      });
    }
  });

  /**
   * GET /api/config/upload
   * Obtiene la configuración de uploads desde db.json
   */
  configRouter.get('/upload', (req, res) => {
    try {
      const db = router.db;
      const uploadConfig = db.get('upload_config').value();

      if (!uploadConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de uploads no encontrada'
        });
      }

      res.json({
        success: true,
        data: uploadConfig,
        meta: {
          version: uploadConfig.version
        }
      });

    } catch (error) {
      console.error('Upload config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de uploads'
      });
    }
  });

  /**
   * GET /api/config/modules
   * Obtiene toda la configuración de módulos en una sola llamada
   */
  configRouter.get('/modules', (req, res) => {
    try {
      const db = router.db;

      const modulesConfig = {
        agencies: db.get('agencies_config').value() || null,
        calendar: db.get('calendar_config').value() || null,
        clients: db.get('clients_config').value() || null,
        drivers: db.get('drivers_config').value() || null,
        vehicles: db.get('vehicles_config').value() || null,
        reservations: db.get('reservations_config').value() || null,
        marketplace: db.get('marketplace_config').value() || null,
        monitoring: db.get('monitoring_config').value() || null,
        auth: db.get('auth_config').value() || null,
        feedback: db.get('feedback_config').value() || null,
        ratings: db.get('ratings_config').value() || null,
        rewards: db.get('rewards_config').value() || null,
        assignments: db.get('assignments_config').value() || null,
        providers: db.get('providers_config').value() || null,
        settings: db.get('settings_config').value() || null,
        profile: db.get('profile_config').value() || null,
        upload: db.get('upload_config').value() || null,
        system: db.get('system_config').value() || null
      };

      res.json({
        success: true,
        data: modulesConfig,
        meta: {
          timestamp: new Date().toISOString(),
          loadedModules: Object.keys(modulesConfig).filter(key => modulesConfig[key] !== null)
        }
      });

    } catch (error) {
      console.error('Modules config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de módulos'
      });
    }
  });

  return configRouter;
};