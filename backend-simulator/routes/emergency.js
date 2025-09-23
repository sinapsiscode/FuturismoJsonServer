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
      let incidents = db.get('incidents').value() || [];

      // Apply filters
      const { category, status, severity, reporter_id, start_date, end_date } = req.query;

      if (category) {
        incidents = incidents.filter(i => i.category === category);
      }

      if (status) {
        incidents = incidents.filter(i => i.status === status);
      }

      if (severity) {
        incidents = incidents.filter(i => i.severity === severity);
      }

      if (reporter_id) {
        incidents = incidents.filter(i => i.reporter_id === reporter_id);
      }

      if (start_date && end_date) {
        incidents = incidents.filter(i => {
          const incidentDate = new Date(i.created_at);
          return incidentDate >= new Date(start_date) && incidentDate <= new Date(end_date);
        });
      }

      // Sort by date descending
      incidents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      res.json({
        success: true,
        data: incidents,
        total: incidents.length
      });

    } catch (error) {
      console.error('Emergency incidents error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener incidentes de emergencia'
      });
    }
  });

  // Create new incident
  emergencyRouter.post('/incidents', (req, res) => {
    try {
      const db = router.db;
      const newIncident = {
        id: `incident-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: req.body.status || 'reported'
      };

      db.get('incidents').push(newIncident).write();

      res.status(201).json({
        success: true,
        data: newIncident,
        message: 'Incidente reportado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear incidente'
      });
    }
  });

  // Get incident by ID
  emergencyRouter.get('/incidents/:id', (req, res) => {
    try {
      const db = router.db;
      const incident = db.get('incidents').find({ id: req.params.id }).value();

      if (!incident) {
        return res.status(404).json({
          success: false,
          error: 'Incidente no encontrado'
        });
      }

      // Get related protocol if any
      const protocol = incident.protocol_id ?
        db.get('emergency_protocols').find({ id: incident.protocol_id }).value() : null;

      // Get protocol steps if protocol exists
      const protocolSteps = protocol ?
        db.get('protocol_steps').filter({ protocol_id: protocol.id }).orderBy('step_order').value() : [];

      res.json({
        success: true,
        data: {
          ...incident,
          protocol,
          protocol_steps: protocolSteps
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener incidente'
      });
    }
  });

  // Update incident
  emergencyRouter.put('/incidents/:id', (req, res) => {
    try {
      const db = router.db;
      const incident = db.get('incidents').find({ id: req.params.id });

      if (!incident.value()) {
        return res.status(404).json({
          success: false,
          error: 'Incidente no encontrado'
        });
      }

      const updatedIncident = {
        ...req.body,
        updated_at: new Date().toISOString()
      };

      incident.assign(updatedIncident).write();

      res.json({
        success: true,
        data: incident.value(),
        message: 'Incidente actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar incidente'
      });
    }
  });

  // Get protocol steps
  emergencyRouter.get('/protocols/:id/steps', (req, res) => {
    try {
      const db = router.db;
      const steps = db.get('protocol_steps')
        .filter({ protocol_id: req.params.id })
        .orderBy('step_order')
        .value() || [];

      res.json({
        success: true,
        data: steps
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener pasos del protocolo'
      });
    }
  });

  // Add protocol step
  emergencyRouter.post('/protocols/:id/steps', (req, res) => {
    try {
      const db = router.db;
      const protocol = db.get('emergency_protocols').find({ id: req.params.id }).value();

      if (!protocol) {
        return res.status(404).json({
          success: false,
          error: 'Protocolo no encontrado'
        });
      }

      const newStep = {
        id: `step-${Date.now()}`,
        protocol_id: req.params.id,
        ...req.body,
        created_at: new Date().toISOString()
      };

      db.get('protocol_steps').push(newStep).write();

      res.status(201).json({
        success: true,
        data: newStep,
        message: 'Paso agregado al protocolo'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar paso'
      });
    }
  });

  // Get emergency contacts
  emergencyRouter.get('/contacts', (req, res) => {
    try {
      const db = router.db;
      let contacts = db.get('emergency_contacts').value() || [];

      const { category, location } = req.query;

      if (category) {
        contacts = contacts.filter(c => c.category === category);
      }

      if (location) {
        contacts = contacts.filter(c => c.location === location);
      }

      // Sort by priority and category
      contacts.sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return a.category.localeCompare(b.category);
      });

      res.json({
        success: true,
        data: contacts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener contactos de emergencia'
      });
    }
  });

  // Add emergency contact
  emergencyRouter.post('/contacts', (req, res) => {
    try {
      const db = router.db;
      const newContact = {
        id: `contact-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString(),
        is_active: true
      };

      db.get('emergency_contacts').push(newContact).write();

      res.status(201).json({
        success: true,
        data: newContact,
        message: 'Contacto de emergencia agregado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar contacto'
      });
    }
  });

  // Update emergency material
  emergencyRouter.put('/materials/:id', (req, res) => {
    try {
      const db = router.db;
      const material = db.get('emergency_materials').find({ id: req.params.id });

      if (!material.value()) {
        return res.status(404).json({
          success: false,
          error: 'Material no encontrado'
        });
      }

      material.assign({
        ...req.body,
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: material.value(),
        message: 'Material actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar material'
      });
    }
  });

  // Add emergency material
  emergencyRouter.post('/materials', (req, res) => {
    try {
      const db = router.db;
      const newMaterial = {
        id: `material-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString(),
        is_active: true
      };

      db.get('emergency_materials').push(newMaterial).write();

      res.status(201).json({
        success: true,
        data: newMaterial,
        message: 'Material de emergencia agregado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar material'
      });
    }
  });

  // Create emergency protocol
  emergencyRouter.post('/protocols', (req, res) => {
    try {
      const db = router.db;
      const newProtocol = {
        id: `protocol-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      };

      db.get('emergency_protocols').push(newProtocol).write();

      res.status(201).json({
        success: true,
        data: newProtocol,
        message: 'Protocolo de emergencia creado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear protocolo'
      });
    }
  });

  // Update emergency protocol
  emergencyRouter.put('/protocols/:id', (req, res) => {
    try {
      const db = router.db;
      const protocol = db.get('emergency_protocols').find({ id: req.params.id });

      if (!protocol.value()) {
        return res.status(404).json({
          success: false,
          error: 'Protocolo no encontrado'
        });
      }

      protocol.assign({
        ...req.body,
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: protocol.value(),
        message: 'Protocolo actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar protocolo'
      });
    }
  });

  return emergencyRouter;
};