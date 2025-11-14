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

  // ============================================
  // CONTACT TYPES CRUD
  // ============================================

  // Get all contact types
  emergencyRouter.get('/contact-types', (req, res) => {
    try {
      const db = router.db;
      let contactTypes = db.get('emergency_contact_types').value() || [];

      // Sort by priority
      contactTypes.sort((a, b) => (a.priority || 0) - (b.priority || 0));

      res.json({
        success: true,
        data: contactTypes
      });
    } catch (error) {
      console.error('Contact types error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de contacto'
      });
    }
  });

  // Get contact type by ID
  emergencyRouter.get('/contact-types/:id', (req, res) => {
    try {
      const db = router.db;
      const contactType = db.get('emergency_contact_types')
        .find({ id: req.params.id })
        .value();

      if (!contactType) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de contacto no encontrado'
        });
      }

      res.json({
        success: true,
        data: contactType
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener el tipo de contacto'
      });
    }
  });

  // Create new contact type
  emergencyRouter.post('/contact-types', (req, res) => {
    try {
      const db = router.db;
      const { name, icon, description, color, priority } = req.body;

      // Validation
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      // Generate ID from name
      const id = name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      // Check if ID already exists
      const exists = db.get('emergency_contact_types')
        .find({ id })
        .value();

      if (exists) {
        return res.status(400).json({
          success: false,
          error: 'Ya existe un tipo de contacto con ese nombre'
        });
      }

      const newContactType = {
        id,
        name: name.trim(),
        icon: icon || '📞',
        description: description || '',
        color: color || '#6B7280',
        priority: priority || 999
      };

      db.get('emergency_contact_types')
        .push(newContactType)
        .write();

      res.json({
        success: true,
        data: newContactType,
        message: 'Tipo de contacto creado exitosamente'
      });
    } catch (error) {
      console.error('Create contact type error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear tipo de contacto'
      });
    }
  });

  // Update contact type
  emergencyRouter.put('/contact-types/:id', (req, res) => {
    try {
      const db = router.db;
      const { name, icon, description, color, priority } = req.body;

      const contactType = db.get('emergency_contact_types')
        .find({ id: req.params.id })
        .value();

      if (!contactType) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de contacto no encontrado'
        });
      }

      // Validation
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      const updatedContactType = {
        ...contactType,
        name: name.trim(),
        icon: icon || contactType.icon,
        description: description || '',
        color: color || contactType.color,
        priority: priority !== undefined ? priority : contactType.priority
      };

      db.get('emergency_contact_types')
        .find({ id: req.params.id })
        .assign(updatedContactType)
        .write();

      res.json({
        success: true,
        data: updatedContactType,
        message: 'Tipo de contacto actualizado exitosamente'
      });
    } catch (error) {
      console.error('Update contact type error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar tipo de contacto'
      });
    }
  });

  // Delete contact type
  emergencyRouter.delete('/contact-types/:id', (req, res) => {
    try {
      const db = router.db;

      const contactType = db.get('emergency_contact_types')
        .find({ id: req.params.id })
        .value();

      if (!contactType) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de contacto no encontrado'
        });
      }

      // Check if contact type is being used in protocols
      const protocolsUsingType = db.get('emergency_protocols')
        .filter(protocol => {
          return protocol.content?.contacts?.some(contact => contact.type === req.params.id);
        })
        .value();

      if (protocolsUsingType && protocolsUsingType.length > 0) {
        return res.status(400).json({
          success: false,
          error: `No se puede eliminar. Este tipo está siendo usado en ${protocolsUsingType.length} protocolo(s)`
        });
      }

      db.get('emergency_contact_types')
        .remove({ id: req.params.id })
        .write();

      res.json({
        success: true,
        message: 'Tipo de contacto eliminado exitosamente'
      });
    } catch (error) {
      console.error('Delete contact type error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar tipo de contacto'
      });
    }
  });

  // ============================================
  // PROTOCOLS
  // ============================================

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

      // Filter by search query
      if (req.query.search) {
        const searchLower = req.query.search.toLowerCase();
        materials = materials.filter(m =>
          m.name.toLowerCase().includes(searchLower) ||
          (m.category && m.category.toLowerCase().includes(searchLower))
        );
      }

      // Sort by mandatory first
      materials.sort((a, b) => {
        if (a.mandatory && !b.mandatory) return -1;
        if (!a.mandatory && b.mandatory) return 1;
        return a.name.localeCompare(b.name);
      });

      // Pagination
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 100; // Default to large size for dropdowns
      const total = materials.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedMaterials = materials.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          materials: paginatedMaterials,
          page,
          pageSize,
          total,
          totalPages
        }
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

  /**
   * POST /api/emergency/categories
   * Crear nueva categoría de emergencia
   */
  emergencyRouter.post('/categories', (req, res) => {
    try {
      const db = router.db;
      const { name, description, color, icon } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      const newCategory = {
        id: `emerg-cat-${Date.now()}`,
        name,
        description: description || '',
        color: color || '#EF4444',
        icon: icon || 'exclamation-triangle',
        active: true,
        created_at: new Date().toISOString()
      };

      db.get('emergency_categories').push(newCategory).write();

      res.status(201).json({
        success: true,
        data: newCategory,
        message: 'Categoría creada exitosamente'
      });
    } catch (error) {
      console.error('Error al crear categoría de emergencia:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear categoría de emergencia'
      });
    }
  });

  /**
   * PUT /api/emergency/categories/:id
   * Actualizar categoría de emergencia
   */
  emergencyRouter.put('/categories/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { name, description, color, icon, active } = req.body;

      const category = db.get('emergency_categories').find({ id }).value();

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
        color: color || category.color,
        icon: icon || category.icon,
        active: active !== undefined ? active : category.active,
        updated_at: new Date().toISOString()
      };

      db.get('emergency_categories').find({ id }).assign(updatedCategory).write();

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
   * DELETE /api/emergency/categories/:id
   * Eliminar categoría de emergencia
   */
  emergencyRouter.delete('/categories/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const category = db.get('emergency_categories').find({ id }).value();

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }

      // Soft delete
      db.get('emergency_categories').find({ id }).assign({ active: false }).write();

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

  /**
   * GET /api/emergency/contacts
   * Obtener contactos de emergencia
   */
  emergencyRouter.get('/contacts', (req, res) => {
    try {
      const db = router.db;
      const { type } = req.query;

      let contacts = db.get('emergency_contacts').value() || [];

      // Filter by type if provided
      if (type) {
        contacts = contacts.filter(c => c.type === type);
      }

      res.json({
        success: true,
        data: contacts
      });
    } catch (error) {
      console.error('Error al obtener contactos de emergencia:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener contactos de emergencia',
        data: []
      });
    }
  });

  /**
   * POST /api/emergency/contacts
   * Crear nuevo contacto de emergencia
   */
  emergencyRouter.post('/contacts', (req, res) => {
    try {
      const db = router.db;
      const { name, phone, type, available_24h, description } = req.body;

      if (!name || !phone || !type) {
        return res.status(400).json({
          success: false,
          error: 'Nombre, teléfono y tipo son requeridos'
        });
      }

      const newContact = {
        id: `contact-${Date.now()}`,
        name,
        phone,
        type,
        available_24h: available_24h !== undefined ? available_24h : true,
        description: description || '',
        active: true,
        created_at: new Date().toISOString()
      };

      db.get('emergency_contacts').push(newContact).write();

      res.status(201).json({
        success: true,
        data: newContact,
        message: 'Contacto creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear contacto:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear contacto'
      });
    }
  });

  /**
   * PUT /api/emergency/contacts/:id
   * Actualizar contacto de emergencia
   */
  emergencyRouter.put('/contacts/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { name, phone, type, available_24h, description, active } = req.body;

      const contact = db.get('emergency_contacts').find({ id }).value();

      if (!contact) {
        return res.status(404).json({
          success: false,
          error: 'Contacto no encontrado'
        });
      }

      const updatedContact = {
        ...contact,
        name: name || contact.name,
        phone: phone || contact.phone,
        type: type || contact.type,
        available_24h: available_24h !== undefined ? available_24h : contact.available_24h,
        description: description !== undefined ? description : contact.description,
        active: active !== undefined ? active : contact.active,
        updated_at: new Date().toISOString()
      };

      db.get('emergency_contacts').find({ id }).assign(updatedContact).write();

      res.json({
        success: true,
        data: updatedContact,
        message: 'Contacto actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar contacto:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar contacto'
      });
    }
  });

  /**
   * DELETE /api/emergency/contacts/:id
   * Eliminar contacto de emergencia
   */
  emergencyRouter.delete('/contacts/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const contact = db.get('emergency_contacts').find({ id }).value();

      if (!contact) {
        return res.status(404).json({
          success: false,
          error: 'Contacto no encontrado'
        });
      }

      // Soft delete
      db.get('emergency_contacts').find({ id }).assign({ active: false }).write();

      res.json({
        success: true,
        message: 'Contacto eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar contacto'
      });
    }
  });

  return emergencyRouter;
};