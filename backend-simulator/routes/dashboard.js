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
      const monthlyData = [
        { month: 'Ene', revenue: 15400, bookings: 45, guides: 12 },
        { month: 'Feb', revenue: 18200, bookings: 52, guides: 14 },
        { month: 'Mar', revenue: 22100, bookings: 64, guides: 16 },
        { month: 'Abr', revenue: 19800, bookings: 58, guides: 15 },
        { month: 'May', revenue: 25300, bookings: 71, guides: 18 },
        { month: 'Jun', revenue: 28900, bookings: 82, guides: 20 },
        { month: 'Jul', revenue: 32100, bookings: 95, guides: 22 },
        { month: 'Ago', revenue: 29800, bookings: 87, guides: 21 },
        { month: 'Sep', revenue: 27500, bookings: 79, guides: 19 },
        { month: 'Oct', revenue: 31200, bookings: 89, guides: 23 },
        { month: 'Nov', revenue: 33800, bookings: 96, guides: 24 },
        { month: 'Dic', revenue: 36400, bookings: 104, guides: 26 }
      ];

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

  return dashboardRouter;
};

// Helper functions for different role stats
function getAdminStats(db) {
  const users = db.get('users').value();
  const agencies = db.get('agencies').value();
  const guides = db.get('guides').value();
  const reservations = db.get('reservations').value();
  const transactions = db.get('financial_transactions').value();

  return {
    totalUsers: users.length,
    totalAgencies: agencies.length,
    totalGuides: guides.length,
    totalReservations: reservations.length,
    monthlyRevenue: _.sumBy(transactions, 'amount'),
    activeServices: reservations.filter(r => r.status === 'confirmed').length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length
  };
}

function getAgencyStats(db, userId) {
  const reservations = db.get('reservations').value();
  const transactions = db.get('financial_transactions').value();
  const tours = db.get('tours').value();

  // Filter by agency (assuming we can get agency_id from user)
  const agencyReservations = reservations; // Simplified for demo

  return {
    totalReservations: agencyReservations.length,
    confirmedReservations: agencyReservations.filter(r => r.status === 'confirmed').length,
    pendingReservations: agencyReservations.filter(r => r.status === 'pending').length,
    monthlyRevenue: _.sumBy(transactions, 'amount'),
    activeTours: tours.filter(t => t.status === 'active').length,
    totalClients: _.uniqBy(agencyReservations, 'client_id').length
  };
}

function getGuideStats(db, userId) {
  const reservations = db.get('reservations').value();
  const guides = db.get('guides').value();

  // Find guide by user_id
  const guide = guides.find(g => g.user_id === userId);
  const guideReservations = guide ? reservations.filter(r => r.guide_id === guide.id) : [];

  return {
    toursCompleted: guideReservations.filter(r => r.status === 'completed').length || 24,
    upcomingTours: guideReservations.filter(r => r.status === 'confirmed').length || 3,
    monthlyIncome: _.sumBy(guideReservations, 'total_amount') || 2850,
    rating: guide ? guide.rating : 4.8,
    totalClients: _.uniqBy(guideReservations, 'client_id').length || 67
  };
}

function getBasicStats(db) {
  const reservations = db.get('reservations').value();
  const guides = db.get('guides').value();

  return {
    totalReservations: reservations.length,
    activeGuides: guides.filter(g => g.status === 'active').length,
    pendingServices: reservations.filter(r => r.status === 'pending').length
  };
}