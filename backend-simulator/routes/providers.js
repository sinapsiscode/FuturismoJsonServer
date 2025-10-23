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

  /**
   * POST /api/providers/locations
   * Crear nueva ubicación de proveedor
   */
  providersRouter.post('/locations', (req, res) => {
    try {
      const db = router.db;
      const { name, city, district, region } = req.body;

      if (!name || !city) {
        return res.status(400).json({
          success: false,
          error: 'Nombre y ciudad son requeridos'
        });
      }

      const newLocation = {
        id: `loc-${Date.now()}`,
        name,
        city,
        district: district || '',
        region: region || city,
        active: true,
        created_at: new Date().toISOString()
      };

      db.get('provider_locations').push(newLocation).write();

      res.status(201).json({
        success: true,
        data: newLocation,
        message: 'Ubicación creada exitosamente'
      });
    } catch (error) {
      console.error('Error al crear ubicación:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear ubicación'
      });
    }
  });

  /**
   * PUT /api/providers/locations/:id
   * Actualizar ubicación de proveedor
   */
  providersRouter.put('/locations/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { name, city, district, region, active } = req.body;

      const location = db.get('provider_locations').find({ id }).value();

      if (!location) {
        return res.status(404).json({
          success: false,
          error: 'Ubicación no encontrada'
        });
      }

      const updatedLocation = {
        ...location,
        name: name || location.name,
        city: city || location.city,
        district: district !== undefined ? district : location.district,
        region: region || location.region,
        active: active !== undefined ? active : location.active,
        updated_at: new Date().toISOString()
      };

      db.get('provider_locations').find({ id }).assign(updatedLocation).write();

      res.json({
        success: true,
        data: updatedLocation,
        message: 'Ubicación actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar ubicación:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar ubicación'
      });
    }
  });

  /**
   * DELETE /api/providers/locations/:id
   * Eliminar ubicación de proveedor
   */
  providersRouter.delete('/locations/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const location = db.get('provider_locations').find({ id }).value();

      if (!location) {
        return res.status(404).json({
          success: false,
          error: 'Ubicación no encontrada'
        });
      }

      // Soft delete
      db.get('provider_locations').find({ id }).assign({ active: false }).write();

      res.json({
        success: true,
        message: 'Ubicación eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar ubicación:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar ubicación'
      });
    }
  });

  /**
   * POST /api/providers/categories
   * Crear nueva categoría de proveedor
   */
  providersRouter.post('/categories', (req, res) => {
    try {
      const db = router.db;
      const { name, description, icon } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      const newCategory = {
        id: `prov-cat-${Date.now()}`,
        name,
        description: description || '',
        icon: icon || 'briefcase',
        active: true,
        created_at: new Date().toISOString()
      };

      db.get('provider_categories').push(newCategory).write();

      res.status(201).json({
        success: true,
        data: newCategory,
        message: 'Categoría creada exitosamente'
      });
    } catch (error) {
      console.error('Error al crear categoría:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear categoría'
      });
    }
  });

  /**
   * PUT /api/providers/categories/:id
   * Actualizar categoría de proveedor
   */
  providersRouter.put('/categories/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { name, description, icon, active } = req.body;

      const category = db.get('provider_categories').find({ id }).value();

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }

      const updatedCategory = {
        ...category,
        name: name || category.name,
        description: description !== undefined ? description : category.description,
        icon: icon || category.icon,
        active: active !== undefined ? active : category.active,
        updated_at: new Date().toISOString()
      };

      db.get('provider_categories').find({ id }).assign(updatedCategory).write();

      res.json({
        success: true,
        data: updatedCategory,
        message: 'Categoría actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar categoría'
      });
    }
  });

  /**
   * DELETE /api/providers/categories/:id
   * Eliminar categoría de proveedor
   */
  providersRouter.delete('/categories/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const category = db.get('provider_categories').find({ id }).value();

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }

      // Soft delete
      db.get('provider_categories').find({ id }).assign({ active: false }).write();

      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar categoría'
      });
    }
  });

  return providersRouter;
};