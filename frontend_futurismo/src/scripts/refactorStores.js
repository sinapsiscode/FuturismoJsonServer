/**
 * Script de refactorización de stores
 * Plantilla para refactorizar stores rápidamente
 */

// Plantilla de servicio
export const SERVICE_TEMPLATE = `/**
 * Servicio de {{name}}
 * Maneja toda la lógica de {{name}} con el backend
 */

import BaseService from './baseService';
import { APP_CONFIG } from '../config/app.config';
import { mock{{Name}}Service } from './mock{{Name}}Service';

class {{Name}}Service extends BaseService {
  constructor() {
    super('/{{endpoint}}');
  }

  /**
   * Obtener todos los {{name}}
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async get{{Names}}(filters = {}) {
    if (this.isUsingMockData) {
      return mock{{Name}}Service.get{{Names}}(filters);
    }
    return this.get('', filters);
  }

  /**
   * Obtener {{name}} por ID
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async get{{Name}}ById(id) {
    if (this.isUsingMockData) {
      return mock{{Name}}Service.get{{Name}}ById(id);
    }
    return this.get(\`/\${id}\`);
  }

  /**
   * Crear nuevo {{name}}
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create{{Name}}(data) {
    if (this.isUsingMockData) {
      return mock{{Name}}Service.create{{Name}}(data);
    }
    return this.post('', data);
  }

  /**
   * Actualizar {{name}}
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update{{Name}}(id, data) {
    if (this.isUsingMockData) {
      return mock{{Name}}Service.update{{Name}}(id, data);
    }
    return this.put(\`/\${id}\`, data);
  }

  /**
   * Eliminar {{name}}
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async delete{{Name}}(id) {
    if (this.isUsingMockData) {
      return mock{{Name}}Service.delete{{Name}}(id);
    }
    return this.delete(\`/\${id}\`);
  }
}

export const {{name}}Service = new {{Name}}Service();
export default {{name}}Service;
`;

// Plantilla de servicio mock
export const MOCK_SERVICE_TEMPLATE = `/**
 * Servicio mock de {{name}}
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';

// Base de datos mock
const MOCK_{{NAME}}_DB = [
  // Agregar datos mock aquí
];

class Mock{{Name}}Service {
  constructor() {
    this.items = [...MOCK_{{NAME}}_DB];
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = \`\${APP_CONFIG.storage.prefix}mock_{{name}}\`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        this.items = JSON.parse(stored);
      } catch (error) {
        console.warn('Error loading mock {{name}} from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = \`\${APP_CONFIG.storage.prefix}mock_{{name}}\`;
    localStorage.setItem(storageKey, JSON.stringify(this.items));
  }

  async simulateDelay(ms = 500) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId() {
    return \`{{prefix}}-\${Date.now()}\`;
  }

  async get{{Names}}(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.items];
    
    // Aplicar filtros según necesidad
    
    return {
      success: true,
      data: filtered
    };
  }

  async get{{Name}}ById(id) {
    await this.simulateDelay();
    
    const item = this.items.find(i => i.id === id);
    
    if (!item) {
      return {
        success: false,
        error: '{{Name}} no encontrado'
      };
    }
    
    return {
      success: true,
      data: item
    };
  }

  async create{{Name}}(data) {
    await this.simulateDelay();
    
    const newItem = {
      id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    
    this.items.push(newItem);
    this.saveToStorage();
    
    return {
      success: true,
      data: newItem
    };
  }

  async update{{Name}}(id, data) {
    await this.simulateDelay();
    
    const index = this.items.findIndex(i => i.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: '{{Name}} no encontrado'
      };
    }
    
    this.items[index] = {
      ...this.items[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.items[index]
    };
  }

  async delete{{Name}}(id) {
    await this.simulateDelay();
    
    const index = this.items.findIndex(i => i.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: '{{Name}} no encontrado'
      };
    }
    
    this.items.splice(index, 1);
    this.saveToStorage();
    
    return {
      success: true
    };
  }
}

export const mock{{Name}}Service = new Mock{{Name}}Service();
export default mock{{Name}}Service;
`;

// Plantilla de store refactorizado
export const STORE_TEMPLATE = `/**
 * Store de {{name}}
 * Maneja el estado global de {{name}}
 */

import { create } from 'zustand';
import { {{name}}Service } from '../services/{{name}}Service';
import { {{NAME}}_CONSTANTS } from '../constants/{{name}}Constants';

const use{{Name}}Store = create((set, get) => ({
  // Estado
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  },

  // Acciones CRUD
  fetch{{Names}}: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await {{name}}Service.get{{Names}}(filters);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar {{name}}');
      }
      
      set({
        items: result.data,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  fetch{{Name}}ById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await {{name}}Service.get{{Name}}ById(id);
      
      if (!result.success) {
        throw new Error(result.error || '{{Name}} no encontrado');
      }
      
      set({
        currentItem: result.data,
        isLoading: false
      });
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  create{{Name}}: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await {{name}}Service.create{{Name}}(data);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear {{name}}');
      }
      
      set((state) => ({
        items: [result.data, ...state.items],
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  update{{Name}}: async (id, data) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await {{name}}Service.update{{Name}}(id, data);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar {{name}}');
      }
      
      set((state) => ({
        items: state.items.map(item => 
          item.id === id ? result.data : item
        ),
        currentItem: state.currentItem?.id === id 
          ? result.data 
          : state.currentItem,
        isLoading: false
      }));
      
      return result.data;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  delete{{Name}}: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await {{name}}Service.delete{{Name}}(id);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar {{name}}');
      }
      
      set((state) => ({
        items: state.items.filter(item => item.id !== id),
        currentItem: state.currentItem?.id === id 
          ? null 
          : state.currentItem,
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      throw error;
    }
  },

  // Filtros
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  // Utilidades
  clearError: () => set({ error: null }),
  
  resetStore: () => {
    set({
      items: [],
      currentItem: null,
      isLoading: false,
      error: null,
      filters: {},
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      }
    });
  }
}));

export { use{{Name}}Store };
export default use{{Name}}Store;
`;

// Función helper para generar archivos
export function generateStoreFiles(config) {
  const { name, Name, Names, NAME, names, endpoint, prefix } = config;
  
  const service = SERVICE_TEMPLATE
    .replace(/{{name}}/g, name)
    .replace(/{{Name}}/g, Name)
    .replace(/{{Names}}/g, Names)
    .replace(/{{endpoint}}/g, endpoint);
    
  const mockService = MOCK_SERVICE_TEMPLATE
    .replace(/{{name}}/g, name)
    .replace(/{{Name}}/g, Name)
    .replace(/{{Names}}/g, Names)
    .replace(/{{NAME}}/g, NAME)
    .replace(/{{prefix}}/g, prefix);
    
  const store = STORE_TEMPLATE
    .replace(/{{name}}/g, name)
    .replace(/{{Name}}/g, Name)
    .replace(/{{Names}}/g, Names)
    .replace(/{{NAME}}/g, NAME);
    
  return { service, mockService, store };
}

// Configuraciones para cada store
export const STORE_CONFIGS = [
  {
    name: 'marketplace',
    Name: 'Marketplace',
    Names: 'MarketplaceItems',
    NAME: 'MARKETPLACE',
    endpoint: 'marketplace',
    prefix: 'MKT'
  },
  {
    name: 'guides',
    Name: 'Guide',
    Names: 'Guides',
    NAME: 'GUIDES',
    endpoint: 'guides',
    prefix: 'GUIDE'
  },
  {
    name: 'users',
    Name: 'User',
    Names: 'Users',
    NAME: 'USERS',
    endpoint: 'users',
    prefix: 'USER'
  },
  {
    name: 'providers',
    Name: 'Provider',
    Names: 'Providers',
    NAME: 'PROVIDERS',
    endpoint: 'providers',
    prefix: 'PROV'
  },
  {
    name: 'emergency',
    Name: 'Emergency',
    Names: 'Emergencies',
    NAME: 'EMERGENCY',
    endpoint: 'emergency-protocols',
    prefix: 'EMRG'
  }
];

// Ejemplo de uso:
// const marketplaceFiles = generateStoreFiles(STORE_CONFIGS[0]);
// console.log(marketplaceFiles.service);
// console.log(marketplaceFiles.mockService);
// console.log(marketplaceFiles.store);