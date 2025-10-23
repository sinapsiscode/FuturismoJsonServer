const express = require('express');

module.exports = (router) => {
  const configRouter = express.Router();

  // Get all app constants and configurations
  configRouter.get('/constants', (req, res) => {
    try {
      const db = router.db;
      const constants = db.get('app_constants').value();

      if (!constants) {
        return res.status(404).json({
          success: false,
          error: 'Constantes de aplicación no encontradas'
        });
      }

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
      const workZones = db.get('work_zones').value();

      if (!workZones) {
        return res.status(404).json({
          success: false,
          error: 'Zonas de trabajo no encontradas'
        });
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
      const tourTypes = db.get('tour_types').value();

      if (!tourTypes) {
        return res.status(404).json({
          success: false,
          error: 'Tipos de tour no encontrados'
        });
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
      const groupTypes = db.get('group_types').value();

      if (!groupTypes) {
        return res.status(404).json({
          success: false,
          error: 'Tipos de grupo no encontrados'
        });
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
      const languages = db.get('languages').value();

      if (!languages) {
        return res.status(404).json({
          success: false,
          error: 'Idiomas no encontrados'
        });
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

  /**
   * GET /api/config/settings
   * @deprecated Usar /api/config/app o /api/config/system en su lugar
   * Este endpoint es legacy y mezcla configuración hardcodeada con env vars
   */
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
   * GET /api/config/service-types
   * Obtiene los tipos de servicio desde db.json
   */
  configRouter.get('/service-types', (req, res) => {
    try {
      const db = router.db;
      const serviceTypesConfig = db.get('service_types_config').value();

      if (!serviceTypesConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de tipos de servicio no encontrada'
        });
      }

      res.json({
        success: true,
        data: serviceTypesConfig,
        meta: {
          version: serviceTypesConfig.version
        }
      });

    } catch (error) {
      console.error('Service types config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de servicio'
      });
    }
  });

  /**
   * POST /api/config/service-types
   * Crea un nuevo tipo de servicio
   */
  configRouter.post('/service-types', (req, res) => {
    try {
      const db = router.db;
      const { value, label, description, icon, category } = req.body;

      if (!value || !label) {
        return res.status(400).json({
          success: false,
          error: 'Los campos value y label son requeridos'
        });
      }

      const serviceTypesConfig = db.get('service_types_config').value();

      // Verificar si ya existe
      const exists = serviceTypesConfig.serviceTypes.some(st => st.value === value);
      if (exists) {
        return res.status(409).json({
          success: false,
          error: 'Ya existe un tipo de servicio con ese valor'
        });
      }

      const newServiceType = {
        value,
        label,
        description: description || '',
        icon: icon || 'briefcase',
        category: category || 'general'
      };

      serviceTypesConfig.serviceTypes.push(newServiceType);
      db.get('service_types_config').assign(serviceTypesConfig).write();

      res.status(201).json({
        success: true,
        data: newServiceType,
        message: 'Tipo de servicio creado exitosamente'
      });

    } catch (error) {
      console.error('Error creating service type:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear tipo de servicio'
      });
    }
  });

  /**
   * PUT /api/config/service-types/:value
   * Actualiza un tipo de servicio existente
   */
  configRouter.put('/service-types/:value', (req, res) => {
    try {
      const db = router.db;
      const { value: oldValue } = req.params;
      const { value, label, description, icon, category } = req.body;

      const serviceTypesConfig = db.get('service_types_config').value();
      const index = serviceTypesConfig.serviceTypes.findIndex(st => st.value === oldValue);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de servicio no encontrado'
        });
      }

      const updatedServiceType = {
        value: value || oldValue,
        label: label || serviceTypesConfig.serviceTypes[index].label,
        description: description !== undefined ? description : serviceTypesConfig.serviceTypes[index].description,
        icon: icon || serviceTypesConfig.serviceTypes[index].icon,
        category: category || serviceTypesConfig.serviceTypes[index].category
      };

      serviceTypesConfig.serviceTypes[index] = updatedServiceType;
      db.get('service_types_config').assign(serviceTypesConfig).write();

      res.json({
        success: true,
        data: updatedServiceType,
        message: 'Tipo de servicio actualizado exitosamente'
      });

    } catch (error) {
      console.error('Error updating service type:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar tipo de servicio'
      });
    }
  });

  /**
   * DELETE /api/config/service-types/:value
   * Elimina un tipo de servicio
   */
  configRouter.delete('/service-types/:value', (req, res) => {
    try {
      const db = router.db;
      const { value } = req.params;

      const serviceTypesConfig = db.get('service_types_config').value();
      const initialLength = serviceTypesConfig.serviceTypes.length;

      serviceTypesConfig.serviceTypes = serviceTypesConfig.serviceTypes.filter(st => st.value !== value);

      if (serviceTypesConfig.serviceTypes.length === initialLength) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de servicio no encontrado'
        });
      }

      db.get('service_types_config').assign(serviceTypesConfig).write();

      res.json({
        success: true,
        message: 'Tipo de servicio eliminado exitosamente',
        data: { value }
      });

    } catch (error) {
      console.error('Error deleting service type:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar tipo de servicio'
      });
    }
  });

  /**
   * GET /api/config/payment-methods
   * Obtiene los métodos de pago disponibles
   */
  configRouter.get('/payment-methods', (req, res) => {
    try {
      const db = router.db;
      const paymentMethods = db.get('payment_methods').value() || [];

      res.json({
        success: true,
        data: paymentMethods.filter(pm => pm.enabled !== false)
      });
    } catch (error) {
      console.error('Payment methods error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener métodos de pago'
      });
    }
  });

  /**
   * POST /api/config/payment-methods
   * Crea un nuevo método de pago
   */
  configRouter.post('/payment-methods', (req, res) => {
    try {
      const db = router.db;
      const { id, name, description, icon } = req.body;

      if (!id || !name) {
        return res.status(400).json({
          success: false,
          error: 'Los campos id y name son requeridos'
        });
      }

      const paymentMethods = db.get('payment_methods').value() || [];

      // Verificar si ya existe
      const exists = paymentMethods.some(pm => pm.id === id);
      if (exists) {
        return res.status(409).json({
          success: false,
          error: 'Ya existe un método de pago con ese ID'
        });
      }

      const newPaymentMethod = {
        id,
        name,
        description: description || '',
        icon: icon || 'credit-card',
        enabled: true
      };

      paymentMethods.push(newPaymentMethod);
      db.set('payment_methods', paymentMethods).write();

      res.status(201).json({
        success: true,
        data: newPaymentMethod,
        message: 'Método de pago creado exitosamente'
      });
    } catch (error) {
      console.error('Error creating payment method:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear método de pago'
      });
    }
  });

  /**
   * PUT /api/config/payment-methods/:id
   * Actualiza un método de pago existente
   */
  configRouter.put('/payment-methods/:id', (req, res) => {
    try {
      const db = router.db;
      const { id: oldId } = req.params;
      const { id, name, description, icon, enabled } = req.body;

      const paymentMethods = db.get('payment_methods').value() || [];
      const index = paymentMethods.findIndex(pm => pm.id === oldId);

      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'Método de pago no encontrado'
        });
      }

      const updatedPaymentMethod = {
        id: id || oldId,
        name: name || paymentMethods[index].name,
        description: description !== undefined ? description : paymentMethods[index].description,
        icon: icon || paymentMethods[index].icon,
        enabled: enabled !== undefined ? enabled : paymentMethods[index].enabled
      };

      paymentMethods[index] = updatedPaymentMethod;
      db.set('payment_methods', paymentMethods).write();

      res.json({
        success: true,
        data: updatedPaymentMethod,
        message: 'Método de pago actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar método de pago'
      });
    }
  });

  /**
   * DELETE /api/config/payment-methods/:id
   * Elimina un método de pago
   */
  configRouter.delete('/payment-methods/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const paymentMethods = db.get('payment_methods').value() || [];
      const initialLength = paymentMethods.length;

      const filtered = paymentMethods.filter(pm => pm.id !== id);

      if (filtered.length === initialLength) {
        return res.status(404).json({
          success: false,
          error: 'Método de pago no encontrado'
        });
      }

      db.set('payment_methods', filtered).write();

      res.json({
        success: true,
        message: 'Método de pago eliminado exitosamente',
        data: { id }
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar método de pago'
      });
    }
  });

  /**
   * GET /api/config/shared
   * Obtiene las constantes compartidas desde db.json
   */
  configRouter.get('/shared', (req, res) => {
    try {
      const db = router.db;
      const sharedConfig = db.get('shared_config').value();

      if (!sharedConfig) {
        return res.status(404).json({
          success: false,
          error: 'Constantes compartidas no encontradas'
        });
      }

      res.json({
        success: true,
        data: sharedConfig,
        meta: {
          version: sharedConfig.version
        }
      });

    } catch (error) {
      console.error('Shared config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener constantes compartidas'
      });
    }
  });

  /**
   * GET /api/config/core-services
   * Obtiene la configuración de servicios centrales desde db.json
   */
  configRouter.get('/core-services', (req, res) => {
    try {
      const db = router.db;
      const coreServicesConfig = db.get('core_services_config').value();

      if (!coreServicesConfig) {
        return res.status(404).json({
          success: false,
          error: 'Configuración de servicios centrales no encontrada'
        });
      }

      res.json({
        success: true,
        data: coreServicesConfig,
        meta: {
          version: coreServicesConfig.version
        }
      });

    } catch (error) {
      console.error('Core services config error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de servicios centrales'
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
        system: db.get('system_config').value() || null,
        emergency: db.get('emergency_config').value() || null,
        guides: db.get('guides_config').value() || null,
        app: db.get('app_config').value() || null,
        coreServices: db.get('core_services_config').value() || null,
        shared: db.get('shared_config').value() || null,
        serviceTypes: db.get('service_types_config').value() || null
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