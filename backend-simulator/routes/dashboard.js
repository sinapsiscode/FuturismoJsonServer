const express = require('express');
const _ = require('lodash');

module.exports = (router) => {
  const dashboardRouter = express.Router();

  // Get dashboard stats
  dashboardRouter.get('/stats', (req, res) => {
    try {
      const { role, userId } = req.query;
      const db = router.db;

      let stats = {};

      switch (role) {
        case 'admin':
          stats = getAdminStats(db);
          break;
        case 'agency':
          stats = getAgencyStats(db, userId);
          break;
        case 'guide':
          stats = getGuideStats(db, userId);
          break;
        default:
          stats = getBasicStats(db);
      }

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  });

  // Get monthly data for charts
  dashboardRouter.get('/monthly-data', (req, res) => {
    try {
      const { role, userId, months = 6 } = req.query;
      const db = router.db;

      let monthlyData = [];

      if (role === 'guide' && userId) {
        // Calcular datos mensuales específicos del guía
        monthlyData = getGuideMonthlyData(db, userId, parseInt(months));
      } else {
        // Datos genéricos para admin/agency
        const dashboardStats = db.get('dashboard_stats').value();
        monthlyData = dashboardStats && dashboardStats.line_data ? dashboardStats.line_data.map(item => ({
          month: item.name,
          revenue: item.ingresos,
          bookings: item.reservas,
          guides: Math.floor(item.turistas / 50)
        })) : [];
      }

      res.json({
        success: true,
        data: monthlyData
      });

    } catch (error) {
      console.error('Error al obtener datos mensuales:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos mensuales'
      });
    }
  });

  // Get chart data - CALCULADO DESDE DATOS REALES
  dashboardRouter.get('/chart-data', (req, res) => {
    try {
      const { type, timeRange } = req.query;
      const db = router.db;

      // Obtener datos reales
      const reservations = db.get('reservations').value() || [];
      const services = db.get('services').value() || [];
      const tours = db.get('tours').value() || [];

      // Calcular datos para gráficos
      const data = calculateChartData(reservations, services, tours, timeRange);

      res.json({
        success: true,
        data: data
      });

    } catch (error) {
      console.error('Error al obtener datos del gráfico:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos del gráfico',
        data: [] // Fallback vacío
      });
    }
  });

  // Get KPIs - CALCULADO DESDE DATOS REALES
  dashboardRouter.get('/kpis', (req, res) => {
    try {
      const { timeRange } = req.query;
      const db = router.db;

      // Obtener datos reales
      const reservations = db.get('reservations').value() || [];
      const services = db.get('services').value() || [];

      // Calcular KPIs reales
      const kpis = calculateKPIs(reservations, services, timeRange);

      res.json({
        success: true,
        data: kpis
      });

    } catch (error) {
      console.error('Error al obtener KPIs:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener KPIs',
        data: {
          totalReservas: { actual: 0, anterior: 0, crecimiento: 0 },
          totalTuristas: { actual: 0, anterior: 0, crecimiento: 0 },
          ingresosTotales: { actual: 0, anterior: 0, crecimiento: 0 }
        }
      });
    }
  });

  // Get summary data - CALCULADO DESDE DATOS REALES
  dashboardRouter.get('/summary', (req, res) => {
    try {
      const { timeRange } = req.query;
      const db = router.db;

      // Obtener datos reales
      const reservations = db.get('reservations').value() || [];
      const services = db.get('services').value() || [];
      const tours = db.get('tours').value() || [];

      // Calcular resumen real
      const summary = calculateSummary(reservations, services, tours, timeRange);

      res.json({
        success: true,
        data: summary
      });

    } catch (error) {
      console.error('Error al obtener resumen:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener resumen',
        data: {
          popularTour: 'Sin datos',
          avgPerBooking: 0,
          bestDay: 'Sin datos',
          conversionRate: 0
        }
      });
    }
  });

  // Get work zones
  dashboardRouter.get('/work-zones', (req, res) => {
    try {
      const db = router.db;
      const workZones = db.get('work_zones').value() || [];

      res.json({
        success: true,
        data: workZones
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener zonas de trabajo'
      });
    }
  });

  // Get tour types
  dashboardRouter.get('/tour-types', (req, res) => {
    try {
      const db = router.db;
      const tourTypes = db.get('tour_types').value() || [];

      res.json({
        success: true,
        data: tourTypes
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de tour'
      });
    }
  });

  // Get group types
  dashboardRouter.get('/group-types', (req, res) => {
    try {
      const db = router.db;
      const groupTypes = db.get('group_types').value() || [];

      res.json({
        success: true,
        data: groupTypes
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de grupo'
      });
    }
  });

  // Get languages
  dashboardRouter.get('/languages', (req, res) => {
    try {
      const db = router.db;
      const languages = db.get('languages').value() || [];

      res.json({
        success: true,
        data: languages
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener idiomas'
      });
    }
  });

  return dashboardRouter;
};

// Helper functions for different role stats
function getAdminStats(db) {
  const users = db.get('users').value() || [];
  const agencies = db.get('agencies').value() || [];
  const guides = db.get('guides').value() || [];
  const reservations = db.get('reservations').value() || [];
  const services = db.get('services').value() || [];
  const clients = db.get('clients').value() || [];

  // Calcular ingresos totales desde reservations (no desde financial_transactions que está vacío)
  const totalRevenue = _.sumBy(reservations, r => parseFloat(r.total_amount) || 0);

  // Calcular trends (simulados por ahora)
  const activeServices = services.filter(s => s.status === 'active').length;

  // Contar solo agencias activas
  const totalAgencies = agencies.filter(a => a.status !== 'inactive').length;

  // Total de clientes registrados
  const totalClients = clients.length;

  return {
    totalUsers: users.length,
    totalAgencies: totalAgencies,
    totalAgenciesTrend: calculateTrendPercentage(totalAgencies, Math.max(1, totalAgencies - 1)),
    totalGuides: guides.length,
    totalGuidesTrend: calculateTrendPercentage(guides.length, Math.max(1, guides.length - 2)),
    totalReservations: reservations.length,
    totalReservationsTrend: calculateTrendPercentage(reservations.length, Math.max(1, reservations.length - 5)),
    totalClients: totalClients,
    totalClientsTrend: calculateTrendPercentage(totalClients, Math.max(1, totalClients - 3)),
    monthlyRevenue: Math.round(totalRevenue),
    activeServices: activeServices,
    activeServicesTrend: calculateTrendPercentage(activeServices, Math.max(1, activeServices - 1)),
    totalRevenue: Math.round(totalRevenue),
    totalRevenueTrend: calculateTrendPercentage(totalRevenue, Math.max(100, totalRevenue * 0.9)),
    pendingReservations: reservations.filter(r => r.status === 'pending').length
  };
}

function getAgencyStats(db, userId) {
  const reservations = db.get('reservations').value() || [];
  const transactions = db.get('financial_transactions').value() || [];
  const tours = db.get('tours').value() || [];
  const services = db.get('services').value() || [];

  // Filter by agency (assuming we can get agency_id from user)
  const agencyReservations = reservations; // Simplified for demo

  // Calcular valores actuales
  const activeServices = services.filter(s => s.status === 'active').length;
  const completedToday = agencyReservations.filter(r => {
    const today = new Date().toDateString();
    const reservationDate = r.tour_date ? new Date(r.tour_date).toDateString() : '';
    return reservationDate === today && r.status === 'completed';
  }).length;
  const totalRevenue = _.sumBy(transactions, 'amount') || 0;
  const punctualityRate = 95.0; // Simulado por ahora

  return {
    totalReservations: agencyReservations.length,
    confirmedReservations: agencyReservations.filter(r => r.status === 'confirmed').length,
    pendingReservations: agencyReservations.filter(r => r.status === 'pending').length,
    monthlyRevenue: _.sumBy(transactions, 'amount') || 0,
    activeTours: tours.filter(t => t.status === 'active').length,
    totalClients: _.uniqBy(agencyReservations, 'client_id').length,

    // Stats para cards del dashboard
    activeServices: activeServices,
    activeServicesTrend: calculateTrendPercentage(activeServices, Math.max(1, activeServices - 2)),
    completedToday: completedToday,
    completedTodayTrend: calculateTrendPercentage(completedToday, Math.max(0, completedToday - 1)),
    totalRevenue: totalRevenue,
    totalRevenueTrend: calculateTrendPercentage(totalRevenue, Math.max(100, totalRevenue * 0.9)),
    punctualityRate: punctualityRate,
    punctualityRateTrend: calculateTrendPercentage(punctualityRate, punctualityRate - 2)
  };
}

function getGuideStats(db, userId) {
  try {
    console.log('🔍 [getGuideStats] UserId:', userId);
    const reservations = db.get('reservations').value() || [];
    const guides = db.get('guides').value() || [];
    console.log('📊 [getGuideStats] Total guides:', guides.length);

    // Find guide by user_id
    const guide = guides.find(g => g.user_id === userId);
    console.log('👤 [getGuideStats] Guide found:', guide ? guide.id : 'NOT FOUND');
    const guideReservations = guide ? reservations.filter(r => r.guide_id === guide.id) : [];
    console.log('📝 [getGuideStats] Guide reservations:', guideReservations.length);

  // Calcular valores actuales
  const toursCompleted = guideReservations.filter(r => r.status === 'completed').length;
  const upcomingTours = guideReservations.filter(r => r.status === 'confirmed').length;
  const monthlyIncome = _.sumBy(guideReservations, 'total_amount') || 0;
  const personalRating = guide ? guide.rating : 0;

  // Tours esta semana
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0); // Start of day
  const toursThisWeek = guideReservations.filter(r => {
    const tourDate = r.tour_date ? new Date(r.tour_date) : null;
    return tourDate && tourDate >= weekStart && r.status !== 'cancelled';
  }).length;

  // Siguiente tour
  const upcomingToursSorted = guideReservations
    .filter(r => r.status === 'confirmed' && r.tour_date)
    .sort((a, b) => new Date(a.tour_date) - new Date(b.tour_date));
  const nextTour = upcomingToursSorted.length > 0 ? upcomingToursSorted[0].tour_date : null;

  return {
    toursCompleted: toursCompleted,
    upcomingTours: upcomingTours,
    monthlyIncome: monthlyIncome,
    rating: personalRating,
    totalClients: _.uniqBy(guideReservations, 'client_id').length,

    // Stats para cards del dashboard
    toursThisWeek: toursThisWeek,
    toursThisWeekTrend: calculateTrendPercentage(toursThisWeek, Math.max(0, toursThisWeek - 1)),
    nextTour: nextTour,
    personalRating: personalRating,
    ratingTrend: calculateTrendPercentage(personalRating, Math.max(1, personalRating - 0.2)),
    monthlyIncomeTrend: calculateTrendPercentage(monthlyIncome, Math.max(50, monthlyIncome * 0.85))
  };
  } catch (error) {
    console.error('❌ [getGuideStats] Error:', error);
    throw error;
  }
}

function getBasicStats(db) {
  const reservations = db.get('reservations').value() || [];
  const guides = db.get('guides').value() || [];

  return {
    totalReservations: reservations.length,
    activeGuides: guides.filter(g => g.status === 'active').length,
    pendingServices: reservations.filter(r => r.status === 'pending').length
  };
}

// Helper function to calculate trend percentage
function calculateTrendPercentage(current, previous) {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const percentage = ((current - previous) / previous) * 100;
  return percentage >= 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`;
}

// Helper function to calculate chart data from real reservations
function calculateChartData(reservations, services, tours, timeRange = 'year') {
  const now = new Date();
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Si es semana, mostrar días de la semana actual
  if (timeRange === 'week') {
    const chartData = [];
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + i);
      const dayStart = new Date(targetDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Filtrar reservas del día
      const dayReservations = reservations.filter(r => {
        if (!r.created_at && !r.tour_date) return false;
        const reservationDate = new Date(r.created_at || r.tour_date);
        return reservationDate >= dayStart && reservationDate <= dayEnd;
      });

      // Calcular estadísticas del día
      const ingresos = _.sumBy(dayReservations, r => parseFloat(r.total_amount) || 0);
      const reservasCount = dayReservations.length;
      const turistas = _.sumBy(dayReservations, r => parseInt(r.group_size) || 1);

      chartData.push({
        name: `${dayNames[targetDate.getDay()]} ${targetDate.getDate()}`,
        ingresos: Math.round(ingresos),
        reservas: reservasCount,
        turistas: turistas,
        servicios: services.length
      });
    }

    return chartData;
  }

  // Determinar el número de meses a mostrar según el timeRange
  const monthsToShow = timeRange === 'year' ? 12 : timeRange === 'quarter' ? 3 : 1;

  const chartData = [];

  for (let i = monthsToShow - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

    // Filtrar reservas del mes
    const monthReservations = reservations.filter(r => {
      if (!r.created_at && !r.tour_date) return false;
      const reservationDate = new Date(r.created_at || r.tour_date);
      return reservationDate >= monthStart && reservationDate <= monthEnd;
    });

    // Calcular estadísticas del mes
    const ingresos = _.sumBy(monthReservations, r => parseFloat(r.total_amount) || 0);
    const reservasCount = monthReservations.length;
    const turistas = _.sumBy(monthReservations, r => parseInt(r.group_size) || 1);

    chartData.push({
      name: monthNames[targetDate.getMonth()],
      ingresos: Math.round(ingresos),
      reservas: reservasCount,
      turistas: turistas,
      servicios: services.length // Total de servicios disponibles
    });
  }

  return chartData;
}

// Helper function to calculate KPIs from real data
function calculateKPIs(reservations, services, timeRange = 'month') {
  const now = new Date();

  // Determinar los períodos actual y anterior
  let currentStart, currentEnd, previousStart, previousEnd;

  if (timeRange === 'week') {
    // Semana actual (lunes a domingo)
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    currentStart = monday;
    currentEnd = new Date(monday);
    currentEnd.setDate(monday.getDate() + 6);
    currentEnd.setHours(23, 59, 59, 999);

    // Semana anterior
    previousStart = new Date(monday);
    previousStart.setDate(monday.getDate() - 7);
    previousEnd = new Date(monday);
    previousEnd.setDate(monday.getDate() - 1);
    previousEnd.setHours(23, 59, 59, 999);
  } else if (timeRange === 'month') {
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    previousEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  } else if (timeRange === 'quarter') {
    const currentQuarter = Math.floor(now.getMonth() / 3);
    currentStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
    currentEnd = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
    previousStart = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
    previousEnd = new Date(now.getFullYear(), currentQuarter * 3, 0);
  } else { // year
    currentStart = new Date(now.getFullYear(), 0, 1);
    currentEnd = new Date(now.getFullYear(), 11, 31);
    previousStart = new Date(now.getFullYear() - 1, 0, 1);
    previousEnd = new Date(now.getFullYear() - 1, 11, 31);
  }

  // Filtrar reservas por período
  const filterByPeriod = (start, end) => {
    return reservations.filter(r => {
      if (!r.created_at && !r.tour_date) return false;
      const date = new Date(r.created_at || r.tour_date);
      return date >= start && date <= end;
    });
  };

  const currentReservations = filterByPeriod(currentStart, currentEnd);
  const previousReservations = filterByPeriod(previousStart, previousEnd);

  // Calcular KPIs actuales
  const totalReservasActual = currentReservations.length;
  const totalReservasAnterior = previousReservations.length;

  const totalTuristasActual = _.sumBy(currentReservations, r => parseInt(r.group_size) || 1);
  const totalTuristasAnterior = _.sumBy(previousReservations, r => parseInt(r.group_size) || 1);

  const ingresosTotalesActual = _.sumBy(currentReservations, r => parseFloat(r.total_amount) || 0);
  const ingresosTotalesAnterior = _.sumBy(previousReservations, r => parseFloat(r.total_amount) || 0);

  // Calcular porcentajes de crecimiento
  const calcularCrecimiento = (actual, anterior) => {
    if (anterior === 0) return actual > 0 ? 100 : 0;
    return parseFloat(((actual - anterior) / anterior * 100).toFixed(1));
  };

  return {
    totalReservas: {
      actual: totalReservasActual,
      anterior: totalReservasAnterior,
      crecimiento: calcularCrecimiento(totalReservasActual, totalReservasAnterior)
    },
    totalTuristas: {
      actual: totalTuristasActual,
      anterior: totalTuristasAnterior,
      crecimiento: calcularCrecimiento(totalTuristasActual, totalTuristasAnterior)
    },
    ingresosTotales: {
      actual: Math.round(ingresosTotalesActual),
      anterior: Math.round(ingresosTotalesAnterior),
      crecimiento: calcularCrecimiento(ingresosTotalesActual, ingresosTotalesAnterior)
    }
  };
}

// Helper function to calculate summary statistics
function calculateSummary(reservations, services, tours, timeRange = 'month') {
  const now = new Date();

  // Determinar período
  let periodStart, periodEnd;

  if (timeRange === 'week') {
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    periodStart = monday;
    periodEnd = new Date(monday);
    periodEnd.setDate(monday.getDate() + 6);
    periodEnd.setHours(23, 59, 59, 999);
  } else if (timeRange === 'month') {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else if (timeRange === 'quarter') {
    const currentQuarter = Math.floor(now.getMonth() / 3);
    periodStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
    periodEnd = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
  } else { // year
    periodStart = new Date(now.getFullYear(), 0, 1);
    periodEnd = new Date(now.getFullYear(), 11, 31);
  }

  // Filtrar reservas del período
  const periodReservations = reservations.filter(r => {
    if (!r.created_at && !r.tour_date) return false;
    const date = new Date(r.created_at || r.tour_date);
    return date >= periodStart && date <= periodEnd;
  });

  // Tour más popular (por número de reservas)
  const tourCounts = {};
  periodReservations.forEach(r => {
    if (r.service_id) {
      tourCounts[r.service_id] = (tourCounts[r.service_id] || 0) + 1;
    }
  });

  let popularTour = 'Sin datos';
  if (Object.keys(tourCounts).length > 0) {
    const mostPopularServiceId = Object.keys(tourCounts).reduce((a, b) =>
      tourCounts[a] > tourCounts[b] ? a : b
    );
    const service = services.find(s => s.id === mostPopularServiceId);
    popularTour = service ? service.name : 'Servicio ' + mostPopularServiceId;
  }

  // Promedio por reserva
  const totalIngresos = _.sumBy(periodReservations, r => parseFloat(r.total_amount) || 0);
  const avgPerBooking = periodReservations.length > 0
    ? Math.round(totalIngresos / periodReservations.length)
    : 0;

  // Mejor día de la semana (por número de reservas)
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayCounts = {};

  periodReservations.forEach(r => {
    if (r.tour_date) {
      const date = new Date(r.tour_date);
      const dayIndex = date.getDay();
      dayCounts[dayIndex] = (dayCounts[dayIndex] || 0) + 1;
    }
  });

  let bestDay = 'Sin datos';
  if (Object.keys(dayCounts).length > 0) {
    const bestDayIndex = Object.keys(dayCounts).reduce((a, b) =>
      dayCounts[a] > dayCounts[b] ? a : b
    );
    bestDay = dayNames[bestDayIndex];
  }

  // Tasa de conversión (reservas confirmadas / total)
  const confirmedReservations = periodReservations.filter(r =>
    r.status === 'confirmed' || r.status === 'completed'
  );
  const conversionRate = periodReservations.length > 0
    ? parseFloat((confirmedReservations.length / periodReservations.length * 100).toFixed(1))
    : 0;

  return {
    popularTour,
    avgPerBooking,
    bestDay,
    conversionRate
  };
}

// Helper function to get guide monthly data
function getGuideMonthlyData(db, userId, months = 6) {
  const guides = db.get('guides').value() || [];
  const reservations = db.get('reservations').value() || [];

  // Find guide by user_id
  const guide = guides.find(g => g.user_id === userId);
  if (!guide) {
    console.log('⚠️ [getGuideMonthlyData] Guide not found for userId:', userId);
    return [];
  }

  console.log('✅ [getGuideMonthlyData] Guide found:', guide.id);

  // Filter reservations for this guide
  const guideReservations = reservations.filter(r => r.guide_id === guide.id);
  console.log('📊 [getGuideMonthlyData] Guide reservations:', guideReservations.length);

  const now = new Date();
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthlyData = [];

  // Generate data for the last N months
  for (let i = months - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    // Filter reservations for this month
    const monthReservations = guideReservations.filter(r => {
      if (!r.tour_date && !r.created_at) return false;
      const reservationDate = new Date(r.tour_date || r.created_at);
      return reservationDate >= monthStart && reservationDate <= monthEnd;
    });

    // Calculate revenue for this month (only completed tours)
    const revenue = monthReservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (parseFloat(r.total_amount) || 0), 0);

    monthlyData.push({
      month: monthNames[targetDate.getMonth()],
      revenue: Math.round(revenue),
      bookings: monthReservations.length,
      completed: monthReservations.filter(r => r.status === 'completed').length
    });
  }

  console.log('📈 [getGuideMonthlyData] Monthly data:', monthlyData);
  return monthlyData;
}