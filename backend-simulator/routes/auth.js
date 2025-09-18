const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');

module.exports = (router) => {
  const authRouter = express.Router();

  // Login endpoint
  authRouter.post('/login', (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email y contraseña son requeridos'
        });
      }

      // Get database instance
      const db = router.db;
      console.log('🔍 DB instance:', !!db);

      const users = db.get('users').value();
      console.log('👥 Users found:', users ? users.length : 'none');
      console.log('📧 Looking for email:', email);

      // Find user by email
      const user = users.find(u => u.email === email && u.status === 'active');
      console.log('👤 User found:', !!user, user ? user.email : 'none');

      // Simple password check (in real app, use bcrypt)
      if (!user || password !== 'demo123') {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }

      // Generate JWT token
      const token = jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role
      }, JWT_SECRET, { expiresIn: '24h' });

      // Update last login
      db.get('users')
        .find({ id: user.id })
        .assign({ last_login_at: new Date().toISOString() })
        .write();

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  });

  // Logout endpoint
  authRouter.post('/logout', (req, res) => {
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  });

  // Get current user
  authRouter.get('/me', (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token requerido'
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const db = router.db;
      const user = db.get('users').find({ id: decoded.userId }).value();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });

    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
  });

  return authRouter;
};