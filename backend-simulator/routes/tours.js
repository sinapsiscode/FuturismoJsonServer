const express = require('express');

module.exports = (router) => {
  const toursRouter = express.Router();

  // NOTE: Specific routes MUST come before parameterized routes like /:id

  // Get extended tours (specific route)
  toursRouter.get('/extended', (req, res) => {
    try {
      const db = router.db;
      const toursExtended = db.get('tours_extended').value() || [];

      res.json({
        success: true,
        data: toursExtended
      });

    } catch (error) {
      console.error('Tours extended error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tours extendidos'
      });
    }
  });

  // Get extended tour by ID (specific route)
  toursRouter.get('/extended/:id', (req, res) => {
    try {
      const db = router.db;
      const tour = db.get('tours_extended').find({ id: req.params.id }).value();

      if (!tour) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      res.json({
        success: true,
        data: tour
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener el tour'
      });
    }
  });

  // Get all tours (base endpoint)
  toursRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      let tours = db.get('tours').value() || [];

      // Apply filters if provided
      const { status, category, search } = req.query;

      if (status) {
        tours = tours.filter(t => t.status === status);
      }

      if (category) {
        tours = tours.filter(t => t.category === category);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        tours = tours.filter(t =>
          t.name?.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower)
        );
      }

      res.json({
        success: true,
        data: tours,
        total: tours.length
      });

    } catch (error) {
      console.error('Tours error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tours'
      });
    }
  });

  // Get tour by ID (parameterized route - MUST be last)
  toursRouter.get('/:id', (req, res) => {
    try {
      const db = router.db;
      const tour = db.get('tours').find({ id: req.params.id }).value();

      if (!tour) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      res.json({
        success: true,
        data: tour
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener el tour'
      });
    }
  });

  return toursRouter;
};