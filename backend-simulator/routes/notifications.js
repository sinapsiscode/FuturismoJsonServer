const express = require('express');

module.exports = (router) => {
  const notificationsRouter = express.Router();

  // Get notifications by user ID
  notificationsRouter.get('/user/:userId', (req, res) => {
    try {
      const db = router.db;
      let notifications = db.get('notifications').value() || [];

      // If no notifications in db.json, create some mock data
      if (notifications.length === 0) {
        notifications = [
          {
            id: 'notif-1',
            title: 'Nueva reservación',
            message: 'Has recibido una nueva reservación para el tour a Machu Picchu',
            type: 'info',
            read: false,
            created_at: new Date().toISOString(),
            user_id: req.params.userId
          },
          {
            id: 'notif-2',
            title: 'Pago confirmado',
            message: 'Se ha confirmado el pago de la reservación #12345',
            type: 'success',
            read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            user_id: req.params.userId
          }
        ];
      }

      // Filter by user
      notifications = notifications.filter(n => n.user_id === req.params.userId);

      // Apply additional filters if provided
      const { type, read, page = 1, pageSize = 20 } = req.query;

      if (type) {
        notifications = notifications.filter(n => n.type === type);
      }

      if (read !== undefined) {
        const isRead = read === 'true';
        notifications = notifications.filter(n => n.read === isRead);
      }

      // Pagination
      const total = notifications.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + parseInt(pageSize);
      const paginatedNotifications = notifications.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          notifications: paginatedNotifications,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: total,
          totalPages: totalPages,
          unreadCount: notifications.filter(n => !n.read).length
        }
      });

    } catch (error) {
      console.error('Error fetching user notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener notificaciones del usuario'
      });
    }
  });

  // Get all notifications
  notificationsRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      let notifications = db.get('notifications').value() || [];

      // If no notifications in db.json, create some mock data
      if (notifications.length === 0) {
        notifications = [
          {
            id: 'notif-1',
            title: 'Nueva reservación',
            message: 'Has recibido una nueva reservación para el tour a Machu Picchu',
            type: 'info',
            read: false,
            created_at: new Date().toISOString(),
            user_id: 'user-admin-1'
          },
          {
            id: 'notif-2',
            title: 'Pago confirmado',
            message: 'Se ha confirmado el pago de la reservación #12345',
            type: 'success',
            read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            user_id: 'user-admin-1'
          }
        ];
      }

      // Filter by user if needed
      const { user_id } = req.query;
      if (user_id) {
        notifications = notifications.filter(n => n.user_id === user_id);
      }

      res.json({
        success: true,
        data: notifications,
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length
      });

    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener notificaciones'
      });
    }
  });

  // Mark notification as read
  notificationsRouter.put('/:id/read', (req, res) => {
    try {
      const db = router.db;
      const notification = db.get('notifications').find({ id: req.params.id });

      if (!notification.value()) {
        return res.status(404).json({
          success: false,
          error: 'Notificación no encontrada'
        });
      }

      notification.assign({ read: true }).write();

      res.json({
        success: true,
        message: 'Notificación marcada como leída'
      });

    } catch (error) {
      console.error('Error updating notification:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar notificación'
      });
    }
  });

  return notificationsRouter;
};