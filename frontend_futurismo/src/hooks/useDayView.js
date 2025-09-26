import { useState, useEffect } from 'react';
import { format, isToday } from 'date-fns';
import useIndependentAgendaStore from '../stores/independentAgendaStore';
import useAuthStore from '../stores/authStore';

const useDayView = () => {
  const { user } = useAuthStore();
  const { 
    selectedDate, 
    currentGuide,
    actions: { getGuideCompleteAgenda, getGuideAvailability }
  } = useIndependentAgendaStore();

  const [dayEvents, setDayEvents] = useState([]);
  const [allDayEvents, setAllDayEvents] = useState([]);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isCurrentDay = isToday(selectedDate);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Load day events
  useEffect(() => {
    if (isAdmin && currentGuide) {
      // Admin view: only availability
      const availability = getGuideAvailability(currentGuide, selectedDate);
      setAvailabilityData(availability);
      setDayEvents(availability?.occupiedSlots || []);
      setAllDayEvents([]);
    } else if (!isAdmin && user?.id) {
      // Guide view: complete agenda
      const agenda = getGuideCompleteAgenda(user.id, selectedDate);
      const events = agenda?.allEvents || [];
      
      // Separate all-day events
      const allDay = events.filter(event => event.allDay);
      const timedEvents = events.filter(event => !event.allDay);
      
      setAllDayEvents(allDay);
      setDayEvents(timedEvents);
      setAvailabilityData(null);
    }
  }, [selectedDate, currentGuide, user?.id, isAdmin, getGuideAvailability, getGuideCompleteAgenda]);

  const handleTimeSlotClick = (hour, minutes = 0, onTimeSlotClick) => {
    const clickDate = new Date(selectedDate);
    clickDate.setHours(hour, minutes, 0, 0);
    
    const timeString = format(clickDate, 'HH:mm');
    
    if (onTimeSlotClick) {
      onTimeSlotClick(selectedDate, timeString);
    }
  };

  const handleEventClick = (event, onEventClick) => {
    setSelectedEvent(event);
    
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleEventDoubleClick = (event, onEventEdit) => {
    if (onEventEdit) {
      onEventEdit(event);
    }
  };

  const handleSlotHover = (hour, isHovering) => {
    if (isHovering) {
      setHoveredSlot(hour);
    } else {
      setHoveredSlot(null);
    }
  };

  const handleDragOver = (e, hour) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(hour);
  };

  const handleDragLeave = (e) => {
    // Only clear if we really left the area
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOver(null);
    }
  };

  const handleDrop = (e, hour) => {
    e.preventDefault();
    setDraggedOver(null);
    setIsDragging(false);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { eventId, eventType, startTime, endTime } = dragData;
      
      // TODO: Integrate with store to move event
      console.log('Event dropped:', {
        eventId,
        originalTime: startTime,
        newHour: hour,
        newDate: format(selectedDate, 'yyyy-MM-dd')
      });
      
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const getCurrentTimePosition = () => {
    if (!isCurrentDay) return null;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (hours < 6 || hours > 22) return null;
    
    const hourIndex = hours - 6;
    const minutePercent = minutes / 60;
    const position = (hourIndex + minutePercent) * 60; // 60px per hour
    
    return position;
  };

  const getEventsForHour = (hour) => {
    return dayEvents.filter(event => {
      const eventHour = parseInt(event.startTime?.split(':')[0] || '0');
      return eventHour === hour;
    });
  };

  return {
    // State
    dayEvents,
    allDayEvents,
    availabilityData,
    currentTime,
    hoveredSlot,
    selectedEvent,
    draggedOver,
    isDragging,
    isAdmin,
    isCurrentDay,
    
    // Handlers
    handleTimeSlotClick,
    handleEventClick,
    handleEventDoubleClick,
    handleSlotHover,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnter,
    
    // Utils
    getCurrentTimePosition,
    getEventsForHour
  };
};

export default useDayView;