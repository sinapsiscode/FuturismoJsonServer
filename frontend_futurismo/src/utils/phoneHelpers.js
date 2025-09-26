/**
 * Helpers para manejo de números de teléfono peruanos
 */

/**
 * Formatea el valor del input para que solo acepte números que empiecen con 9
 * @param {string} value - Valor del input
 * @returns {string} - Valor formateado
 */
export const formatPhoneInput = (value) => {
  // Eliminar todos los caracteres que no sean números
  const cleanValue = value.replace(/[^0-9]/g, '');
  
  // Si está vacío, retornar vacío
  if (cleanValue === '') return '';
  
  // Si el primer dígito no es 9, no permitir
  if (cleanValue[0] !== '9') return '';
  
  // Limitar a 9 dígitos
  return cleanValue.slice(0, 9);
};

/**
 * Valida si un número de teléfono es válido (9 dígitos empezando con 9)
 * @param {string} phone - Número de teléfono
 * @returns {boolean} - true si es válido
 */
export const isValidPhone = (phone) => {
  return /^9\d{8}$/.test(phone);
};

/**
 * Obtiene el mensaje de error para un teléfono inválido
 * @param {string} phone - Número de teléfono
 * @returns {string|null} - Mensaje de error o null si es válido
 */
export const getPhoneError = (phone) => {
  if (!phone) {
    return 'El teléfono es requerido';
  }
  
  if (phone.length < 9) {
    return `Faltan ${9 - phone.length} dígitos`;
  }
  
  if (phone[0] !== '9') {
    return 'El teléfono debe empezar con 9';
  }
  
  if (!isValidPhone(phone)) {
    return 'El teléfono debe tener 9 dígitos y empezar con 9';
  }
  
  return null;
};

/**
 * Props comunes para inputs de teléfono
 */
export const phoneInputProps = {
  type: 'tel',
  placeholder: '9XXXXXXXX (9 dígitos)',
  maxLength: '9',
  pattern: '9[0-9]{8}',
  autoComplete: 'tel'
};

/**
 * Handler para onChange de inputs de teléfono
 * @param {function} setter - Función para actualizar el estado
 * @returns {function} - Handler para onChange
 */
export const createPhoneChangeHandler = (setter) => {
  return (e) => {
    const formattedValue = formatPhoneInput(e.target.value);
    setter(formattedValue);
  };
};