const jwt = require('jsonwebtoken');

// Get JWT secret from environment variable
// In production, this MUST be a secure random string stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'futurismo-secret-2024';

// Warn if using default secret in production
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('⚠️ WARNING: Using default JWT_SECRET in production! Set JWT_SECRET environment variable.');
}

const authMiddleware = (req, res, next) => {
  // Skip auth for public endpoints
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/config/', // All config endpoints should be public
    '/services/active', // Active services for monitoring map
    '/clients/types', // Client types configuration
    '/tours/categories', // Tour categories configuration
    '/tours', // Tours catalog (browse tours without authentication)
    '/app/init' // App initialization data
  ];
  if (publicPaths.some(path => req.path.includes(path))) {
    return next();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    console.log('❌ [Auth] No token provided for:', req.method, req.path);
    console.log('❌ [Auth] Authorization header:', req.headers.authorization);
    return res.status(401).json({
      success: false,
      error: 'Token de acceso requerido'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('✅ [Auth] Token valid for user:', decoded.email, '| Role:', decoded.role);
    next();
  } catch (error) {
    console.log('❌ [Auth] Invalid token:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado'
    });
  }
};

module.exports = { authMiddleware, JWT_SECRET };