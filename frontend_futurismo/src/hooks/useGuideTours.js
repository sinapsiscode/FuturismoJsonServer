import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import toursService from '../services/toursService';
import useAuthStore from '../stores/authStore';

const useGuideTours = () => {
  const { user } = useAuthStore();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTour, setActiveTour] = useState(null);

  // Cargar tours del guía
  const loadGuideTours = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await toursService.getGuideTours(user.id);
      
      if (response.success) {
        setTours(response.data);
        
        // Buscar tour activo
        const active = response.data.find(tour => 
          ['en_camino', 'iniciado', 'en_progreso'].includes(tour.status)
        );
        setActiveTour(active?.id || null);
      } else {
        throw new Error(response.message || 'Error al cargar tours');
      }
    } catch (err) {
      console.error('Error loading guide tours:', err);
      setError(err.message);
      toast.error('Error al cargar tus tours');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de tour
  const updateTourStatus = async (tourId, newStatus) => {
    try {
      // Verificar restricción de tour activo
      if (activeTour && activeTour !== tourId && 
          ['en_camino', 'iniciado', 'en_progreso'].includes(newStatus)) {
        toast.error('Solo puedes tener un tour activo a la vez. Finaliza el tour actual primero.');
        return false;
      }

      const response = await toursService.updateTourStatus(tourId, newStatus, user.id);
      
      if (response.success) {
        // Actualizar estado local
        setTours(prevTours => 
          prevTours.map(tour => {
            if (tour.id === tourId) {
              const updatedTour = { ...tour, status: newStatus };
              
              // Actualizar tour activo
              if (['en_camino', 'iniciado', 'en_progreso'].includes(newStatus)) {
                setActiveTour(tourId);
                updatedTour.isActive = true;
              } else if (newStatus === 'finalizado') {
                if (activeTour === tourId) {
                  setActiveTour(null);
                }
                updatedTour.isActive = false;
              }
              
              return updatedTour;
            }
            // Desactivar otros tours si se activa uno nuevo
            else if (['en_camino', 'iniciado', 'en_progreso'].includes(newStatus)) {
              return { ...tour, isActive: false };
            }
            return tour;
          })
        );

        toast.success(`Tour ${newStatus.replace('_', ' ')}`);
        return true;
      } else {
        throw new Error(response.message || 'Error al actualizar tour');
      }
    } catch (err) {
      console.error('Error updating tour status:', err);
      toast.error('Error al actualizar el estado del tour');
      return false;
    }
  };

  // Obtener tour por ID
  const getTourById = (tourId) => {
    return tours.find(tour => tour.id === tourId);
  };

  // Verificar si puede cambiar estado
  const canChangeStatus = (tour, newStatus) => {
    if (!tour) return false;
    
    const statusFlow = {
      'asignado': ['en_camino'],
      'en_camino': ['iniciado'],
      'iniciado': ['en_progreso'],
      'en_progreso': ['finalizado'],
      'finalizado': []
    };

    return statusFlow[tour.status]?.includes(newStatus) || false;
  };

  // Obtener tours por estado
  const getToursByStatus = (status) => {
    return tours.filter(tour => tour.status === status);
  };

  // Estadísticas básicas
  const getStats = () => {
    return {
      total: tours.length,
      pending: tours.filter(t => t.status === 'asignado').length,
      active: tours.filter(t => ['en_camino', 'iniciado', 'en_progreso'].includes(t.status)).length,
      completed: tours.filter(t => t.status === 'finalizado').length,
      totalTourists: tours.reduce((sum, tour) => sum + (tour.tourists || 0), 0)
    };
  };

  // Cargar tours al montar el componente
  useEffect(() => {
    if (user?.role === 'guide') {
      loadGuideTours();
    }
  }, [user?.id]);

  return {
    tours,
    loading,
    error,
    activeTour,
    loadGuideTours,
    updateTourStatus,
    getTourById,
    canChangeStatus,
    getToursByStatus,
    getStats,
    refresh: loadGuideTours
  };
};

export default useGuideTours;