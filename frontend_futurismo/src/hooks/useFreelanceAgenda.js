import { useState, useEffect } from 'react';
import { useUsersStore } from '../../stores/usersStoreSimple';
import useAuthStore from '../../stores/authStore';

const useFreelanceAgenda = () => {
  const { user } = useAuthStore();
  const { getUserById, updateUser } = useUsersStore();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('week');
  const [freelanceUser, setFreelanceUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFreelanceUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // En producción, usar el ID del usuario autenticado
        const userId = user?.id || 'user-6'; // Fallback temporal
        const freelancer = getUserById(userId);
        
        if (!freelancer) {
          throw new Error('Usuario no encontrado');
        }
        
        setFreelanceUser(freelancer);
      } catch (err) {
        console.error('Error loading freelance user:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadFreelanceUser();
  }, [user, getUserById]);

  const getAvailabilityForDate = (date) => {
    if (!freelanceUser?.agenda) return { disponible: false, horarios: [] };
    return freelanceUser.agenda[date] || { disponible: false, horarios: [] };
  };

  const updateAvailability = async (date, availability) => {
    if (!freelanceUser) return;

    try {
      const updatedAgenda = {
        ...freelanceUser.agenda,
        [date]: availability
      };

      const updatedUser = {
        ...freelanceUser,
        agenda: updatedAgenda
      };

      await updateUser(freelanceUser.id, updatedUser);
      setFreelanceUser(updatedUser);
      
      return { success: true };
    } catch (err) {
      console.error('Error updating availability:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const toggleDayAvailability = async (date) => {
    const current = getAvailabilityForDate(date);
    return await updateAvailability(date, {
      disponible: !current.disponible,
      horarios: current.disponible ? [] : ['09:00-17:00']
    });
  };

  const addTimeSlot = async (date, timeSlot) => {
    const current = getAvailabilityForDate(date);
    const newHorarios = [...current.horarios, timeSlot];
    return await updateAvailability(date, {
      disponible: true,
      horarios: newHorarios
    });
  };

  const removeTimeSlot = async (date, slotIndex) => {
    const current = getAvailabilityForDate(date);
    const newHorarios = current.horarios.filter((_, index) => index !== slotIndex);
    return await updateAvailability(date, {
      disponible: newHorarios.length > 0,
      horarios: newHorarios
    });
  };

  const updateTimeSlot = async (date, slotIndex, newTimeSlot) => {
    const current = getAvailabilityForDate(date);
    const newHorarios = [...current.horarios];
    newHorarios[slotIndex] = newTimeSlot;
    return await updateAvailability(date, {
      disponible: true,
      horarios: newHorarios
    });
  };

  return {
    // Estado
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    freelanceUser,
    isLoading,
    error,
    
    // Funciones
    getAvailabilityForDate,
    toggleDayAvailability,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    
    // Utilidades
    clearError: () => setError(null)
  };
};

export default useFreelanceAgenda;