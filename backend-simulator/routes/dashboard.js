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
      const db = router.db;
      const dashboardStats = db.get('dashboard_stats').value();

      // Use data from db.json or return empty data
      const monthlyData = dashboardStats && dashboardStats.line_data ? dashboardStats.line_data.map(item => ({
        month: item.name,
        revenue: item.ingresos,
        bookings: item.reservas,
        guides: Math.floor(item.turistas / 50) // Estimate guides based on tourists
      })) : [];

      res.json({
        success: true,
        data: monthlyData
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos mensuales'
      });
    }
  });

  // Get chart data
  dashboardRouter.get('/chart-data', (req, res) => {
    try {
      const { type, timeRange } = req.query;
      const db = router.db;
      const dashboardStats = db.get('dashboard_stats').value();

      let data = [];

      if (type === 'line' && dashboardStats) {
        data = dashboardStats.line_data;
      } else if (type === 'bar' && dashboardStats) {
        data = dashboardStats.bar_data;
      }

      res.json({
        success: true,
        data: data
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos del gráfico'
      });
    }
  });

  // Get KPIs
  dashboardRouter.get('/kpis', (req, res) => {
    try {
      const db = router.db;
      const dashboardStats = db.get('dashboard_stats').value();

      const kpis = dashboardStats ? dashboardStats.kpi_data : {
        totalReservas: { actual: 0, anterior: 0, crecimiento: 0 },
        totalTuristas: { actual: 0, anterior: 0, crecimiento: 0 },
        ingresosTotales: { actual: 0, anterior: 0, crecimiento: 0 }
      };

      res.json({
        success: true,
        data: kpis
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener KPIs'
      });
    }
  });

  // Get summary data
  dashboardRouter.get('/summary', (req, res) => {
    try {
      const db = router.db;
      const dashboardStats = db.get('dashboard_stats').value();

      const summary = dashboardStats ? dashboardStats.summary_data : {
        popularTour: 'Sin datos',
        avgPerBooking: 0,
        bestDay: 'Sin datos',
        conversionRate: 0
      };

      res.json({
        success: true,
        data: summary
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener resumen'
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
  const transactions = db.get('financial_transactions').value() || [];

  return {
    totalUsers: users.length,
    totalAgencies: agencies.length,
    totalGuides: guides.length,
    totalReservations: reservations.length,
    monthlyRevenue: _.sumBy(transactions, 'amount') || 0,
    activeServices: reservations.filter(r => r.status === 'confirmed').length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length
  };
}

function getAgencyStats(db, userId) {
  const reservations = db.get('reservations').value() || [];
  const transactions = db.get('financial_transactions').value() || [];
  const tours = db.get('tours').value() || [];

  // Filter by agency (assuming we can get agency_id from user)
  const agencyReservations = reservations; // Simplified for demo

  return {
    totalReservations: agencyReservations.length,
    confirmedReservations: agencyReservations.filter(r => r.status === 'confirmed').length,
    pendingReservations: agencyReservations.filter(r => r.status === 'pending').length,
    monthlyRevenue: _.sumBy(transactions, 'amount') || 0,
    activeTours: tours.filter(t => t.status === 'active').length,
    totalClients: _.uniqBy(agencyReservations, 'client_id').length
  };
}

function getGuideStats(db, userId) {
  const reservations = db.get('reservations').value() || [];
  const guides = db.get('guides').value() || [];

  // Find guide by user_id
  const guide = guides.find(g => g.user_id === userId);
  const guideReservations = guide ? reservations.filter(r => r.guide_id === guide.id) : [];

  return {
    toursCompleted: guideReservations.filter(r => r.status === 'completed').length,
    upcomingTours: guideReservations.filter(r => r.status === 'confirmed').length,
    monthlyIncome: _.sumBy(guideReservations, 'total_amount') || 0,
    rating: guide ? guide.rating : 0,
    totalClients: _.uniqBy(guideReservations, 'client_id').length
  };
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