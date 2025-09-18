const express = require('express');
const _ = require('lodash');

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

      res.json({
        success: true,
        data: guidesWithUsers,
        total: guidesWithUsers.length,
        filters: {
          specialization,
          language,
          date,
          minRating,
          maxPrice
        }
      });

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

  return marketplaceRouter;
};