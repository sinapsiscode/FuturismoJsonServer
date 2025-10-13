import { useState, useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import useIndependentAgendaStore from '../stores/independentAgendaStore';
import useGuidesStore from '../stores/guidesStore';

const useCalendarSidebar = () => {
  const { user } = useAuthStore();
  const { currentGuide, actions: { setCurrentGuide } } = useIndependentAgendaStore();
  const { guides: guidesData, fetchGuides } = useGuidesStore();

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

  // Load guides from API
  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

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

  // Transform guides data to the format needed by the sidebar
  const guides = (guidesData || []).map(guide => ({
    id: guide.id,
    name: guide.name || `${guide.firstName || ''} ${guide.lastName || ''}`.trim(),
    online: guide.isOnline || guide.online || false,
    role: guide.type || guide.guideType || 'freelance'
  }));

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