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

  return apiRouter;
};
