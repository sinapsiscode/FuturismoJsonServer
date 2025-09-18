const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

// Import custom routes
const authRoutes = require('./routes/auth');
const marketplaceRoutes = require('./routes/marketplace');
const dashboardRoutes = require('./routes/dashboard');

// Create server
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// CORS configuration - Allow all origins in development
server.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

// Default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom routes (BEFORE json-server router)
server.use('/api/auth', authRoutes(router));
server.use('/api/marketplace', marketplaceRoutes(router));
server.use('/api/dashboard', dashboardRoutes(router));

// JSON Server router (handles CRUD for all other endpoints)
server.use('/api', router);

// Start server
const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log('🚀 Futurismo JSON Server is running!');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📊 Resources: http://localhost:${PORT}/api`);
  console.log('✅ Ready for frontend integration');
});

module.exports = server;