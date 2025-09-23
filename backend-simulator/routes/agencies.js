const express = require('express');

module.exports = (router) => {
  const agenciesRouter = express.Router();

  // Get all agencies with filters
  agenciesRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      let agencies = db.get('agencies').value() || [];

      // Apply filters
      const { status, type, location, rating_min, search } = req.query;

      if (status) {
        agencies = agencies.filter(a => a.status === status);
      }

      if (type) {
        agencies = agencies.filter(a => a.agency_type === type);
      }

      if (location) {
        agencies = agencies.filter(a =>
          a.location?.city?.toLowerCase().includes(location.toLowerCase()) ||
          a.location?.region?.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (rating_min) {
        agencies = agencies.filter(a => a.average_rating >= parseFloat(rating_min));
      }

      if (search) {
        const searchLower = search.toLowerCase();
        agencies = agencies.filter(a =>
          a.name?.toLowerCase().includes(searchLower) ||
          a.business_name?.toLowerCase().includes(searchLower) ||
          a.contact_email?.toLowerCase().includes(searchLower)
        );
      }

      // Add statistics for each agency
      const users = db.get('users').value() || [];
      const reservations = db.get('reservations').value() || [];
      const reviews = db.get('agency_reviews').value() || [];

      agencies = agencies.map(agency => {
        // Count employees
        const employees = users.filter(u => u.agency_id === agency.id);

        // Count recent reservations
        const agencyReservations = reservations.filter(r => r.agency_id === agency.id);
        const lastMonthReservations = agencyReservations.filter(r => {
          const reservationDate = new Date(r.created_at);
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return reservationDate >= lastMonth;
        });

        // Get reviews
        const agencyReviews = reviews.filter(r => r.agency_id === agency.id);

        return {
          ...agency,
          stats: {
            total_employees: employees.length,
            active_employees: employees.filter(e => e.status === 'active').length,
            total_reservations: agencyReservations.length,
            last_month_reservations: lastMonthReservations.length,
            total_reviews: agencyReviews.length,
            average_rating: agencyReviews.length > 0 ?
              agencyReviews.reduce((sum, r) => sum + r.rating, 0) / agencyReviews.length : 0
          }
        };
      });

      res.json({
        success: true,
        data: agencies,
        total: agencies.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener agencias'
      });
    }
  });

  // Get agency by ID
  agenciesRouter.get('/:id', (req, res) => {
    try {
      const db = router.db;
      const agency = db.get('agencies').find({ id: req.params.id }).value();

      if (!agency) {
        return res.status(404).json({
          success: false,
          error: 'Agencia no encontrada'
        });
      }

      // Get employees
      const employees = db.get('users')
        .filter({ agency_id: agency.id })
        .value() || [];

      // Get contracts
      const contracts = db.get('agency_contracts')
        .filter({ agency_id: agency.id })
        .orderBy('created_at', 'desc')
        .value() || [];

      // Get financial summary
      const transactions = db.get('financial_transactions')
        .filter({ agency_id: agency.id })
        .value() || [];

      const financialSummary = {
        total_revenue: transactions
          .filter(t => t.transaction_type === 'income' && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        pending_payments: transactions
          .filter(t => t.status === 'pending')
          .reduce((sum, t) => sum + t.amount, 0),
        total_transactions: transactions.length
      };

      // Get recent reservations
      const reservations = db.get('reservations')
        .filter({ agency_id: agency.id })
        .orderBy('created_at', 'desc')
        .take(10)
        .value() || [];

      // Get reviews
      const reviews = db.get('agency_reviews')
        .filter({ agency_id: agency.id })
        .orderBy('created_at', 'desc')
        .take(10)
        .value() || [];

      // Get services offered
      const services = db.get('agency_services')
        .filter({ agency_id: agency.id })
        .value() || [];

      res.json({
        success: true,
        data: {
          ...agency,
          employees,
          contracts,
          financial_summary: financialSummary,
          recent_reservations: reservations,
          reviews,
          services
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener agencia'
      });
    }
  });

  // Create new agency
  agenciesRouter.post('/', (req, res) => {
    try {
      const db = router.db;
      const { business_name, tax_id, contact_email } = req.body;

      // Check if business name already exists
      const existingName = db.get('agencies').find({ business_name }).value();
      if (existingName) {
        return res.status(400).json({
          success: false,
          error: 'El nombre comercial ya está registrado'
        });
      }

      // Check if tax ID already exists
      if (tax_id) {
        const existingTaxId = db.get('agencies').find({ tax_id }).value();
        if (existingTaxId) {
          return res.status(400).json({
            success: false,
            error: 'El RUC/ID fiscal ya está registrado'
          });
        }
      }

      // Check if email already exists
      const existingEmail = db.get('agencies').find({ contact_email }).value();
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: 'El email ya está registrado'
        });
      }

      const newAgency = {
        id: `agency-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: req.body.status || 'active',
        verification_status: 'pending',
        average_rating: 0,
        total_reviews: 0,
        total_reservations: 0
      };

      db.get('agencies').push(newAgency).write();

      res.status(201).json({
        success: true,
        data: newAgency,
        message: 'Agencia creada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear agencia'
      });
    }
  });

  // Update agency
  agenciesRouter.put('/:id', (req, res) => {
    try {
      const db = router.db;
      const agency = db.get('agencies').find({ id: req.params.id });

      if (!agency.value()) {
        return res.status(404).json({
          success: false,
          error: 'Agencia no encontrada'
        });
      }

      // Check business name uniqueness if being changed
      if (req.body.business_name && req.body.business_name !== agency.value().business_name) {
        const existingName = db.get('agencies').find({ business_name: req.body.business_name }).value();
        if (existingName) {
          return res.status(400).json({
            success: false,
            error: 'El nombre comercial ya está registrado'
          });
        }
      }

      const updatedAgency = {
        ...req.body,
        updated_at: new Date().toISOString()
      };

      agency.assign(updatedAgency).write();

      res.json({
        success: true,
        data: agency.value(),
        message: 'Agencia actualizada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar agencia'
      });
    }
  });

  // Update agency status
  agenciesRouter.put('/:id/status', (req, res) => {
    try {
      const db = router.db;
      const { status, reason } = req.body;

      const agency = db.get('agencies').find({ id: req.params.id });

      if (!agency.value()) {
        return res.status(404).json({
          success: false,
          error: 'Agencia no encontrada'
        });
      }

      agency.assign({
        status,
        status_reason: reason,
        status_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: { status, reason },
        message: 'Estado de agencia actualizado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar estado'
      });
    }
  });

  // Get agency employees
  agenciesRouter.get('/:id/employees', (req, res) => {
    try {
      const db = router.db;
      const { role, status } = req.query;

      let employees = db.get('users')
        .filter({ agency_id: req.params.id })
        .value() || [];

      if (role) {
        employees = employees.filter(e => e.role === role);
      }

      if (status) {
        employees = employees.filter(e => e.status === status);
      }

      // Remove sensitive data
      employees = employees.map(employee => {
        const { password, ...employeeWithoutPassword } = employee;
        return employeeWithoutPassword;
      });

      res.json({
        success: true,
        data: employees,
        total: employees.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener empleados'
      });
    }
  });

  // Add employee to agency
  agenciesRouter.post('/:id/employees', (req, res) => {
    try {
      const db = router.db;
      const { user_id, role, permissions } = req.body;

      const agency = db.get('agencies').find({ id: req.params.id }).value();
      if (!agency) {
        return res.status(404).json({
          success: false,
          error: 'Agencia no encontrada'
        });
      }

      const user = db.get('users').find({ id: user_id });
      if (!user.value()) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Update user's agency
      user.assign({
        agency_id: req.params.id,
        role: role || user.value().role,
        updated_at: new Date().toISOString()
      }).write();

      // Create employee record
      const employeeRecord = {
        id: `employee-${Date.now()}`,
        agency_id: req.params.id,
        user_id,
        role: role || user.value().role,
        permissions: permissions || [],
        hired_at: new Date().toISOString(),
        status: 'active'
      };

      db.get('agency_employees').push(employeeRecord).write();

      res.status(201).json({
        success: true,
        data: employeeRecord,
        message: 'Empleado agregado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar empleado'
      });
    }
  });

  // Remove employee from agency
  agenciesRouter.delete('/:id/employees/:userId', (req, res) => {
    try {
      const db = router.db;

      const user = db.get('users').find({ id: req.params.userId });
      if (!user.value()) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Update user
      user.assign({
        agency_id: null,
        updated_at: new Date().toISOString()
      }).write();

      // Update employee record
      db.get('agency_employees')
        .find({ agency_id: req.params.id, user_id: req.params.userId })
        .assign({
          status: 'terminated',
          terminated_at: new Date().toISOString()
        })
        .write();

      res.json({
        success: true,
        message: 'Empleado removido exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al remover empleado'
      });
    }
  });

  // Get agency contracts
  agenciesRouter.get('/:id/contracts', (req, res) => {
    try {
      const db = router.db;
      const { status, type } = req.query;

      let contracts = db.get('agency_contracts')
        .filter({ agency_id: req.params.id })
        .value() || [];

      if (status) {
        contracts = contracts.filter(c => c.status === status);
      }

      if (type) {
        contracts = contracts.filter(c => c.contract_type === type);
      }

      contracts = contracts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      res.json({
        success: true,
        data: contracts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener contratos'
      });
    }
  });

  // Create agency contract
  agenciesRouter.post('/:id/contracts', (req, res) => {
    try {
      const db = router.db;
      const agency = db.get('agencies').find({ id: req.params.id }).value();

      if (!agency) {
        return res.status(404).json({
          success: false,
          error: 'Agencia no encontrada'
        });
      }

      const newContract = {
        id: `contract-${Date.now()}`,
        agency_id: req.params.id,
        ...req.body,
        created_at: new Date().toISOString(),
        status: req.body.status || 'draft'
      };

      db.get('agency_contracts').push(newContract).write();

      res.status(201).json({
        success: true,
        data: newContract,
        message: 'Contrato creado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear contrato'
      });
    }
  });

  // Get agency financial summary
  agenciesRouter.get('/:id/financial-summary', (req, res) => {
    try {
      const db = router.db;
      const { start_date, end_date } = req.query;

      let transactions = db.get('financial_transactions')
        .filter({ agency_id: req.params.id })
        .value() || [];

      if (start_date && end_date) {
        transactions = transactions.filter(t => {
          const transDate = new Date(t.created_at);
          return transDate >= new Date(start_date) && transDate <= new Date(end_date);
        });
      }

      const summary = {
        total_revenue: transactions
          .filter(t => t.transaction_type === 'income' && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        total_expenses: transactions
          .filter(t => t.transaction_type === 'expense' && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        pending_income: transactions
          .filter(t => t.transaction_type === 'income' && t.status === 'pending')
          .reduce((sum, t) => sum + t.amount, 0),
        pending_expenses: transactions
          .filter(t => t.transaction_type === 'expense' && t.status === 'pending')
          .reduce((sum, t) => sum + t.amount, 0),
        total_transactions: transactions.length,
        period: { start_date, end_date }
      };

      summary.net_profit = summary.total_revenue - summary.total_expenses;

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener resumen financiero'
      });
    }
  });

  // Get agency services
  agenciesRouter.get('/:id/services', (req, res) => {
    try {
      const db = router.db;
      const { category, status } = req.query;

      let services = db.get('agency_services')
        .filter({ agency_id: req.params.id })
        .value() || [];

      if (category) {
        services = services.filter(s => s.category === category);
      }

      if (status) {
        services = services.filter(s => s.status === status);
      }

      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener servicios'
      });
    }
  });

  // Add agency service
  agenciesRouter.post('/:id/services', (req, res) => {
    try {
      const db = router.db;
      const agency = db.get('agencies').find({ id: req.params.id }).value();

      if (!agency) {
        return res.status(404).json({
          success: false,
          error: 'Agencia no encontrada'
        });
      }

      const newService = {
        id: `service-${Date.now()}`,
        agency_id: req.params.id,
        ...req.body,
        created_at: new Date().toISOString(),
        status: req.body.status || 'active'
      };

      db.get('agency_services').push(newService).write();

      res.status(201).json({
        success: true,
        data: newService,
        message: 'Servicio agregado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar servicio'
      });
    }
  });

  // Get agency reviews
  agenciesRouter.get('/:id/reviews', (req, res) => {
    try {
      const db = router.db;
      const { rating, start_date, end_date } = req.query;

      let reviews = db.get('agency_reviews')
        .filter({ agency_id: req.params.id })
        .value() || [];

      if (rating) {
        reviews = reviews.filter(r => r.rating === parseInt(rating));
      }

      if (start_date && end_date) {
        reviews = reviews.filter(r => {
          const reviewDate = new Date(r.created_at);
          return reviewDate >= new Date(start_date) && reviewDate <= new Date(end_date);
        });
      }

      // Add client information
      const clients = db.get('clients').value() || [];
      reviews = reviews.map(review => {
        const client = clients.find(c => c.id === review.client_id);
        return {
          ...review,
          client: client ? {
            id: client.id,
            name: client.name
          } : null
        };
      });

      reviews = reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      res.json({
        success: true,
        data: reviews,
        total: reviews.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener reseñas'
      });
    }
  });

  // Get agency statistics
  agenciesRouter.get('/:id/statistics', (req, res) => {
    try {
      const db = router.db;
      const { period = 'month' } = req.query;

      const agency = db.get('agencies').find({ id: req.params.id }).value();
      if (!agency) {
        return res.status(404).json({
          success: false,
          error: 'Agencia no encontrada'
        });
      }

      // Calculate date range based on period
      const endDate = new Date();
      const startDate = new Date();

      switch (period) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      // Get data in period
      const reservations = db.get('reservations')
        .filter({ agency_id: req.params.id })
        .filter(r => {
          const reservationDate = new Date(r.created_at);
          return reservationDate >= startDate && reservationDate <= endDate;
        })
        .value() || [];

      const transactions = db.get('financial_transactions')
        .filter({ agency_id: req.params.id })
        .filter(t => {
          const transDate = new Date(t.created_at);
          return transDate >= startDate && transDate <= endDate;
        })
        .value() || [];

      const reviews = db.get('agency_reviews')
        .filter({ agency_id: req.params.id })
        .filter(r => {
          const reviewDate = new Date(r.created_at);
          return reviewDate >= startDate && reviewDate <= endDate;
        })
        .value() || [];

      const statistics = {
        period: { start_date: startDate, end_date: endDate },
        reservations: {
          total: reservations.length,
          confirmed: reservations.filter(r => r.status === 'confirmed').length,
          completed: reservations.filter(r => r.status === 'completed').length,
          cancelled: reservations.filter(r => r.status === 'cancelled').length
        },
        financial: {
          total_revenue: transactions
            .filter(t => t.transaction_type === 'income' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0),
          total_transactions: transactions.length
        },
        reviews: {
          total: reviews.length,
          average_rating: reviews.length > 0 ?
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
          ratings_distribution: {
            '5_stars': reviews.filter(r => r.rating === 5).length,
            '4_stars': reviews.filter(r => r.rating === 4).length,
            '3_stars': reviews.filter(r => r.rating === 3).length,
            '2_stars': reviews.filter(r => r.rating === 2).length,
            '1_star': reviews.filter(r => r.rating === 1).length
          }
        }
      };

      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  });

  return agenciesRouter;
};