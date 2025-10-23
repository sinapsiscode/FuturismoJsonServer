const express = require('express');

module.exports = (router) => {
  const financialRouter = express.Router();

  // Get all financial transactions
  financialRouter.get('/transactions', (req, res) => {
    try {
      const db = router.db;
      let transactions = db.get('financial_transactions').value() || [];

      // Apply filters
      const { user_id, type, status, start_date, end_date, amount_min, amount_max } = req.query;

      if (user_id) {
        transactions = transactions.filter(t => t.user_id === user_id);
      }

      if (type) {
        transactions = transactions.filter(t => t.transaction_type === type);
      }

      if (status) {
        transactions = transactions.filter(t => t.status === status);
      }

      if (start_date && end_date) {
        transactions = transactions.filter(t => {
          const transDate = new Date(t.created_at);
          return transDate >= new Date(start_date) && transDate <= new Date(end_date);
        });
      }

      if (amount_min) {
        transactions = transactions.filter(t => t.amount >= parseFloat(amount_min));
      }

      if (amount_max) {
        transactions = transactions.filter(t => t.amount <= parseFloat(amount_max));
      }

      // Sort by date descending
      transactions = transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      res.json({
        success: true,
        data: transactions,
        total: transactions.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener transacciones'
      });
    }
  });

  // Create new transaction
  financialRouter.post('/transactions', (req, res) => {
    try {
      const db = router.db;
      const newTransaction = {
        id: `trans-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: req.body.status || 'pending'
      };

      db.get('financial_transactions').push(newTransaction).write();

      res.status(201).json({
        success: true,
        data: newTransaction,
        message: 'Transacción creada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear transacción'
      });
    }
  });

  // Get transaction by ID
  financialRouter.get('/transactions/:id', (req, res) => {
    try {
      const db = router.db;
      const transaction = db.get('financial_transactions').find({ id: req.params.id }).value();

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transacción no encontrada'
        });
      }

      // Get related vouchers
      const vouchers = db.get('payment_vouchers').filter({ transaction_id: transaction.id }).value() || [];

      res.json({
        success: true,
        data: {
          ...transaction,
          vouchers
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener transacción'
      });
    }
  });

  // Update transaction status
  financialRouter.put('/transactions/:id/status', (req, res) => {
    try {
      const db = router.db;
      const { status, notes } = req.body;

      const transaction = db.get('financial_transactions').find({ id: req.params.id });

      if (!transaction.value()) {
        return res.status(404).json({
          success: false,
          error: 'Transacción no encontrada'
        });
      }

      transaction.assign({
        status,
        notes,
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: transaction.value(),
        message: 'Estado de transacción actualizado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar transacción'
      });
    }
  });

  // Get all vouchers
  financialRouter.get('/vouchers', (req, res) => {
    try {
      const db = router.db;
      let vouchers = db.get('payment_vouchers').value() || [];

      const { user_id, type, status } = req.query;

      if (user_id) {
        vouchers = vouchers.filter(v => v.user_id === user_id);
      }

      if (type) {
        vouchers = vouchers.filter(v => v.voucher_type === type);
      }

      if (status) {
        vouchers = vouchers.filter(v => v.status === status);
      }

      // Add voucher items
      const voucherItems = db.get('voucher_items').value() || [];
      vouchers = vouchers.map(voucher => {
        const items = voucherItems.filter(item => item.voucher_id === voucher.id);
        return {
          ...voucher,
          items
        };
      });

      res.json({
        success: true,
        data: vouchers,
        total: vouchers.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener comprobantes'
      });
    }
  });

  // Create new voucher
  financialRouter.post('/vouchers', (req, res) => {
    try {
      const db = router.db;
      const { items, ...voucherData } = req.body;

      const newVoucher = {
        id: `voucher-${Date.now()}`,
        ...voucherData,
        created_at: new Date().toISOString(),
        status: 'active'
      };

      db.get('payment_vouchers').push(newVoucher).write();

      // Add voucher items
      if (items && items.length > 0) {
        const voucherItems = items.map((item, index) => ({
          id: `voucher-item-${Date.now()}-${index}`,
          voucher_id: newVoucher.id,
          ...item
        }));

        db.get('voucher_items').push(...voucherItems).write();
        newVoucher.items = voucherItems;
      }

      res.status(201).json({
        success: true,
        data: newVoucher,
        message: 'Comprobante creado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear comprobante'
      });
    }
  });

  // Get points transactions
  financialRouter.get('/points', (req, res) => {
    try {
      const db = router.db;
      let pointsTransactions = db.get('points_transactions').value() || [];

      const { user_id, type } = req.query;

      if (user_id) {
        pointsTransactions = pointsTransactions.filter(p => p.user_id === user_id);
      }

      if (type) {
        pointsTransactions = pointsTransactions.filter(p => p.transaction_type === type);
      }

      // Calculate user balances
      const userBalances = {};
      pointsTransactions.forEach(transaction => {
        if (!userBalances[transaction.user_id]) {
          userBalances[transaction.user_id] = 0;
        }
        userBalances[transaction.user_id] += transaction.points_amount;
      });

      res.json({
        success: true,
        data: pointsTransactions,
        balances: userBalances,
        total: pointsTransactions.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener transacciones de puntos'
      });
    }
  });

  // Add points transaction
  financialRouter.post('/points', (req, res) => {
    try {
      const db = router.db;
      const newPointsTransaction = {
        id: `points-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString()
      };

      db.get('points_transactions').push(newPointsTransaction).write();

      res.status(201).json({
        success: true,
        data: newPointsTransaction,
        message: 'Transacción de puntos registrada'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al registrar puntos'
      });
    }
  });

  // Get user points balance
  financialRouter.get('/points/balance/:userId', (req, res) => {
    try {
      const db = router.db;
      const pointsTransactions = db.get('points_transactions')
        .filter({ user_id: req.params.userId })
        .value() || [];

      const balance = pointsTransactions.reduce((total, transaction) => {
        return total + transaction.points_amount;
      }, 0);

      const recentTransactions = pointsTransactions
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);

      res.json({
        success: true,
        data: {
          user_id: req.params.userId,
          current_balance: balance,
          recent_transactions: recentTransactions
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener balance de puntos'
      });
    }
  });

  // Get rewards catalog
  financialRouter.get('/rewards/catalog', (req, res) => {
    try {
      const db = router.db;
      let rewards = db.get('rewards_catalog').value() || [];

      const { category, min_points, max_points, available } = req.query;

      if (category) {
        rewards = rewards.filter(r => r.category === category);
      }

      if (min_points) {
        rewards = rewards.filter(r => r.points_required >= parseInt(min_points));
      }

      if (max_points) {
        rewards = rewards.filter(r => r.points_required <= parseInt(max_points));
      }

      if (available !== undefined) {
        const isAvailable = available === 'true';
        rewards = rewards.filter(r => r.is_available === isAvailable);
      }

      res.json({
        success: true,
        data: rewards,
        total: rewards.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener catálogo de recompensas'
      });
    }
  });

  // Create reward item
  financialRouter.post('/rewards/catalog', (req, res) => {
    try {
      const db = router.db;
      const newReward = {
        id: `reward-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString(),
        is_available: true
      };

      db.get('rewards_catalog').push(newReward).write();

      res.status(201).json({
        success: true,
        data: newReward,
        message: 'Recompensa agregada al catálogo'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar recompensa'
      });
    }
  });

  // Redeem reward
  financialRouter.post('/rewards/redeem', (req, res) => {
    try {
      const db = router.db;
      const { user_id, reward_id } = req.body;

      // Check if reward exists and is available
      const reward = db.get('rewards_catalog').find({ id: reward_id }).value();
      if (!reward || !reward.is_available) {
        return res.status(404).json({
          success: false,
          error: 'Recompensa no disponible'
        });
      }

      // Check user points balance
      const pointsTransactions = db.get('points_transactions')
        .filter({ user_id })
        .value() || [];

      const currentBalance = pointsTransactions.reduce((total, transaction) => {
        return total + transaction.points_amount;
      }, 0);

      if (currentBalance < reward.points_required) {
        return res.status(400).json({
          success: false,
          error: 'Puntos insuficientes'
        });
      }

      // Create redemption record
      const redemption = {
        id: `redemption-${Date.now()}`,
        user_id,
        reward_id,
        points_used: reward.points_required,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      db.get('reward_redemptions').push(redemption).write();

      // Deduct points
      const pointsDeduction = {
        id: `points-${Date.now()}`,
        user_id,
        transaction_type: 'redemption',
        points_amount: -reward.points_required,
        description: `Canje: ${reward.name}`,
        reference_id: redemption.id,
        created_at: new Date().toISOString()
      };

      db.get('points_transactions').push(pointsDeduction).write();

      res.status(201).json({
        success: true,
        data: redemption,
        message: 'Recompensa canjeada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al canjear recompensa'
      });
    }
  });

  // Get user redemptions
  financialRouter.get('/rewards/redemptions/:userId', (req, res) => {
    try {
      const db = router.db;
      const redemptions = db.get('reward_redemptions')
        .filter({ user_id: req.params.userId })
        .orderBy('created_at', 'desc')
        .value() || [];

      // Add reward details
      const rewards = db.get('rewards_catalog').value() || [];
      const redemptionsWithDetails = redemptions.map(redemption => {
        const reward = rewards.find(r => r.id === redemption.reward_id);
        return {
          ...redemption,
          reward: reward || null
        };
      });

      res.json({
        success: true,
        data: redemptionsWithDetails,
        total: redemptionsWithDetails.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener canjes'
      });
    }
  });

  // Update redemption status
  financialRouter.put('/rewards/redemptions/:id/status', (req, res) => {
    try {
      const db = router.db;
      const { status, notes } = req.body;

      const redemption = db.get('reward_redemptions').find({ id: req.params.id });

      if (!redemption.value()) {
        return res.status(404).json({
          success: false,
          error: 'Canje no encontrado'
        });
      }

      redemption.assign({
        status,
        notes,
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: redemption.value(),
        message: 'Estado de canje actualizado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar canje'
      });
    }
  });

  // Financial summary for user
  financialRouter.get('/summary/:userId', (req, res) => {
    try {
      const db = router.db;
      const userId = req.params.userId;

      // Get transactions
      const transactions = db.get('financial_transactions')
        .filter({ user_id: userId })
        .value() || [];

      // Get points
      const pointsTransactions = db.get('points_transactions')
        .filter({ user_id: userId })
        .value() || [];

      // Get redemptions
      const redemptions = db.get('reward_redemptions')
        .filter({ user_id: userId })
        .value() || [];

      // Calculate totals
      const totalIncome = transactions
        .filter(t => t.transaction_type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter(t => t.transaction_type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      const currentPointsBalance = pointsTransactions
        .reduce((sum, t) => sum + t.points_amount, 0);

      const totalRedemptions = redemptions.length;

      res.json({
        success: true,
        data: {
          user_id: userId,
          financial_summary: {
            total_income: totalIncome,
            total_expenses: totalExpenses,
            net_balance: totalIncome - totalExpenses
          },
          points_summary: {
            current_balance: currentPointsBalance,
            total_redemptions: totalRedemptions
          },
          recent_activity: {
            transactions: transactions.slice(-5),
            points: pointsTransactions.slice(-5),
            redemptions: redemptions.slice(-3)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener resumen financiero'
      });
    }
  });

  /**
   * GET /api/financial/rewards/categories
   * Obtener categorías de premios
   */
  financialRouter.get('/rewards/categories', (req, res) => {
    try {
      const db = router.db;
      const categories = db.get('rewards_categories').value() || [];

      res.json({
        success: true,
        data: categories.filter(c => c.active !== false)
      });
    } catch (error) {
      console.error('Error al obtener categorías de premios:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener categorías de premios',
        data: []
      });
    }
  });

  /**
   * POST /api/financial/rewards/categories
   * Crear nueva categoría de premio
   */
  financialRouter.post('/rewards/categories', (req, res) => {
    try {
      const db = router.db;
      const { name, description, icon, color } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      const newCategory = {
        id: `reward-cat-${Date.now()}`,
        name,
        description: description || '',
        icon: icon || 'tag',
        color: color || '#3B82F6',
        active: true,
        created_at: new Date().toISOString()
      };

      db.get('rewards_categories').push(newCategory).write();

      res.status(201).json({
        success: true,
        data: newCategory,
        message: 'Categoría creada exitosamente'
      });
    } catch (error) {
      console.error('Error al crear categoría:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear categoría'
      });
    }
  });

  /**
   * PUT /api/financial/rewards/categories/:id
   * Actualizar categoría de premio
   */
  financialRouter.put('/rewards/categories/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { name, description, icon, color, active } = req.body;

      const category = db.get('rewards_categories').find({ id }).value();

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
        icon: icon || category.icon,
        color: color || category.color,
        active: active !== undefined ? active : category.active,
        updated_at: new Date().toISOString()
      };

      db.get('rewards_categories').find({ id }).assign(updatedCategory).write();

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
   * DELETE /api/financial/rewards/categories/:id
   * Eliminar categoría de premio
   */
  financialRouter.delete('/rewards/categories/:id', (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const category = db.get('rewards_categories').find({ id }).value();

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }

      // Soft delete
      db.get('rewards_categories').find({ id }).assign({ active: false }).write();

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
   * GET /api/financial/points/config
   * Obtener configuración de puntos
   */
  financialRouter.get('/points/config', (req, res) => {
    try {
      const db = router.db;
      const config = db.get('points_config').value() || {
        enabled: true,
        points_per_service: 10,
        points_per_dollar: 1,
        bonus_multiplier: 1.5,
        minimum_redemption: 100,
        expiration_months: 12,
        levels: []
      };

      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      console.error('Error al obtener configuración de puntos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración de puntos'
      });
    }
  });

  /**
   * PUT /api/financial/points/config
   * Actualizar configuración de puntos
   */
  financialRouter.put('/points/config', (req, res) => {
    try {
      const db = router.db;
      const {
        enabled,
        points_per_service,
        points_per_dollar,
        bonus_multiplier,
        minimum_redemption,
        expiration_months,
        levels
      } = req.body;

      const currentConfig = db.get('points_config').value() || {};

      const updatedConfig = {
        enabled: enabled !== undefined ? enabled : currentConfig.enabled,
        points_per_service: points_per_service || currentConfig.points_per_service,
        points_per_dollar: points_per_dollar || currentConfig.points_per_dollar,
        bonus_multiplier: bonus_multiplier || currentConfig.bonus_multiplier,
        minimum_redemption: minimum_redemption || currentConfig.minimum_redemption,
        expiration_months: expiration_months || currentConfig.expiration_months,
        levels: levels || currentConfig.levels,
        updated_at: new Date().toISOString()
      };

      db.set('points_config', updatedConfig).write();

      res.json({
        success: true,
        data: updatedConfig,
        message: 'Configuración actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar configuración'
      });
    }
  });

  return financialRouter;
};