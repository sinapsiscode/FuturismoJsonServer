const express = require('express');
const { successResponse, errorResponse } = require('../middlewares/helpers');

module.exports = (router) => {
  const appRouter = express.Router();

  // Get complete app initialization data
  appRouter.get('/init', (req, res) => {
    try {
      const { role, userId } = req.query;
      const db = router.db;

      const initData = {
        user: null,
        constants: {},
        dashboard: {},
        navigation: [],
        permissions: {},
        recent_data: {}
      };

      // Get user data if provided
      if (userId) {
        const user = db.get('users').find({ id: userId }).value();
        if (user) {
          initData.user = {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            last_login_at: user.last_login_at
          };
        }
      }

      // Get constants
      initData.constants = {
        USER_ROLES: {
          ADMIN: 'admin',
          AGENCY: 'agency',
          GUIDE: 'guide',
          CLIENT: 'client'
        },
        RESERVATION_STATUS: {
          PENDING: 'pending',
          CONFIRMED: 'confirmed',
          IN_PROGRESS: 'in_progress',
          COMPLETED: 'completed',
          CANCELLED: 'cancelled'
        },
        SERVICE_CATEGORIES: {
          TOURS: 'tours',
          ACCOMMODATION: 'accommodation',
          TRANSPORT: 'transport',
          ACTIVITIES: 'activities',
          MEALS: 'meals'
        },
        TOUR_TYPES: [
          { id: 'cultural', name: 'Cultural', icon: '🏛️' },
          { id: 'adventure', name: 'Aventura', icon: '🏔️' },
          { id: 'gastronomic', name: 'Gastronómico', icon: '🍽️' },
          { id: 'nature', name: 'Naturaleza', icon: '🌿' },
          { id: 'historical', name: 'Histórico', icon: '🏺' }
        ],
        LANGUAGES: [
          { id: 'es', name: 'Español', flag: '🇪🇸' },
          { id: 'en', name: 'English', flag: '🇺🇸' },
          { id: 'fr', name: 'Français', flag: '🇫🇷' },
          { id: 'pt', name: 'Português', flag: '🇧🇷' }
        ]
      };

      // Get role-specific navigation
      switch (role) {
        case 'admin':
          initData.navigation = [
            { id: 'dashboard', name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
            { id: 'users', name: 'Usuarios', icon: 'people', path: '/users' },
            { id: 'agencies', name: 'Agencias', icon: 'business', path: '/agencies' },
            { id: 'guides', name: 'Guías', icon: 'person', path: '/guides' },
            { id: 'services', name: 'Servicios', icon: 'room_service', path: '/services' },
            { id: 'reservations', name: 'Reservaciones', icon: 'event', path: '/reservations' },
            { id: 'statistics', name: 'Estadísticas', icon: 'analytics', path: '/statistics' },
            { id: 'emergency', name: 'Emergencias', icon: 'warning', path: '/emergency' }
          ];
          initData.permissions = {
            can_create_users: true,
            can_edit_services: true,
            can_view_all_reservations: true,
            can_manage_system: true
          };
          break;

        case 'agency':
          initData.navigation = [
            { id: 'dashboard', name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
            { id: 'marketplace', name: 'Marketplace', icon: 'store', path: '/marketplace' },
            { id: 'reservations', name: 'Mis Reservaciones', icon: 'event', path: '/reservations' },
            { id: 'services', name: 'Servicios', icon: 'room_service', path: '/services' },
            { id: 'clients', name: 'Clientes', icon: 'people', path: '/clients' },
            { id: 'profile', name: 'Perfil', icon: 'account_circle', path: '/profile' }
          ];
          initData.permissions = {
            can_create_reservations: true,
            can_search_guides: true,
            can_manage_clients: true,
            can_view_own_data: true
          };
          break;

        case 'guide':
          initData.navigation = [
            { id: 'dashboard', name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
            { id: 'marketplace', name: 'Solicitudes', icon: 'work', path: '/marketplace' },
            { id: 'tours', name: 'Mis Tours', icon: 'map', path: '/tours' },
            { id: 'schedule', name: 'Horarios', icon: 'schedule', path: '/schedule' },
            { id: 'earnings', name: 'Ingresos', icon: 'monetization_on', path: '/earnings' },
            { id: 'profile', name: 'Perfil', icon: 'account_circle', path: '/profile' }
          ];
          initData.permissions = {
            can_respond_requests: true,
            can_manage_tours: true,
            can_view_earnings: true,
            can_update_profile: true
          };
          break;

        case 'client':
          initData.navigation = [
            { id: 'dashboard', name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
            { id: 'services', name: 'Servicios', icon: 'room_service', path: '/services' },
            { id: 'reservations', name: 'Mis Reservaciones', icon: 'event', path: '/reservations' },
            { id: 'favorites', name: 'Favoritos', icon: 'favorite', path: '/favorites' },
            { id: 'profile', name: 'Perfil', icon: 'account_circle', path: '/profile' }
          ];
          initData.permissions = {
            can_make_reservations: true,
            can_view_services: true,
            can_manage_profile: true
          };
          break;

        default:
          initData.navigation = [
            { id: 'services', name: 'Servicios', icon: 'room_service', path: '/services' }
          ];
          initData.permissions = {
            can_view_services: true
          };
      }

      // Get dashboard data based on role
      if (role && userId) {
        switch (role) {
          case 'admin':
            const users = db.get('users').value() || [];
            const agencies = db.get('agencies').value() || [];
            const guides = db.get('guides').value() || [];
            const reservations = db.get('reservations').value() || [];

            initData.dashboard = {
              totalUsers: users.length,
              totalAgencies: agencies.length,
              totalGuides: guides.length,
              totalReservations: reservations.length,
              pendingReservations: reservations.filter(r => r.status === 'pending').length,
              activeServices: reservations.filter(r => r.status === 'confirmed').length
            };
            break;

          case 'agency':
            const agencyReservations = db.get('reservations').value() || [];
            initData.dashboard = {
              totalReservations: agencyReservations.length,
              confirmedReservations: agencyReservations.filter(r => r.status === 'confirmed').length,
              pendingReservations: agencyReservations.filter(r => r.status === 'pending').length,
              monthlyRevenue: agencyReservations.reduce((sum, r) => sum + (r.total_amount || 0), 0)
            };
            break;

          case 'guide':
            const guideData = db.get('guides').find({ user_id: userId }).value();
            const guideReservations = guideData ?
              db.get('reservations').filter({ guide_id: guideData.id }).value() : [];

            initData.dashboard = {
              toursCompleted: guideReservations.filter(r => r.status === 'completed').length || 0,
              upcomingTours: guideReservations.filter(r => r.status === 'confirmed').length || 0,
              monthlyIncome: guideReservations.reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0,
              rating: guideData ? guideData.rating : 0
            };
            break;
        }
      }

      // Get recent data
      initData.recent_data = {
        recent_reservations: db.get('reservations').take(5).value() || [],
        recent_services: db.get('services').take(5).value() || [],
        recent_notifications: db.get('notifications').filter({ user_id: userId }).take(5).value() || []
      };

      res.json(successResponse(initData));

    } catch (error) {
      console.error('Error getting app init data:', error);
      res.status(500).json(errorResponse('Error al obtener datos de inicialización'));
    }
  });

  // Get all data for specific role functionality
  appRouter.get('/role-data/:role', (req, res) => {
    try {
      const { role } = req.params;
      const { userId } = req.query;
      const db = router.db;

      let roleData = {};

      switch (role) {
        case 'admin':
          roleData = {
            users: db.get('users').value() || [],
            agencies: db.get('agencies').value() || [],
            guides: db.get('guides').value() || [],
            services: db.get('services').value() || [],
            reservations: db.get('reservations').value() || [],
            statistics: {
              total_users: db.get('users').size().value(),
              total_revenue: db.get('reservations').sumBy('total_amount').value() || 0,
              active_guides: db.get('guides').filter({ status: 'active' }).size().value()
            }
          };
          break;

        case 'agency':
          const agencyUser = db.get('users').find({ id: userId }).value();
          const agency = agencyUser ? db.get('agencies').find({ user_id: userId }).value() : null;

          roleData = {
            agency_info: agency,
            available_guides: db.get('guides').filter({ status: 'active' }).value() || [],
            services: db.get('services').filter({ status: 'active' }).value() || [],
            my_reservations: db.get('reservations').filter({ agency_id: agency?.id }).value() || [],
            marketplace_requests: db.get('marketplace_requests').value() || []
          };
          break;

        case 'guide':
          const guide = db.get('guides').find({ user_id: userId }).value();

          roleData = {
            guide_info: guide,
            my_tours: guide ? db.get('reservations').filter({ guide_id: guide.id }).value() : [],
            available_requests: db.get('marketplace_requests').filter({ status: 'open' }).value() || [],
            earnings: guide ? db.get('reservations')
              .filter({ guide_id: guide.id, status: 'completed' })
              .sumBy('total_amount').value() || 0 : 0
          };
          break;

        case 'client':
          roleData = {
            available_services: db.get('services').filter({ status: 'active' }).value() || [],
            my_reservations: db.get('reservations').filter({ client_id: userId }).value() || [],
            favorite_guides: [],
            booking_history: db.get('reservations')
              .filter({ client_id: userId, status: 'completed' })
              .value() || []
          };
          break;
      }

      res.json(successResponse(roleData));

    } catch (error) {
      console.error('Error getting role data:', error);
      res.status(500).json(errorResponse('Error al obtener datos del rol'));
    }
  });

  return appRouter;
};