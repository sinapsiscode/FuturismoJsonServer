const express = require('express');
const _ = require('lodash');
const { generateId, paginate, filterBy, sortBy, successResponse, errorResponse } = require('../middlewares/helpers');

module.exports = (router) => {
  const marketplaceRouter = express.Router();

  // Search guides
  marketplaceRouter.get('/search', (req, res) => {
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
  marketplaceRouter.get('/requests', (req, res) => {
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
  marketplaceRouter.post('/requests', (req, res) => {
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
  marketplaceRouter.get('/requests/:id/responses', (req, res) => {
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
  marketplaceRouter.post('/requests/:id/respond', (req, res) => {
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
  marketplaceRouter.post('/responses/:responseId/accept', (req, res) => {
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
  marketplaceRouter.get('/popular-guides', (req, res) => {
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
  marketplaceRouter.get('/stats', (req, res) => {
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