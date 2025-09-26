// Funciones auxiliares para manejo de fechas

export const generateWeekDates = (startDate) => {
  const dates = [];
  const start = new Date(startDate);
  const dayOfWeek = start.getDay();
  const monday = new Date(start);
  monday.setDate(start.getDate() - dayOfWeek + 1);

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

export const generateMonthDates = (startDate) => {
  const dates = [];
  const start = new Date(startDate);
  const year = start.getFullYear();
  const month = start.getMonth();
  
  // Primer día del mes
  const firstDay = new Date(year, month, 1);
  
  // Encontrar el lunes de la primera semana
  const startOfCalendar = new Date(firstDay);
  const dayOfWeek = firstDay.getDay();
  startOfCalendar.setDate(firstDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  
  // Generar todas las fechas necesarias para llenar el calendario (6 semanas)
  for (let i = 0; i < 42; i++) {
    const date = new Date(startOfCalendar);
    date.setDate(startOfCalendar.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

export const getDayNames = (locale = 'es', format = 'short') => {
  const baseDate = new Date(2024, 0, 1); // Un lunes
  const dayNames = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    
    if (format === 'short') {
      dayNames.push(date.toLocaleDateString(locale, { weekday: 'short' }));
    } else {
      dayNames.push(date.toLocaleDateString(locale, { weekday: 'long' }));
    }
  }
  
  return dayNames;
};

export const formatDate = (dateString, locale = 'es') => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const isToday = (dateString) => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

export const isPastDate = (dateString) => {
  const today = new Date().toISOString().split('T')[0];
  return dateString < today;
};

export const isFutureDate = (dateString) => {
  const today = new Date().toISOString().split('T')[0];
  return dateString > today;
};

export const getMonthName = (date, locale = 'es') => {
  return new Date(date).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
};

export const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const addWeeks = (dateString, weeks) => {
  return addDays(dateString, weeks * 7);
};

export const addMonths = (dateString, months) => {
  const date = new Date(dateString);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
};