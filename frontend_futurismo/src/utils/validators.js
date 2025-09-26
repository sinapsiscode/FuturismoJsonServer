import * as yup from 'yup';
import { LIMITS, REGEX_PATTERNS } from './constants';

// Esquemas de validación con Yup

// Validación de login
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  remember: yup.boolean()
});

// Validación de registro para guía freelance
export const freelanceGuideRegisterSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es requerido'),
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma la contraseña'),
  phone: yup
    .string()
    .matches(REGEX_PATTERNS.PHONE, 'El teléfono debe tener 9 dígitos y empezar con 9')
    .required('El teléfono es requerido'),
  dni: yup
    .string()
    .matches(/^\d{8}$/, 'DNI debe tener 8 dígitos')
    .required('El DNI es requerido'),
  city: yup
    .string()
    .required('La ciudad es requerida'),
  languages: yup
    .array()
    .min(1, 'Debe seleccionar al menos un idioma')
    .required('Los idiomas son requeridos'),
  experience: yup
    .number()
    .min(0, 'La experiencia no puede ser negativa')
    .max(50, 'La experiencia no puede ser mayor a 50 años')
    .required('La experiencia es requerida'),
  specialties: yup
    .array()
    .min(1, 'Debe seleccionar al menos una especialidad')
    .required('Las especialidades son requeridas'),
  museums: yup
    .array()
    .optional(),
  museumExperiences: yup
    .object()
    .optional(),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'Debe aceptar los términos y condiciones')
    .required('Debe aceptar los términos y condiciones'),
  profileImage: yup
    .mixed()
    .nullable()
    .test('fileSize', 'El archivo es demasiado grande (máx. 5MB)', value => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Formato de imagen no válido', value => {
      if (!value) return true;
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(value.type);
    })
});

// Validación de datos de turista
export const touristSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es requerido'),
  passport: yup
    .string()
    .matches(REGEX_PATTERNS.PASSPORT, 'Formato de pasaporte inválido')
    .required('El pasaporte es requerido'),
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido')
});

// Validación de reserva base
export const reservationBaseSchema = yup.object().shape({
  serviceType: yup
    .string()
    .oneOf(['transfer', 'tour', 'package', 'custom'], 'Tipo de servicio inválido')
    .required('El tipo de servicio es requerido'),
  date: yup
    .date()
    .min(new Date(), 'La fecha no puede ser anterior a hoy')
    .required('La fecha es requerida'),
  time: yup
    .string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido')
    .required('La hora es requerida'),
  touristsCount: yup
    .number()
    .min(LIMITS.MIN_TOURISTS, `Mínimo ${LIMITS.MIN_TOURISTS} turista`)
    .max(LIMITS.MAX_TOURISTS, `Máximo ${LIMITS.MAX_TOURISTS} turistas`)
    .required('La cantidad de turistas es requerida')
});

// Validación específica para transfer
export const transferSchema = reservationBaseSchema.concat(
  yup.object().shape({
    origin: yup.string().required('El origen es requerido'),
    destination: yup.string().required('El destino es requerido'),
    flightNumber: yup.string(),
    specialRequirements: yup.string().max(500, 'Máximo 500 caracteres')
  })
);

// Validación específica para tour
export const tourSchema = reservationBaseSchema.concat(
  yup.object().shape({
    tourName: yup.string().required('El nombre del tour es requerido'),
    duration: yup
      .number()
      .min(LIMITS.MIN_SERVICE_DURATION, `Mínimo ${LIMITS.MIN_SERVICE_DURATION} hora`)
      .max(LIMITS.MAX_SERVICE_DURATION, `Máximo ${LIMITS.MAX_SERVICE_DURATION} horas`)
      .required('La duración es requerida'),
    pickupLocation: yup.string().required('El lugar de recojo es requerido'),
    includesLunch: yup.boolean(),
    specialRequirements: yup.string().max(500, 'Máximo 500 caracteres')
  })
);

// Validación específica para paquete
export const packageSchema = reservationBaseSchema.concat(
  yup.object().shape({
    packageName: yup.string().required('El nombre del paquete es requerido'),
    days: yup
      .number()
      .min(2, 'Mínimo 2 días')
      .max(30, 'Máximo 30 días')
      .required('La cantidad de días es requerida'),
    accommodation: yup.string().required('El tipo de alojamiento es requerido'),
    mealPlan: yup.string().required('El plan de comidas es requerido'),
    specialRequirements: yup.string().max(500, 'Máximo 500 caracteres')
  })
);

// Validación de perfil de agencia
export const agencyProfileSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es requerido'),
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  phone: yup
    .string()
    .matches(REGEX_PATTERNS.PHONE, 'El teléfono debe tener 9 dígitos y empezar con 9')
    .required('El teléfono es requerido'),
  address: yup.string().required('La dirección es requerida'),
  contactPerson: yup.string().required('La persona de contacto es requerida')
});

// Validación de cambio de contraseña
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('La contraseña actual es requerida'),
  newPassword: yup
    .string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
    .notOneOf([yup.ref('currentPassword')], 'La nueva contraseña debe ser diferente a la actual')
    .required('La nueva contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
    .required('Confirma la nueva contraseña')
});

// Funciones de validación personalizadas

/**
 * Valida si un archivo es una imagen válida
 */
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!file) {
    return { valid: false, error: 'No se ha seleccionado ningún archivo' };
  }
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Formato de imagen no válido' };
  }
  
  if (file.size > LIMITS.MAX_FILE_SIZE) {
    return { valid: false, error: 'El archivo es demasiado grande (máx. 5MB)' };
  }
  
  return { valid: true };
};

/**
 * Valida un código de servicio
 */
export const validateServiceCode = (code) => {
  if (!code) {
    return { valid: false, error: 'El código es requerido' };
  }
  
  if (!REGEX_PATTERNS.SERVICE_CODE.test(code)) {
    return { valid: false, error: 'Formato de código inválido (ej: FT123456)' };
  }
  
  return { valid: true };
};

/**
 * Valida una lista de turistas
 */
export const validateTouristsList = async (tourists) => {
  if (!tourists || tourists.length === 0) {
    return { valid: false, error: 'Debe agregar al menos un turista' };
  }
  
  if (tourists.length > LIMITS.MAX_TOURISTS) {
    return { valid: false, error: `Máximo ${LIMITS.MAX_TOURISTS} turistas permitidos` };
  }
  
  try {
    // Validar cada turista con el esquema
    for (let i = 0; i < tourists.length; i++) {
      await touristSchema.validate(tourists[i]);
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Valida fechas de disponibilidad
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

// Funciones de validación básicas
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Eliminar espacios, guiones y puntos
  const cleanPhone = phone.replace(/[\s.-]/g, '');
  // Validar que tenga exactamente 9 dígitos y empiece con 9
  const phoneRegex = /^9\d{8}$/;
  return phoneRegex.test(cleanPhone);
};

export const validateRUC = (ruc) => {
  return /^\d{11}$/.test(ruc);
};

export const validateDNI = (dni) => {
  return /^\d{8}$/.test(dni);
};

export const validateName = (name) => {
  return name && name.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateCreditCard = (number) => {
  const cleaned = number.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
};

export const validateRequiredField = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export const validateMinLength = (value, min) => {
  return value && value.length >= min;
};

export const validateMaxLength = (value, max) => {
  return value && value.length <= max;
};

export const validateNumberRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const validateFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate >= today;
};

// Exportar todos los validators agrupados
export const validators = {
  validateEmail,
  validatePhone,
  validateRUC,
  validateDNI,
  validateName,
  validatePassword,
  validateCreditCard,
  validateRequiredField,
  validateMinLength,
  validateMaxLength,
  validateNumberRange,
  validateFutureDate,
  validateDateRange
};