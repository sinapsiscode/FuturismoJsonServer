const express = require('express');

module.exports = (router) => {
  const providersRouter = express.Router();

  // Get all locations
  providersRouter.get('/locations', (req, res) => {
    try {
      const db = router.db;
      const locations = db.get('provider_locations').value() || [];

      console.log('Backend: Obteniendo ubicaciones. Total:', locations.length);

      // Filtrar solo ubicaciones activas
      const activeLocations = locations.filter(l => l.active !== false);

      res.json({
        success: true,
        data: activeLocations,
        total: activeLocations.length
      });
    } catch (error) {
      console.error('Backend: Error fetching provider locations:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener ubicaciones de proveedores',
        details: error.message
      });
    }
  });

  // Get all categories
  providersRouter.get('/categories', (req, res) => {
    try {
      const db = router.db;
      const categories = db.get('provider_categories').value() || [];

      console.log('Backend: Obteniendo categorías. Total:', categories.length);

      // Filtrar solo categorías activas
      const activeCategories = categories.filter(c => c.active !== false);

      res.json({
        success: true,
        data: activeCategories,
        total: activeCategories.length
      });
    } catch (error) {
      console.error('Backend: Error fetching provider categories:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener categorías de proveedores',
        details: error.message
      });
    }
  });

  /**
   * GET /api/providers/services
   * Obtener todos los servicios
   */
  providersRouter.get('/services', (req, res) => {
    try {
      const db = router.db;
      const services = db.get('service_types').value() || [];

      console.log('Backend: Obteniendo servicios. Total:', services.length);

      // Filtrar solo servicios activos
      const activeServices = services.filter(s => s.active !== false);

      res.json({
        success: true,
        data: activeServices,
        total: activeServices.length
      });
    } catch (error) {
      console.error('Backend: Error fetching services:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener servicios',
        details: error.message
      });
    }
  });

  /**
   * POST /api/providers/services
   * Crear nuevo servicio
   */
  providersRouter.post('/services', (req, res) => {
    try {
      const db = router.db;
      const { name, category, description } = req.body;

      console.log('Backend: Recibiendo solicitud para crear servicio:', { name, category, description });

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'El nombre del servicio es requerido'
        });
      }

      if (!category) {
        return res.status(400).json({
          success: false,
          error: 'La categoría es requerida'
        });
      }

      // Obtener o crear el array de service_types si no existe
      let serviceTypes = db.get('service_types').value();
      if (!serviceTypes) {
        console.log('Backend: Inicializando array service_types');
        db.set('service_types', []).write();
        serviceTypes = [];
      }

      // Validar que no exista un servicio con el mismo nombre en la misma categoría
      const existingService = serviceTypes.find(
        s => s.name.toLowerCase() === name.trim().toLowerCase() &&
             s.category === category &&
             s.active !== false
      );

      if (existingService) {
        return res.status(400).json({
          success: false,
          error: 'Ya existe un servicio con ese nombre en esta categoría'
        });
      }

      const newService = {
        id: `service-${Date.now()}`,
        name: name.trim(),
        category,
        description: description ? description.trim() : '',
        active: true,
        created_at: new Date().toISOString()
      };

      console.log('Backend: Creando nuevo servicio:', newService);

      db.get('service_types').push(newService).write();

      console.log('Backend: Servicio guardado exitosamente');

      res.status(201).json({
        success: true,
        data: newService,
        message: 'Servicio creado exitosamente'
      });
    } catch (error) {
      console.error('Backend: Error al crear servicio:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear servicio',
        details: error.message
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
   * POST /api/providers
   * Crear nuevo proveedor
   */
  providersRouter.post('/', (req, res) => {
    try {
      const db = router.db;
      const providerData = req.body;

      // Validaciones básicas
      if (!providerData.name) {
        return res.status(400).json({
          success: false,
          error: 'El nombre del proveedor es requerido'
        });
      }

      if (!providerData.category) {
        return res.status(400).json({
          success: false,
          error: 'La categoría es requerida'
        });
      }

      if (!providerData.location) {
        return res.status(400).json({
          success: false,
          error: 'La ubicación es requerida'
        });
      }

      // Crear nuevo proveedor
      const newProvider = {
        id: `prov-${Date.now()}`,
        name: providerData.name,
        category: providerData.category,
        location: providerData.location,
        contact: providerData.contact || {
          contactPerson: '',
          phone: '',
          email: '',
          address: ''
        },
        pricing: providerData.pricing || {
          basePrice: 0,
          type: 'fixed',
          currency: 'PEN'
        },
        rating: providerData.rating || 0,
        capacity: providerData.capacity || 1,
        services: providerData.services || [],
        specialties: providerData.specialties || [],
        languages: providerData.languages || [],
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Guardar en la base de datos
      db.get('providers').push(newProvider).write();

      res.status(201).json({
        success: true,
        data: newProvider,
        message: 'Proveedor creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear proveedor',
        details: error.message
      });
    }
  });

  /**
   * PUT /api/providers/:id
   * Actualizar proveedor
   */
  providersRouter.put('/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const updateData = req.body;

      const provider = db.get('providers').find({ id }).value();

      if (!provider) {
        return res.status(404).json({
          success: false,
          error: 'Proveedor no encontrado'
        });
      }

      const updatedProvider = {
        ...provider,
        ...updateData,
        id: provider.id, // Mantener el ID original
        created_at: provider.created_at, // Mantener fecha de creación
        updated_at: new Date().toISOString()
      };

      db.get('providers').find({ id }).assign(updatedProvider).write();

      res.json({
        success: true,
        data: updatedProvider,
        message: 'Proveedor actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar proveedor',
        details: error.message
      });
    }
  });

  /**
   * DELETE /api/providers/:id
   * Eliminar proveedor (soft delete)
   */
  providersRouter.delete('/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const provider = db.get('providers').find({ id }).value();

      if (!provider) {
        return res.status(404).json({
          success: false,
          error: 'Proveedor no encontrado'
        });
      }

      // Soft delete - marcar como inactivo
      db.get('providers')
        .find({ id })
        .assign({
          status: 'inactive',
          deleted_at: new Date().toISOString()
        })
        .write();

      res.json({
        success: true,
        message: 'Proveedor eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar proveedor',
        details: error.message
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
      const { name, parentId, description } = req.body;

      console.log('Backend: Recibiendo solicitud para crear ubicación:', { name, parentId, description });

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      // Validar que no exista una ubicación con el mismo nombre
      const locations = db.get('provider_locations').value() || [];
      const existingLocation = locations.find(
        l => l.name.toLowerCase() === name.trim().toLowerCase() && l.active !== false
      );

      if (existingLocation) {
        return res.status(400).json({
          success: false,
          error: 'Ya existe una ubicación con ese nombre'
        });
      }

      const newLocation = {
        id: `loc-${Date.now()}`,
        name: name.trim(),
        description: description ? description.trim() : '',
        parentId: parentId || null,
        active: true,
        created_at: new Date().toISOString()
      };

      // Si tiene padre, agregarlo como hijo
      if (parentId) {
        const parent = db.get('provider_locations').find({ id: parentId }).value();
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          // Esto se manejará en el GET para construir la jerarquía
        }
      }

      console.log('Backend: Creando nueva ubicación:', newLocation);

      db.get('provider_locations').push(newLocation).write();

      console.log('Backend: Ubicación guardada exitosamente');

      res.status(201).json({
        success: true,
        data: newLocation,
        message: 'Ubicación creada exitosamente'
      });
    } catch (error) {
      console.error('Backend: Error al crear ubicación:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear ubicación',
        details: error.message
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

      console.log('Backend: Recibiendo solicitud para crear categoría:', { name, description, icon });

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      // Validar que no exista una categoría con el mismo nombre
      const categories = db.get('provider_categories').value() || [];
      const existingCategory = categories.find(
        c => c.name.toLowerCase() === name.trim().toLowerCase() && c.active !== false
      );

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: 'Ya existe una categoría con ese nombre'
        });
      }

      // Crear el nombre con formato i18n si no viene en ese formato
      let categoryName = name.trim();
      if (!categoryName.includes('.')) {
        // Convertir a formato slug para i18n
        const slug = categoryName.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
          .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
          .replace(/\s+/g, '_'); // Espacios a guiones bajos

        categoryName = `providers.categories.${slug}`;
      }

      const newCategory = {
        id: `prov-cat-${Date.now()}`,
        name: categoryName,
        description: description ? description.trim() : '',
        icon: icon || 'briefcase',
        active: true,
        created_at: new Date().toISOString()
      };

      console.log('Backend: Creando nueva categoría:', newCategory);

      db.get('provider_categories').push(newCategory).write();

      console.log('Backend: Categoría guardada exitosamente');

      res.status(201).json({
        success: true,
        data: newCategory,
        message: 'Categoría creada exitosamente'
      });
    } catch (error) {
      console.error('Backend: Error al crear categoría:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear categoría',
        details: error.message
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