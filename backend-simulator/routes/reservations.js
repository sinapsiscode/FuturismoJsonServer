const express = require('express');
const { generateId, paginate, filterBy, sortBy, calculatePrice, successResponse, errorResponse } = require('../middlewares/helpers');
const { adminOrAgency } = require('../middlewares/authorize');

module.exports = (router) => {
  const reservationsRouter = express.Router();

  // IMPORTANT: Specific routes MUST come BEFORE parameterized routes
  // Otherwise /:id will match /stats, /search, etc.

  // Get reservations statistics (GET /stats)
  reservationsRouter.get('/stats', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const reservations = db.get('reservations').value() || [];
      const { date_from, date_to } = req.query;

      let filteredReservations = reservations;

      // Apply date filters
      if (date_from) {
        filteredReservations = filteredReservations.filter(r =>
          new Date(r.created_at) >= new Date(date_from)
        );
      }
      if (date_to) {
        filteredReservations = filteredReservations.filter(r =>
          new Date(r.created_at) <= new Date(date_to)
        );
      }

      // Calculate statistics
      const stats = {
        total: filteredReservations.length,
        by_status: {
          pending: filteredReservations.filter(r => r.status === 'pending').length,
          confirmed: filteredReservations.filter(r => r.status === 'confirmed').length,
          in_progress: filteredReservations.filter(r => r.status === 'in_progress').length,
          completed: filteredReservations.filter(r => r.status === 'completed').length,
          cancelled: filteredReservations.filter(r => r.status === 'cancelled').length
        },
        by_payment_status: {
          pending: filteredReservations.filter(r => r.payment_status === 'pending').length,
          paid: filteredReservations.filter(r => r.payment_status === 'paid').length,
          partial: filteredReservations.filter(r => r.payment_status === 'partial').length,
          refunded: filteredReservations.filter(r => r.payment_status === 'refunded').length
        },
        total_revenue: filteredReservations.reduce((sum, r) => sum + (r.total_amount || 0), 0),
        average_group_size: filteredReservations.length > 0
          ? filteredReservations.reduce((sum, r) => sum + (r.group_size || 0), 0) / filteredReservations.length
          : 0,
        average_amount: filteredReservations.length > 0
          ? filteredReservations.reduce((sum, r) => sum + (r.total_amount || 0), 0) / filteredReservations.length
          : 0
      };

      res.json(successResponse(stats));

    } catch (error) {
      console.error('Error calculating stats:', error);
      res.status(500).json(errorResponse('Error al calcular estadísticas'));
    }
  });

  // Search reservations (GET /search)
  reservationsRouter.get('/search', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { q, status, date_from, date_to } = req.query;

      if (!q) {
        return res.status(400).json(errorResponse('Parámetro de búsqueda requerido'));
      }

      let reservations = db.get('reservations').value() || [];

      // Search in multiple fields
      const searchTerm = q.toLowerCase();
      reservations = reservations.filter(r => {
        const matchesId = r.id && r.id.toLowerCase().includes(searchTerm);
        const matchesClientId = r.client_id && typeof r.client_id === 'string' && r.client_id.toLowerCase().includes(searchTerm);
        const matchesServiceId = r.service_id && typeof r.service_id === 'string' && r.service_id.toLowerCase().includes(searchTerm);

        return matchesId || matchesClientId || matchesServiceId;
      });

      // Apply additional filters
      if (status) {
        reservations = reservations.filter(r => r.status === status);
      }

      if (date_from) {
        reservations = reservations.filter(r => new Date(r.tour_date) >= new Date(date_from));
      }

      if (date_to) {
        reservations = reservations.filter(r => new Date(r.tour_date) <= new Date(date_to));
      }

      res.json(successResponse({ reservations, total: reservations.length }));

    } catch (error) {
      console.error('Error searching reservations:', error);
      res.status(500).json(errorResponse('Error al buscar reservaciones'));
    }
  });

  // Check availability (POST /check-availability)
  reservationsRouter.post('/check-availability', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { serviceType, date, time, touristsCount } = req.body;

      if (!date) {
        return res.status(400).json(errorResponse('La fecha es requerida'));
      }

      // Get all reservations for the date
      const reservations = db.get('reservations').value() || [];
      const dateReservations = reservations.filter(r => r.tour_date === date);

      // Get available guides
      const guides = db.get('guides').value() || [];
      const availableGuides = guides.filter(g => g.status === 'active');

      // Calculate total tourists for the date
      const totalTourists = dateReservations.reduce((sum, r) => sum + (r.group_size || 0), 0);

      // Simple availability logic (can be enhanced)
      const maxCapacity = availableGuides.length * 15; // Assume 15 tourists per guide
      const remainingCapacity = maxCapacity - totalTourists;
      const isAvailable = remainingCapacity >= (touristsCount || 0);

      res.json(successResponse({
        available: isAvailable,
        date,
        requested_tourists: touristsCount || 0,
        remaining_capacity: Math.max(0, remainingCapacity),
        available_guides: availableGuides.length,
        existing_reservations: dateReservations.length
      }));

    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json(errorResponse('Error al verificar disponibilidad'));
    }
  });

  // Get available tours (GET /available-tours)
  reservationsRouter.get('/available-tours', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json(errorResponse('La fecha es requerida'));
      }

      // Get all active services/tours
      const services = db.get('services').value() || [];
      const tours = db.get('tours').value() || [];

      // Combine both sources
      const availableItems = [...services, ...tours].filter(item =>
        item.status === 'active' || item.status === 'available'
      );

      // For demo purposes, return all active tours
      // In real implementation, check availability for specific date
      res.json(successResponse({
        date,
        tours: availableItems,
        total: availableItems.length
      }));

    } catch (error) {
      console.error('Error getting available tours:', error);
      res.status(500).json(errorResponse('Error al obtener tours disponibles'));
    }
  });

  // Export reservations (GET /export)
  reservationsRouter.get('/export', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { format = 'excel', status, date_from, date_to } = req.query;

      let reservations = db.get('reservations').value() || [];

      // Apply filters
      if (status) {
        reservations = reservations.filter(r => r.status === status);
      }

      if (date_from) {
        reservations = reservations.filter(r => new Date(r.created_at) >= new Date(date_from));
      }

      if (date_to) {
        reservations = reservations.filter(r => new Date(r.created_at) <= new Date(date_to));
      }

      // In a real implementation, this would generate actual file
      // For demo, return mock export data
      const filename = `reservations_${new Date().toISOString().split('T')[0]}.${format}`;

      res.json({
        success: true,
        data: {
          filename,
          format,
          url: `/api/files/exports/${filename}`,
          records: reservations.length,
          size: reservations.length * 1024, // Mock size
          generated_at: new Date().toISOString(),
          message: 'Exportación generada (simulada para demo)'
        }
      });

    } catch (error) {
      console.error('Error exporting reservations:', error);
      res.status(500).json(errorResponse('Error al exportar reservaciones'));
    }
  });

  // Get all reservations with filtering
  // Only admins and agencies can manage reservations
  reservationsRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      let reservations = db.get('reservations').value() || [];

      // Get user from token
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'No autorizado'
        });
      }

      // El token puede tener 'id' o 'userId' dependiendo de cómo se generó
      const userId = user.id || user.userId;
      console.log('📋 [GET /reservations] Usuario:', user.role, 'userId:', userId, 'token:', user);

      // Get related data for joining
      const services = db.get('services').value() || [];
      const tours = db.get('tours').value() || [];
      const clients = db.get('clients').value() || [];
      const users = db.get('users').value() || [];
      const guides = db.get('guides').value() || [];

      // Si es guía, filtrar solo sus reservas
      if (user.role === 'guide') {
        const guide = guides.find(g => g.user_id === userId);
        if (guide) {
          reservations = reservations.filter(r => r.guide_id === guide.id);
          console.log('🔍 [GET /reservations] Guía filtrado:', guide.id, '- Reservas:', reservations.length);
        } else {
          console.log('⚠️ [GET /reservations] Guía no encontrado para user_id:', userId);
          reservations = [];
        }
      }
      // Si es agencia, filtrar solo sus reservas
      else if (user.role === 'agency') {
        const agencies = db.get('agencies').value() || [];
        const agency = agencies.find(a => a.user_id === userId);
        if (agency) {
          reservations = reservations.filter(r => r.agency_id === agency.id);
          console.log('🔍 [GET /reservations] Agencia filtrada:', agency.id, '- Reservas:', reservations.length);
        }
      }
      // Admin puede ver todas

      // Transform reservations to extended format with joined data
      let extendedReservations = reservations.map(reservation => {
        // Find related service/tour
        const service = services.find(s => s.id === reservation.service_id) ||
                       tours.find(t => t.id === reservation.service_id);

        // Find related client
        const client = clients.find(c => c.id === reservation.client_id) ||
                      users.find(u => u.id === reservation.client_id);

        // Find related guide
        const guide = reservation.guide_id ?
                     guides.find(g => g.id === reservation.guide_id) : null;

        // Calculate adults and children (for now, assume all are adults if not specified)
        const adults = reservation.adults || reservation.group_size || 1;
        const children = reservation.children || 0;

        return {
          ...reservation,
          // Add expected fields for frontend filters
          date: reservation.tour_date ? new Date(reservation.tour_date) : new Date(),
          tourName: service?.name || service?.title || 'Sin nombre',
          clientName: client ? `${client.name || client.first_name || ''} ${client.last_name || ''}`.trim() : 'Sin nombre',
          destination: service?.location || service?.destination || 'Sin destino',
          adults: adults,
          children: children,
          total: reservation.total_amount || 0,
          // Keep original fields
          tour_date: reservation.tour_date,
          group_size: reservation.group_size,
          total_amount: reservation.total_amount,
          // Add related entities
          service: service ? {
            id: service.id,
            name: service.name || service.title,
            category: service.category || service.type,
            duration: service.duration,
            location: service.location || service.destination
          } : null,
          client: client ? {
            id: client.id,
            name: `${client.name || client.first_name || ''} ${client.last_name || ''}`.trim(),
            email: client.email,
            phone: client.phone
          } : null,
          guide: guide ? {
            id: guide.id,
            name: guide.name,
            phone: guide.phone,
            rating: guide.rating
          } : null
        };
      });

      // Apply filters if provided
      const { status, date_from, date_to, user_id, page, pageSize } = req.query;

      if (status) {
        extendedReservations = extendedReservations.filter(r => r.status === status);
      }

      if (user_id) {
        extendedReservations = extendedReservations.filter(r => r.user_id === user_id);
      }

      if (date_from) {
        extendedReservations = extendedReservations.filter(r => new Date(r.created_at) >= new Date(date_from));
      }

      if (date_to) {
        extendedReservations = extendedReservations.filter(r => new Date(r.created_at) <= new Date(date_to));
      }

      // Pagination
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(pageSize) || 20;
      const totalItems = extendedReservations.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedReservations = extendedReservations.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          reservations: paginatedReservations,
          page: currentPage,
          pageSize: itemsPerPage,
          total: totalItems,
          totalPages: totalPages
        }
      });

    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener reservaciones'
      });
    }
  });

  // Get reservation by ID
  reservationsRouter.get('/:id', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const reservation = db.get('reservations').find({ id: req.params.id }).value();

      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Reservación no encontrada'
        });
      }

      res.json({
        success: true,
        data: reservation
      });

    } catch (error) {
      console.error('Error fetching reservation:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener reservación'
      });
    }
  });

  // Create new reservation
  reservationsRouter.post('/', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;

      // Accept both camelCase and snake_case
      const agency_id = req.body.agency_id || req.body.agencyId;
      const service_id = req.body.service_id || req.body.serviceId || req.body.tourId;
      const client_id = req.body.client_id || req.body.clientId;
      const client_name = req.body.client_name || req.body.clientName;
      const client_phone = req.body.client_phone || req.body.clientPhone;
      const client_email = req.body.client_email || req.body.clientEmail;
      const guide_id = req.body.guide_id || req.body.guideId;
      const tour_date = req.body.tour_date || req.body.tourDate || req.body.date;
      const tour_time = req.body.tour_time || req.body.tourTime || req.body.time || req.body.start_time;
      const group_size = req.body.group_size || req.body.groupSize || req.body.participants || req.body.adults || req.body.tourists;
      const service_type = req.body.service_type || req.body.serviceType;
      const service_name = req.body.service_name || req.body.serviceName;
      const pickup_location = req.body.pickup_location || req.body.pickupLocation;
      const special_requests = req.body.special_requests || req.body.specialRequests || req.body.specialRequirements;
      const emergency_contact = req.body.emergency_contact || req.body.emergencyContact;
      const total_amount = req.body.total_amount || req.body.totalAmount || req.body.price;
      const payment_status = req.body.payment_status || req.body.paymentStatus || 'pending';
      const status = req.body.status || 'pending';

      // Validate required fields for agency calendar reservations
      // Either (service_id + client_id) OR (agency_id + client_name + tour_date + group_size)
      const hasServiceAndClient = service_id && client_id;
      const hasAgencyAndBasics = tour_date && group_size;

      if (!hasServiceAndClient && !hasAgencyAndBasics) {
        console.log('Missing required fields:', { service_id, client_id, tour_date, group_size });
        console.log('Received body:', req.body);
        return res.status(400).json(errorResponse('Campos requeridos: (service_id + client_id) O (tour_date + group_size)'));
      }

      // Calculate pricing only if service exists
      let pricing = {
        total: parseFloat(total_amount) || 0,
        subtotal: parseFloat(total_amount) || 0,
        tax_amount: 0
      };

      if (service_id) {
        const service = db.get('services').find({ id: service_id }).value();
        if (service) {
          pricing = calculatePrice({
            base_price: service.price,
            group_size: parseInt(group_size)
          });
        }
      }

      const newReservation = {
        id: generateId('reservation'),
        agency_id: agency_id || null,
        service_id: service_id || null,
        client_id: client_id || null,
        client_name: client_name || null,
        client_phone: client_phone || null,
        client_email: client_email || null,
        guide_id: guide_id || null,
        service_type: service_type || 'Tour',
        service_name: service_name || service_type || 'Tour',
        tour_date,
        date: tour_date,
        time: tour_time || '09:00',
        start_time: tour_time || '09:00',
        pickup_location: pickup_location || '',
        group_size: parseInt(group_size),
        participants: parseInt(group_size),
        status: status,
        payment_status: payment_status,
        total_amount: pricing.total,
        price: pricing.total,
        base_amount: pricing.subtotal,
        tax_amount: pricing.tax_amount,
        special_requests: special_requests || '',
        emergency_contact: emergency_contact || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add to database
      db.get('reservations').push(newReservation).write();

      res.status(201).json(successResponse(newReservation, 'Reservación creada exitosamente'));

    } catch (error) {
      console.error('Error creating reservation:', error);
      res.status(500).json(errorResponse('Error al crear reservación'));
    }
  });

  // Update reservation
  reservationsRouter.put('/:id', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const updateData = req.body;

      const reservation = db.get('reservations').find({ id }).value();

      if (!reservation) {
        return res.status(404).json(errorResponse('Reservación no encontrada'));
      }

      // Recalculate pricing if group_size or service changed
      if (updateData.group_size || updateData.service_id) {
        const service_id = updateData.service_id || reservation.service_id;
        const group_size = updateData.group_size || reservation.group_size;

        const service = db.get('services').find({ id: service_id }).value();
        if (service) {
          const pricing = calculatePrice({
            base_price: service.price,
            group_size: parseInt(group_size)
          });

          updateData.total_amount = pricing.total;
          updateData.base_amount = pricing.subtotal;
          updateData.tax_amount = pricing.tax_amount;
        }
      }

      // Update reservation
      const updatedReservation = {
        ...reservation,
        ...updateData,
        updated_at: new Date().toISOString()
      };

      db.get('reservations')
        .find({ id })
        .assign(updatedReservation)
        .write();

      res.json(successResponse(updatedReservation, 'Reservación actualizada exitosamente'));

    } catch (error) {
      console.error('Error updating reservation:', error);
      res.status(500).json(errorResponse('Error al actualizar reservación'));
    }
  });

  // Cancel reservation
  reservationsRouter.delete('/:id', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const reservation = db.get('reservations').find({ id }).value();

      if (!reservation) {
        return res.status(404).json(errorResponse('Reservación no encontrada'));
      }

      // Update status to cancelled
      db.get('reservations')
        .find({ id })
        .assign({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .write();

      res.json(successResponse(null, 'Reservación cancelada exitosamente'));

    } catch (error) {
      console.error('Error cancelling reservation:', error);
      res.status(500).json(errorResponse('Error al cancelar reservación'));
    }
  });

  // Get reservation with full details
  reservationsRouter.get('/:id/details', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const reservation = db.get('reservations').find({ id }).value();

      if (!reservation) {
        return res.status(404).json(errorResponse('Reservación no encontrada'));
      }

      // Get related data
      const service = db.get('services').find({ id: reservation.service_id }).value();
      const client = db.get('users').find({ id: reservation.client_id }).value();
      const guide = reservation.guide_id ?
        db.get('guides').find({ id: reservation.guide_id }).value() : null;

      const fullReservation = {
        ...reservation,
        service: service ? {
          id: service.id,
          name: service.name,
          category: service.category,
          duration: service.duration,
          location: service.location
        } : null,
        client: client ? {
          id: client.id,
          name: `${client.first_name} ${client.last_name}`,
          email: client.email,
          phone: client.phone
        } : null,
        guide: guide ? {
          id: guide.id,
          name: guide.name,
          phone: guide.phone,
          rating: guide.rating
        } : null
      };

      res.json(successResponse(fullReservation));

    } catch (error) {
      console.error('Error fetching reservation details:', error);
      res.status(500).json(errorResponse('Error al obtener detalles de reservación'));
    }
  });

  // Confirm reservation
  reservationsRouter.post('/:id/confirm', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const reservation = db.get('reservations').find({ id }).value();

      if (!reservation) {
        return res.status(404).json(errorResponse('Reservación no encontrada'));
      }

      if (reservation.status !== 'pending') {
        return res.status(400).json(errorResponse('Solo se pueden confirmar reservaciones pendientes'));
      }

      // Update status
      db.get('reservations')
        .find({ id })
        .assign({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .write();

      res.json(successResponse(null, 'Reservación confirmada exitosamente'));

    } catch (error) {
      console.error('Error confirming reservation:', error);
      res.status(500).json(errorResponse('Error al confirmar reservación'));
    }
  });

  // Update reservation status (PATCH /:id/status)
  reservationsRouter.patch('/:id/status', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { status, reason } = req.body;

      const reservation = db.get('reservations').find({ id }).value();

      if (!reservation) {
        return res.status(404).json(errorResponse('Reservación no encontrada'));
      }

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json(errorResponse('Estado inválido'));
      }

      // Update status
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };

      if (reason) {
        updateData.status_reason = reason;
      }

      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }

      db.get('reservations')
        .find({ id })
        .assign(updateData)
        .write();

      res.json(successResponse(updateData, 'Estado actualizado exitosamente'));

    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json(errorResponse('Error al actualizar estado'));
    }
  });

  // Cancel reservation (PATCH /:id/cancel)
  reservationsRouter.patch('/:id/cancel', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { reason } = req.body;

      const reservation = db.get('reservations').find({ id }).value();

      if (!reservation) {
        return res.status(404).json(errorResponse('Reservación no encontrada'));
      }

      if (reservation.status === 'cancelled') {
        return res.status(400).json(errorResponse('La reservación ya está cancelada'));
      }

      // Update status to cancelled
      db.get('reservations')
        .find({ id })
        .assign({
          status: 'cancelled',
          cancellation_reason: reason || 'Sin razón especificada',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .write();

      res.json(successResponse(null, 'Reservación cancelada exitosamente'));

    } catch (error) {
      console.error('Error cancelling reservation:', error);
      res.status(500).json(errorResponse('Error al cancelar reservación'));
    }
  });

  // Assign guide to reservation (POST /:id/assign-guide)
  reservationsRouter.post('/:id/assign-guide', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { guideId } = req.body;

      if (!guideId) {
        return res.status(400).json(errorResponse('El ID del guía es requerido'));
      }

      const reservation = db.get('reservations').find({ id }).value();
      if (!reservation) {
        return res.status(404).json(errorResponse('Reservación no encontrada'));
      }

      // Verify guide exists
      const guide = db.get('guides').find({ id: guideId }).value();
      if (!guide) {
        return res.status(404).json(errorResponse('Guía no encontrado'));
      }

      // Update reservation
      db.get('reservations')
        .find({ id })
        .assign({
          guide_id: guideId,
          updated_at: new Date().toISOString()
        })
        .write();

      res.json(successResponse({ guide_id: guideId }, 'Guía asignado exitosamente'));

    } catch (error) {
      console.error('Error assigning guide:', error);
      res.status(500).json(errorResponse('Error al asignar guía'));
    }
  });

  // Generate voucher (GET /:id/voucher)
  reservationsRouter.get('/:id/voucher', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const reservation = db.get('reservations').find({ id }).value();
      if (!reservation) {
        return res.status(404).json(errorResponse('Reservación no encontrada'));
      }

      // Get related data
      const service = db.get('services').find({ id: reservation.service_id }).value();
      const client = db.get('users').find({ id: reservation.client_id }).value();
      const guide = reservation.guide_id ?
        db.get('guides').find({ id: reservation.guide_id }).value() : null;

      const voucher = {
        voucher_number: `V-${id.toUpperCase()}`,
        reservation_id: id,
        issue_date: new Date().toISOString(),
        status: reservation.status,
        service: service ? {
          name: service.name,
          category: service.category,
          duration: service.duration,
          location: service.location
        } : null,
        client: client ? {
          name: `${client.first_name} ${client.last_name}`,
          email: client.email,
          phone: client.phone
        } : null,
        guide: guide ? {
          name: guide.name,
          phone: guide.phone
        } : null,
        tour_date: reservation.tour_date,
        group_size: reservation.group_size,
        total_amount: reservation.total_amount,
        payment_status: reservation.payment_status,
        special_requests: reservation.special_requests,
        emergency_contact: reservation.emergency_contact
      };

      res.json(successResponse(voucher));

    } catch (error) {
      console.error('Error generating voucher:', error);
      res.status(500).json(errorResponse('Error al generar voucher'));
    }
  });

  // Download voucher PDF (GET /:id/voucher/pdf)
  reservationsRouter.get('/:id/voucher/pdf', adminOrAgency(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const reservation = db.get('reservations').find({ id }).value();
      if (!reservation) {
        return res.status(404).json(errorResponse('Reservación no encontrada'));
      }

      // In a real implementation, this would generate a PDF
      // For now, return mock PDF data
      res.json({
        success: true,
        data: {
          filename: `voucher_${id}.pdf`,
          url: `/api/files/vouchers/${id}.pdf`,
          content_type: 'application/pdf',
          size: 124587,
          message: 'PDF generado (simulado para demo)'
        }
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json(errorResponse('Error al generar PDF'));
    }
  });

  return reservationsRouter;
};