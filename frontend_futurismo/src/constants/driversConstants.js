/**
 * Constantes para la gestión de choferes
 */

// Categorías de licencia
export const LICENSE_CATEGORIES = {
  A_I: 'A-I',      // Motos
  A_IIA: 'A-IIa',  // Mototaxis
  A_IIB: 'A-IIb',  // Motos
  A_IIIA: 'A-IIIa', // Autos
  A_IIIB: 'A-IIIb', // Camionetas
  A_IIIC: 'A-IIIc', // Autos y camionetas
  B_I: 'B-I',      // Camiones pequeños
  B_IIA: 'B-IIa',  // Buses
  B_IIB: 'B-IIb',  // Buses turísticos
  B_IIC: 'B-IIc'   // Buses interprovinciales
};

// Labels para licencias
export const LICENSE_CATEGORY_LABELS = {
  [LICENSE_CATEGORIES.A_I]: 'A-I - Motocicletas',
  [LICENSE_CATEGORIES.A_IIA]: 'A-IIa - Mototaxis',
  [LICENSE_CATEGORIES.A_IIB]: 'A-IIb - Motocicletas',
  [LICENSE_CATEGORIES.A_IIIA]: 'A-IIIa - Autos particulares',
  [LICENSE_CATEGORIES.A_IIIB]: 'A-IIIb - Camionetas',
  [LICENSE_CATEGORIES.A_IIIC]: 'A-IIIc - Autos y camionetas',
  [LICENSE_CATEGORIES.B_I]: 'B-I - Camiones pequeños',
  [LICENSE_CATEGORIES.B_IIA]: 'B-IIa - Buses',
  [LICENSE_CATEGORIES.B_IIB]: 'B-IIb - Buses turísticos',
  [LICENSE_CATEGORIES.B_IIC]: 'B-IIc - Buses interprovinciales'
};

// Validaciones
export const DRIVER_VALIDATIONS = {
  NAME_MIN_LENGTH: 2,
  DNI_LENGTH: 8
};

// Mensajes
export const DRIVER_MESSAGES = {
  CREATE_SUCCESS: 'Chofer creado exitosamente',
  UPDATE_SUCCESS: 'Chofer actualizado exitosamente',
  DELETE_SUCCESS: 'Chofer eliminado exitosamente',
  CREATE_ERROR: 'Error al crear chofer',
  UPDATE_ERROR: 'Error al actualizar chofer',
  DELETE_ERROR: 'Error al eliminar chofer',
  FETCH_ERROR: 'Error al cargar choferes',
  DUPLICATE_LICENSE: 'Ya existe un chofer con esa licencia',
  DUPLICATE_DNI: 'Ya existe un chofer con ese DNI',
  LICENSE_EXPIRED: 'La licencia del chofer está vencida',
  ASSIGN_SUCCESS: 'Chofer asignado exitosamente',
  ASSIGN_ERROR: 'Error al asignar chofer',
  NOT_AVAILABLE: 'El chofer no está disponible en esa fecha'
};

// Helpers
export const getLicenseCategoryLabel = (category) => {
  return LICENSE_CATEGORY_LABELS[category] || category;
};