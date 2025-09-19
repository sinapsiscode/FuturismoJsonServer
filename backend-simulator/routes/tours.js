const express = require('express');

module.exports = (router) => {
  const toursRouter = express.Router();

  // Get extended tours
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

  // Get tour by ID
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

  return toursRouter;
};