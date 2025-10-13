const jwt = require('jsonwebtoken');

const JWT_SECRET = 'futurismo-secret-2024';

const authMiddleware = (req, res, next) => {
  // Skip auth for public endpoints
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/config/' // All config endpoints should be public
  ];
  if (publicPaths.some(path => req.path.includes(path))) {
    return next();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de acceso requerido'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado'
    });
  }
};

module.exports = { authMiddleware, JWT_SECRET };