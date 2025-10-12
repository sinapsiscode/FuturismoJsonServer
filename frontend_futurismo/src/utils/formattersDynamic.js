/**
 * Formateadores dinámicos que usan configuración del servidor
 * Reemplaza formatos hardcodeados por formatos basados en config
 */

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppConfigStore } from '../stores/appConfigStore';

/**
 * Obtener formatos de fecha desde la configuración
 */
export const getDateFormats = () => {
  const { system } = useAppConfigStore.getState();
  return system?.dateFormats || {
    DEFAULT: 'DD/MM/YYYY',
    ISO: 'YYYY-MM-DD',
    US: 'MM/DD/YYYY',
    TIME_12H: '12h',
    TIME_24H: '24h',
    DATETIME: 'DD/MM/YYYY HH:mm',
    DATETIME_US: 'MM/DD/YYYY HH:mm'
  };
};

/**
 * Obtener monedas desde la configuración
 */
export const getCurrencies = () => {
  const { system } = useAppConfigStore.getState();
  return system?.currencies || [];
};

/**
 * Obtener moneda por defecto
 */
export const getDefaultCurrency = () => {
  const currencies = getCurrencies();
  const defaultCurrency = currencies.find(c => c.default);
  return defaultCurrency?.value || 'PEN';
};

/**
 * Formatea una fecha según el formato configurado
 */
export const formatDate = (date, formatStr = null) => {
  if (!date) return '';

  const dateFormats = getDateFormats();
  const formatToUse = formatStr || dateFormats.DEFAULT || 'dd/MM/yyyy';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) return '';

  return format(dateObj, formatToUse, { locale: es });
};

/**
 * Formatea una fecha con hora
 */
export const formatDateTime = (date) => {
  const dateFormats = getDateFormats();
  return formatDate(date, dateFormats.DATETIME || 'dd/MM/yyyy HH:mm');
};

/**
 * Formatea una fecha relativa (hace 2 horas, etc.)
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) return '';

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: es
  });
};

/**
 * Formatea un número como moneda usando configuración dinámica
 */
export const formatCurrency = (amount, currencyCode = null) => {
  if (typeof amount !== 'number') return '';

  const currency = currencyCode || getDefaultCurrency();
  const currencies = getCurrencies();
  const currencyConfig = currencies.find(c => c.value === currency);

  if (currencyConfig) {
    // Si tenemos la configuración, usar el símbolo personalizado
    return `${currencyConfig.symbol} ${formatNumber(amount, 2)}`;
  }

  // Fallback a Intl.NumberFormat
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (number, decimals = 0) => {
  if (typeof number !== 'number') return '';

  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '';

  return `${formatNumber(value, decimals)}%`;
};

/**
 * Formatea un número de teléfono
 */
export const formatPhone = (phone) => {
  if (!phone) return '';

  // Eliminar caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');

  // Formatear según la longitud
  if (cleaned.length === 9) {
    // Formato peruano: 999 999 999
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  } else if (cleaned.length === 11) {
    // Formato con código de país: +51 999 999 999
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
  }

  return phone;
};

/**
 * Formatea un nombre (capitaliza primera letra de cada palabra)
 */
export const formatName = (name) => {
  if (!name) return '';

  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formatea un código de servicio
 */
export const formatServiceCode = (code) => {
  if (!code) return '';

  // Asegurar formato: FT123456
  const cleaned = code.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (cleaned.length >= 2) {
    const letters = cleaned.substring(0, 2);
    const numbers = cleaned.substring(2).padStart(6, '0').substring(0, 6);
    return `${letters}${numbers}`;
  }

  return code;
};

/**
 * Formatea el tamaño de archivo
 */
export const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number' || bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formatea duración en horas y minutos
 */
export const formatDuration = (minutes) => {
  if (typeof minutes !== 'number' || minutes < 0) return '';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} h`;
  } else {
    return `${hours} h ${mins} min`;
  }
};

/**
 * Trunca un texto largo
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;

  return `${text.substring(0, maxLength)}...`;
};

/**
 * Formatea coordenadas GPS
 */
export const formatCoordinates = (lat, lng, decimals = 6) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return '';

  const latStr = lat.toFixed(decimals);
  const lngStr = lng.toFixed(decimals);
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  return `${Math.abs(lat).toFixed(decimals)}°${latDir}, ${Math.abs(lng).toFixed(decimals)}°${lngDir}`;
};

/**
 * Genera iniciales de un nombre
 */
export const getInitials = (name) => {
  if (!name) return '';

  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Formatea un rango de fechas
 */
export const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (!start || !end) return '';

  if (start === end) {
    return start;
  }

  return `${start} - ${end}`;
};

/**
 * Pluraliza una palabra según la cantidad
 */
export const pluralize = (count, singular, plural = null) => {
  if (count === 1) return `${count} ${singular}`;

  return `${count} ${plural || singular + 's'}`;
};

/**
 * Formatea solo la hora de una fecha
 */
export const formatTime = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) return '';

  return format(dateObj, 'HH:mm');
};

/**
 * Verifica si es hora válida para reserva directa de fullday
 * usando configuración dinámica
 */
export const canBookDirectly = () => {
  const { app } = useAppConfigStore.getState();
  const cutoffHour = app?.limits?.whatsapp_cutoff_hour || 17; // 5 PM por defecto

  const now = new Date();
  const currentHour = now.getHours();
  return currentHour < cutoffHour;
};

/**
 * Genera URL de WhatsApp para consultar disponibilidad
 */
export const generateWhatsAppURL = (customMessage = null) => {
  const { app } = useAppConfigStore.getState();
  const whatsappNumber = app?.external?.whatsappNumber || '+51999888777';
  const defaultMessage = 'Hola, necesito consultar disponibilidad para un tour fullday';

  const message = customMessage || defaultMessage;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
};

// Exportar todos los formatters agrupados
export const formatters = {
  formatCoordinates,
  formatCurrency,
  formatDate,
  formatDateRange,
  formatDateTime,
  formatDuration,
  formatFileSize,
  formatName,
  formatNumber,
  formatPercentage,
  formatPhone,
  formatRelativeTime,
  formatServiceCode,
  formatTime,
  getInitials,
  pluralize,
  truncateText,
  canBookDirectly,
  generateWhatsAppURL,
  getDateFormats,
  getCurrencies,
  getDefaultCurrency
};

export default formatters;
