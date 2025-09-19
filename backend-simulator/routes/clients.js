const express = require('express');

module.exports = (router) => {
  const clientsRouter = express.Router();

  // Get all clients
  clientsRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      // Get users with role 'client'
      let clients = db.get('users').filter({ role: 'client' }).value() || [];

      // Apply filters if provided
      const { status, search } = req.query;

      if (status) {
        clients = clients.filter(c => c.status === status);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        clients = clients.filter(c =>
          c.first_name.toLowerCase().includes(searchLower) ||
          c.last_name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower)
        );
      }

      // Transform to client format
      const transformedClients = clients.map(client => ({
        id: client.id,
        name: `${client.first_name} ${client.last_name}`,
        email: client.email,
        phone: client.phone,
        status: client.status,
        created_at: client.created_at,
        last_login_at: client.last_login_at,
        total_reservations: 0, // Could calculate from reservations
        total_spent: 0 // Could calculate from reservations
      }));

      res.json({
        success: true,
        data: transformedClients,
        total: transformedClients.length
      });

    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener clientes'
      });
    }
  });

  // Get client by ID
  clientsRouter.get('/:id', (req, res) => {
    try {
      const db = router.db;
      const client = db.get('users').find({ id: req.params.id, role: 'client' }).value();

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Cliente no encontrado'
        });
      }

      // Transform to client format
      const transformedClient = {
        id: client.id,
        name: `${client.first_name} ${client.last_name}`,
        email: client.email,
        phone: client.phone,
        status: client.status,
        created_at: client.created_at,
        last_login_at: client.last_login_at,
        total_reservations: 0,
        total_spent: 0
      };

      res.json({
        success: true,
        data: transformedClient
      });

    } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener cliente'
      });
    }
  });

  return clientsRouter;
};