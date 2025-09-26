import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays 
} from 'date-fns';
import useIndependentAgendaStore from '../stores/independentAgendaStore';
import useAuthStore from '../stores/authStore';
import { 
  EVENT_TYPES, 
  CALENDAR_CONFIG, 
  CALENDAR_VIEWS,
  USER_ROLES
} from '../constants/monthViewConstants';

const useMonthView = () => {
  const { user } = useAuthStore();
  const { 
    selectedDate, 
    currentGuide,
    actions: { 
      getGuideCompleteAgenda, 
      getGuideAvailability, 
      setSelectedDate,
      setCurrentView
    }
  } = useIndependentAgendaStore();

  const [monthEvents, setMonthEvents] = useState({});
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: CALENDAR_CONFIG.WEEK_START_DAY });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: CALENDAR_CONFIG.WEEK_START_DAY });

  // Load month events
  useEffect(() => {
    const eventsData = {};
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const dateKey = format(currentDate, CALENDAR_CONFIG.DATE_FORMAT);
      
      if (isAdmin && currentGuide) {
        // Admin view: only availability
        const availability = getGuideAvailability(currentGuide, currentDate);
        eventsData[dateKey] = {
          events: availability?.occupiedSlots || [],
          availability: availability?.availableSlots || []
        };
      } else if (!isAdmin && user?.id) {
        // Guide view: complete agenda
        const agenda = getGuideCompleteAgenda(user.id, currentDate);
        eventsData[dateKey] = {
          events: agenda?.allEvents || [],
          availability: []
        };
      }

      currentDate = addDays(currentDate, 1);
    }

    setMonthEvents(eventsData);
  }, [selectedDate, currentGuide, user?.id, isAdmin, getGuideAvailability, getGuideCompleteAgenda, startDate, endDate]);

  const handleDateHover = (date, isHovering) => {
    if (isHovering) {
      setHoveredDate(format(date, CALENDAR_CONFIG.DATE_FORMAT));
    } else {
      setHoveredDate(null);
    }
  };

  const getDayEventIndicators = (date) => {
    const dateKey = format(date, CALENDAR_CONFIG.DATE_FORMAT);
    const dayData = monthEvents[dateKey] || { events: [], availability: [] };
    
    const personalEvents = dayData.events.filter(e => e.type === EVENT_TYPES.PERSONAL).length;
    const companyTours = dayData.events.filter(e => e.type === EVENT_TYPES.COMPANY_TOUR).length;
    const occupiedSlots = dayData.events.filter(e => e.type === EVENT_TYPES.OCCUPIED).length;
    const availableSlots = dayData.availability.length;

    return {
      personalEvents,
      companyTours,
      occupiedSlots,
      availableSlots,
      hasEvents: dayData.events.length > 0,
      hasAvailability: availableSlots > 0,
      totalEvents: dayData.events.length
    };
  };

  const handleEventBadgeClick = (date, eventType, event, onEventClick) => {
    event.preventDefault();
    event.stopPropagation();
    
    const dateKey = format(date, CALENDAR_CONFIG.DATE_FORMAT);
    const dayData = monthEvents[dateKey] || { events: [] };
    const eventsOfType = dayData.events.filter(e => e.type === eventType);
    
    if (eventsOfType.length === 1 && onEventClick) {
      // If only one event, click it directly
      onEventClick(eventsOfType[0]);
    } else {
      // If multiple events, go to day view
      setSelectedDate(date);
      setCurrentView(CALENDAR_VIEWS.DAY);
    }
  };

  const totalEvents = Object.values(monthEvents).reduce((total, dayData) => 
    total + (dayData.events?.length || 0), 0
  );

  const availableDays = Object.values(monthEvents).filter(dayData => 
    (dayData.availability?.length || 0) > 0
  ).length;

  return {
    monthStart,
    monthEnd,
    startDate,
    endDate,
    monthEvents,
    hoveredDate,
    selectedEvent,
    isAdmin,
    totalEvents,
    availableDays,
    setSelectedDate,
    setCurrentView,
    setSelectedEvent,
    handleDateHover,
    getDayEventIndicators,
    handleEventBadgeClick
  };
};

export default useMonthView;