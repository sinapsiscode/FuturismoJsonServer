const express = require('express');
const { generateId, paginate, filterBy, sortBy, calculatePrice, successResponse, errorResponse } = require('../middlewares/helpers');

module.exports = (router) => {
  const servicesRouter = express.Router();

  // Get active services (monitoring)
  servicesRouter.get('/active', (req, res) => {
    try {
      const db = router.db;
      const monitoringTours = db.get('monitoring_tours').value() || [];

      // Filter by provided filters if any
      const { status, guide, date } = req.query;
      let filteredTours = monitoringTours;

      if (status) {
        filteredTours = filteredTours.filter(t => t.status === status);
      }
      if (guide) {
        filteredTours = filteredTours.filter(t => t.guideName === guide);
      }
      if (date) {
        filteredTours = filteredTours.filter(t => t.date === date);
      }

      res.json(successResponse(filteredTours));

    } catch (error) {
      console.error('Error fetching active services:', error);
      res.status(500).json(errorResponse('Error al obtener servicios activos'));
    }
  });

  // Get all services
  servicesRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      const services = db.get('services').value() || [];

      // Extract query parameters
      const {
        category,
        status,
        location,
        min_price,
        max_price,
        search,
        sort_by = 'name',
        sort_order = 'asc',
        page = 1,
        limit = 10
      } = req.query;

      // Apply filters
      const filters = {};
      if (category) filters.category = category;
      if (status) filters.status = status;
      if (location) filters.location = location;

      let filteredServices = filterBy(services, filters);

      // Price range filter
      if (min_price) {
        filteredServices = filteredServices.filter(s => s.price >= parseFloat(min_price));
      }
      if (max_price) {
        filteredServices = filteredServices.filter(s => s.price <= parseFloat(max_price));
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredServices = filteredServices.filter(s =>
          s.name.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower)
        );
      }

      // Sort results
      const sortedServices = sortBy(filteredServices, sort_by, sort_order);

      // Paginate results
      const paginatedResult = paginate(sortedServices, parseInt(page), parseInt(limit));

      res.json(successResponse({
        services: paginatedResult.data,
        pagination: paginatedResult.pagination,
        filters_applied: {
          category,
          status,
          location,
          min_price,
          max_price,
          search
        }
      }));

    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json(errorResponse('Error al obtener servicios'));
    }
  });

  // Get service by ID
  servicesRouter.get('/:id', (req, res) => {
    try {
      const db = router.db;
      const service = db.get('services').find({ id: req.params.id }).value();

      if (!service) {
        return res.status(404).json({
          success: false,
          error: 'Servicio no encontrado'
        });
      }

      res.json({
        success: true,
        data: service
      });

    } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener servicio'
      });
    }
  });

  // Create new service
  servicesRouter.post('/', (req, res) => {
    try {
      const db = router.db;
      const {
        name,
        description,
        category,
        price,
        currency = 'USD',
        duration,
        max_group_size = 10,
        included = [],
        excluded = [],
        location
      } = req.body;

      // Validate required fields
      if (!name || !description || !category || !price || !duration) {
        return res.status(400).json(errorResponse('Campos requeridos: name, description, category, price, duration'));
      }

      const newService = {
        id: generateId('service'),
        name,
        description,
        category,
        price: parseFloat(price),
        currency,
        duration,
        status: 'active',
        rating: 0,
        max_group_size: parseInt(max_group_size),
        included: Array.isArray(included) ? included : [],
        excluded: Array.isArray(excluded) ? excluded : [],
        location: location || 'Lima',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add to database
      db.get('services').push(newService).write();

      res.status(201).json(successResponse(newService, 'Servicio creado exitosamente'));

    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json(errorResponse('Error al crear servicio'));
    }
  });

  // Update service
  servicesRouter.put('/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const updateData = req.body;

      const service = db.get('services').find({ id }).value();

      if (!service) {
        return res.status(404).json(errorResponse('Servicio no encontrado'));
      }

      // Update service
      const updatedService = {
        ...service,
        ...updateData,
        updated_at: new Date().toISOString()
      };

      db.get('services')
        .find({ id })
        .assign(updatedService)
        .write();

      res.json(successResponse(updatedService, 'Servicio actualizado exitosamente'));

    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json(errorResponse('Error al actualizar servicio'));
    }
  });

  // Delete service
  servicesRouter.delete('/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const service = db.get('services').find({ id }).value();

      if (!service) {
        return res.status(404).json(errorResponse('Servicio no encontrado'));
      }

      // Soft delete - change status to inactive
      db.get('services')
        .find({ id })
        .assign({
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .write();

      res.json(successResponse(null, 'Servicio eliminado exitosamente'));

    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json(errorResponse('Error al eliminar servicio'));
    }
  });

  // Get service pricing with calculations
  servicesRouter.get('/:id/pricing', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { group_size = 1, discount_percent = 0 } = req.query;

      const service = db.get('services').find({ id }).value();

      if (!service) {
        return res.status(404).json(errorResponse('Servicio no encontrado'));
      }

      const pricing = calculatePrice({
        base_price: service.price,
        group_size: parseInt(group_size),
        discount_percent: parseFloat(discount_percent)
      });

      res.json(successResponse({
        service: {
          id: service.id,
          name: service.name,
          base_price: service.price,
          currency: service.currency
        },
        pricing
      }));

    } catch (error) {
      console.error('Error calculating pricing:', error);
      res.status(500).json(errorResponse('Error al calcular precios'));
    }
  });

  // Get service availability
  servicesRouter.get('/:id/availability', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { date, group_size = 1 } = req.query;

      const service = db.get('services').find({ id }).value();

      if (!service) {
        return res.status(404).json(errorResponse('Servicio no encontrado'));
      }

      // Check reservations for the given date
      const reservations = db.get('reservations').value() || [];
      const dateReservations = reservations.filter(r =>
        r.service_id === id &&
        r.tour_date &&
        r.tour_date.split('T')[0] === date &&
        r.status !== 'cancelled'
      );

      const totalBooked = dateReservations.reduce((sum, r) => sum + (r.group_size || 0), 0);
      const available_spots = service.max_group_size - totalBooked;
      const can_book = parseInt(group_size) <= available_spots;

      res.json(successResponse({
        service_id: id,
        date,
        max_capacity: service.max_group_size,
        booked: totalBooked,
        available: available_spots,
        requested_group_size: parseInt(group_size),
        can_book,
        existing_reservations: dateReservations.length
      }));

    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json(errorResponse('Error al verificar disponibilidad'));
    }
  });

  return servicesRouter;
};