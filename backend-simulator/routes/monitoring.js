/**
 * Monitoring Routes
 * Endpoints para monitoreo en tiempo real de tours y fotos
 */

module.exports = (router) => {
  const express = require('express');
  const apiRouter = express.Router();

  /**
   * GET /api/monitoring/photos
   * Obtener fotos de tours con filtros
   */
  apiRouter.get('/photos', (req, res) => {
    try {
      const db = router.db;
      const { date, guideId, tourId, agencyId } = req.query;

      // Obtener datos relacionados
      const reservations = db.get('reservations').value() || [];
      const services = db.get('services').value() || [];
      const guides = db.get('guides').value() || [];
      const agencies = db.get('agencies').value() || [];

      // Obtener fotos de tours (si existen en db.json)
      let photos = db.get('tour_photos').value() || [];

      // Si no hay fotos guardadas, generar desde checkpoints completados
      if (photos.length === 0) {
        photos = generatePhotosFromCheckpoints(reservations, services, guides, agencies);
      }

      // Aplicar filtros
      if (date) {
        const targetDate = new Date(date).toDateString();
        photos = photos.filter(photo => {
          const photoDate = new Date(photo.timestamp).toDateString();
          return photoDate === targetDate;
        });
      }

      if (guideId) {
        photos = photos.filter(photo => photo.guideId === guideId);
      }

      if (tourId) {
        photos = photos.filter(photo => photo.tourId === tourId);
      }

      if (agencyId) {
        photos = photos.filter(photo => photo.agencyId === agencyId);
      }

      // Ordenar por fecha descendente (más recientes primero)
      photos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      res.json({
        success: true,
        data: photos
      });
    } catch (error) {
      console.error('Error al obtener fotos de tours:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener fotos de tours',
        details: error.message,
        data: []
      });
    }
  });

  /**
   * POST /api/monitoring/photos
   * Subir nueva foto de tour
   */
  apiRouter.post('/photos', (req, res) => {
    try {
      const db = router.db;
      const {
        tourId,
        stopId,
        stopName,
        guideId,
        guideName,
        agencyId,
        agencyName,
        photoUrl,
        thumbnail,
        comment,
        coordinates
      } = req.body;

      // Validar datos requeridos
      if (!tourId || !guideId || !photoUrl) {
        return res.status(400).json({
          success: false,
          error: 'Faltan datos requeridos: tourId, guideId, photoUrl'
        });
      }

      const newPhoto = {
        id: `photo-${Date.now()}`,
        tourId,
        stopId,
        stopName: stopName || 'Punto de control',
        guideId,
        guideName: guideName || 'Guía',
        agencyId,
        agencyName: agencyName || 'Agencia',
        url: photoUrl,
        thumbnail: thumbnail || photoUrl,
        comment: comment || '',
        coordinates: coordinates || null,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      // Guardar en la base de datos
      const photos = db.get('tour_photos').value() || [];
      photos.push(newPhoto);
      db.set('tour_photos', photos).write();

      res.json({
        success: true,
        data: newPhoto,
        message: 'Foto subida correctamente'
      });
    } catch (error) {
      console.error('Error al subir foto:', error);
      res.status(500).json({
        success: false,
        error: 'Error al subir foto',
        details: error.message
      });
    }
  });

  /**
   * DELETE /api/monitoring/photos/:photoId
   * Eliminar foto de tour
   */
  apiRouter.delete('/photos/:photoId', (req, res) => {
    try {
      const db = router.db;
      const { photoId } = req.params;

      const photos = db.get('tour_photos').value() || [];
      const photoIndex = photos.findIndex(p => p.id === photoId);

      if (photoIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Foto no encontrada'
        });
      }

      photos.splice(photoIndex, 1);
      db.set('tour_photos', photos).write();

      res.json({
        success: true,
        message: 'Foto eliminada correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar foto:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar foto',
        details: error.message
      });
    }
  });

  /**
   * GET /api/monitoring/active-tours
   * Obtener tours activos en tiempo real
   */
  apiRouter.get('/active-tours', (req, res) => {
    try {
      const db = router.db;
      const services = db.get('services').value() || [];
      const guides = db.get('guides').value() || [];

      // Filtrar servicios activos o en progreso
      const activeTours = services.filter(s =>
        s.status === 'active' || s.status === 'in_progress' || s.status === 'enroute'
      ).map(service => {
        const guide = guides.find(g => g.id === service.assignedGuide);

        return {
          id: service.id,
          tourName: service.name,
          guideName: guide?.name || 'Guía no asignado',
          guideId: service.assignedGuide,
          status: service.status,
          startTime: service.startTime || service.created_at,
          tourists: service.groupSize || 0,
          currentLocation: service.currentLocation || null,
          progress: service.progress || 0,
          estimatedEndTime: service.estimatedEndTime || null
        };
      });

      res.json({
        success: true,
        data: activeTours
      });
    } catch (error) {
      console.error('Error al obtener tours activos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tours activos',
        details: error.message,
        data: []
      });
    }
  });

  return apiRouter;
};

/**
 * Helper function: Generar fotos desde checkpoints completados
 */
function generatePhotosFromCheckpoints(reservations, services, guides, agencies) {
  const photos = [];

  reservations.forEach(reservation => {
    if (!reservation.checkpoints || !Array.isArray(reservation.checkpoints)) return;

    const service = services.find(s => s.id === reservation.service_id);
    const guide = guides.find(g => g.id === reservation.guide_id);
    const agency = agencies.find(a => a.id === reservation.agency_id);

    reservation.checkpoints.forEach(checkpoint => {
      if (checkpoint.photoUrl) {
        photos.push({
          id: `photo-${reservation.id}-${checkpoint.id}`,
          tourId: reservation.id,
          tourName: service?.name || 'Tour',
          stopId: checkpoint.id,
          stopName: checkpoint.name || 'Punto de control',
          guideId: reservation.guide_id,
          guideName: guide?.name || 'Guía',
          agencyId: reservation.agency_id,
          agencyName: agency?.name || agency?.business_name || 'Agencia',
          url: checkpoint.photoUrl,
          thumbnail: checkpoint.photoUrl,
          comment: checkpoint.comment || '',
          coordinates: checkpoint.coordinates || null,
          timestamp: checkpoint.timestamp || reservation.created_at,
          created_at: checkpoint.timestamp || reservation.created_at
        });
      }
    });
  });

  return photos;
}
