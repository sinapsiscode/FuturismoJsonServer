const express = require('express');

module.exports = (router) => {
  const statisticsRouter = express.Router();

  // Dashboard statistics
  statisticsRouter.get('/dashboard', (req, res) => {
    try {
      const db = router.db;
      const reservations = db.get('reservations').value();
      const users = db.get('users').value();
      const tours = db.get('tours').value();

      // Calculate basic stats
      const totalReservations = reservations.length;
      const totalUsers = users.filter(u => u.role === 'client').length;
      const totalTours = tours.length;
      const totalRevenue = reservations.reduce((sum, r) => sum + (r.total_amount || 0), 0);

      // Monthly comparisons (mock data for demo)
      const stats = {
        reservations: {
          current: totalReservations,
          previous: Math.floor(totalReservations * 0.8),
          growth: 25.5
        },
        revenue: {
          current: totalRevenue,
          previous: Math.floor(totalRevenue * 0.85),
          growth: 18.2
        },
        users: {
          current: totalUsers,
          previous: Math.floor(totalUsers * 0.9),
          growth: 12.3
        },
        tours: {
          current: totalTours,
          previous: Math.floor(totalTours * 0.95),
          growth: 5.8
        }
      };

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas del dashboard'
      });
    }
  });

  // Chart data for views
  statisticsRouter.get('/chart-views', (req, res) => {
    try {
      // Mock chart data
      const chartData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: 'Vistas',
          data: [1200, 1900, 3000, 5000, 2000, 3000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
      };

      res.json({
        success: true,
        data: chartData
      });

    } catch (error) {
      console.error('Error fetching chart data:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos del gráfico'
      });
    }
  });

  // Reservation statistics with trends
  statisticsRouter.get('/reservations/trends', (req, res) => {
    try {
      const db = router.db;
      const reservations = db.get('reservations').value() || [];

      if (!reservations.length) {
        return res.json({
          success: true,
          data: {
            totalClients: { value: 0, trend: 0, trendLabel: '0%' },
            totalTourists: { value: 0, trend: 0, trendLabel: '0%' },
            totalRevenue: { value: 0, trend: 0, trendLabel: '0%' },
            avgGroupSize: { value: 0, trend: 0, trendLabel: '0%' },
            avgRevenuePerClient: { value: 0, trend: 0, trendLabel: '0%' },
            activeDestinations: { value: 0, trend: 0, trendLabel: '0%' }
          }
        });
      }

      // Calculate current period stats
      const currentDate = new Date();
      const lastMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

      const currentReservations = reservations.filter(r => new Date(r.created_at || r.date) >= lastMonthDate);
      const previousReservations = reservations.filter(r => {
        const date = new Date(r.created_at || r.date);
        const twoMonthsAgo = new Date(lastMonthDate);
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);
        return date >= twoMonthsAgo && date < lastMonthDate;
      });

      // Calculate metrics
      const calculateMetrics = (data) => ({
        totalClients: data.length,
        totalTourists: data.reduce((sum, r) => sum + (r.tourists || r.group_size || 0), 0),
        totalRevenue: data.reduce((sum, r) => sum + (r.totalAmount || r.total_amount || 0), 0),
        avgGroupSize: data.length > 0 ? data.reduce((sum, r) => sum + (r.tourists || r.group_size || 0), 0) / data.length : 0,
        activeDestinations: [...new Set(data.map(r => r.destination).filter(Boolean))].length
      });

      const current = calculateMetrics(currentReservations);
      const previous = calculateMetrics(previousReservations);

      // Calculate trends
      const calculateTrend = (currentVal, previousVal) => {
        if (previousVal === 0) return currentVal > 0 ? 100 : 0;
        return Math.round(((currentVal - previousVal) / previousVal) * 100);
      };

      const trends = {
        totalClients: {
          value: current.totalClients,
          trend: calculateTrend(current.totalClients, previous.totalClients),
          trendLabel: `${calculateTrend(current.totalClients, previous.totalClients) > 0 ? '+' : ''}${calculateTrend(current.totalClients, previous.totalClients)}%`
        },
        totalTourists: {
          value: current.totalTourists,
          trend: calculateTrend(current.totalTourists, previous.totalTourists),
          trendLabel: `${calculateTrend(current.totalTourists, previous.totalTourists) > 0 ? '+' : ''}${calculateTrend(current.totalTourists, previous.totalTourists)}%`
        },
        totalRevenue: {
          value: current.totalRevenue,
          trend: calculateTrend(current.totalRevenue, previous.totalRevenue),
          trendLabel: `${calculateTrend(current.totalRevenue, previous.totalRevenue) > 0 ? '+' : ''}${calculateTrend(current.totalRevenue, previous.totalRevenue)}%`
        },
        avgGroupSize: {
          value: Number(current.avgGroupSize.toFixed(1)),
          trend: calculateTrend(current.avgGroupSize, previous.avgGroupSize),
          trendLabel: `${calculateTrend(current.avgGroupSize, previous.avgGroupSize) > 0 ? '+' : ''}${calculateTrend(current.avgGroupSize, previous.avgGroupSize)}%`
        },
        avgRevenuePerClient: {
          value: current.totalClients > 0 ? Math.round(current.totalRevenue / current.totalClients) : 0,
          trend: calculateTrend(
            current.totalClients > 0 ? current.totalRevenue / current.totalClients : 0,
            previous.totalClients > 0 ? previous.totalRevenue / previous.totalClients : 0
          ),
          trendLabel: `${calculateTrend(
            current.totalClients > 0 ? current.totalRevenue / current.totalClients : 0,
            previous.totalClients > 0 ? previous.totalRevenue / previous.totalClients : 0
          ) > 0 ? '+' : ''}${calculateTrend(
            current.totalClients > 0 ? current.totalRevenue / current.totalClients : 0,
            previous.totalClients > 0 ? previous.totalRevenue / previous.totalClients : 0
          )}%`
        },
        activeDestinations: {
          value: current.activeDestinations,
          trend: calculateTrend(current.activeDestinations, previous.activeDestinations),
          trendLabel: `${calculateTrend(current.activeDestinations, previous.activeDestinations) > 0 ? '+' : ''}${calculateTrend(current.activeDestinations, previous.activeDestinations)}%`
        }
      };

      res.json({
        success: true,
        data: trends
      });

    } catch (error) {
      console.error('Error fetching reservation trends:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tendencias de reservaciones'
      });
    }
  });

  // Feedback statistics
  statisticsRouter.get('/feedback', (req, res) => {
    try {
      const db = router.db;
      const feedbackData = db.get('feedback_data').value() || {};
      const feedbackDataFull = db.get('feedback_data_full').value() || {};

      // Extract data
      const serviceFeedback = feedbackData.serviceFeedback || [];
      const staffFeedback = feedbackData.staffFeedback || [];

      // Calculate current vs previous month
      const currentDate = new Date();
      const lastMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

      const currentServiceFeedback = serviceFeedback.filter(f => new Date(f.date) >= lastMonthDate);
      const previousServiceFeedback = serviceFeedback.filter(f => {
        const date = new Date(f.date);
        const twoMonthsAgo = new Date(lastMonthDate);
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);
        return date >= twoMonthsAgo && date < lastMonthDate;
      });

      const currentStaffFeedback = staffFeedback.filter(f => new Date(f.date) >= lastMonthDate);
      const previousStaffFeedback = staffFeedback.filter(f => {
        const date = new Date(f.date);
        const twoMonthsAgo = new Date(lastMonthDate);
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);
        return date >= twoMonthsAgo && date < lastMonthDate;
      });

      const calculateTrend = (currentVal, previousVal) => {
        if (previousVal === 0) return currentVal > 0 ? 100 : 0;
        return Math.round(((currentVal - previousVal) / previousVal) * 100);
      };

      const totalCurrent = currentServiceFeedback.length + currentStaffFeedback.length;
      const totalPrevious = previousServiceFeedback.length + previousStaffFeedback.length;

      const stats = {
        totalFeedback: totalCurrent,
        totalFeedbackTrend: `${calculateTrend(totalCurrent, totalPrevious) > 0 ? '+' : ''}${calculateTrend(totalCurrent, totalPrevious)}%`,
        serviceFeedback: currentServiceFeedback.length,
        serviceFeedbackTrend: `${calculateTrend(currentServiceFeedback.length, previousServiceFeedback.length) > 0 ? '+' : ''}${calculateTrend(currentServiceFeedback.length, previousServiceFeedback.length)}%`,
        staffFeedback: currentStaffFeedback.length,
        staffFeedbackTrend: `${calculateTrend(currentStaffFeedback.length, previousStaffFeedback.length) > 0 ? '+' : ''}${calculateTrend(currentStaffFeedback.length, previousStaffFeedback.length)}%`
      };

      res.json({
        success: true,
        data: {
          stats,
          serviceFeedback,
          staffFeedback
        }
      });

    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas de feedback'
      });
    }
  });

  return statisticsRouter;
};