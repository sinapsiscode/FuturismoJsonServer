const express = require('express');

module.exports = (router) => {
  const emergencyRouter = express.Router();

  // Get emergency categories
  emergencyRouter.get('/categories', (req, res) => {
    try {
      const db = router.db;
      const categories = db.get('emergency_categories').value() || [];

      res.json({
        success: true,
        data: categories
      });

    } catch (error) {
      console.error('Emergency categories error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener categorías de emergencia'
      });
    }
  });

  // Get emergency protocols
  emergencyRouter.get('/protocols', (req, res) => {
    try {
      const db = router.db;
      let protocols = db.get('emergency_protocols').value() || [];

      // Filter by category if provided
      if (req.query.category) {
        protocols = protocols.filter(p => p.category === req.query.category);
      }

      // Filter by priority if provided
      if (req.query.priority) {
        protocols = protocols.filter(p => p.priority === req.query.priority);
      }

      // Sort by priority
      const priorityOrder = { alta: 1, media: 2, baja: 3 };
      protocols.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      res.json({
        success: true,
        data: protocols
      });

    } catch (error) {
      console.error('Emergency protocols error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener protocolos de emergencia'
      });
    }
  });

  // Get protocol by ID
  emergencyRouter.get('/protocols/:id', (req, res) => {
    try {
      const db = router.db;
      const protocol = db.get('emergency_protocols').find({ id: req.params.id }).value();

      if (!protocol) {
        return res.status(404).json({
          success: false,
          error: 'Protocolo no encontrado'
        });
      }

      res.json({
        success: true,
        data: protocol
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener el protocolo'
      });
    }
  });

  // Get emergency materials
  emergencyRouter.get('/materials', (req, res) => {
    try {
      const db = router.db;
      let materials = db.get('emergency_materials').value() || [];

      // Filter by category if provided
      if (req.query.category) {
        materials = materials.filter(m => m.category === req.query.category);
      }

      // Filter by mandatory if provided
      if (req.query.mandatory !== undefined) {
        materials = materials.filter(m => m.mandatory === (req.query.mandatory === 'true'));
      }

      // Sort by mandatory first
      materials.sort((a, b) => {
        if (a.mandatory && !b.mandatory) return -1;
        if (!a.mandatory && b.mandatory) return 1;
        return a.name.localeCompare(b.name);
      });

      res.json({
        success: true,
        data: materials
      });

    } catch (error) {
      console.error('Emergency materials error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener materiales de emergencia'
      });
    }
  });

  // Get emergency incidents
  emergencyRouter.get('/incidents', (req, res) => {
    try {
      const db = router.db;
      let incidents = db.get('emergency_incidents').value() || [];

      // Filter by category if provided
      if (req.query.category) {
        incidents = incidents.filter(i => i.category === req.query.category);
      }

      // Filter by status if provided
      if (req.query.status) {
        incidents = incidents.filter(i => i.status === req.query.status);
      }

      // Sort by date descending
      incidents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.json({
        success: true,
        data: incidents
      });

    } catch (error) {
      console.error('Emergency incidents error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener incidentes de emergencia'
      });
    }
  });

  return emergencyRouter;
};