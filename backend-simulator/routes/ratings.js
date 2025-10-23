/**
 * Ratings and Evaluations Routes
 * Endpoints para sistema de calificaciones y evaluaciones de personal
 */

module.exports = (router) => {
  const express = require('express');
  const apiRouter = express.Router();

  /**
   * GET /api/ratings/dashboard/stats
   * Obtener estadísticas generales del dashboard de ratings
   */
  apiRouter.get('/dashboard/stats', (req, res) => {
    try {
      const db = router.db;
      const stats = db.get('ratings_dashboard').value() || {
        totalRatings: 0,
        averageRating: 0,
        staffEvaluated: 0,
        improvementTrend: '+0%'
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas de ratings',
        details: error.message
      });
    }
  });

  /**
   * GET /api/ratings/areas
   * Obtener estadísticas por área de servicio
   */
  apiRouter.get('/areas', (req, res) => {
    try {
      const db = router.db;
      const areaStats = db.get('ratings_area_stats').value() || [];

      res.json({
        success: true,
        data: areaStats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas por área',
        details: error.message
      });
    }
  });

  /**
   * GET /api/ratings/staff
   * Obtener estadísticas de personal
   */
  apiRouter.get('/staff', (req, res) => {
    try {
      const db = router.db;
      const staffStats = db.get('ratings_staff_stats').value() || [];

      res.json({
        success: true,
        data: staffStats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas de personal',
        details: error.message
      });
    }
  });

  /**
   * GET /api/ratings/service-areas
   * Obtener lista de áreas de servicio
   */
  apiRouter.get('/service-areas', (req, res) => {
    try {
      const db = router.db;
      const serviceAreas = db.get('ratings_service_areas').value() || [];

      res.json({
        success: true,
        data: serviceAreas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener áreas de servicio',
        details: error.message
      });
    }
  });

  /**
   * GET /api/ratings/periods
   * Obtener períodos disponibles para filtrar
   */
  apiRouter.get('/periods', (req, res) => {
    try {
      const db = router.db;
      const periods = db.get('ratings_periods').value() || [];

      res.json({
        success: true,
        data: periods
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener períodos',
        details: error.message
      });
    }
  });

  /**
   * GET /api/ratings/distribution
   * Obtener distribución de calificaciones
   */
  apiRouter.get('/distribution', (req, res) => {
    try {
      const db = router.db;
      const distribution = db.get('ratings_distribution').value() || {};

      res.json({
        success: true,
        data: distribution
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener distribución',
        details: error.message
      });
    }
  });

  /**
   * GET /api/evaluations/criteria
   * Obtener criterios de evaluación
   */
  apiRouter.get('/evaluations/criteria', (req, res) => {
    try {
      const db = router.db;
      const criteria = db.get('evaluation_criteria').value() || [];

      res.json({
        success: true,
        data: criteria
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener criterios de evaluación',
        details: error.message
      });
    }
  });

  /**
   * GET /api/evaluations/recommendations
   * Obtener opciones de recomendación
   */
  apiRouter.get('/evaluations/recommendations', (req, res) => {
    try {
      const db = router.db;
      const recommendations = db.get('evaluation_recommendations').value() || [];

      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener opciones de recomendación',
        details: error.message
      });
    }
  });

  /**
   * POST /api/evaluations
   * Crear nueva evaluación de personal
   */
  apiRouter.post('/evaluations', (req, res) => {
    try {
      const db = router.db;
      const evaluation = {
        id: `eval-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString()
      };

      db.get('staff_evaluations').push(evaluation).write();

      res.json({
        success: true,
        data: evaluation,
        message: 'Evaluación creada correctamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear evaluación',
        details: error.message
      });
    }
  });

  /**
   * GET /api/ratings/agencies
   * Obtener calificaciones de agencias con estadísticas
   */
  apiRouter.get('/agencies', (req, res) => {
    try {
      const db = router.db;
      const { period, agencyId } = req.query;

      // Obtener reservas y agencias
      const reservations = db.get('reservations').value() || [];
      const agencies = db.get('agencies').value() || [];
      const services = db.get('services').value() || [];

      // Filtrar reservas completadas con calificación
      let completedReservations = reservations.filter(r =>
        r.status === 'completed' && r.rating !== undefined
      );

      // Filtrar por período si se especifica
      if (period) {
        const now = new Date();
        let startDate;

        switch(period) {
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case 'quarter':
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
          case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
          default:
            startDate = new Date(now.setMonth(now.getMonth() - 1));
        }

        completedReservations = completedReservations.filter(r => {
          const reviewDate = new Date(r.reviewed_at || r.updated_at);
          return reviewDate >= startDate;
        });
      }

      // Agrupar por agencia
      const agencyRatings = {};

      completedReservations.forEach(reservation => {
        const agencyData = agencies.find(a => a.id === reservation.agency_id);
        if (!agencyData) return;

        if (!agencyRatings[reservation.agency_id]) {
          agencyRatings[reservation.agency_id] = {
            id: reservation.agency_id,
            agencyName: agencyData.name || agencyData.business_name,
            totalReviews: 0,
            totalRating: 0,
            rating: 0,
            lastReview: null,
            comments: []
          };
        }

        agencyRatings[reservation.agency_id].totalReviews++;
        agencyRatings[reservation.agency_id].totalRating += (reservation.rating || 0);

        // Agregar comentario si existe
        if (reservation.review_comment) {
          const service = services.find(s => s.id === reservation.service_id);
          agencyRatings[reservation.agency_id].comments.push({
            id: `comment-${reservation.id}`,
            tourName: service?.name || reservation.service_name || 'Tour',
            rating: reservation.rating,
            comment: reservation.review_comment,
            touristName: reservation.client_name || 'Cliente',
            date: reservation.reviewed_at || reservation.updated_at
          });
        }

        // Actualizar última review
        const reviewDate = new Date(reservation.reviewed_at || reservation.updated_at);
        if (!agencyRatings[reservation.agency_id].lastReview ||
            reviewDate > new Date(agencyRatings[reservation.agency_id].lastReview)) {
          agencyRatings[reservation.agency_id].lastReview = reservation.reviewed_at || reservation.updated_at;
        }
      });

      // Calcular rating promedio
      Object.keys(agencyRatings).forEach(agencyId => {
        const data = agencyRatings[agencyId];
        data.rating = data.totalReviews > 0
          ? parseFloat((data.totalRating / data.totalReviews).toFixed(1))
          : 0;

        // Ordenar comentarios por fecha (más recientes primero)
        data.comments.sort((a, b) => new Date(b.date) - new Date(a.date));
      });

      // Convertir a array y filtrar por agencyId si se especifica
      let ratingsArray = Object.values(agencyRatings);

      if (agencyId) {
        ratingsArray = ratingsArray.filter(r => r.id === agencyId);
      }

      // Ordenar por rating descendente
      ratingsArray.sort((a, b) => b.rating - a.rating);

      res.json({
        success: true,
        data: ratingsArray
      });
    } catch (error) {
      console.error('Error al obtener ratings de agencias:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener calificaciones de agencias',
        details: error.message,
        data: []
      });
    }
  });

  /**
   * GET /api/ratings/agencies/summary
   * Obtener resumen general de calificaciones de agencias
   */
  apiRouter.get('/agencies/summary', (req, res) => {
    try {
      const db = router.db;
      const reservations = db.get('reservations').value() || [];
      const agencies = db.get('agencies').value() || [];

      // Filtrar reservas completadas con calificación
      const completedWithRating = reservations.filter(r =>
        r.status === 'completed' && r.rating !== undefined
      );

      // Calcular estadísticas generales
      const totalRatings = completedWithRating.length;
      const avgRating = totalRatings > 0
        ? completedWithRating.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRatings
        : 0;

      // Contar agencias únicas con calificaciones
      const agenciesWithRatings = new Set(completedWithRating.map(r => r.agency_id));

      res.json({
        success: true,
        data: {
          averageRating: parseFloat(avgRating.toFixed(1)),
          totalRatings: totalRatings,
          totalAgencies: agenciesWithRatings.size
        }
      });
    } catch (error) {
      console.error('Error al obtener resumen de ratings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener resumen',
        data: {
          averageRating: 0,
          totalRatings: 0,
          totalAgencies: 0
        }
      });
    }
  });

  return apiRouter;
};
