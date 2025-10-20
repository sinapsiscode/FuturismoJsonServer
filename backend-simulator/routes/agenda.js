const express = require('express');

module.exports = (router) => {
  const agendaRouter = express.Router();

  // Get guide availability for a specific date
  agendaRouter.get('/guides/:guideId/availability', (req, res) => {
    try {
      const db = router.db;
      const { guideId } = req.params;
      const { date } = req.query;

      // Buscar disponibilidad del guía en la fecha especificada
      let availability = db.get('guide_availability')
        .filter({ guide_id: guideId })
        .value() || [];

      // Si se especifica una fecha, filtrar por ella
      if (date) {
        const requestedDate = new Date(date).toISOString().split('T')[0];
        availability = availability.filter(a => {
          const availDate = new Date(a.date).toISOString().split('T')[0];
          return availDate === requestedDate;
        });
      }

      // Si no hay disponibilidad registrada, retornar disponibilidad por defecto
      if (availability.length === 0) {
        const defaultAvailability = {
          guide_id: guideId,
          date: date || new Date().toISOString().split('T')[0],
          is_available: true,
          time_slots: [
            { start: '08:00', end: '12:00', available: true },
            { start: '14:00', end: '18:00', available: true }
          ],
          notes: null
        };

        res.json({
          success: true,
          data: defaultAvailability
        });
      } else {
        res.json({
          success: true,
          data: availability.length === 1 ? availability[0] : availability
        });
      }

    } catch (error) {
      console.error('Error getting guide availability:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener disponibilidad del guía'
      });
    }
  });

  // Update guide availability
  agendaRouter.put('/guides/:guideId/availability', (req, res) => {
    try {
      const db = router.db;
      const { guideId } = req.params;
      const { date, is_available, time_slots, notes } = req.body;

      if (!date) {
        return res.status(400).json({
          success: false,
          error: 'La fecha es requerida'
        });
      }

      // Buscar disponibilidad existente
      const existing = db.get('guide_availability')
        .find({ guide_id: guideId, date })
        .value();

      if (existing) {
        // Actualizar existente
        db.get('guide_availability')
          .find({ guide_id: guideId, date })
          .assign({
            is_available,
            time_slots,
            notes,
            updated_at: new Date().toISOString()
          })
          .write();

        res.json({
          success: true,
          message: 'Disponibilidad actualizada exitosamente',
          data: db.get('guide_availability').find({ guide_id: guideId, date }).value()
        });
      } else {
        // Crear nueva
        const newAvailability = {
          id: `guide-avail-${Date.now()}`,
          guide_id: guideId,
          date,
          is_available: is_available !== undefined ? is_available : true,
          time_slots: time_slots || [],
          notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        db.get('guide_availability').push(newAvailability).write();

        res.status(201).json({
          success: true,
          message: 'Disponibilidad creada exitosamente',
          data: newAvailability
        });
      }

    } catch (error) {
      console.error('Error updating guide availability:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar disponibilidad'
      });
    }
  });

  // Get guide's weekly availability
  agendaRouter.get('/guides/:guideId/weekly-availability', (req, res) => {
    try {
      const db = router.db;
      const { guideId } = req.params;
      const { startDate, endDate } = req.query;

      let availability = db.get('guide_availability')
        .filter({ guide_id: guideId })
        .value() || [];

      // Filtrar por rango de fechas si se proporciona
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        availability = availability.filter(a => {
          const date = new Date(a.date);
          return date >= start && date <= end;
        });
      }

      res.json({
        success: true,
        data: availability
      });

    } catch (error) {
      console.error('Error getting weekly availability:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener disponibilidad semanal'
      });
    }
  });

  // Get all guides availability for a specific date (admin view)
  agendaRouter.get('/availability', (req, res) => {
    try {
      const db = router.db;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          error: 'La fecha es requerida'
        });
      }

      const requestedDate = new Date(date).toISOString().split('T')[0];

      // Obtener todos los guías
      const guides = db.get('guides').value() || [];

      // Obtener disponibilidad de todos los guías para esa fecha
      const availability = guides.map(guide => {
        const guideAvail = db.get('guide_availability')
          .find({ guide_id: guide.id, date: requestedDate })
          .value();

        // Si no hay registro, asumir disponible por defecto
        if (!guideAvail) {
          return {
            guide_id: guide.id,
            guide_name: guide.name || `${guide.first_name} ${guide.last_name}`,
            date: requestedDate,
            is_available: true,
            time_slots: [
              { start: '08:00', end: '12:00', available: true },
              { start: '14:00', end: '18:00', available: true }
            ]
          };
        }

        return {
          ...guideAvail,
          guide_name: guide.name || `${guide.first_name} ${guide.last_name}`
        };
      });

      res.json({
        success: true,
        data: availability
      });

    } catch (error) {
      console.error('Error getting all availability:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener disponibilidad de guías'
      });
    }
  });

  return agendaRouter;
};
