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

  // Get tour categories (specific route - MUST come before /:id)
  toursRouter.get('/categories', (req, res) => {
    try {
      const db = router.db;
      const tourCategories = db.get('tour_categories').value();

      if (!tourCategories) {
        return res.status(404).json({
          success: false,
          error: 'Categorías de tours no encontradas'
        });
      }

      res.json({
        success: true,
        data: tourCategories
      });

    } catch (error) {
      console.error('Error fetching tour categories:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener categorías de tours'
      });
    }
  });

  // Get tours for a specific guide (specific route - MUST come before /:id)
  toursRouter.get('/guide-tours', (req, res) => {
    try {
      const { guideId } = req.query;
      const db = router.db;

      if (!guideId) {
        return res.status(400).json({
          success: false,
          error: 'guideId es requerido'
        });
      }

      console.log('🔍 [guide-tours] Buscando tours para guideId:', guideId);

      // Encontrar el guía por user_id
      const guides = db.get('guides').value() || [];
      const guide = guides.find(g => g.user_id === guideId);

      if (!guide) {
        console.log('⚠️ [guide-tours] Guía no encontrado para user_id:', guideId);
        return res.json({
          success: true,
          data: []
        });
      }

      console.log('✅ [guide-tours] Guía encontrado:', guide.id, guide.name);

      // Buscar reservas asignadas a este guía
      const reservations = db.get('reservations').value() || [];
      const guideReservations = reservations.filter(r => r.guide_id === guide.id);

      console.log('📊 [guide-tours] Reservas del guía:', guideReservations.length);

      // Transformar reservas a formato de tours para el frontend
      const tours = db.get('tours').value() || [];
      const agencies = db.get('agencies').value() || [];

      const guideTours = guideReservations.map(reservation => {
        const tour = tours.find(t => t.id === reservation.service_id);
        const agency = agencies.find(a => a.id === reservation.agency_id);

        // Mapear status de reserva a status de tour
        let tourStatus = 'asignado';
        if (reservation.status === 'completed') tourStatus = 'completado';
        else if (reservation.status === 'in_progress') tourStatus = 'iniciado';
        else if (reservation.status === 'confirmed') tourStatus = 'asignado';
        else if (reservation.status === 'cancelled') tourStatus = 'cancelado';

        return {
          id: reservation.id,
          name: tour ? tour.name : 'Tour sin nombre',
          agency: agency ? agency.name : 'Agencia desconocida',
          date: reservation.tour_date || reservation.created_at,
          time: reservation.start_time || '09:00',
          tourists: reservation.group_size || 1,
          location: reservation.meeting_point || 'Por definir',
          status: tourStatus,
          isActive: ['iniciado', 'en_progreso'].includes(tourStatus),
          checkpoints: [], // Podrías agregar checkpoints reales aquí si existen
          tourDetails: tour,
          reservationDetails: reservation
        };
      });

      console.log('✅ [guide-tours] Tours procesados:', guideTours.length);

      res.json({
        success: true,
        data: guideTours
      });

    } catch (error) {
      console.error('❌ [guide-tours] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tours del guía'
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

  // Get available guides for a tour
  toursRouter.get('/:id/available-guides', async (req, res) => {
    try {
      const db = router.db;
      const { date } = req.query;

      // Get all active guides
      let guides = db.get('guides').filter({ status: 'active' }).value() || [];

      // If date is provided, filter by availability
      if (date) {
        // TODO: Check guide assignments on that date
        const assignments = db.get('tour_assignments')
          .filter({ date, status: 'active' })
          .value() || [];

        const busyGuideIds = assignments.map(a => a.guide_id);
        guides = guides.filter(g => !busyGuideIds.includes(g.id));
      }

      res.json({
        success: true,
        data: guides
      });
    } catch (error) {
      console.error('Error getting available guides:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener guías disponibles'
      });
    }
  });

  // Check guide availability for tour
  // Check guide availability for tour (GET version - legacy)
  toursRouter.get('/:id/check-guide-availability', async (req, res) => {
    try {
      const { guideId } = req.query;
      const db = router.db;

      const tour = db.get('tours').find({ id: req.params.id }).value();
      if (!tour) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      const guide = db.get('guides').find({ id: guideId }).value();
      if (!guide) {
        return res.status(404).json({
          success: false,
          error: 'Guía no encontrado'
        });
      }

      // Check if guide is available
      const isAvailable = guide.status === 'active' && guide.is_available !== false;

      res.json({
        success: true,
        data: {
          isAvailable,
          guide: {
            id: guide.id,
            name: guide.name,
            status: guide.status
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al verificar disponibilidad'
      });
    }
  });

  // Check guide availability for tour (POST version - used by frontend)
  toursRouter.post('/:id/check-guide-availability', async (req, res) => {
    try {
      const { guideId } = req.body;
      const db = router.db;

      const tour = db.get('tours').find({ id: req.params.id }).value();
      if (!tour) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      const guide = db.get('guides').find({ id: guideId }).value();
      if (!guide) {
        return res.status(404).json({
          success: false,
          error: 'Guía no encontrado'
        });
      }

      // Check if guide is available
      const isAvailable = guide.status === 'active' && guide.is_available !== false;

      res.json({
        success: true,
        data: {
          isAvailable,
          guide: {
            id: guide.id,
            name: guide.name,
            status: guide.status
          }
        }
      });
    } catch (error) {
      console.error('Error checking guide availability:', error);
      res.status(500).json({
        success: false,
        error: 'Error al verificar disponibilidad'
      });
    }
  });

  // Check guide competences for tour
  toursRouter.post('/:id/check-guide-competences', async (req, res) => {
    try {
      const { guideId } = req.body;
      const db = router.db;

      const tour = db.get('tours').find({ id: req.params.id }).value();
      const guide = db.get('guides').find({ id: guideId }).value();

      if (!tour || !guide) {
        return res.status(404).json({
          success: false,
          error: 'Tour o guía no encontrado'
        });
      }

      // Check if guide has required languages (more permissive)
      const tourLanguages = tour.languages || [];
      const guideLanguages = guide.languages || [];
      // Si no hay idiomas requeridos, o el guía tiene al menos un idioma, es válido
      const hasLanguages = tourLanguages.length === 0 ||
                          tourLanguages.some(lang => guideLanguages.includes(lang)) ||
                          guideLanguages.length > 0;

      // Check if guide has matching specialization (more permissive)
      const tourCategory = tour.category || '';
      const guideSpecialties = guide.specialties || guide.specializations || [];
      // Si no hay categoría específica, o el guía tiene especialidades que coincidan parcialmente, es válido
      const hasSpecialty = !tourCategory ||
                          tourCategory === 'general' ||
                          guideSpecialties.length === 0 ||
                          guideSpecialties.some(s =>
                            s.toLowerCase().includes(tourCategory.toLowerCase()) ||
                            tourCategory.toLowerCase().includes(s.toLowerCase())
                          );

      const hasCompetences = hasLanguages && hasSpecialty;

      console.log('🔍 [Competences Check]', {
        tourId: req.params.id,
        guideId,
        tourCategory,
        guideSpecialties,
        hasLanguages,
        hasSpecialty,
        hasCompetences
      });

      res.json({
        success: true,
        data: {
          hasRequiredCompetences: hasCompetences,
          hasCompetences,
          details: {
            hasLanguages,
            hasSpecialty,
            guideLanguages,
            tourLanguages,
            guideSpecialties,
            tourCategory
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al verificar competencias'
      });
    }
  });

  // Assign guide to tour
  toursRouter.post('/:id/assign-guide', async (req, res) => {
    try {
      const { guideId, validateCompetences } = req.body;
      const db = router.db;

      const tour = db.get('tours').find({ id: req.params.id });
      if (!tour.value()) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      const guide = db.get('guides').find({ id: guideId }).value();
      if (!guide) {
        return res.status(404).json({
          success: false,
          error: 'Guía no encontrado'
        });
      }

      // Update tour with guide assignment
      tour.assign({
        assignedGuide: guideId,
        updated_at: new Date().toISOString()
      }).write();

      // Create assignment record
      const assignment = {
        id: `assignment-${Date.now()}`,
        tour_id: req.params.id,
        guide_id: guideId,
        type: 'guide',
        date: tour.value().date || new Date().toISOString(),
        status: 'active',
        created_at: new Date().toISOString()
      };

      db.get('tour_assignments').push(assignment).write();

      res.json({
        success: true,
        message: 'Guía asignado exitosamente',
        data: tour.value()
      });
    } catch (error) {
      console.error('Error assigning guide:', error);
      res.status(500).json({
        success: false,
        error: 'Error al asignar guía'
      });
    }
  });

  // Assign driver to tour
  toursRouter.post('/:id/assign-driver', async (req, res) => {
    try {
      const { driverId } = req.body;
      const db = router.db;

      const tour = db.get('tours').find({ id: req.params.id });
      if (!tour.value()) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      tour.assign({
        assignedDriver: driverId,
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        message: 'Chofer asignado exitosamente',
        data: tour.value()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al asignar chofer'
      });
    }
  });

  // Assign vehicle to tour
  toursRouter.post('/:id/assign-vehicle', async (req, res) => {
    try {
      const { vehicleId } = req.body;
      const db = router.db;

      const tour = db.get('tours').find({ id: req.params.id });
      if (!tour.value()) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      tour.assign({
        assignedVehicle: vehicleId,
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        message: 'Vehículo asignado exitosamente',
        data: tour.value()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al asignar vehículo'
      });
    }
  });

  // Remove assignment
  toursRouter.delete('/:id/assignments/:type', async (req, res) => {
    try {
      const { type } = req.params; // 'guide', 'driver', 'vehicle'
      const db = router.db;

      const tour = db.get('tours').find({ id: req.params.id });
      if (!tour.value()) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      const fieldMap = {
        guide: 'assignedGuide',
        driver: 'assignedDriver',
        vehicle: 'assignedVehicle'
      };

      const field = fieldMap[type];
      if (!field) {
        return res.status(400).json({
          success: false,
          error: 'Tipo de asignación inválido'
        });
      }

      tour.assign({
        [field]: null,
        updated_at: new Date().toISOString()
      }).write();

      // Remove assignment record
      db.get('tour_assignments')
        .remove({ tour_id: req.params.id, type })
        .write();

      res.json({
        success: true,
        message: 'Asignación removida exitosamente',
        data: tour.value()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al remover asignación'
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

  // Create new tour
  toursRouter.post('/', (req, res) => {
    try {
      const db = router.db;

      // Generate tour code if not provided
      const tourCode = req.body.code || `TOUR-${Date.now()}`;

      // La agencia/cliente ya debe venir en el body desde el frontend
      // Si no viene, retornar error
      if (!req.body.agency_id && !req.body.client_id) {
        return res.status(400).json({
          success: false,
          error: 'El tour debe estar asociado a una agencia (agency_id o client_id requerido)'
        });
      }

      const newTour = {
        id: `tour-${Date.now()}`,
        code: tourCode,
        ...req.body,
        status: req.body.status || 'active',
        // Asignaciones de recursos (null inicialmente, se asignan en página de Asignaciones)
        assignedGuide: null,
        assignedDriver: null,
        assignedVehicle: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      db.get('tours').push(newTour).write();

      res.status(201).json({
        success: true,
        data: newTour,
        message: 'Tour creado exitosamente'
      });
    } catch (error) {
      console.error('Error creating tour:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear tour'
      });
    }
  });

  // Update tour (complete replacement)
  // Assign providers to tour (specific route - MUST come before /:id)
  toursRouter.post('/:id/assign-providers', (req, res) => {
    try {
      const db = router.db;
      const tour = db.get('tours').find({ id: req.params.id });

      if (!tour.value()) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      const { providers } = req.body;

      if (!Array.isArray(providers)) {
        return res.status(400).json({
          success: false,
          error: 'Los proveedores deben ser un array'
        });
      }

      // Actualizar proveedores asignados
      tour.assign({
        ...tour.value(),
        assignedProviders: providers,
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: tour.value(),
        message: `${providers.length} proveedor(es) asignado(s) exitosamente`
      });

    } catch (error) {
      console.error('Error assigning providers:', error);
      res.status(500).json({
        success: false,
        error: 'Error al asignar proveedores'
      });
    }
  });

  toursRouter.put('/:id', (req, res) => {
    try {
      const db = router.db;
      const tour = db.get('tours').find({ id: req.params.id });

      if (!tour.value()) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      // Preserve assignments and timestamps
      const existingTour = tour.value();
      const updatedTour = {
        ...req.body,
        id: req.params.id,
        assignedGuide: req.body.assignedGuide !== undefined ? req.body.assignedGuide : existingTour.assignedGuide,
        assignedDriver: req.body.assignedDriver !== undefined ? req.body.assignedDriver : existingTour.assignedDriver,
        assignedVehicle: req.body.assignedVehicle !== undefined ? req.body.assignedVehicle : existingTour.assignedVehicle,
        assignedProviders: req.body.assignedProviders !== undefined ? req.body.assignedProviders : existingTour.assignedProviders,
        created_at: existingTour.created_at,
        updated_at: new Date().toISOString()
      };

      tour.assign(updatedTour).write();

      res.json({
        success: true,
        data: tour.value(),
        message: 'Tour actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error updating tour:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar tour'
      });
    }
  });

  // Update tour (partial update)
  toursRouter.patch('/:id', (req, res) => {
    try {
      const db = router.db;
      const tour = db.get('tours').find({ id: req.params.id });

      if (!tour.value()) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      const updates = {
        ...req.body,
        updated_at: new Date().toISOString()
      };

      tour.assign(updates).write();

      res.json({
        success: true,
        data: tour.value(),
        message: 'Tour actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error patching tour:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar tour'
      });
    }
  });

  // Delete tour
  toursRouter.delete('/:id', (req, res) => {
    try {
      const db = router.db;
      const tour = db.get('tours').find({ id: req.params.id }).value();

      if (!tour) {
        return res.status(404).json({
          success: false,
          error: 'Tour no encontrado'
        });
      }

      // Remove related assignments
      db.get('tour_assignments').remove({ tour_id: req.params.id }).write();

      // Remove the tour
      db.get('tours').remove({ id: req.params.id }).write();

      res.json({
        success: true,
        message: 'Tour eliminado exitosamente',
        data: { id: req.params.id }
      });
    } catch (error) {
      console.error('Error deleting tour:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar tour'
      });
    }
  });

  return toursRouter;
};