import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGuidesStore } from '../stores/guidesStore';
import {
  TIME_SLOT_CONFIG,
  SLOT_STATUS,
  GUIDE_TYPES,
  DISPLAY_LIMITS,
  DATE_NAVIGATION
} from '../constants/guideAvailabilityConstants';

/**
 * Hook para manejar la disponibilidad de guías
 * @param {string} guideId - ID del guía
 * @param {Function} onAvailabilityChange - Callback cuando cambia la disponibilidad
 * @returns {Object} Estado y funciones de disponibilidad
 */
const useGuideAvailability = (guideId, onAvailabilityChange) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { getGuideAgenda, updateGuideAgenda } = useGuidesStore();

  const loadAvailability = useCallback(() => {
    setIsLoading(true);
    const agenda = getGuideAgenda(guideId, selectedDate);
    setAvailability(agenda);
    setIsLoading(false);
  }, [guideId, selectedDate, getGuideAgenda]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);


  const updateAvailability = useCallback((newAvailability) => {
    setAvailability(newAvailability);
    updateGuideAgenda(guideId, selectedDate, newAvailability);
    if (onAvailabilityChange) {
      onAvailabilityChange(selectedDate, newAvailability);
    }
  }, [guideId, selectedDate, updateGuideAgenda, onAvailabilityChange]);

  const addTimeSlot = useCallback((timeSlot) => {
    if (timeSlot && TIME_SLOT_CONFIG.PATTERN.test(timeSlot)) {
      const updatedAvailability = {
        ...availability,
        disponible: true,
        horarios: [...(availability?.horarios || []), timeSlot]
      };
      updateAvailability(updatedAvailability);
      return true;
    }
    return false;
  }, [availability, updateAvailability]);

  const removeTimeSlot = useCallback((index) => {
    const updatedAvailability = {
      ...availability,
      horarios: availability.horarios.filter((_, i) => i !== index)
    };
    if (updatedAvailability.horarios.length === 0) {
      updatedAvailability.disponible = false;
    }
    updateAvailability(updatedAvailability);
  }, [availability, updateAvailability]);

  const toggleAvailability = useCallback(() => {
    const updatedAvailability = {
      disponible: !availability?.disponible,
      horarios: availability?.disponible ? [] : [TIME_SLOT_CONFIG.DEFAULT_SLOT]
    };
    updateAvailability(updatedAvailability);
  }, [availability, updateAvailability]);

  const changeDate = useCallback((days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  }, [selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    availability,
    isLoading,
    addTimeSlot,
    removeTimeSlot,
    toggleAvailability,
    changeDate
  };
};

/**
 * Hook para manejar disponibilidad de guías freelance
 * @returns {Object} Estado y funciones para freelance
 */
export const useFreelanceAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [freelanceGuides, setFreelanceGuides] = useState([]);
  
  const { getGuides, getGuideAgenda } = useGuidesStore();

  useEffect(() => {
    const guides = getGuides({ tipo: GUIDE_TYPES.FREELANCE });
    setFreelanceGuides(guides);
  }, [getGuides]);

  const changeDate = useCallback((days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  }, [selectedDate]);

  const getGuideAvailabilityInfo = useCallback((guide) => {
    const agenda = getGuideAgenda(guide.id, selectedDate);
    
    // Create specialties safely
    const languages = guide.specializations?.languages?.map(lang => lang.code.toUpperCase()) || [];
    const museums = guide.specializations?.museums?.map(museum => museum.name) || [];
    const specialties = [...languages, ...museums.slice(0, DISPLAY_LIMITS.MAX_MUSEUMS)];
    
    // Check availability
    const availableSlots = agenda?.slots?.filter(slot => slot.status === SLOT_STATUS.AVAILABLE) || [];
    const isAvailable = availableSlots.length > 0;
    const busySlots = agenda?.slots?.filter(slot => slot.status === SLOT_STATUS.BUSY) || [];
    
    return {
      agenda,
      specialties,
      availableSlots,
      isAvailable,
      busySlots
    };
  }, [selectedDate, getGuideAgenda]);

  return {
    selectedDate,
    setSelectedDate,
    freelanceGuides,
    changeDate,
    getGuideAvailabilityInfo,
    
    // Constantes
    GUIDE_TYPES,
    SLOT_STATUS,
    DATE_NAVIGATION
  };
};

export default useGuideAvailability;