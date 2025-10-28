// Load environment variables first
require('dotenv').config();

const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

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
const vehiclesRoutes = require('./routes/vehicles');
const guidesRoutes = require('./routes/guides');
const financialRoutes = require('./routes/financial');
const chatRoutes = require('./routes/chat');
const usersRoutes = require('./routes/users');
const driversRoutes = require('./routes/drivers');
const agenciesRoutes = require('./routes/agencies');
const filesRoutes = require('./routes/files');
const ratingsRoutes = require('./routes/ratings');
const agendaRoutes = require('./routes/agenda');
const monitoringRoutes = require('./routes/monitoring');
const settingsRoutes = require('./routes/settings');
const suggestionsRoutes = require('./routes/suggestions');
const rewardsRoutes = require('./routes/rewards');
const { addHelpers } = require('./middlewares/helpers');
const { authMiddleware } = require('./middlewares/auth');

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

// Authentication middleware - validates JWT and sets req.user
server.use(authMiddleware);

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
server.use('/api/vehicles', vehiclesRoutes(router));
server.use('/api/guides', guidesRoutes(router));
server.use('/api/financial', financialRoutes(router));
server.use('/api/chat', chatRoutes(router));
server.use('/api/users', usersRoutes(router));
server.use('/api/drivers', driversRoutes(router));
server.use('/api/agencies', agenciesRoutes(router));
server.use('/api/files', filesRoutes(router));
server.use('/api/ratings', ratingsRoutes(router));
server.use('/api/agenda', agendaRoutes(router));
server.use('/api/monitoring', monitoringRoutes(router));
server.use('/api/settings', settingsRoutes(router));
server.use('/api/suggestions', suggestionsRoutes(router));
server.use('/api/rewards', rewardsRoutes(router));

// JSON Server router (handles CRUD for all other endpoints)
server.use('/api', router);

// Create HTTP server for Socket.io
const PORT = process.env.PORT || 4050;
const HOST = process.env.HOST || '0.0.0.0';
const httpServer = http.createServer(server);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false
  }
});

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log('⚠️ [WebSocket] Client connected without token');
    // Allow connection even without token for development
    return next();
  }

  try {
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('./middlewares/auth');
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId;
    socket.userEmail = decoded.email;
    socket.userRole = decoded.role;
    console.log(`✅ [WebSocket] Authenticated user: ${decoded.email} (${decoded.role})`);
    next();
  } catch (error) {
    console.log('❌ [WebSocket] Invalid token:', error.message);
    // Allow connection but mark as unauthenticated
    socket.userId = null;
    next();
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`🔌 [WebSocket] Client connected: ${socket.id} | User: ${socket.userEmail || 'anonymous'}`);

  // Join user to their personal room
  if (socket.userId) {
    socket.join(`user:${socket.userId}`);
    console.log(`👤 [WebSocket] User ${socket.userEmail} joined room: user:${socket.userId}`);
  }

  // Join role-based rooms
  if (socket.userRole) {
    socket.join(`role:${socket.userRole}`);
    console.log(`👥 [WebSocket] User joined role room: role:${socket.userRole}`);
  }

  // Handle custom events
  socket.on('service:update', (data) => {
    console.log(`📦 [WebSocket] Service update:`, data);
    // Broadcast to all connected clients
    io.emit('service:update', data);
  });

  socket.on('notification:new', (data) => {
    console.log(`🔔 [WebSocket] New notification:`, data);
    if (data.userId) {
      // Send to specific user
      io.to(`user:${data.userId}`).emit('notification:new', data);
    } else {
      // Broadcast to all
      io.emit('notification:new', data);
    }
  });

  socket.on('booking:update', (data) => {
    console.log(`📅 [WebSocket] Booking update:`, data);
    io.emit('booking:update', data);
  });

  socket.on('chat:message', (data) => {
    console.log(`💬 [WebSocket] Chat message:`, data);
    // Send to specific conversation
    if (data.conversationId) {
      io.to(`conversation:${data.conversationId}`).emit('chat:message', data);
    }
  });

  socket.on('monitoring:update', (data) => {
    console.log(`📍 [WebSocket] Monitoring update:`, data);
    // Broadcast to monitoring viewers
    io.to('role:admin').emit('monitoring:update', data);
    io.to('role:agency').emit('monitoring:update', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 [WebSocket] Client disconnected: ${socket.id}`);
  });
});

// Start server
httpServer.listen(PORT, HOST, () => {
  console.log('🚀 Futurismo JSON Server is running!');
  console.log(`📡 HTTP Server: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
  console.log(`📊 API Resources: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 Version: ${process.env.APP_VERSION || 'unknown'}`);
  console.log('✅ Ready for frontend integration');
});

// Export both server and io for use in routes
module.exports = { server, io, httpServer };