const express = require('express');
const _ = require('lodash');
const { generateId, paginate, filterBy, sortBy, successResponse, errorResponse } = require('../middlewares/helpers');
const { authenticated, adminOrAgency, freelanceGuidesOnly } = require('../middlewares/authorize');

module.exports = (router) => {
  const marketplaceRouter = express.Router();

  // IMPORTANT: More specific routes must come BEFORE general routes
  // Otherwise Express will match the general route first

  // Get guide reviews
  // Accessible to all authenticated users
  marketplaceRouter.get('/guides/:guideId/reviews', authenticated(), (req, res) => {
    try {
      const db = router.db;
      const { guideId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // For now, return empty reviews array
      // TODO: Implement actual reviews system
      res.json({
        success: true,
        data: {
          reviews: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            totalPages: 0
          },
          summary: {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: {
              5: 0,
              4: 0,
              3: 0,
              2: 0,
              1: 0
            }
          }
        }
      });

    } catch (error) {
      console.error('Error fetching guide reviews:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener reseñas del guía'
      });
    }
  });

  // Get individual guide profile
  // Accessible to all authenticated users
  marketplaceRouter.get('/guides/:guideId', authenticated(), (req, res) => {
    try {
      const db = router.db;
      const { guideId } = req.params;

      const guide = db.get('guides').find({ id: guideId }).value();

      if (!guide) {
        return res.status(404).json({
          success: false,
          error: 'Guía no encontrado'
        });
      }

      // Get user data
      const users = db.get('users').value() || [];
      const user = users.find(u => u.id === guide.user_id);

      // Build name from guide data directly if available
      const firstName = guide.first_name || guide.firstName || user?.first_name || '';
      const lastName = guide.last_name || guide.lastName || user?.last_name || '';
      const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : guide.name || 'Unknown';

      // Build complete profile
      const guideProfile = {
        ...guide,
        name: fullName,
        fullName: fullName,
        avatar: user?.avatar || guide.avatar || null,
        phone: user?.phone || guide.phone || null,
        email: user?.email || guide.email || null,
        // Include marketplace profile info
        hourlyRate: guide.marketplace_profile?.hourly_rate || guide.base_price || 25,
        hourly_rate: guide.marketplace_profile?.hourly_rate || guide.base_price || 25,
        daily_rate: guide.marketplace_profile?.daily_rate || null,
        half_day_rate: guide.marketplace_profile?.half_day_rate || null,
        available_for_booking: guide.marketplace_profile?.available !== false,
        // Ensure we have required fields
        rating: guide.rating || 0,
        reviewCount: guide.review_count || guide.reviewCount || 0,
        workZones: guide.work_zones || guide.workZones || [],
        bio: guide.bio || guide.description || '',
        status: guide.status || 'available',
        languages: guide.languages || [],
        specializations: {
          languages: guide.languages || [],
          tourTypes: guide.specializations || guide.specialties || [],
          museums: guide.museums || [],
          workZones: guide.work_zones || guide.workZones || []
        },
        certifications: guide.certifications || [],
        experience_years: guide.experience_years || 0,
        completed_tours: guide.completed_tours || 0,
        // Profile details for the marketplace view
        profile: {
          bio: guide.bio || guide.description || '',
          specializations: guide.specializations || guide.specialties || [],
          languages: guide.languages || [],
          workZones: guide.work_zones || guide.workZones || [],
          museums: guide.museums || [],
          tourTypes: guide.tour_types || guide.tourTypes || [],
          groupTypes: guide.group_types || guide.groupTypes || [],
          certifications: guide.certifications || [],
          photos: guide.photos || [],
          video_url: guide.video_url || null
        },
        // Pricing
        pricing: {
          hourlyRate: guide.marketplace_profile?.hourly_rate || guide.base_price || 25,
          dailyRate: guide.marketplace_profile?.daily_rate || null,
          halfDayRate: guide.marketplace_profile?.half_day_rate || null,
          fullDayRate: guide.marketplace_profile?.daily_rate || null
        },
        // Preferences (defaults for booking)
        preferences: {
          minBookingHours: guide.preferences?.minBookingHours || 2,
          maxGroupSize: guide.preferences?.maxGroupSize || 50,
          advanceBookingDays: guide.preferences?.advanceBookingDays || 1,
          requiresDeposit: guide.preferences?.requiresDeposit || false,
          depositPercentage: guide.preferences?.depositPercentage || 30,
          cancellationPolicy: guide.preferences?.cancellationPolicy || 'Cancelación gratuita hasta 24 horas antes del servicio. Después de ese tiempo, se cobrará el 50% del total.'
        },
        // Stats
        stats: {
          rating: guide.rating || 0,
          reviewCount: guide.review_count || guide.reviewCount || 0,
          completedTours: guide.completed_tours || 0,
          experienceYears: guide.experience_years || 0
        },
        // Marketplace Stats
        marketplaceStats: {
          responseTime: guide.marketplaceStats?.responseTime || '< 2 horas',
          acceptanceRate: guide.marketplaceStats?.acceptanceRate || 95,
          completionRate: guide.marketplaceStats?.completionRate || 98,
          repeatedClients: guide.marketplaceStats?.repeatedClients || 0
        },
        // Availability
        availability: {
          workingDays: guide.availability?.workingDays || [1, 2, 3, 4, 5, 6, 0], // Lunes a Domingo
          workingHours: guide.availability?.workingHours || { start: '08:00', end: '18:00' },
          blockedDates: guide.availability?.blockedDates || [],
          bookedDates: guide.availability?.bookedDates || []
        }
      };

      console.log(`[Marketplace] Returning profile for guide: ${guideId} - ${fullName}`);

      res.json({
        success: true,
        data: guideProfile
      });

    } catch (error) {
      console.error('Error fetching guide profile:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener perfil del guía'
      });
    }
  });

  // Get all freelance guides
  // Accessible to all authenticated users
  marketplaceRouter.get('/guides', authenticated(), (req, res) => {
    try {
      const db = router.db;
      let guides = db.get('guides').value() || [];
      const users = db.get('users').value() || [];

      // Filter only freelance guides
      guides = guides.filter(guide => guide.type === 'freelance');

      // Apply additional filters if provided
      const { status, availability, language, workZone, specialization, minRating, maxPrice } = req.query;

      // Handle status or availability filter
      const statusFilter = status || availability;
      if (statusFilter) {
        guides = guides.filter(guide => guide.status === statusFilter);
      }

      if (language) {
        guides = guides.filter(guide =>
          guide.languages && Array.isArray(guide.languages) && guide.languages.includes(language)
        );
      }

      if (workZone) {
        guides = guides.filter(guide => {
          const zones = guide.work_zones || guide.workZones || [];
          return Array.isArray(zones) && zones.some(zone =>
            zone.toLowerCase().includes(workZone.toLowerCase()) ||
            workZone.toLowerCase().includes(zone.toLowerCase())
          );
        });
      }

      if (specialization) {
        guides = guides.filter(guide =>
          (guide.specializations && Array.isArray(guide.specializations) && guide.specializations.includes(specialization)) ||
          (guide.specialties && Array.isArray(guide.specialties) && guide.specialties.includes(specialization))
        );
      }

      if (minRating) {
        guides = guides.filter(guide =>
          (guide.rating || 0) >= parseFloat(minRating)
        );
      }

      if (maxPrice) {
        guides = guides.filter(guide => {
          const price = guide.marketplace_profile?.hourly_rate || guide.base_price || 0;
          return price <= parseFloat(maxPrice);
        });
      }

      // Enrich with user data and marketplace info
      const guidesWithUsers = guides.map(guide => {
        const user = users.find(u => u.id === guide.user_id);

        // Build name from guide data directly if available
        const firstName = guide.first_name || guide.firstName || user?.first_name || '';
        const lastName = guide.last_name || guide.lastName || user?.last_name || '';
        const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : guide.name || 'Unknown';

        return {
          ...guide,
          name: fullName,
          avatar: user?.avatar || guide.avatar || null,
          phone: user?.phone || guide.phone || null,
          email: user?.email || guide.email || null,
          // Include marketplace profile info
          hourlyRate: guide.marketplace_profile?.hourly_rate || guide.base_price || 25,
          hourly_rate: guide.marketplace_profile?.hourly_rate || guide.base_price || 25,
          daily_rate: guide.marketplace_profile?.daily_rate,
          half_day_rate: guide.marketplace_profile?.half_day_rate,
          available_for_booking: guide.marketplace_profile?.available !== false,
          // Ensure we have required fields
          rating: guide.rating || 0,
          reviewCount: guide.review_count || guide.reviewCount || 0,
          workZones: guide.work_zones || guide.workZones || [],
          bio: guide.bio || guide.description || '',
          status: guide.status || 'available'
        };
      });

      console.log(`[Marketplace] Returning ${guidesWithUsers.length} freelance guides`);

      // Return in the format expected by the store
      res.json({
        success: true,
        data: {
          guides: guidesWithUsers,
          page: 1,
          pageSize: guidesWithUsers.length,
          total: guidesWithUsers.length,
          totalPages: 1
        }
      });

    } catch (error) {
      console.error('Error fetching marketplace guides:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener guías del marketplace'
      });
    }
  });

  // Search guides
  // Accessible to all authenticated users
  marketplaceRouter.get('/search', authenticated(), (req, res) => {
    try {
      const { specialization, language, date, minRating, maxPrice } = req.query;
      const db = router.db;
      let guides = db.get('guides').value();

      // Filter by specialization
      if (specialization) {
        guides = guides.filter(guide =>
          guide.specializations.includes(specialization)
        );
      }

      // Filter by language
      if (language) {
        guides = guides.filter(guide =>
          guide.languages.includes(language)
        );
      }

      // Filter by rating
      if (minRating) {
        guides = guides.filter(guide =>
          guide.rating >= parseFloat(minRating)
        );
      }

      // Filter by price
      if (maxPrice) {
        guides = guides.filter(guide =>
          guide.base_price <= parseFloat(maxPrice)
        );
      }

      // Get user data for each guide
      const users = db.get('users').value();
      const guidesWithUsers = guides.map(guide => {
        const user = users.find(u => u.id === guide.user_id);
        return {
          ...guide,
          name: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
          avatar: user ? user.avatar : null,
          phone: user ? user.phone : null
        };
      });

      // Add pagination and sorting
      const {
        page = 1,
        limit = 10,
        sort_by = 'rating',
        sort_order = 'desc'
      } = req.query;

      const sortedGuides = sortBy(guidesWithUsers, sort_by, sort_order);
      const paginatedResult = paginate(sortedGuides, parseInt(page), parseInt(limit));

      res.json(successResponse({
        guides: paginatedResult.data,
        pagination: paginatedResult.pagination,
        filters: {
          specialization,
          language,
          date,
          minRating,
          maxPrice
        }
      }));

    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        error: 'Error en la búsqueda'
      });
    }
  });

  // Get service requests
  // Accessible to agencies and guides (to see available requests)
  marketplaceRouter.get('/requests', authenticated(), (req, res) => {
    try {
      const db = router.db;
      const requests = db.get('marketplace_requests').value();

      res.json({
        success: true,
        data: requests
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener solicitudes'
      });
    }
  });

  // Create service request
  // Only agencies can create service requests
  marketplaceRouter.post('/requests', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const newRequest = {
        id: `request-${Date.now()}`,
        ...req.body,
        status: 'open',
        responses_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      db.get('marketplace_requests').push(newRequest).write();

      res.status(201).json({
        success: true,
        data: newRequest
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear solicitud'
      });
    }
  });

  // Get guide responses for a request
  // Agencies can view responses to their requests
  marketplaceRouter.get('/requests/:id/responses', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const responses = db.get('guide_responses')
        .filter({ request_id: req.params.id })
        .value();

      // Get guide and user data
      const guides = db.get('guides').value();
      const users = db.get('users').value();

      const responsesWithData = responses.map(response => {
        const guide = guides.find(g => g.id === response.guide_id);
        const user = users.find(u => u.id === guide?.user_id);

        return {
          ...response,
          guide: {
            ...guide,
            name: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
            avatar: user ? user.avatar : null
          }
        };
      });

      res.json({
        success: true,
        data: responsesWithData
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener respuestas'
      });
    }
  });

  // Submit response to service request (for guides)
  // Only freelance guides can respond to marketplace requests
  marketplaceRouter.post('/requests/:id/respond', freelanceGuidesOnly(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { guide_id, message, proposed_price, availability } = req.body;

      if (!guide_id || !message || !proposed_price) {
        return res.status(400).json(errorResponse('Campos requeridos: guide_id, message, proposed_price'));
      }

      const request = db.get('marketplace_requests').find({ id }).value();
      if (!request) {
        return res.status(404).json(errorResponse('Solicitud no encontrada'));
      }

      const newResponse = {
        id: generateId('response'),
        request_id: id,
        guide_id,
        message,
        proposed_price: parseFloat(proposed_price),
        availability,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      // Initialize guide_responses if it doesn't exist
      if (!db.has('guide_responses').value()) {
        db.set('guide_responses', []).write();
      }

      db.get('guide_responses').push(newResponse).write();

      // Update request response count
      db.get('marketplace_requests')
        .find({ id })
        .assign({
          responses_count: (request.responses_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .write();

      res.status(201).json(successResponse(newResponse, 'Respuesta enviada exitosamente'));

    } catch (error) {
      console.error('Error submitting response:', error);
      res.status(500).json(errorResponse('Error al enviar respuesta'));
    }
  });

  // Accept a guide response (for agencies/clients)
  // Only agencies can accept guide responses
  marketplaceRouter.post('/responses/:responseId/accept', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { responseId } = req.params;

      const response = db.get('guide_responses').find({ id: responseId }).value();
      if (!response) {
        return res.status(404).json(errorResponse('Respuesta no encontrada'));
      }

      const request = db.get('marketplace_requests').find({ id: response.request_id }).value();
      if (!request) {
        return res.status(404).json(errorResponse('Solicitud no encontrada'));
      }

      // Update response status
      db.get('guide_responses')
        .find({ id: responseId })
        .assign({
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .write();

      // Update request status
      db.get('marketplace_requests')
        .find({ id: response.request_id })
        .assign({
          status: 'assigned',
          assigned_guide_id: response.guide_id,
          updated_at: new Date().toISOString()
        })
        .write();

      // Reject other responses for this request
      db.get('guide_responses')
        .filter({ request_id: response.request_id })
        .filter(r => r.id !== responseId)
        .each(r => {
          r.status = 'rejected';
          r.rejected_at = new Date().toISOString();
        })
        .write();

      res.json(successResponse(null, 'Respuesta aceptada exitosamente'));

    } catch (error) {
      console.error('Error accepting response:', error);
      res.status(500).json(errorResponse('Error al aceptar respuesta'));
    }
  });

  // Get popular guides
  // Accessible to all authenticated users
  marketplaceRouter.get('/popular-guides', authenticated(), (req, res) => {
    try {
      const db = router.db;
      const guides = db.get('guides').value() || [];
      const users = db.get('users').value() || [];

      // Sort by rating and get top guides
      const popularGuides = guides
        .filter(guide => guide.status === 'active')
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10)
        .map(guide => {
          const user = users.find(u => u.id === guide.user_id);
          return {
            id: guide.id,
            name: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
            avatar: user ? user.avatar : null,
            rating: guide.rating || 0,
            specializations: guide.specializations || [],
            languages: guide.languages || [],
            base_price: guide.base_price || 0,
            completed_tours: guide.completed_tours || 0
          };
        });

      res.json(successResponse(popularGuides));

    } catch (error) {
      console.error('Error getting popular guides:', error);
      res.status(500).json(errorResponse('Error al obtener guías populares'));
    }
  });

  // Get marketplace statistics
  // Accessible to admins and agencies
  marketplaceRouter.get('/stats', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const guides = db.get('guides').value() || [];
      const requests = db.get('marketplace_requests').value() || [];
      const responses = db.get('guide_responses').value() || [];

      const stats = {
        total_guides: guides.length,
        active_guides: guides.filter(g => g.status === 'active').length,
        total_requests: requests.length,
        open_requests: requests.filter(r => r.status === 'open').length,
        assigned_requests: requests.filter(r => r.status === 'assigned').length,
        total_responses: responses.length,
        pending_responses: responses.filter(r => r.status === 'pending').length,
        average_rating: guides.length > 0 ?
          guides.reduce((sum, g) => sum + (g.rating || 0), 0) / guides.length : 0,
        price_range: {
          min: guides.length > 0 ? Math.min(...guides.map(g => g.base_price || 0)) : 0,
          max: guides.length > 0 ? Math.max(...guides.map(g => g.base_price || 0)) : 0
        }
      };

      res.json(successResponse(stats));

    } catch (error) {
      console.error('Error getting marketplace stats:', error);
      res.status(500).json(errorResponse('Error al obtener estadísticas del marketplace'));
    }
  });

  return marketplaceRouter;
};