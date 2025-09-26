import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import useIndependentAgendaStore from '../stores/independentAgendaStore';

const useCalendarSidebar = () => {
  const { user } = useAuthStore();
  const { currentGuide, actions: { setCurrentGuide } } = useIndependentAgendaStore();
  
  const [expandedSections, setExpandedSections] = useState({
    calendars: true,
    guides: true,
    filters: false
  });

  const [visibleCalendars, setVisibleCalendars] = useState({
    personal: true,
    company: true,
    reservations: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCalendarVisibility = (calendarType) => {
    setVisibleCalendars(prev => ({
      ...prev,
      [calendarType]: !prev[calendarType]
    }));
  };

  const isAdmin = user?.role === 'admin';

  // Mock guides data - should be fetched from API
  const guides = [
    { id: '1', name: 'Carlos Mendoza', online: true, role: 'freelance' },
    { id: '2', name: 'Ana García', online: false, role: 'freelance' },
    { id: '3', name: 'Luis Rivera', online: true, role: 'freelance' },
    { id: 'user123', name: 'María Torres', online: true, role: 'freelance' }
  ];

  return {
    expandedSections,
    visibleCalendars,
    currentGuide,
    guides,
    isAdmin,
    toggleSection,
    toggleCalendarVisibility,
    setCurrentGuide
  };
};

export default useCalendarSidebar;