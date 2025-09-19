const express = require('express');
const { generateId, paginate, filterBy, sortBy, calculatePrice, successResponse, errorResponse } = require('../middlewares/helpers');

module.exports = (router) => {
  const reservationsRouter = express.Router();

  // Get all reservations with filtering
  reservationsRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      let reservations = db.get('reservations').value();

      // Apply filters if provided
      const { status, date_from, date_to, user_id } = req.query;

      if (status) {
        reservations = reservations.filter(r => r.status === status);
      }

      if (user_id) {
        reservations = reservations.filter(r => r.user_id === user_id);
      }

      if (date_from) {
        reservations = reservations.filter(r => new Date(r.created_at) >= new Date(date_from));
      }

      if (date_to) {
        reservations = reservations.filter(r => new Date(r.created_at) <= new Date(date_to));
      }

      res.json({
        success: true,
        data: reservations,
        total: reservations.length
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
  reservationsRouter.get('/:id', (req, res) => {
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
  reservationsRouter.post('/', (req, res) => {
    try {
      const db = router.db;
      const {
        service_id,
        client_id,
        guide_id,
        tour_date,
        group_size,
        special_requests,
        emergency_contact
      } = req.body;

      // Validate required fields
      if (!service_id || !client_id || !tour_date || !group_size) {
        return res.status(400).json(errorResponse('Campos requeridos: service_id, client_id, tour_date, group_size'));
      }

      // Get service details for pricing
      const service = db.get('services').find({ id: service_id }).value();
      if (!service) {
        return res.status(404).json(errorResponse('Servicio no encontrado'));
      }

      // Calculate pricing
      const pricing = calculatePrice({
        base_price: service.price,
        group_size: parseInt(group_size)
      });

      const newReservation = {
        id: generateId('reservation'),
        service_id,
        client_id,
        guide_id: guide_id || null,
        tour_date,
        group_size: parseInt(group_size),
        status: 'pending',
        payment_status: 'pending',
        total_amount: pricing.total,
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
  reservationsRouter.put('/:id', (req, res) => {
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
  reservationsRouter.delete('/:id', (req, res) => {
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
  reservationsRouter.get('/:id/details', (req, res) => {
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
  reservationsRouter.post('/:id/confirm', (req, res) => {
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

  return reservationsRouter;
};