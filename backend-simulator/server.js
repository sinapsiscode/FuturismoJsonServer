const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

// Import custom routes
const authRoutes = require('./routes/auth');
const marketplaceRoutes = require('./routes/marketplace');
const dashboardRoutes = require('./routes/dashboard');
const reservationsRoutes = require('./routes/reservations');
const statisticsRoutes = require('./routes/statistics');
const notificationsRoutes = require('./routes/notifications');
const providersRoutes = require('./routes/providers');
const servicesRoutes = require('./routes/services');
const clientsRoutes = require('./routes/clients');
const profileRoutes = require('./routes/profile');
const toursRoutes = require('./routes/tours');
const emergencyRoutes = require('./routes/emergency');
const dataRoutes = require('./routes/data');
const configRoutes = require('./routes/config');
const validatorsRoutes = require('./routes/validators');
const utilsRoutes = require('./routes/utils');
const systemRoutes = require('./routes/system');
const appRoutes = require('./routes/app');
const { addHelpers } = require('./middlewares/helpers');

// Create server
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// CORS configuration - Allow all origins in development
server.use(cors({
  origin: '*', // Allow all origins explicitly
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false // Set to false to avoid preflight issues
}));

// Default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Add helper functions to all requests
server.use(addHelpers);

// Custom routes (BEFORE json-server router)
server.use('/api/auth', authRoutes(router));
server.use('/api/marketplace', marketplaceRoutes(router));
server.use('/api/dashboard', dashboardRoutes(router));
server.use('/api/reservations', reservationsRoutes(router));
server.use('/api/statistics', statisticsRoutes(router));
server.use('/api/notifications', notificationsRoutes(router));
server.use('/api/providers', providersRoutes(router));
server.use('/api/services', servicesRoutes(router));
server.use('/api/clients', clientsRoutes(router));
server.use('/api/profile', profileRoutes(router));
server.use('/api/tours', toursRoutes(router));
server.use('/api/emergency', emergencyRoutes(router));
server.use('/api/data', dataRoutes(router));
server.use('/api/config', configRoutes(router));
server.use('/api/validators', validatorsRoutes(router));
server.use('/api/utils', utilsRoutes(router));
server.use('/api/system', systemRoutes(router));
server.use('/api/app', appRoutes(router));

// JSON Server router (handles CRUD for all other endpoints)
server.use('/api', router);

// Start server
const PORT = process.env.PORT || 4050;
server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Futurismo JSON Server is running!');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📡 Server: http://172.29.80.1:${PORT}`);
  console.log(`📊 Resources: http://localhost:${PORT}/api`);
  console.log('✅ Ready for frontend integration');
});

module.exports = server;