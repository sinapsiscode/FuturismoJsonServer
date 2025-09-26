import { io } from 'socket.io-client';
import { API_ENDPOINTS } from '../utils/constants';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.listeners = new Map();
  }

  connect(token) {
    // En desarrollo sin backend, simular conexión WebSocket
    if (import.meta.env.DEV && !import.meta.env.VITE_ENABLE_WEBSOCKET) {
      console.log('WebSocket simulado en modo desarrollo');
      this.simulateConnection();
      return;
    }

    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.socket = io(API_ENDPOINTS.WS_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Conexión establecida
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connection:established');
    });

    // Desconexión
    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.emit('connection:lost', reason);
    });

    // Error de conexión
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.emit('connection:failed');
      }
    });

    // Reconexión
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts');
      this.emit('connection:reconnected');
    });

    // Eventos de servicios
    this.socket.on('service:update', (data) => {
      this.emit('service:update', data);
    });

    this.socket.on('service:location', (data) => {
      this.emit('service:location', data);
    });

    this.socket.on('service:status', (data) => {
      this.emit('service:status', data);
    });

    // Eventos de notificaciones
    this.socket.on('notification:new', (data) => {
      this.emit('notification:new', data);
    });

    // Eventos de chat
    this.socket.on('chat:message', (data) => {
      this.emit('chat:message', data);
    });

    this.socket.on('chat:typing', (data) => {
      this.emit('chat:typing', data);
    });

    this.socket.on('chat:read', (data) => {
      this.emit('chat:read', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Suscribirse a un canal específico
  subscribeToService(serviceId) {
    if (!this.socket?.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('subscribe:service', { serviceId });
  }

  unsubscribeFromService(serviceId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('unsubscribe:service', { serviceId });
  }

  // Suscribirse a actualizaciones del mapa
  subscribeToMapUpdates() {
    if (!this.socket?.connected) return;
    
    this.socket.emit('subscribe:map');
  }

  unsubscribeFromMapUpdates() {
    if (!this.socket?.connected) return;
    
    this.socket.emit('unsubscribe:map');
  }

  // Enviar ubicación del guía
  sendGuideLocation(location) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('guide:location', {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      timestamp: new Date().toISOString()
    });
  }

  // Actualizar estado del servicio
  updateServiceStatus(serviceId, status, details = {}) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('service:status:update', {
      serviceId,
      status,
      details,
      timestamp: new Date().toISOString()
    });
  }

  // Chat en tiempo real
  joinChatRoom(roomId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('chat:join', { roomId });
  }

  leaveChatRoom(roomId) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('chat:leave', { roomId });
  }

  sendChatMessage(roomId, message) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('chat:message:send', {
      roomId,
      message,
      timestamp: new Date().toISOString()
    });
  }

  sendTypingIndicator(roomId, isTyping) {
    if (!this.socket?.connected) return;
    
    this.socket.emit('chat:typing', {
      roomId,
      isTyping
    });
  }

  // Sistema de eventos personalizado
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event).add(callback);
    
    // Retornar función para desuscribirse
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  // Verificar estado de conexión
  isConnected() {
    return this.socket?.connected || false;
  }

  // Obtener ID de socket
  getSocketId() {
    return this.socket?.id || null;
  }

  // Simular conexión en desarrollo
  simulateConnection() {
    // Crear un objeto mock que simula el socket
    this.socket = {
      connected: true,
      id: 'mock-socket-id',
      on: (event, callback) => {
        // Simular algunos eventos después de un delay
        if (event === 'connect') {
          setTimeout(() => callback(), 100);
        }
      },
      emit: (event, data) => {
        console.log(`[WebSocket Mock] Evento emitido: ${event}`, data);
      },
      off: () => {},
      disconnect: () => {
        console.log('[WebSocket Mock] Desconectado');
        this.socket.connected = false;
      }
    };

    // Simular eventos periódicos de actualización
    if (import.meta.env.DEV) {
      setInterval(() => {
        // Simular actualización de ubicación de guía
        const mockUpdate = {
          type: 'location_update',
          guideId: 'guide-1',
          location: {
            lat: -12.0464 + (Math.random() - 0.5) * 0.01,
            lng: -77.0428 + (Math.random() - 0.5) * 0.01
          },
          timestamp: new Date()
        };
        
        // Notificar a los listeners
        this.emit('guide:location:update', mockUpdate);
      }, 30000); // Cada 30 segundos
    }
  }
}

// Exportar instancia única (singleton)
const webSocketService = new WebSocketService();

export default webSocketService;