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

  return statisticsRouter;
};