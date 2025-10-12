/**
 * Validadores dinámicos que usan configuración del servidor
 * Reemplaza validaciones hardcodeadas por validaciones basadas en config
 */

import { useAppConfigStore } from '../stores/appConfigStore';

/**
 * Obtener patrones de validación desde la configuración
 */
export const getValidationPatterns = () => {
  const { system } = useAppConfigStore.getState();
  return system?.validationPatterns || {};
};

/**
 * Obtener límites desde la configuración
 */
export const getLimits = () => {
  const { system, app } = useAppConfigStore.getState();
  return {
    // De system config
    fileSizeLimits: system?.fileSizeLimits || {},
    acceptedFileTypes: system?.acceptedFileTypes || {},

    // De app config
    maxFileSize: app?.limits?.maxFileSize || 10485760,
    allowedFileTypes: app?.limits?.allowedFileTypes || [],
    maxUploadFiles: app?.limits?.maxUploadFiles || 10
  };
};

/**
 * Validación de email usando patrón dinámico
 */
export const validateEmail = (email) => {
  const patterns = getValidationPatterns();
  const emailPattern = patterns.EMAIL || '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
  const regex = new RegExp(emailPattern);
  return regex.test(email);
};

/**
 * Validación de teléfono usando patrón dinámico
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  const patterns = getValidationPatterns();
  const phonePattern = patterns.PHONE || '^9\\d{8}$';

  // Limpiar el teléfono
  const cleanPhone = phone.replace(/[\s.-]/g, '');
  const regex = new RegExp(phonePattern);
  return regex.test(cleanPhone);
};

/**
 * Validación de DNI usando patrón dinámico
 */
export const validateDNI = (dni) => {
  const patterns = getValidationPatterns();
  const dniPattern = patterns.DNI || '^\\d{8}$';
  const regex = new RegExp(dniPattern);
  return regex.test(dni);
};

/**
 * Validación de RUC usando patrón dinámico
 */
export const validateRUC = (ruc) => {
  const patterns = getValidationPatterns();
  const rucPattern = patterns.RUC || '^[0-9]{11}$';
  const regex = new RegExp(rucPattern);
  return regex.test(ruc);
};

/**
 * Validación de URL usando patrón dinámico
 */
export const validateURL = (url) => {
  const patterns = getValidationPatterns();
  const urlPattern = patterns.URL || '^(https?:\\/\\/)?([\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$';
  const regex = new RegExp(urlPattern);
  return regex.test(url);
};

/**
 * Validación de username usando patrón dinámico
 */
export const validateUsername = (username) => {
  const patterns = getValidationPatterns();
  const usernamePattern = patterns.USERNAME || '^[a-zA-Z0-9_]+$';
  const regex = new RegExp(usernamePattern);
  return regex.test(username);
};

/**
 * Validación de nombre
 */
export const validateName = (name) => {
  return name && name.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
};

/**
 * Validación de contraseña
 */
export const validatePassword = (password) => {
  const { app } = useAppConfigStore.getState();
  const minLength = app?.security?.passwordMinLength || 6;
  return password && password.length >= minLength;
};

/**
 * Validación de tarjeta de crédito
 */
export const validateCreditCard = (number) => {
  const cleaned = number.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
};

/**
 * Validación de campo requerido
 */
export const validateRequiredField = (value) => {
  return value !== null && value !== undefined && value !== '';
};

/**
 * Validación de longitud mínima
 */
export const validateMinLength = (value, min) => {
  return value && value.length >= min;
};

/**
 * Validación de longitud máxima
 */
export const validateMaxLength = (value, max) => {
  return value && value.length <= max;
};

/**
 * Validación de rango numérico
 */
export const validateNumberRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validación de fecha futura
 */
export const validateFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate >= today;
};

/**
 * Validación de rango de fechas
 */
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return { valid: false, error: 'La fecha de inicio no puede ser anterior a hoy' };
  }

  if (end < start) {
    return { valid: false, error: 'La fecha de fin debe ser posterior a la fecha de inicio' };
  }

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 365) {
    return { valid: false, error: 'El rango de fechas no puede exceder un año' };
  }

  return { valid: true };
};

/**
 * Validación de archivo de imagen usando límites dinámicos
 */
export const validateImageFile = (file) => {
  const limits = getLimits();
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!file) {
    return { valid: false, error: 'No se ha seleccionado ningún archivo' };
  }

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Formato de imagen no válido' };
  }

  const maxSize = limits.fileSizeLimits.IMAGE || 5242880; // 5MB default
  if (file.size > maxSize) {
    return { valid: false, error: `El archivo es demasiado grande (máx. ${maxSize / 1024 / 1024}MB)` };
  }

  return { valid: true };
};

/**
 * Validación de código de servicio
 */
export const validateServiceCode = (code) => {
  if (!code) {
    return { valid: false, error: 'El código es requerido' };
  }

  // Patrón: 2 letras + 6 dígitos (ej: FT123456)
  if (!/^[A-Z]{2}[0-9]{6}$/.test(code)) {
    return { valid: false, error: 'Formato de código inválido (ej: FT123456)' };
  }

  return { valid: true };
};

// Exportar objeto con todas las validaciones para fácil acceso
export const validators = {
  validateEmail,
  validatePhone,
  validateDNI,
  validateRUC,
  validateURL,
  validateUsername,
  validateName,
  validatePassword,
  validateCreditCard,
  validateRequiredField,
  validateMinLength,
  validateMaxLength,
  validateNumberRange,
  validateFutureDate,
  validateDateRange,
  validateImageFile,
  validateServiceCode,
  getValidationPatterns,
  getLimits
};

export default validators;
