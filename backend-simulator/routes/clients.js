const express = require('express');

module.exports = (router) => {
  const clientsRouter = express.Router();

  // Get all clients
  clientsRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      // ✅ CORREGIDO: Buscar en la colección 'clients' directamente
      let clients = db.get('clients').value() || [];

      // Apply filters if provided
      const { type, status, search, minRating, sortBy } = req.query;

      // Filter by type
      if (type) {
        clients = clients.filter(c => c.type === type);
      }

      // Filter by status
      if (status) {
        clients = clients.filter(c => c.status === status);
      }

      // Filter by minimum rating
      if (minRating) {
        const minRatingNum = parseFloat(minRating);
        clients = clients.filter(c => (c.rating || 0) >= minRatingNum);
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        clients = clients.filter(c => {
          const name = (c.name || '').toLowerCase();
          const email = (c.email || '').toLowerCase();
          const documentNumber = (c.documentNumber || c.ruc || '').toLowerCase();
          const contact = (c.contact || '').toLowerCase();

          return name.includes(searchLower) ||
                 email.includes(searchLower) ||
                 documentNumber.includes(searchLower) ||
                 contact.includes(searchLower);
        });
      }

      // Sort
      if (sortBy) {
        switch (sortBy) {
          case 'recent':
            clients = clients.sort((a, b) =>
              new Date(b.createdAt || b.since || 0) - new Date(a.createdAt || a.since || 0)
            );
            break;
          case 'name':
            clients = clients.sort((a, b) =>
              (a.name || '').localeCompare(b.name || '')
            );
            break;
          case 'rating':
            clients = clients.sort((a, b) =>
              (b.rating || 0) - (a.rating || 0)
            );
            break;
        }
      }

      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const paginatedClients = clients.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: paginatedClients,
        pagination: {
          page,
          limit,
          total: clients.length,
          totalPages: Math.ceil(clients.length / limit)
        }
      });

    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener clientes'
      });
    }
  });

  // Get client types (specific route - MUST come before /:id)
  clientsRouter.get('/types', (req, res) => {
    try {
      const db = router.db;
      const clientTypes = db.get('client_types').value();

      if (!clientTypes) {
        // Return default types if not found in db
        return res.json({
          success: true,
          data: ['agency', 'company', 'individual']
        });
      }

      res.json({
        success: true,
        data: clientTypes
      });

    } catch (error) {
      console.error('Error fetching client types:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de clientes'
      });
    }
  });

  // Get statistics
  clientsRouter.get('/statistics', (req, res) => {
    try {
      const db = router.db;
      const clients = db.get('clients').value() || [];
      const reservations = db.get('reservations').value() || [];

      const stats = {
        total: clients.length,
        byType: {
          agency: clients.filter(c => c.type === 'agency').length,
          company: clients.filter(c => c.type === 'company').length,
          individual: clients.filter(c => c.type === 'individual').length
        },
        byStatus: {
          active: clients.filter(c => c.status === 'active' || c.status === 'activo').length,
          inactive: clients.filter(c => c.status === 'inactive' || c.status === 'inactivo').length,
          suspended: clients.filter(c => c.status === 'suspended' || c.status === 'suspendido').length,
          pending: clients.filter(c => c.status === 'pending' || c.status === 'pendiente').length
        },
        totalRevenue: clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0),
        totalBookings: reservations.length,
        averageRating: clients.reduce((sum, c) => sum + (c.rating || 0), 0) / (clients.length || 1)
      };

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  });

  // Validate RUC
  clientsRouter.post('/validate-ruc', (req, res) => {
    try {
      const db = router.db;
      const { ruc } = req.body;

      if (!ruc) {
        return res.status(400).json({
          success: false,
          error: 'RUC es requerido'
        });
      }

      // Check if RUC already exists
      const clients = db.get('clients').value() || [];
      const exists = clients.some(c =>
        (c.documentNumber === ruc || c.ruc === ruc)
      );

      res.json({
        success: true,
        data: {
          ruc,
          exists,
          valid: ruc.length === 11, // Basic validation
          message: exists ? 'RUC ya está registrado' : 'RUC disponible'
        }
      });

    } catch (error) {
      console.error('Error validating RUC:', error);
      res.status(500).json({
        success: false,
        error: 'Error al validar RUC'
      });
    }
  });

  // Get client by ID
  clientsRouter.get('/:id', (req, res) => {
    try {
      const db = router.db;
      const clientId = parseInt(req.params.id);
      const client = db.get('clients').find({ id: clientId }).value();

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }

      res.json({
        success: true,
        data: client
      });

    } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener cliente'
      });
    }
  });

  // Create new client
  clientsRouter.post('/', (req, res) => {
    try {
      const db = router.db;
      const clients = db.get('clients');

      // Get the highest ID and increment
      const allClients = clients.value() || [];
      const maxId = allClients.length > 0
        ? Math.max(...allClients.map(c => c.id || 0))
        : 0;

      const newClient = {
        ...req.body,
        id: maxId + 1,
        status: req.body.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalBookings: 0,
        totalRevenue: 0,
        pointsBalance: req.body.type === 'agency' ? 0 : undefined,
        totalEarned: req.body.type === 'agency' ? 0 : undefined,
        rating: 0
      };

      // Check for duplicate document number
      const existingClient = clients.find({
        documentNumber: newClient.documentNumber
      }).value();

      if (existingClient) {
        return res.status(400).json({
          success: false,
          error: 'Ya existe un cliente con este número de documento'
        });
      }

      clients.push(newClient).write();

      res.status(201).json({
        success: true,
        data: newClient,
        message: 'Cliente creado exitosamente'
      });

    } catch (error) {
      console.error('Error creating client:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear cliente'
      });
    }
  });

  // Update client
  clientsRouter.put('/:id', (req, res) => {
    try {
      const db = router.db;
      const clientId = parseInt(req.params.id);
      const client = db.get('clients').find({ id: clientId });

      if (!client.value()) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }

      const updatedData = {
        ...req.body,
        id: clientId, // Preserve ID
        updatedAt: new Date().toISOString()
      };

      // Check for duplicate document number (excluding current client)
      if (req.body.documentNumber) {
        const existingClient = db.get('clients')
          .find({ documentNumber: req.body.documentNumber })
          .value();

        if (existingClient && existingClient.id !== clientId) {
          return res.status(400).json({
            success: false,
            error: 'Ya existe un cliente con este número de documento'
          });
        }
      }

      client.assign(updatedData).write();

      res.json({
        success: true,
        data: client.value(),
        message: 'Cliente actualizado exitosamente'
      });

    } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar cliente'
      });
    }
  });

  // Delete client
  clientsRouter.delete('/:id', (req, res) => {
    try {
      const db = router.db;
      const clientId = parseInt(req.params.id);

      const client = db.get('clients').find({ id: clientId }).value();

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }

      // Check if client has active bookings
      const reservations = db.get('reservations').value() || [];
      const hasActiveBookings = reservations.some(r =>
        r.clientId === clientId &&
        (r.status === 'confirmed' || r.status === 'pending')
      );

      if (hasActiveBookings) {
        return res.status(400).json({
          success: false,
          error: 'No se puede eliminar un cliente con reservas activas'
        });
      }

      db.get('clients').remove({ id: clientId }).write();

      res.json({
        success: true,
        message: 'Cliente eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error deleting client:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar cliente'
      });
    }
  });

  // Toggle client status
  clientsRouter.put('/:id/toggle-status', (req, res) => {
    try {
      const db = router.db;
      const clientId = parseInt(req.params.id);
      const client = db.get('clients').find({ id: clientId });

      if (!client.value()) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }

      const currentStatus = client.value().status;
      const newStatus = currentStatus === 'active' || currentStatus === 'activo'
        ? 'inactive'
        : 'active';

      client.assign({
        status: newStatus,
        updatedAt: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: client.value(),
        message: `Cliente ${newStatus === 'active' ? 'activado' : 'desactivado'} exitosamente`
      });

    } catch (error) {
      console.error('Error toggling client status:', error);
      res.status(500).json({
        success: false,
        error: 'Error al cambiar estado del cliente'
      });
    }
  });

  // Get client bookings
  clientsRouter.get('/:id/bookings', (req, res) => {
    try {
      const db = router.db;
      const clientId = parseInt(req.params.id);

      const client = db.get('clients').find({ id: clientId }).value();

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }

      const reservations = db.get('reservations').value() || [];
      const clientBookings = reservations.filter(r => r.clientId === clientId);

      // Apply filters if provided
      const { status, startDate, endDate } = req.query;
      let filteredBookings = [...clientBookings];

      if (status) {
        filteredBookings = filteredBookings.filter(b => b.status === status);
      }

      if (startDate) {
        filteredBookings = filteredBookings.filter(b =>
          new Date(b.date) >= new Date(startDate)
        );
      }

      if (endDate) {
        filteredBookings = filteredBookings.filter(b =>
          new Date(b.date) <= new Date(endDate)
        );
      }

      res.json({
        success: true,
        data: filteredBookings,
        total: filteredBookings.length
      });

    } catch (error) {
      console.error('Error fetching client bookings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener reservas del cliente'
      });
    }
  });

  // Update client credit
  clientsRouter.put('/:id/credit', (req, res) => {
    try {
      const db = router.db;
      const clientId = parseInt(req.params.id);
      const client = db.get('clients').find({ id: clientId });

      if (!client.value()) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }

      const { creditLimit, creditUsed } = req.body;

      client.assign({
        creditLimit: creditLimit !== undefined ? creditLimit : client.value().creditLimit,
        creditUsed: creditUsed !== undefined ? creditUsed : client.value().creditUsed,
        creditAvailable: (creditLimit || client.value().creditLimit || 0) - (creditUsed || client.value().creditUsed || 0),
        updatedAt: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: client.value(),
        message: 'Crédito actualizado exitosamente'
      });

    } catch (error) {
      console.error('Error updating client credit:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar crédito'
      });
    }
  });

  return clientsRouter;
};
