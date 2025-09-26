/**
 * Constantes para la gestión de clientes/agencias
 */

// Tipos de cliente
export const CLIENT_TYPES = {
  AGENCY: 'agency',
  COMPANY: 'company',
  INDIVIDUAL: 'individual'
};

// Labels para tipos
export const CLIENT_TYPE_LABELS = {
  [CLIENT_TYPES.AGENCY]: 'Agencia de Viajes',
  [CLIENT_TYPES.COMPANY]: 'Empresa',
  [CLIENT_TYPES.INDIVIDUAL]: 'Particular'
};

// Estados de cliente
export const CLIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

// Labels para estados
export const CLIENT_STATUS_LABELS = {
  [CLIENT_STATUS.ACTIVE]: 'Activo',
  [CLIENT_STATUS.INACTIVE]: 'Inactivo',
  [CLIENT_STATUS.SUSPENDED]: 'Suspendido',
  [CLIENT_STATUS.PENDING]: 'Pendiente'
};

// Colores para estados
export const CLIENT_STATUS_COLORS = {
  [CLIENT_STATUS.ACTIVE]: 'green',
  [CLIENT_STATUS.INACTIVE]: 'gray',
  [CLIENT_STATUS.SUSPENDED]: 'red',
  [CLIENT_STATUS.PENDING]: 'yellow'
};

// Tipos de documento
export const DOCUMENT_TYPES = {
  RUC: 'ruc',
  DNI: 'dni',
  PASSPORT: 'passport',
  OTHER: 'other'
};

// Labels para documentos
export const DOCUMENT_TYPE_LABELS = {
  [DOCUMENT_TYPES.RUC]: 'RUC',
  [DOCUMENT_TYPES.DNI]: 'DNI',
  [DOCUMENT_TYPES.PASSPORT]: 'Pasaporte',
  [DOCUMENT_TYPES.OTHER]: 'Otro'
};

// Campos requeridos por tipo de cliente
export const REQUIRED_FIELDS_BY_TYPE = {
  [CLIENT_TYPES.AGENCY]: ['name', 'documentType', 'documentNumber', 'email', 'phone', 'address', 'contact'],
  [CLIENT_TYPES.COMPANY]: ['name', 'documentType', 'documentNumber', 'email', 'phone', 'address', 'contact'],
  [CLIENT_TYPES.INDIVIDUAL]: ['name', 'documentType', 'documentNumber', 'email', 'phone']
};

// Validaciones
export const CLIENT_VALIDATIONS = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  DOCUMENT_MIN_LENGTH: 8,
  DOCUMENT_MAX_LENGTH: 20,
  PHONE_MIN_LENGTH: 9,
  PHONE_MAX_LENGTH: 15,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  RUC_LENGTH: 11
};

// Tipos de comisión
export const COMMISSION_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
};

// Labels para comisión
export const COMMISSION_TYPE_LABELS = {
  [COMMISSION_TYPES.PERCENTAGE]: 'Porcentaje',
  [COMMISSION_TYPES.FIXED]: 'Monto Fijo'
};

// Configuración de paginación
export const CLIENTS_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Opciones de ordenamiento
export const CLIENT_SORT_OPTIONS = {
  NAME_ASC: { field: 'name', order: 'asc', label: 'Nombre (A-Z)' },
  NAME_DESC: { field: 'name', order: 'desc', label: 'Nombre (Z-A)' },
  CREATED_DESC: { field: 'createdAt', order: 'desc', label: 'Más recientes' },
  CREATED_ASC: { field: 'createdAt', order: 'asc', label: 'Más antiguos' }
};

// Mensajes
export const CLIENT_MESSAGES = {
  CREATE_SUCCESS: 'Cliente creado exitosamente',
  UPDATE_SUCCESS: 'Cliente actualizado exitosamente',
  DELETE_SUCCESS: 'Cliente eliminado exitosamente',
  CREATE_ERROR: 'Error al crear cliente',
  UPDATE_ERROR: 'Error al actualizar cliente',
  DELETE_ERROR: 'Error al eliminar cliente',
  FETCH_ERROR: 'Error al cargar clientes',
  DUPLICATE_DOCUMENT: 'Ya existe un cliente con ese número de documento',
  INVALID_EMAIL: 'El email ingresado no es válido',
  INVALID_DOCUMENT: 'El número de documento no es válido'
};