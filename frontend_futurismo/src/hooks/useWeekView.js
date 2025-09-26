import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import useIndependentAgendaStore from '../stores/independentAgendaStore';
import useAuthStore from '../stores/authStore';

const useWeekView = () => {
  const { user } = useAuthStore();
  const { 
    selectedDate, 
    currentGuide,
    actions: { getGuideCompleteAgenda, getGuideAvailability }
  } = useIndependentAgendaStore();

  const [weekEvents, setWeekEvents] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  const isAdmin = user?.role === 'admin';
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday as first day
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 10 PM

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Load week events
  useEffect(() => {
    const eventsData = {};
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const currentWeekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    currentWeekDays.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      
      if (isAdmin && currentGuide) {
        // Admin view: only availability
        const availability = getGuideAvailability(currentGuide, day);
        eventsData[dateKey] = availability?.occupiedSlots || [];
      } else if (!isAdmin && user?.id) {
        // Guide view: complete agenda
        const agenda = getGuideCompleteAgenda(user.id, day);
        eventsData[dateKey] = agenda?.allEvents?.filter(event => !event.allDay) || [];
      }
    });

    setWeekEvents(eventsData);
  }, [selectedDate, currentGuide, user?.id, isAdmin, getGuideAvailability, getGuideCompleteAgenda]);

  const handleSlotHover = (day, hour, isHovering) => {
    if (isHovering) {
      setHoveredSlot(`${format(day, 'yyyy-MM-dd')}-${hour}`);
    } else {
      setHoveredSlot(null);
    }
  };

  const handleDragOver = (e, day, hour) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(`${format(day, 'yyyy-MM-dd')}-${hour}`);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOver(null);
    }
  };

  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    setDraggedOver(null);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { eventId, eventType, startTime, endTime } = dragData;
      
      console.log('Event dropped in week view:', {
        eventId,
        originalTime: startTime,
        newDay: format(day, 'yyyy-MM-dd'),
        newHour: hour
      });
      
      // TODO: Integrate with store to move event
      
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (hours < 6 || hours > 22) return null;
    
    const hourIndex = hours - 6;
    const minutePercent = minutes / 60;
    const position = (hourIndex + minutePercent) * 60; // 60px per hour
    
    return position;
  };

  const getEventsForSlot = (day, hour) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayEvents = weekEvents[dateKey] || [];
    
    // Only show events that START at this exact hour
    const hourEvents = dayEvents.filter(event => {
      const eventHour = parseInt(event.startTime?.split(':')[0] || '0');
      return eventHour === hour;
    });

    return hourEvents;
  };

  const isSlotOccupied = (day, hour) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayEvents = weekEvents[dateKey] || [];
    
    return dayEvents.some(event => {
      const eventHour = parseInt(event.startTime?.split(':')[0] || '0');
      const endHour = parseInt(event.endTime?.split(':')[0] || '0');
      return eventHour <= hour && endHour > hour;
    });
  };

  const currentTimePosition = getCurrentTimePosition();
  const todayColumn = weekDays.findIndex(day => isToday(day));

  const totalEvents = Object.values(weekEvents).reduce((total, dayEvents) => 
    total + dayEvents.length, 0
  );

  return {
    weekStart,
    weekDays,
    hours,
    weekEvents,
    currentTime,
    hoveredSlot,
    selectedEvent,
    draggedOver,
    isAdmin,
    currentTimePosition,
    todayColumn,
    totalEvents,
    setSelectedEvent,
    handleSlotHover,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    getEventsForSlot,
    isSlotOccupied
  };
};

export default useWeekView;