const express = require('express');

module.exports = (router) => {
  const systemRouter = express.Router();

  // Get system information and all configurations
  systemRouter.get('/info', (req, res) => {
    try {
      const systemInfo = {
        app: {
          name: 'Futurismo JSON Server',
          version: '1.0.0',
          environment: 'development',
          api_version: 'v1',
          status: 'running'
        },
        endpoints: {
          auth: [
            'POST /api/auth/login',
            'POST /api/auth/logout',
            'GET /api/auth/me'
          ],
          config: [
            'GET /api/config/constants',
            'GET /api/config/work-zones',
            'GET /api/config/tour-types',
            'GET /api/config/group-types',
            'GET /api/config/languages',
            'GET /api/config/settings'
          ],
          validators: [
            'POST /api/validators/email',
            'POST /api/validators/phone',
            'POST /api/validators/reservation',
            'POST /api/validators/user-registration',
            'POST /api/validators/service'
          ],
          utils: [
            'POST /api/utils/format-currency',
            'POST /api/utils/format-date',
            'GET /api/utils/generate-id/:prefix?',
            'POST /api/utils/calculate-distance',
            'GET /api/utils/weather/:location?',
            'GET /api/utils/timezone/:timezone?',
            'POST /api/utils/calculate-price'
          ],
          services: [
            'GET /api/services',
            'GET /api/services/:id',
            'POST /api/services',
            'PUT /api/services/:id',
            'DELETE /api/services/:id',
            'GET /api/services/:id/pricing',
            'GET /api/services/:id/availability'
          ],
          dashboard: [
            'GET /api/dashboard/stats',
            'GET /api/dashboard/monthly-data',
            'GET /api/dashboard/chart-data',
            'GET /api/dashboard/kpis',
            'GET /api/dashboard/summary'
          ],
          clients: [
            'GET /api/clients',
            'GET /api/clients/:id'
          ],
          tours: [
            'GET /api/tours',
            'GET /api/tours/:id'
          ],
          providers: [
            'GET /api/providers',
            'GET /api/providers/:id'
          ],
          notifications: [
            'GET /api/notifications',
            'POST /api/notifications',
            'PUT /api/notifications/:id/read'
          ],
          emergency: [
            'GET /api/emergency',
            'POST /api/emergency',
            'PUT /api/emergency/:id'
          ],
          profile: [
            'GET /api/profile/:userId',
            'PUT /api/profile/:userId'
          ],
          reservations: [
            'GET /api/reservations',
            'GET /api/reservations/:id',
            'POST /api/reservations',
            'PUT /api/reservations/:id'
          ],
          statistics: [
            'GET /api/statistics',
            'GET /api/statistics/revenue',
            'GET /api/statistics/bookings'
          ]
        },
        database_collections: [
          'users',
          'agencies',
          'guides',
          'clients',
          'services',
          'tours',
          'reservations',
          'notifications',
          'emergency_alerts',
          'financial_transactions',
          'dashboard_stats',
          'work_zones',
          'tour_types',
          'group_types',
          'languages'
        ],
        features: {
          authentication: true,
          authorization: true,
          validation: true,
          formatting: true,
          calculations: true,
          filters_and_search: true,
          pagination: true,
          sorting: true,
          real_time_data: true,
          mock_data_generation: true
        }
      };

      res.json({
        success: true,
        data: systemInfo,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error getting system info:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener información del sistema'
      });
    }
  });

  // Get API documentation
  systemRouter.get('/docs', (req, res) => {
    try {
      const documentation = {
        title: 'Futurismo API Documentation',
        version: '1.0.0',
        description: 'Complete API for Futurismo tourism management system',
        base_url: 'http://localhost:4050/api',
        authentication: {
          type: 'Bearer Token',
          login_endpoint: '/api/auth/login',
          example: 'Authorization: Bearer your-jwt-token'
        },
        endpoints: {
          authentication: {
            login: {
              method: 'POST',
              url: '/api/auth/login',
              body: {
                email: 'string (required)',
                password: 'string (required)'
              },
              response: {
                success: 'boolean',
                data: {
                  token: 'string',
                  user: 'object'
                }
              }
            },
            me: {
              method: 'GET',
              url: '/api/auth/me',
              headers: {
                'Authorization': 'Bearer token'
              },
              response: {
                success: 'boolean',
                data: 'user object'
              }
            }
          },
          services: {
            list: {
              method: 'GET',
              url: '/api/services',
              query_params: {
                category: 'string (optional)',
                status: 'string (optional)',
                location: 'string (optional)',
                min_price: 'number (optional)',
                max_price: 'number (optional)',
                search: 'string (optional)',
                sort_by: 'string (optional)',
                sort_order: 'asc|desc (optional)',
                page: 'number (optional)',
                limit: 'number (optional)'
              }
            },
            create: {
              method: 'POST',
              url: '/api/services',
              body: {
                name: 'string (required)',
                description: 'string (required)',
                category: 'string (required)',
                price: 'number (required)',
                duration: 'string (required)',
                currency: 'string (optional)',
                max_group_size: 'number (optional)',
                included: 'array (optional)',
                excluded: 'array (optional)',
                location: 'string (optional)'
              }
            }
          }
        },
        error_codes: {
          400: 'Bad Request - Invalid parameters',
          401: 'Unauthorized - Authentication required',
          404: 'Not Found - Resource not found',
          500: 'Internal Server Error'
        },
        response_format: {
          success_response: {
            success: true,
            data: 'object|array',
            message: 'string (optional)'
          },
          error_response: {
            success: false,
            error: 'string',
            code: 'number (optional)'
          }
        }
      };

      res.json({
        success: true,
        data: documentation
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener documentación'
      });
    }
  });

  // Health check endpoint
  systemRouter.get('/health', (req, res) => {
    try {
      const db = router.db;
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        database: {
          connected: !!db,
          collections_count: db ? Object.keys(db.getState()).length : 0
        },
        environment: {
          node_version: process.version,
          platform: process.platform,
          arch: process.arch
        }
      };

      res.json({
        success: true,
        data: health
      });

    } catch (error) {
      res.status(503).json({
        success: false,
        error: 'Service unavailable',
        timestamp: new Date().toISOString()
      });
    }
  });

  return systemRouter;
};