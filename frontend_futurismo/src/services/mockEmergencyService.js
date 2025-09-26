/**
 * Servicio mock de emergencias
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';

// Categorías de emergencia
const EMERGENCY_CATEGORIES = [
  { id: 'medico', name: 'Médico', icon: '🚑', color: '#EF4444' },
  { id: 'climatico', name: 'Climático', icon: '⛈️', color: '#3B82F6' },
  { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#F59E0B' },
  { id: 'seguridad', name: 'Seguridad', icon: '🔍', color: '#8B5CF6' },
  { id: 'comunicacion', name: 'Comunicación', icon: '📡', color: '#10B981' }
];

// Base de datos mock de protocolos
const MOCK_PROTOCOLS_DB = [
  {
    id: 'protocolo_medico',
    title: 'Protocolo Médico de Emergencia',
    category: 'medico',
    priority: 'alta',
    description: 'Procedimientos para emergencias médicas durante tours',
    icon: '🚑',
    lastUpdated: '2024-01-15',
    content: {
      steps: [
        'Evaluar la situación y seguridad del entorno',
        'Verificar estado de conciencia del afectado',
        'Llamar inmediatamente a emergencias (105)',
        'Contactar coordinador de tours',
        'Aplicar primeros auxilios básicos si está capacitado',
        'Documentar el incidente',
        'Coordinar traslado si es necesario'
      ],
      contacts: [
        { name: 'Emergencias Nacionales', phone: '105', type: 'emergency' },
        { name: 'Coordinador Tours', phone: '+51 999 888 777', type: 'coordinator' },
        { name: 'Gerencia', phone: '+51 999 888 778', type: 'management' },
        { name: 'Seguro Médico', phone: '+51 999 888 780', type: 'insurance' }
      ],
      materials: [
        'Botiquín de primeros auxilios',
        'Lista de contactos de emergencia',
        'Información médica de participantes',
        'Linterna y silbato',
        'Mantas térmicas'
      ]
    },
    status: 'active',
    version: '1.0',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'admin',
    approvedBy: 'management'
  },
  {
    id: 'protocolo_climatico',
    title: 'Protocolo de Emergencia Climática',
    category: 'climatico',
    priority: 'alta',
    description: 'Procedimientos para condiciones climáticas adversas',
    icon: '⛈️',
    lastUpdated: '2024-01-15',
    content: {
      steps: [
        'Monitorear condiciones climáticas constantemente',
        'Identificar refugios seguros en la ruta',
        'Comunicar situación al coordinador',
        'Reagrupar al grupo en lugar seguro',
        'Evaluar continuidad del tour',
        'Coordinar plan de contingencia',
        'Mantener comunicación constante'
      ],
      contacts: [
        { name: 'SENAMHI', phone: '115', type: 'weather' },
        { name: 'Coordinador Tours', phone: '+51 999 888 777', type: 'coordinator' },
        { name: 'Defensa Civil', phone: '116', type: 'emergency' }
      ],
      materials: [
        'Radio de comunicación',
        'Impermeables de emergencia',
        'Brújula y GPS',
        'Linternas adicionales',
        'Silbato de emergencia'
      ]
    },
    status: 'active',
    version: '1.0',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'admin',
    approvedBy: 'management'
  },
  {
    id: 'protocolo_vehicular',
    title: 'Protocolo de Emergencia Vehicular',
    category: 'transporte',
    priority: 'media',
    description: 'Procedimientos para accidentes o fallas de vehículos',
    icon: '🚗',
    lastUpdated: '2024-01-15',
    content: {
      steps: [
        'Asegurar la zona del incidente',
        'Verificar estado de todos los pasajeros',
        'Llamar a emergencias si hay heridos',
        'Contactar servicio de grúa y seguros',
        'Documentar daños con fotografías',
        'Coordinar transporte alternativo',
        'Informar a coordinador y agencia'
      ],
      contacts: [
        { name: 'Policía de Carreteras', phone: '105', type: 'police' },
        { name: 'Seguro Vehicular', phone: '+51 999 888 785', type: 'insurance' },
        { name: 'Servicio de Grúa', phone: '+51 999 888 786', type: 'towing' },
        { name: 'Coordinador Tours', phone: '+51 999 888 777', type: 'coordinator' }
      ],
      materials: [
        'Kit de herramientas básicas',
        'Triángulos de seguridad',
        'Chaleco reflectivo',
        'Extintor',
        'Botiquín vehicular'
      ]
    },
    status: 'active',
    version: '1.0',
    createdAt: '2023-07-20T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'admin',
    approvedBy: 'management'
  },
  {
    id: 'protocolo_perdida',
    title: 'Protocolo de Persona Perdida',
    category: 'seguridad',
    priority: 'alta',
    description: 'Procedimientos cuando un turista se pierde del grupo',
    icon: '🔍',
    lastUpdated: '2024-01-15',
    content: {
      steps: [
        'Realizar conteo inmediato del grupo',
        'Determinar cuándo y dónde se vio por última vez',
        'Asignar búsqueda en área inmediata',
        'Contactar inmediatamente al coordinador',
        'Llamar a autoridades locales',
        'Mantener al resto del grupo seguro',
        'Documentar cronología de eventos'
      ],
      contacts: [
        { name: 'Policía Nacional', phone: '105', type: 'police' },
        { name: 'Coordinador Tours', phone: '+51 999 888 777', type: 'coordinator' },
        { name: 'Autoridades Locales', phone: 'Variable', type: 'local' },
        { name: 'Gerencia 24h', phone: '+51 999 888 779', type: 'management' }
      ],
      materials: [
        'Lista actualizada de participantes',
        'Silbato de emergencia',
        'Linterna potente',
        'Radio de comunicación',
        'Fotografías del grupo'
      ]
    },
    status: 'active',
    version: '1.0',
    createdAt: '2023-08-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'admin',
    approvedBy: 'management'
  },
  {
    id: 'protocolo_comunicacion',
    title: 'Protocolo de Pérdida de Comunicación',
    category: 'comunicacion',
    priority: 'media',
    description: 'Procedimientos cuando se pierde comunicación',
    icon: '📡',
    lastUpdated: '2024-01-15',
    content: {
      steps: [
        'Intentar comunicación por todos los medios disponibles',
        'Moverse a zona con mejor señal si es seguro',
        'Utilizar radio de emergencia si está disponible',
        'Seguir plan de contingencia predefinido',
        'Mantener al grupo informado y tranquilo',
        'Dirigirse al punto de encuentro establecido',
        'Documentar período sin comunicación'
      ],
      contacts: [
        { name: 'Coordinador Tours', phone: '+51 999 888 777', type: 'coordinator' },
        { name: 'Base de Operaciones', phone: '+51 999 888 781', type: 'operations' },
        { name: 'Emergencia 24h', phone: '+51 999 888 779', type: 'emergency' }
      ],
      materials: [
        'Radio de emergencia',
        'Teléfono satelital (si disponible)',
        'Puntos WiFi identificados',
        'Plan de contingencia impreso',
        'Mapas offline'
      ]
    },
    status: 'active',
    version: '1.0',
    createdAt: '2023-09-05T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'admin',
    approvedBy: 'management'
  }
];

// Base de datos mock de materiales
const MOCK_MATERIALS_DB = [
  {
    id: 'botiquin_basico',
    name: 'Botiquín Básico de Primeros Auxilios',
    category: 'medico',
    mandatory: true,
    status: 'active',
    items: [
      'Vendas elásticas (2 rollos)',
      'Gasas estériles (10 unidades)',
      'Esparadrapo (2 rollos)',
      'Alcohol y agua oxigenada',
      'Analgésicos básicos',
      'Termómetro digital',
      'Tijeras y pinzas',
      'Guantes desechables (5 pares)'
    ],
    checklistFrequency: 'weekly',
    lastChecked: '2024-03-10T00:00:00Z',
    checkedBy: 'user-003',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z'
  },
  {
    id: 'comunicacion',
    name: 'Equipo de Comunicación',
    category: 'comunicacion',
    mandatory: true,
    status: 'active',
    items: [
      'Radio transmisor',
      'Teléfono móvil con batería extra',
      'Silbato de emergencia',
      'Linterna LED con pilas extra',
      'Cargador portátil'
    ],
    checklistFrequency: 'daily',
    lastChecked: '2024-03-12T00:00:00Z',
    checkedBy: 'user-003',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z'
  },
  {
    id: 'documentacion',
    name: 'Documentación de Emergencia',
    category: 'documentos',
    mandatory: true,
    status: 'active',
    items: [
      'Lista de participantes con contactos',
      'Protocolos impresos',
      'Contactos de emergencia locales',
      'Números de seguros',
      'Mapas de la zona'
    ],
    checklistFrequency: 'tour',
    lastChecked: '2024-03-11T00:00:00Z',
    checkedBy: 'user-002',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-03-11T00:00:00Z'
  },
  {
    id: 'seguridad_personal',
    name: 'Seguridad Personal',
    category: 'seguridad',
    mandatory: false,
    status: 'active',
    items: [
      'Chaleco reflectivo',
      'Casco de seguridad (según actividad)',
      'Silbato adicional',
      'Mantas térmicas (2 unidades)',
      'Agua potable extra (2 litros)'
    ],
    checklistFrequency: 'monthly',
    lastChecked: '2024-03-01T00:00:00Z',
    checkedBy: 'user-001',
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  }
];

// Base de datos mock de incidentes
const MOCK_INCIDENTS_DB = [
  {
    id: 'incident-001',
    date: '2024-02-15',
    time: '14:30',
    tourId: 'tour-cusco-001',
    tourName: 'Cusco - Valle Sagrado',
    protocolUsed: 'protocolo_medico',
    category: 'medico',
    severity: 'moderada',
    description: 'Turista con mareos por altura',
    actions: [
      'Se aplicó protocolo médico',
      'Se administró oxígeno',
      'Se contactó al médico del tour',
      'Turista se recuperó en 30 minutos'
    ],
    reportedBy: 'user-003',
    status: 'closed',
    resolution: 'Turista recuperado completamente',
    createdAt: '2024-02-15T14:30:00Z',
    closedAt: '2024-02-15T15:00:00Z'
  },
  {
    id: 'incident-002',
    date: '2024-03-05',
    time: '16:45',
    tourId: 'tour-ica-002',
    tourName: 'Ica - Huacachina',
    protocolUsed: 'protocolo_vehicular',
    category: 'transporte',
    severity: 'baja',
    description: 'Pinchadura de llanta en ruta',
    actions: [
      'Se aseguró la zona',
      'Se cambió la llanta',
      'Se documentó el incidente',
      'Tour continuó con 20 minutos de retraso'
    ],
    reportedBy: 'user-002',
    status: 'closed',
    resolution: 'Llanta cambiada, tour completado',
    createdAt: '2024-03-05T16:45:00Z',
    closedAt: '2024-03-05T17:05:00Z'
  }
];

class MockEmergencyService {
  constructor() {
    this.protocols = [...MOCK_PROTOCOLS_DB];
    this.materials = [...MOCK_MATERIALS_DB];
    this.categories = [...EMERGENCY_CATEGORIES];
    this.incidents = [...MOCK_INCIDENTS_DB];
    this.initializeStorage();
  }

  initializeStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_emergency`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.protocols = data.protocols || this.protocols;
        this.materials = data.materials || this.materials;
        this.incidents = data.incidents || this.incidents;
      } catch (error) {
        console.warn('Error loading mock emergency data from storage:', error);
      }
    }
  }

  saveToStorage() {
    const storageKey = `${APP_CONFIG.storage.prefix}mock_emergency`;
    localStorage.setItem(storageKey, JSON.stringify({
      protocols: this.protocols,
      materials: this.materials,
      incidents: this.incidents
    }));
  }

  async simulateDelay(ms = 500) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  generateId(prefix = 'item') {
    return `${prefix}-${Date.now()}`;
  }

  // Categorías
  async getCategories() {
    await this.simulateDelay();
    
    return {
      success: true,
      data: this.categories
    };
  }

  // Protocolos
  async getProtocols(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.protocols];
    
    // Solo protocolos activos por defecto
    if (filters.includeInactive !== true) {
      filtered = filtered.filter(p => p.status === 'active');
    }
    
    // Filtrar por categoría
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Filtrar por prioridad
    if (filters.priority) {
      filtered = filtered.filter(p => p.priority === filters.priority);
    }
    
    // Búsqueda por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Ordenar por prioridad
    const priorityOrder = { alta: 1, media: 2, baja: 3 };
    filtered.sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    
    // Paginación
    const page = filters.page || 1;
    const pageSize = filters.pageSize || APP_CONFIG.pagination.defaultPageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = filtered.slice(start, end);
    
    return {
      success: true,
      data: {
        protocols: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  async getProtocolById(id) {
    await this.simulateDelay();
    
    const protocol = this.protocols.find(p => p.id === id);
    
    if (!protocol) {
      return {
        success: false,
        error: 'Protocolo no encontrado'
      };
    }
    
    return {
      success: true,
      data: protocol
    };
  }

  async createProtocol(protocolData) {
    await this.simulateDelay();
    
    const newProtocol = {
      id: this.generateId('protocolo'),
      ...protocolData,
      status: 'active',
      version: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    };
    
    this.protocols.push(newProtocol);
    this.saveToStorage();
    
    return {
      success: true,
      data: newProtocol
    };
  }

  async updateProtocol(id, updateData) {
    await this.simulateDelay();
    
    const index = this.protocols.findIndex(p => p.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Protocolo no encontrado'
      };
    }
    
    // Incrementar versión si hay cambios significativos
    const currentVersion = parseFloat(this.protocols[index].version);
    const newVersion = updateData.content ? (currentVersion + 0.1).toFixed(1) : currentVersion.toFixed(1);
    
    this.protocols[index] = {
      ...this.protocols[index],
      ...updateData,
      version: newVersion,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      updatedBy: 'current-user'
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.protocols[index]
    };
  }

  async deleteProtocol(id) {
    await this.simulateDelay();
    
    const index = this.protocols.findIndex(p => p.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Protocolo no encontrado'
      };
    }
    
    // Soft delete
    this.protocols[index].status = 'inactive';
    this.protocols[index].deletedAt = new Date().toISOString();
    
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  // Materiales
  async getMaterials(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.materials];
    
    // Solo materiales activos por defecto
    if (filters.includeInactive !== true) {
      filtered = filtered.filter(m => m.status === 'active');
    }
    
    // Filtrar por categoría
    if (filters.category) {
      filtered = filtered.filter(m => m.category === filters.category);
    }
    
    // Filtrar por obligatorios
    if (filters.mandatory !== undefined) {
      filtered = filtered.filter(m => m.mandatory === filters.mandatory);
    }
    
    // Búsqueda por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchTerm) ||
        m.items.some(item => item.toLowerCase().includes(searchTerm))
      );
    }
    
    // Ordenar por obligatorios primero
    filtered.sort((a, b) => {
      if (a.mandatory && !b.mandatory) return -1;
      if (!a.mandatory && b.mandatory) return 1;
      return a.name.localeCompare(b.name);
    });
    
    // Paginación
    const page = filters.page || 1;
    const pageSize = filters.pageSize || APP_CONFIG.pagination.defaultPageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = filtered.slice(start, end);
    
    return {
      success: true,
      data: {
        materials: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  async getMaterialById(id) {
    await this.simulateDelay();
    
    const material = this.materials.find(m => m.id === id);
    
    if (!material) {
      return {
        success: false,
        error: 'Material no encontrado'
      };
    }
    
    return {
      success: true,
      data: material
    };
  }

  async createMaterial(materialData) {
    await this.simulateDelay();
    
    const newMaterial = {
      id: this.generateId('material'),
      ...materialData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.materials.push(newMaterial);
    this.saveToStorage();
    
    return {
      success: true,
      data: newMaterial
    };
  }

  async updateMaterial(id, updateData) {
    await this.simulateDelay();
    
    const index = this.materials.findIndex(m => m.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Material no encontrado'
      };
    }
    
    this.materials[index] = {
      ...this.materials[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.materials[index]
    };
  }

  async deleteMaterial(id) {
    await this.simulateDelay();
    
    const index = this.materials.findIndex(m => m.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Material no encontrado'
      };
    }
    
    // Soft delete
    this.materials[index].status = 'inactive';
    this.materials[index].deletedAt = new Date().toISOString();
    
    this.saveToStorage();
    
    return {
      success: true
    };
  }

  async checkMaterial(id, checkedBy) {
    await this.simulateDelay();
    
    const index = this.materials.findIndex(m => m.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Material no encontrado'
      };
    }
    
    this.materials[index].lastChecked = new Date().toISOString();
    this.materials[index].checkedBy = checkedBy;
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.materials[index]
    };
  }

  // Incidentes
  async getIncidents(filters = {}) {
    await this.simulateDelay();
    
    let filtered = [...this.incidents];
    
    // Filtrar por tour
    if (filters.tourId) {
      filtered = filtered.filter(i => i.tourId === filters.tourId);
    }
    
    // Filtrar por categoría
    if (filters.category) {
      filtered = filtered.filter(i => i.category === filters.category);
    }
    
    // Filtrar por severidad
    if (filters.severity) {
      filtered = filtered.filter(i => i.severity === filters.severity);
    }
    
    // Filtrar por estado
    if (filters.status) {
      filtered = filtered.filter(i => i.status === filters.status);
    }
    
    // Filtrar por fecha
    if (filters.dateFrom) {
      filtered = filtered.filter(i => i.date >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(i => i.date <= filters.dateTo);
    }
    
    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Paginación
    const page = filters.page || 1;
    const pageSize = filters.pageSize || APP_CONFIG.pagination.defaultPageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    const paginatedData = filtered.slice(start, end);
    
    return {
      success: true,
      data: {
        incidents: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize)
      }
    };
  }

  async getIncidentById(id) {
    await this.simulateDelay();
    
    const incident = this.incidents.find(i => i.id === id);
    
    if (!incident) {
      return {
        success: false,
        error: 'Incidente no encontrado'
      };
    }
    
    return {
      success: true,
      data: incident
    };
  }

  async createIncident(incidentData) {
    await this.simulateDelay();
    
    const newIncident = {
      id: this.generateId('incident'),
      ...incidentData,
      status: 'open',
      createdAt: new Date().toISOString(),
      reportedBy: 'current-user'
    };
    
    this.incidents.push(newIncident);
    this.saveToStorage();
    
    return {
      success: true,
      data: newIncident
    };
  }

  async updateIncident(id, updateData) {
    await this.simulateDelay();
    
    const index = this.incidents.findIndex(i => i.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Incidente no encontrado'
      };
    }
    
    this.incidents[index] = {
      ...this.incidents[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Si se cierra el incidente
    if (updateData.status === 'closed' && this.incidents[index].status !== 'closed') {
      this.incidents[index].closedAt = new Date().toISOString();
      this.incidents[index].closedBy = 'current-user';
    }
    
    this.saveToStorage();
    
    return {
      success: true,
      data: this.incidents[index]
    };
  }

  async closeIncident(id, resolution) {
    return this.updateIncident(id, {
      status: 'closed',
      resolution
    });
  }

  // Estadísticas
  async getEmergencyStats() {
    await this.simulateDelay();
    
    const activeProtocols = this.protocols.filter(p => p.status === 'active');
    const activeMaterials = this.materials.filter(m => m.status === 'active');
    const mandatoryMaterials = activeMaterials.filter(m => m.mandatory);
    
    // Incidentes por categoría
    const incidentsByCategory = {};
    this.categories.forEach(cat => {
      incidentsByCategory[cat.name] = this.incidents.filter(i => i.category === cat.id).length;
    });
    
    // Incidentes por severidad
    const incidentsBySeverity = {
      alta: this.incidents.filter(i => i.severity === 'alta').length,
      media: this.incidents.filter(i => i.severity === 'media').length,
      baja: this.incidents.filter(i => i.severity === 'baja').length
    };
    
    // Materiales que necesitan revisión
    const materialsNeedingCheck = activeMaterials.filter(m => {
      if (!m.lastChecked) return true;
      
      const lastCheck = new Date(m.lastChecked);
      const now = new Date();
      const daysSinceCheck = (now - lastCheck) / (1000 * 60 * 60 * 24);
      
      switch (m.checklistFrequency) {
        case 'daily': return daysSinceCheck >= 1;
        case 'weekly': return daysSinceCheck >= 7;
        case 'monthly': return daysSinceCheck >= 30;
        default: return false;
      }
    });
    
    // Incidentes recientes
    const recentIncidents = this.incidents
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    return {
      success: true,
      data: {
        totalProtocols: activeProtocols.length,
        protocolsByCategory: activeProtocols.reduce((acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {}),
        totalMaterials: activeMaterials.length,
        mandatoryMaterials: mandatoryMaterials.length,
        materialsNeedingCheck: materialsNeedingCheck.length,
        totalIncidents: this.incidents.length,
        openIncidents: this.incidents.filter(i => i.status === 'open').length,
        incidentsByCategory,
        incidentsBySeverity,
        recentIncidents,
        averageResolutionTime: this.calculateAverageResolutionTime()
      }
    };
  }

  calculateAverageResolutionTime() {
    const closedIncidents = this.incidents.filter(i => i.status === 'closed' && i.closedAt);
    
    if (closedIncidents.length === 0) return 0;
    
    const totalTime = closedIncidents.reduce((sum, i) => {
      const created = new Date(i.createdAt);
      const closed = new Date(i.closedAt);
      return sum + (closed - created);
    }, 0);
    
    const averageMs = totalTime / closedIncidents.length;
    const averageMinutes = Math.round(averageMs / (1000 * 60));
    
    return averageMinutes;
  }

  // Exportación
  async exportProtocolsPDF() {
    await this.simulateDelay(1500);
    
    // En producción esto generaría un PDF real
    console.log('[MOCK] Exportando protocolos a PDF');
    
    return {
      success: true,
      message: 'Protocolos exportados exitosamente'
    };
  }

  async exportMaterialsChecklist() {
    await this.simulateDelay(1000);
    
    // En producción esto generaría un checklist
    console.log('[MOCK] Exportando checklist de materiales');
    
    return {
      success: true,
      message: 'Checklist exportado exitosamente'
    };
  }

  async exportIncidentsReport(filters = {}) {
    await this.simulateDelay(1500);
    
    // En producción esto generaría un reporte
    console.log('[MOCK] Exportando reporte de incidentes', filters);
    
    return {
      success: true,
      message: 'Reporte exportado exitosamente'
    };
  }
}

export const mockEmergencyService = new MockEmergencyService();
export default mockEmergencyService;