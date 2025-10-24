const cors = require('cors');

// Get allowed origins from environment variable
// In production, specify exact allowed origins for security
const getAllowedOrigins = () => {
  if (process.env.CORS_ORIGINS) {
    // If CORS_ORIGINS is set, parse it (comma-separated list)
    return process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());
  }

  // Default origins for development
  if (process.env.NODE_ENV === 'development') {
    return [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Alternative dev server
      'http://localhost:5174', // Alternative Vite port
      'http://localhost:4173'  // Vite preview mode
    ];
  }

  // In production, require explicit CORS_ORIGINS
  console.warn('⚠️ WARNING: CORS_ORIGINS not set in production. Set this environment variable for security.');
  return [];
};

const corsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = cors(corsOptions);