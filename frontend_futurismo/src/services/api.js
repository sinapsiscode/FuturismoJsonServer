import axios from 'axios';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../utils/constants';
import { getStorageKey } from '../config/app.config';

// Crear instancia de axios con configuración base
// En desarrollo usar URL relativa para que funcione el proxy de Vite
const isDevelopment = import.meta.env.MODE === 'development';
const api = axios.create({
  baseURL: isDevelopment ? '/api' : API_ENDPOINTS.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Variable para guardar referencia al authStore (se carga después)
let authStoreRef = null;

// Función para obtener el token (primero del store, luego del storage)
const getAuthToken = () => {
  let token = null;

  // Intentar obtener del authStore si está disponible
  if (authStoreRef) {
    try {
      const state = authStoreRef.getState();
      token = state?.token;

      if (token) {
        console.log('🔑 [Interceptor] Token found in authStore');
        return token;
      }
    } catch (error) {
      console.warn('⚠️ [Interceptor] Could not access authStore:', error.message);
    }
  }

  // Si no está en el store, buscar en storage
  const storageKey = getStorageKey('authToken');
  token = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);

  if (token) {
    console.log('🔑 [Interceptor] Token found in storage');
  }

  return token;
};

// Función para registrar el authStore (se llama desde authStore)
export const setAuthStoreReference = (store) => {
  authStoreRef = store;
};

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    console.log('🔑 [Interceptor] Request to:', config.url);
    console.log('🔑 [Interceptor] Token found:', token ? 'YES' : 'NO');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [Interceptor] Authorization header set');
    } else {
      console.warn('⚠️ [Interceptor] No token found, request will be made without auth');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de red
    if (!error.response) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    // Manejar errores por código de estado
    switch (error.response.status) {
      case 401:
        // Token expirado o inválido - limpiar storage usando las claves correctas
        const tokenKey = getStorageKey('authToken');
        const userKey = getStorageKey('authUser');

        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        sessionStorage.removeItem(tokenKey);
        sessionStorage.removeItem(userKey);

        console.log('🔒 [Interceptor] Session expired - cleared storage and redirecting to login');
        window.location.href = '/login';
        throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);

      case 403:
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

      case 422:
        // Errores de validación
        const validationErrors = error.response.data.errors || {};
        throw {
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          errors: validationErrors
        };

      default:
        throw new Error(
          error.response.data.message || ERROR_MESSAGES.GENERIC_ERROR
        );
    }
  }
);

// Endpoints de autenticación
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me')
};

// Endpoints de servicios
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  getActive: () => api.get('/services/active'),
  getByCode: (code) => api.get(`/services/code/${code}`),
  updateStatus: (id, status) => api.patch(`/services/${id}/status`, { status })
};

// Endpoints de reservaciones
export const reservationsAPI = {
  create: (data) => api.post('/reservations', data),
  getAll: (params) => api.get('/reservations', { params }),
  getById: (id) => api.get(`/reservations/${id}`),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  cancel: (id, reason) => api.post(`/reservations/${id}/cancel`, { reason }),
  getAvailability: (date, serviceType) => 
    api.get('/reservations/availability', { params: { date, serviceType } })
};

// Endpoints de agencias
export const agenciesAPI = {
  getProfile: () => api.get('/agencies/profile'),
  updateProfile: (data) => api.put('/agencies/profile', data),
  getStats: (period) => api.get('/agencies/stats', { params: { period } }),
  getReservations: (params) => api.get('/agencies/reservations', { params }),
  changePassword: (data) => api.post('/agencies/change-password', data)
};

// Endpoints de guías
export const guidesAPI = {
  getAll: () => api.get('/guides'),
  getById: (id) => api.get(`/guides/${id}`),
  getAvailable: (date) => api.get('/guides/available', { params: { date } }),
  assignToService: (guideId, serviceId) => 
    api.post(`/guides/${guideId}/assign`, { serviceId })
};

// Endpoints de reportes
export const reportsAPI = {
  getServicesSummary: (startDate, endDate) => 
    api.get('/reports/services-summary', { params: { startDate, endDate } }),
  getPerformance: (period) => 
    api.get('/reports/performance', { params: { period } }),
  exportPDF: (type, params) => 
    api.get(`/reports/export/pdf/${type}`, { 
      params, 
      responseType: 'blob' 
    }),
  exportExcel: (type, params) => 
    api.get(`/reports/export/excel/${type}`, { 
      params, 
      responseType: 'blob' 
    })
};

// Endpoints de notificaciones
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

// Endpoints de chat
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, message) => 
    api.post(`/chat/conversations/${conversationId}/messages`, { message }),
  markAsRead: (conversationId) => 
    api.patch(`/chat/conversations/${conversationId}/read`)
};

// Funciones helper para subida de archivos
export const uploadFile = async (file, type = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      // Aquí podrías actualizar un store con el progreso
      console.log(`Upload progress: ${percentCompleted}%`);
    }
  });
};

// Función para descargar archivos
export const downloadFile = async (url, filename) => {
  try {
    const response = await api.get(url, { responseType: 'blob' });
    const blob = new Blob([response]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export default api;