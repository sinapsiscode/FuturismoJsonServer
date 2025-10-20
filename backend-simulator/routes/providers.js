const express = require('express');

module.exports = (router) => {
  const providersRouter = express.Router();

  // Get all locations
  providersRouter.get('/locations', (req, res) => {
    try {
      const db = router.db;
      const locations = db.get('provider_locations').value() || [];

      res.json({
        success: true,
        data: locations
      });
    } catch (error) {
      console.error('Error fetching provider locations:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener ubicaciones de proveedores'
      });
    }
  });

  // Get all categories
  providersRouter.get('/categories', (req, res) => {
    try {
      const db = router.db;
      const categories = db.get('provider_categories').value() || [];

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching provider categories:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener categorías de proveedores'
      });
    }
  });

  // Get all providers with filtering
  providersRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      let providers = db.get('providers').value() || [];

      // Apply filters if provided
      const { status, type, location } = req.query;

      if (status) {
        providers = providers.filter(p => p.status === status);
      }

      if (type) {
        providers = providers.filter(p => p.type === type);
      }

      if (location) {
        providers = providers.filter(p => p.location && p.location.toLowerCase().includes(location.toLowerCase()));
      }

      res.json({
        success: true,
        data: providers,
        total: providers.length
      });

    } catch (error) {
      console.error('Error fetching providers:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener proveedores'
      });
    }
  });

  // Get provider by ID
  providersRouter.get('/:id', (req, res) => {
    try {
      const db = router.db;
      const provider = db.get('providers').find({ id: req.params.id }).value();

      if (!provider) {
        return res.status(404).json({
          success: false,
          error: 'Proveedor no encontrado'
        });
      }

      res.json({
        success: true,
        data: provider
      });

    } catch (error) {
      console.error('Error fetching provider:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener proveedor'
      });
    }
  });

  return providersRouter;
};