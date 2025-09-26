/**
 * Inicializador central de la aplicación
 * Se encarga de cargar TODA la configuración del servidor antes de renderizar
 */

import useAppConfigStore from '../stores/appConfigStore.js';
import serverConfigService from './serverConfigService.js';
import { APP_CONFIG } from '../config/app.config.js';

class AppInitializer {
  constructor() {
    this.initialized = false;
    this.initPromise = null;
  }

  // Inicialización principal de la app
  async initialize() {
    // Si ya se está inicializando, esperar a que termine
    if (this.initPromise) {
      return this.initPromise;
    }

    // Si ya está inicializada, retornar inmediatamente
    if (this.initialized) {
      return true;
    }

    this.initPromise = this._performInitialization();
    return this.initPromise;
  }

  async _performInitialization() {
    try {
      console.log('🚀 Iniciando aplicación...');

      // 1. Validar configuración local
      this._validateLocalConfig();

      // 2. Verificar conectividad con el servidor
      await this._checkServerConnection();

      // 3. Obtener usuario de localStorage si existe
      const storedUser = this._getStoredUser();

      // 4. Si hay usuario, inicializar con datos del servidor
      if (storedUser?.id && storedUser?.role) {
        await this._initializeWithServerData(storedUser.role, storedUser.id);
      } else {
        // 5. Si no hay usuario, cargar configuraciones básicas
        await this._loadBasicConfig();
      }

      // 6. Precargar datos comunes
      await this._preloadCommonData();

      this.initialized = true;
      console.log('✅ Aplicación inicializada correctamente');

      return true;

    } catch (error) {
      console.error('❌ Error inicializando aplicación:', error);

      // En caso de error, inicializar en modo offline con datos básicos
      await this._initializeOfflineMode();

      throw error;
    } finally {
      this.initPromise = null;
    }
  }

  // Validar configuración local
  _validateLocalConfig() {
    if (!APP_CONFIG.api.baseUrl) {
      throw new Error('API base URL no configurada');
    }

    console.log('✅ Configuración local válida');
  }

  // Verificar conectividad con el servidor
  async _checkServerConnection() {
    try {
      const response = await fetch(`${APP_CONFIG.api.baseUrl}/system/health`, {
        method: 'GET',
        timeout: 5000
      });

      if (!response.ok) {
        throw new Error(`Server health check failed: ${response.status}`);
      }

      const health = await response.json();
      console.log('✅ Servidor conectado:', health.data?.status);

    } catch (error) {
      console.warn('⚠️ Error conectando al servidor:', error.message);
      throw new Error('No se puede conectar al servidor');
    }
  }

  // Obtener usuario de localStorage
  _getStoredUser() {
    try {
      const userStr = localStorage.getItem(APP_CONFIG.storage.keys.authUser);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.warn('⚠️ Error parseando usuario almacenado:', error);
      return null;
    }
  }

  // Inicializar con datos del servidor para usuario específico
  async _initializeWithServerData(role, userId) {
    try {
      console.log(`🔧 Inicializando para ${role}:${userId}`);

      const store = useAppConfigStore.getState();
      const initData = await store.initializeApp(role, userId);

      console.log('✅ Datos del servidor cargados:', {
        user: initData.user?.name,
        role: role,
        navigation: initData.navigation?.length,
        permissions: Object.keys(initData.permissions || {}).length
      });

      return initData;

    } catch (error) {
      console.error('❌ Error cargando datos del servidor:', error);
      throw error;
    }
  }

  // Cargar configuraciones básicas sin usuario
  async _loadBasicConfig() {
    try {
      console.log('🔧 Cargando configuración básica...');

      // Cargar constantes básicas
      const constants = await serverConfigService.getConstants();
      const tourTypes = await serverConfigService.getTourTypes();
      const languages = await serverConfigService.getLanguages();

      const store = useAppConfigStore.getState();
      store.constants = constants;
      store.tourTypes = tourTypes;
      store.languages = languages;

      console.log('✅ Configuración básica cargada');

    } catch (error) {
      console.error('❌ Error cargando configuración básica:', error);
      throw error;
    }
  }

  // Precargar datos comunes para mejorar performance
  async _preloadCommonData() {
    try {
      console.log('🔄 Precargando datos comunes...');

      await serverConfigService.preloadCommonData();

      console.log('✅ Datos comunes precargados');

    } catch (error) {
      console.warn('⚠️ Error precargando datos comunes:', error);
      // No es crítico, continuar
    }
  }

  // Modo offline con datos básicos hardcodeados
  async _initializeOfflineMode() {
    console.log('🔄 Inicializando en modo offline...');

    const store = useAppConfigStore.getState();

    // Configuraciones mínimas hardcodeadas como fallback
    store.constants = {
      USER_ROLES: {
        ADMIN: 'admin',
        AGENCY: 'agency',
        GUIDE: 'guide',
        CLIENT: 'client'
      },
      RESERVATION_STATUS: {
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
      },
      SERVICE_CATEGORIES: {
        TOURS: 'tours',
        ACCOMMODATION: 'accommodation',
        TRANSPORT: 'transport'
      }
    };

    store.tourTypes = [
      { id: 'cultural', name: 'Cultural', icon: '🏛️' },
      { id: 'adventure', name: 'Aventura', icon: '🏔️' },
      { id: 'nature', name: 'Naturaleza', icon: '🌿' }
    ];

    store.languages = [
      { id: 'es', name: 'Español', flag: '🇪🇸' },
      { id: 'en', name: 'English', flag: '🇺🇸' }
    ];

    console.log('⚠️ Aplicación inicializada en modo offline');
  }

  // Reinicializar la app (útil después de login/logout)
  async reinitialize(role = null, userId = null) {
    console.log('🔄 Reinicializando aplicación...');

    this.initialized = false;
    this.initPromise = null;

    // Limpiar store
    const store = useAppConfigStore.getState();
    store.clearState();

    // Limpiar cache del servicio
    serverConfigService.clearCache();

    // Si se proporcionan credenciales, inicializar con ellas
    if (role && userId) {
      await this._initializeWithServerData(role, userId);
    } else {
      await this.initialize();
    }

    console.log('✅ Aplicación reinicializada');
  }

  // Verificar si la app está inicializada
  isInitialized() {
    return this.initialized;
  }

  // Obtener estado de inicialización
  getInitializationStatus() {
    return {
      initialized: this.initialized,
      initializing: !!this.initPromise
    };
  }

  // Refrescar configuración sin reinicializar completamente
  async refreshConfig() {
    try {
      console.log('🔄 Refrescando configuración...');

      const store = useAppConfigStore.getState();
      await store.refreshConfig();

      console.log('✅ Configuración refrescada');

    } catch (error) {
      console.error('❌ Error refrescando configuración:', error);
      throw error;
    }
  }

  // Hook para escuchar cambios de inicialización
  onInitializationChange(callback) {
    // Implementar sistema de eventos si es necesario
    // Por ahora, simple callback
    if (typeof callback === 'function') {
      callback(this.initialized);
    }
  }
}

// Crear instancia global
const appInitializer = new AppInitializer();

export default appInitializer;