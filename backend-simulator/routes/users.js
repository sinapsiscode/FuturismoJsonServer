const express = require('express');
const { adminOnly, selfOrAdmin } = require('../middlewares/authorize');

module.exports = (router) => {
  const usersRouter = express.Router();

  // Get all users with filters and pagination
  // Only admins can list all users
  usersRouter.get('/', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      let users = db.get('users').value() || [];

      // Apply filters
      const { role, status, agency_id, search, page = 1, limit = 10 } = req.query;

      if (role) {
        users = users.filter(u => u.role === role);
      }

      if (status) {
        users = users.filter(u => u.status === status);
      }

      if (agency_id) {
        users = users.filter(u => u.agency_id === agency_id);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        users = users.filter(u =>
          u.name?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower) ||
          u.phone?.includes(search)
        );
      }

      // Pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const totalUsers = users.length;
      users = users.slice(offset, offset + parseInt(limit));

      // Remove sensitive data
      users = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.json({
        success: true,
        data: {
          users: users,
          page: parseInt(page),
          pageSize: parseInt(limit),
          total: totalUsers,
          totalPages: Math.ceil(totalUsers / parseInt(limit))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener usuarios'
      });
    }
  });

  // Get user by ID
  // Admin can access any user, others can only access their own profile
  usersRouter.get('/:id', selfOrAdmin(), (req, res) => {
    try {
      const db = router.db;
      const user = db.get('users').find({ id: req.params.id }).value();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      // Get additional data based on role
      let additionalData = {};

      if (user.role === 'guide') {
        const guideData = db.get('guides').find({ user_id: user.id }).value();
        additionalData.guide_profile = guideData;
      }

      if (user.role === 'driver') {
        const driverData = db.get('drivers').find({ user_id: user.id }).value();
        additionalData.driver_profile = driverData;
      }

      if (user.agency_id) {
        const agency = db.get('agencies').find({ id: user.agency_id }).value();
        additionalData.agency = agency;
      }

      // Get user activity logs
      const activityLogs = db.get('user_activity_logs')
        .filter({ user_id: user.id })
        .orderBy('created_at', 'desc')
        .take(10)
        .value() || [];

      res.json({
        success: true,
        data: {
          ...userWithoutPassword,
          ...additionalData,
          recent_activity: activityLogs
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener usuario'
      });
    }
  });

  // Create new user
  // Only admins can create new users
  usersRouter.post('/', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { email, phone } = req.body;

      // Check if email already exists
      const existingEmail = db.get('users').find({ email }).value();
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: 'El email ya está registrado'
        });
      }

      // Check if phone already exists
      if (phone) {
        const existingPhone = db.get('users').find({ phone }).value();
        if (existingPhone) {
          return res.status(400).json({
            success: false,
            error: 'El teléfono ya está registrado'
          });
        }
      }

      const newUser = {
        id: `user-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: req.body.status || 'active',
        email_verified: false,
        phone_verified: false,
        last_login: null
      };

      db.get('users').push(newUser).write();

      // Create activity log
      const activityLog = {
        id: `activity-${Date.now()}`,
        user_id: newUser.id,
        action: 'user_created',
        description: 'Usuario creado en el sistema',
        created_by: req.body.created_by || 'system',
        created_at: new Date().toISOString()
      };

      db.get('user_activity_logs').push(activityLog).write();

      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;

      res.status(201).json({
        success: true,
        data: userWithoutPassword,
        message: 'Usuario creado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear usuario'
      });
    }
  });

  // Update user
  // Admin can update any user, others can only update their own profile
  usersRouter.put('/:id', selfOrAdmin(), (req, res) => {
    try {
      const db = router.db;
      const user = db.get('users').find({ id: req.params.id });

      if (!user.value()) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Check email uniqueness if email is being changed
      if (req.body.email && req.body.email !== user.value().email) {
        const existingEmail = db.get('users').find({ email: req.body.email }).value();
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            error: 'El email ya está registrado'
          });
        }
      }

      const updatedUser = {
        ...req.body,
        updated_at: new Date().toISOString()
      };

      user.assign(updatedUser).write();

      // Create activity log
      const activityLog = {
        id: `activity-${Date.now()}`,
        user_id: req.params.id,
        action: 'user_updated',
        description: 'Información de usuario actualizada',
        created_by: req.body.updated_by || 'system',
        created_at: new Date().toISOString()
      };

      db.get('user_activity_logs').push(activityLog).write();

      // Remove password from response
      const { password, ...userWithoutPassword } = user.value();

      res.json({
        success: true,
        data: userWithoutPassword,
        message: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar usuario'
      });
    }
  });

  // Delete user (soft delete)
  // Only admins can delete users
  usersRouter.delete('/:id', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const user = db.get('users').find({ id: req.params.id });

      if (!user.value()) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Soft delete
      user.assign({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
        deleted_by: req.body.deleted_by || 'system'
      }).write();

      // Create activity log
      const activityLog = {
        id: `activity-${Date.now()}`,
        user_id: req.params.id,
        action: 'user_deleted',
        description: 'Usuario eliminado del sistema',
        created_by: req.body.deleted_by || 'system',
        created_at: new Date().toISOString()
      };

      db.get('user_activity_logs').push(activityLog).write();

      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al eliminar usuario'
      });
    }
  });

  // Update user status
  // Only admins can change user status
  usersRouter.put('/:id/status', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { status, reason } = req.body;

      const user = db.get('users').find({ id: req.params.id });

      if (!user.value()) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      const oldStatus = user.value().status;

      user.assign({
        status,
        updated_at: new Date().toISOString()
      }).write();

      // Create activity log
      const activityLog = {
        id: `activity-${Date.now()}`,
        user_id: req.params.id,
        action: 'status_changed',
        description: `Estado cambiado de ${oldStatus} a ${status}${reason ? `: ${reason}` : ''}`,
        created_by: req.body.updated_by || 'system',
        created_at: new Date().toISOString()
      };

      db.get('user_activity_logs').push(activityLog).write();

      res.json({
        success: true,
        data: { status },
        message: 'Estado de usuario actualizado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar estado'
      });
    }
  });

  // Reset user password
  // Only admins can reset passwords
  usersRouter.post('/:id/reset-password', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { new_password, reset_by } = req.body;

      const user = db.get('users').find({ id: req.params.id });

      if (!user.value()) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      user.assign({
        password: new_password, // In production, this should be hashed
        password_reset_at: new Date().toISOString(),
        force_password_change: true,
        updated_at: new Date().toISOString()
      }).write();

      // Create activity log
      const activityLog = {
        id: `activity-${Date.now()}`,
        user_id: req.params.id,
        action: 'password_reset',
        description: 'Contraseña restablecida por administrador',
        created_by: reset_by || 'system',
        created_at: new Date().toISOString()
      };

      db.get('user_activity_logs').push(activityLog).write();

      res.json({
        success: true,
        message: 'Contraseña restablecida exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al restablecer contraseña'
      });
    }
  });

  // Get user roles
  // Only admins can view roles
  usersRouter.get('/roles/list', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const roles = db.get('roles').value() || [];

      res.json({
        success: true,
        data: roles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener roles'
      });
    }
  });

  // Assign role to user
  // Only admins can assign roles
  usersRouter.post('/:id/roles', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { role_id, assigned_by } = req.body;

      const user = db.get('users').find({ id: req.params.id });
      const role = db.get('roles').find({ id: role_id });

      if (!user.value()) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      if (!role.value()) {
        return res.status(404).json({
          success: false,
          error: 'Rol no encontrado'
        });
      }

      // Create user role assignment
      const userRole = {
        id: `user-role-${Date.now()}`,
        user_id: req.params.id,
        role_id,
        assigned_by,
        assigned_at: new Date().toISOString(),
        is_active: true
      };

      db.get('user_roles').push(userRole).write();

      // Update user's primary role if specified
      if (req.body.is_primary) {
        user.assign({
          role: role.value().name,
          updated_at: new Date().toISOString()
        }).write();
      }

      // Create activity log
      const activityLog = {
        id: `activity-${Date.now()}`,
        user_id: req.params.id,
        action: 'role_assigned',
        description: `Rol ${role.value().name} asignado`,
        created_by: assigned_by || 'system',
        created_at: new Date().toISOString()
      };

      db.get('user_activity_logs').push(activityLog).write();

      res.status(201).json({
        success: true,
        data: userRole,
        message: 'Rol asignado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al asignar rol'
      });
    }
  });

  // Get user activity logs
  // Admin can view any user's activity, users can only view their own
  usersRouter.get('/:id/activity', selfOrAdmin(), (req, res) => {
    try {
      const db = router.db;
      const { page = 1, limit = 20 } = req.query;

      let activityLogs = db.get('user_activity_logs')
        .filter({ user_id: req.params.id })
        .orderBy('created_at', 'desc')
        .value() || [];

      // Pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const totalLogs = activityLogs.length;
      activityLogs = activityLogs.slice(offset, offset + parseInt(limit));

      res.json({
        success: true,
        data: activityLogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalLogs,
          pages: Math.ceil(totalLogs / parseInt(limit))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener actividad del usuario'
      });
    }
  });

  // Get users statistics
  // Only admins can view user statistics
  usersRouter.get('/stats/overview', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const users = db.get('users').value() || [];

      const stats = {
        total_users: users.length,
        active_users: users.filter(u => u.status === 'active').length,
        inactive_users: users.filter(u => u.status === 'inactive').length,
        deleted_users: users.filter(u => u.status === 'deleted').length,
        by_role: {
          admin: users.filter(u => u.role === 'admin').length,
          agency: users.filter(u => u.role === 'agency').length,
          guide: users.filter(u => u.role === 'guide').length,
          driver: users.filter(u => u.role === 'driver').length,
          client: users.filter(u => u.role === 'client').length
        },
        recent_registrations: users
          .filter(u => {
            const createdDate = new Date(u.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createdDate >= weekAgo;
          }).length
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  });

  return usersRouter;
};