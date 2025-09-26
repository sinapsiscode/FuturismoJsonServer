import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { TOUR_STATUS } from '../constants/monitoringConstants';
import { getMockTourData } from '../data/mockMonitoringData';
import useNotificationStore from '../stores/notificationsStore';

const useTourProgress = (tourId, isGuideView = false) => {
  const [expandedStop, setExpandedStop] = useState(null);
  const [tourData, setTourData] = useState(() => {
    // Inicializar con datos mock traducidos
    const mockTourData = getMockTourData(tourId);
    return {
      ...mockTourData,
      // Agregar timestamps reales para interactividad
      lastUpdate: new Date(),
      isActive: true
    };
  });
  const [autoProgressTimer, setAutoProgressTimer] = useState(null);
  const { t } = useTranslation();
  const { addNotification } = useNotificationStore();

  const mockTourData = getMockTourData(tourId);
  
  // Traducir los textos del mock data
  const mockTour = {
    ...mockTourData,
    name: t(mockTourData.name),
    guide: {
      ...mockTourData.guide,
      name: t(mockTourData.guide.name),
      phone: t(mockTourData.guide.phone)
    },
    stops: mockTourData.stops.map(stop => ({
      ...stop,
      name: t(stop.name),
      description: t(stop.description),
      incidents: stop.incidents.map(incident => ({
        ...incident,
        message: t(incident.message)
      }))
    })),
    incidents: mockTourData.incidents.map(incident => ({
      ...incident,
      message: t(incident.message)
    }))
  };

  const getProgressPercentage = () => {
    const completedStops = mockTour.stops.filter(s => s.status === TOUR_STATUS.COMPLETED).length;
    return (completedStops / mockTour.stops.length) * 100;
  };

  const getEstimatedDelay = () => {
    const now = new Date();
    const elapsed = now - mockTour.actualStartTime;
    const plannedElapsed = now - mockTour.startTime;
    const delay = elapsed - plannedElapsed;
    return delay > 0 ? delay / 60000 : 0;
  };

  const handlePhotosChange = (stopId, newPhotos) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Photos updated for stop:', stopId, newPhotos);
    }
    toast.success(t('monitoring.tour.photosUpdated'));
  };

  const canUploadPhotos = (stop) => {
    return isGuideView && (
      stop.status === TOUR_STATUS.IN_PROGRESS || 
      stop.status === TOUR_STATUS.COMPLETED
    );
  };

  const toggleStop = (stopId) => {
    setExpandedStop(expandedStop === stopId ? null : stopId);
  };

  // ===== NUEVAS FUNCIONES INTERACTIVAS =====

  const handleCheckIn = useCallback((stopId) => {
    if (!isGuideView) return;

    setTourData(prevData => {
      const updatedStops = prevData.stops.map(stop => {
        if (stop.id === stopId) {
          const now = new Date();
          return {
            ...stop,
            status: TOUR_STATUS.IN_PROGRESS,
            arrivalTime: now,
            actualTime: null // Se completará al hacer check-out
          };
        }
        return stop;
      });

      return {
        ...prevData,
        stops: updatedStops,
        lastUpdate: new Date()
      };
    });

    // Notificación para la central
    addNotification({
      title: t('monitoring.notifications.checkIn'),
      message: t('monitoring.notifications.checkInMessage', { stopName: mockTour.stops.find(s => s.id === stopId)?.name }),
      type: 'info',
      duration: 5000
    });

    toast.success(t('monitoring.tour.checkedIn'));
  }, [isGuideView, addNotification, t, mockTour.stops]);

  const handleCheckOut = useCallback((stopId) => {
    if (!isGuideView) return;

    setTourData(prevData => {
      const updatedStops = prevData.stops.map(stop => {
        if (stop.id === stopId && stop.status === TOUR_STATUS.IN_PROGRESS) {
          const now = new Date();
          const actualTimeMinutes = stop.arrivalTime ? 
            Math.round((now - new Date(stop.arrivalTime)) / 60000) : 
            stop.estimatedTime;

          return {
            ...stop,
            status: TOUR_STATUS.COMPLETED,
            departureTime: now,
            actualTime: actualTimeMinutes
          };
        }
        return stop;
      });

      return {
        ...prevData,
        stops: updatedStops,
        lastUpdate: new Date()
      };
    });

    // Notificación para la central
    addNotification({
      title: t('monitoring.notifications.checkOut'),
      message: t('monitoring.notifications.checkOutMessage', { stopName: mockTour.stops.find(s => s.id === stopId)?.name }),
      type: 'success',
      duration: 5000
    });

    toast.success(t('monitoring.tour.checkedOut'));
    
    // Auto-avanzar al siguiente punto después de 2 segundos
    setTimeout(() => {
      const currentIndex = mockTour.stops.findIndex(s => s.id === stopId);
      const nextStop = mockTour.stops[currentIndex + 1];
      if (nextStop && nextStop.status === TOUR_STATUS.PENDING) {
        setExpandedStop(nextStop.id);
        toast.info(t('monitoring.tour.nextStop', { stopName: nextStop.name }));
      }
    }, 2000);
  }, [isGuideView, addNotification, t, mockTour.stops]);

  const reportIncident = useCallback((stopId, incidentType, message) => {
    const incident = {
      id: Date.now(),
      type: incidentType,
      message: message || t('monitoring.incidents.generic'),
      time: new Date(),
      resolved: false
    };

    setTourData(prevData => {
      const updatedStops = prevData.stops.map(stop => {
        if (stop.id === stopId) {
          return {
            ...stop,
            incidents: [...(stop.incidents || []), incident]
          };
        }
        return stop;
      });

      return {
        ...prevData,
        stops: updatedStops,
        incidents: [...prevData.incidents, incident],
        lastUpdate: new Date()
      };
    });

    // Notificación urgente para la central
    addNotification({
      title: t('monitoring.notifications.incident'),
      message: t('monitoring.notifications.incidentMessage', { 
        stopName: mockTour.stops.find(s => s.id === stopId)?.name,
        incident: message 
      }),
      type: 'error',
      duration: 10000,
      urgent: true
    });

    toast.error(t('monitoring.tour.incidentReported'));
  }, [addNotification, t, mockTour.stops]);

  const canCheckIn = useCallback((stop) => {
    return isGuideView && stop.status === TOUR_STATUS.PENDING;
  }, [isGuideView]);

  const canCheckOut = useCallback((stop) => {
    return isGuideView && stop.status === TOUR_STATUS.IN_PROGRESS;
  }, [isGuideView]);

  // Auto-simulación de progreso para demo (solo en vista monitoreo)
  useEffect(() => {
    if (!isGuideView && tourData.isActive) {
      const timer = setInterval(() => {
        // Simular progreso automático cada 30 segundos
        const now = new Date();
        const shouldProgress = Math.random() > 0.7; // 30% chance cada interval
        
        if (shouldProgress) {
          setTourData(prevData => ({
            ...prevData,
            lastUpdate: now
          }));
        }
      }, 30000);

      setAutoProgressTimer(timer);
      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [isGuideView, tourData.isActive]);

  // Usar tourData en lugar de mockTour para datos reactivos
  const currentTour = {
    ...mockTour,
    ...tourData,
    stops: tourData.stops?.map(stop => ({
      ...stop,
      name: t(stop.name || ''),
      description: t(stop.description || ''),
      incidents: (stop.incidents || []).map(incident => ({
        ...incident,
        message: typeof incident.message === 'string' ? incident.message : t(incident.message || '')
      }))
    })) || mockTour.stops
  };

  const getCurrentProgressPercentage = () => {
    const completedStops = currentTour.stops.filter(s => s.status === TOUR_STATUS.COMPLETED).length;
    return (completedStops / currentTour.stops.length) * 100;
  };

  return {
    tour: currentTour,
    expandedStop,
    progressPercentage: getCurrentProgressPercentage(),
    estimatedDelay: getEstimatedDelay(),
    handlePhotosChange,
    canUploadPhotos,
    toggleStop,
    // Nuevas funciones interactivas
    handleCheckIn,
    handleCheckOut,
    reportIncident,
    canCheckIn,
    canCheckOut,
    isActive: tourData.isActive,
    lastUpdate: tourData.lastUpdate
  };
};

export default useTourProgress;