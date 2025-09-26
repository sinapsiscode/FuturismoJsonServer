/**
 * Constantes para la gestión de vehículos
 */

// Estados del vehículo
export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  REPAIR: 'repair',
  INACTIVE: 'inactive',
  RESERVED: 'reserved'
};

// Labels para estados
export const VEHICLE_STATUS_LABELS = {
  [VEHICLE_STATUS.ACTIVE]: 'Activo',
  [VEHICLE_STATUS.MAINTENANCE]: 'En Mantenimiento',
  [VEHICLE_STATUS.REPAIR]: 'En Reparación',
  [VEHICLE_STATUS.INACTIVE]: 'Inactivo',
  [VEHICLE_STATUS.RESERVED]: 'Reservado'
};

// Colores para estados
export const VEHICLE_STATUS_COLORS = {
  [VEHICLE_STATUS.ACTIVE]: 'green',
  [VEHICLE_STATUS.MAINTENANCE]: 'yellow',
  [VEHICLE_STATUS.REPAIR]: 'orange',
  [VEHICLE_STATUS.INACTIVE]: 'gray',
  [VEHICLE_STATUS.RESERVED]: 'blue'
};

// Tipos de vehículo
export const VEHICLE_TYPES = {
  VAN: 'van',
  MINIBUS: 'minibus',
  BUS: 'bus',
  CAR: 'car',
  SUV: 'suv',
  PICKUP: 'pickup'
};

// Labels para tipos
export const VEHICLE_TYPE_LABELS = {
  [VEHICLE_TYPES.VAN]: 'Van/Combi',
  [VEHICLE_TYPES.MINIBUS]: 'Minibús',
  [VEHICLE_TYPES.BUS]: 'Bus',
  [VEHICLE_TYPES.CAR]: 'Auto',
  [VEHICLE_TYPES.SUV]: 'SUV/4x4',
  [VEHICLE_TYPES.PICKUP]: 'Camioneta'
};

// Capacidad por tipo
export const VEHICLE_CAPACITY = {
  [VEHICLE_TYPES.VAN]: { min: 8, max: 15 },
  [VEHICLE_TYPES.MINIBUS]: { min: 16, max: 25 },
  [VEHICLE_TYPES.BUS]: { min: 26, max: 60 },
  [VEHICLE_TYPES.CAR]: { min: 2, max: 4 },
  [VEHICLE_TYPES.SUV]: { min: 4, max: 7 },
  [VEHICLE_TYPES.PICKUP]: { min: 2, max: 5 }
};

// Tipo de combustible
export const FUEL_TYPES = {
  GASOLINE: 'gasoline',
  DIESEL: 'diesel',
  GAS: 'gas',
  HYBRID: 'hybrid',
  ELECTRIC: 'electric'
};

// Labels para combustible
export const FUEL_TYPE_LABELS = {
  [FUEL_TYPES.GASOLINE]: 'Gasolina',
  [FUEL_TYPES.DIESEL]: 'Diésel',
  [FUEL_TYPES.GAS]: 'GLP/GNV',
  [FUEL_TYPES.HYBRID]: 'Híbrido',
  [FUEL_TYPES.ELECTRIC]: 'Eléctrico'
};

// Estados de documentos
export const VEHICLE_DOCUMENT_STATUS = {
  VALID: 'valid',
  EXPIRING_SOON: 'expiring_soon',
  EXPIRED: 'expired'
};

// Tipos de documentos del vehículo
export const VEHICLE_DOCUMENTS = {
  SOAT: 'soat',
  TECHNICAL_REVIEW: 'technical_review',
  CIRCULATION_PERMIT: 'circulation_permit',
  INSURANCE: 'insurance'
};

// Labels para documentos
export const VEHICLE_DOCUMENT_LABELS = {
  [VEHICLE_DOCUMENTS.SOAT]: 'SOAT',
  [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: 'Revisión Técnica',
  [VEHICLE_DOCUMENTS.CIRCULATION_PERMIT]: 'Permiso de Circulación',
  [VEHICLE_DOCUMENTS.INSURANCE]: 'Seguro Vehicular'
};

// Días para alertar antes del vencimiento
export const VEHICLE_DOCUMENT_ALERTS = {
  [VEHICLE_DOCUMENTS.SOAT]: 30,
  [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: 30,
  [VEHICLE_DOCUMENTS.CIRCULATION_PERMIT]: 45,
  [VEHICLE_DOCUMENTS.INSURANCE]: 30
};

// Características del vehículo
export const VEHICLE_FEATURES = {
  AIR_CONDITIONING: 'air_conditioning',
  HEATING: 'heating',
  GPS: 'gps',
  WIFI: 'wifi',
  USB_CHARGERS: 'usb_chargers',
  MICROPHONE: 'microphone',
  FIRST_AID_KIT: 'first_aid_kit',
  WHEELCHAIR_ACCESS: 'wheelchair_access',
  LUGGAGE_COMPARTMENT: 'luggage_compartment',
  RECLINING_SEATS: 'reclining_seats'
};

// Labels para características
export const VEHICLE_FEATURE_LABELS = {
  [VEHICLE_FEATURES.AIR_CONDITIONING]: 'Aire Acondicionado',
  [VEHICLE_FEATURES.HEATING]: 'Calefacción',
  [VEHICLE_FEATURES.GPS]: 'GPS',
  [VEHICLE_FEATURES.WIFI]: 'WiFi',
  [VEHICLE_FEATURES.USB_CHARGERS]: 'Cargadores USB',
  [VEHICLE_FEATURES.MICROPHONE]: 'Micrófono',
  [VEHICLE_FEATURES.FIRST_AID_KIT]: 'Botiquín',
  [VEHICLE_FEATURES.WHEELCHAIR_ACCESS]: 'Acceso Silla de Ruedas',
  [VEHICLE_FEATURES.LUGGAGE_COMPARTMENT]: 'Compartimento de Equipaje',
  [VEHICLE_FEATURES.RECLINING_SEATS]: 'Asientos Reclinables'
};

// Validaciones
export const VEHICLE_VALIDATIONS = {
  PLATE_MIN_LENGTH: 6,
  PLATE_MAX_LENGTH: 8,
  BRAND_MIN_LENGTH: 2,
  BRAND_MAX_LENGTH: 50,
  MODEL_MIN_LENGTH: 2,
  MODEL_MAX_LENGTH: 50,
  MIN_YEAR: 2000,
  MAX_YEAR: new Date().getFullYear() + 1,
  MIN_CAPACITY: 1,
  MAX_CAPACITY: 60,
  MIN_MILEAGE: 0,
  MAX_MILEAGE: 9999999
};

// Intervalos de mantenimiento (en km)
export const MAINTENANCE_INTERVALS = {
  OIL_CHANGE: 5000,
  TIRE_ROTATION: 10000,
  BRAKE_CHECK: 20000,
  GENERAL_SERVICE: 15000
};

// Labels para mantenimiento
export const MAINTENANCE_TYPE_LABELS = {
  OIL_CHANGE: 'Cambio de Aceite',
  TIRE_ROTATION: 'Rotación de Llantas',
  BRAKE_CHECK: 'Revisión de Frenos',
  GENERAL_SERVICE: 'Servicio General'
};

// Configuración de paginación
export const VEHICLES_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Opciones de ordenamiento
export const VEHICLE_SORT_OPTIONS = {
  PLATE_ASC: { field: 'plate', order: 'asc', label: 'Placa (A-Z)' },
  PLATE_DESC: { field: 'plate', order: 'desc', label: 'Placa (Z-A)' },
  BRAND_ASC: { field: 'brand', order: 'asc', label: 'Marca (A-Z)' },
  CAPACITY_DESC: { field: 'capacity', order: 'desc', label: 'Mayor Capacidad' },
  CAPACITY_ASC: { field: 'capacity', order: 'asc', label: 'Menor Capacidad' },
  YEAR_DESC: { field: 'year', order: 'desc', label: 'Más Nuevos' },
  YEAR_ASC: { field: 'year', order: 'asc', label: 'Más Antiguos' }
};

// Mensajes
export const VEHICLE_MESSAGES = {
  CREATE_SUCCESS: 'Vehículo creado exitosamente',
  UPDATE_SUCCESS: 'Vehículo actualizado exitosamente',
  DELETE_SUCCESS: 'Vehículo eliminado exitosamente',
  CREATE_ERROR: 'Error al crear vehículo',
  UPDATE_ERROR: 'Error al actualizar vehículo',
  DELETE_ERROR: 'Error al eliminar vehículo',
  FETCH_ERROR: 'Error al cargar vehículos',
  DUPLICATE_PLATE: 'Ya existe un vehículo con esa placa',
  MAINTENANCE_REQUIRED: 'El vehículo requiere mantenimiento',
  DOCUMENTS_EXPIRED: 'El vehículo tiene documentos vencidos',
  ASSIGN_SUCCESS: 'Vehículo asignado exitosamente',
  ASSIGN_ERROR: 'Error al asignar vehículo',
  NOT_AVAILABLE: 'El vehículo no está disponible en esa fecha',
  CAPACITY_EXCEEDED: 'La capacidad del vehículo es insuficiente'
};

// Métricas del vehículo
export const VEHICLE_METRICS = {
  GOOD_FUEL_EFFICIENCY: 15, // km/l
  AVERAGE_FUEL_EFFICIENCY: 10,
  POOR_FUEL_EFFICIENCY: 7,
  HIGH_MILEAGE_THRESHOLD: 200000, // km
  MAINTENANCE_COST_HIGH: 1000, // soles/mes
  MAINTENANCE_COST_AVERAGE: 500
};