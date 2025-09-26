import { useState } from 'react';
import { 
  format, 
  addDays, 
  subDays, 
  addWeeks, 
  subWeeks, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  CalendarDaysIcon, 
  Squares2X2Icon, 
  ViewColumnsIcon, 
  TableCellsIcon 
} from '@heroicons/react/24/solid';
import useIndependentAgendaStore from '../stores/independentAgendaStore';
import useAuthStore from '../stores/authStore';

const useFantasticalLayout = () => {
  const { user } = useAuthStore();
  const { 
    currentView, 
    selectedDate, 
    actions: { setCurrentView, setSelectedDate }
  } = useIndependentAgendaStore();

  const [isLoading, setIsLoading] = useState(false);

  const viewOptions = [
    { key: 'day', label: 'calendar.views.day', icon: CalendarDaysIcon },
    { key: 'week', label: 'calendar.views.week', icon: ViewColumnsIcon },
    { key: 'month', label: 'calendar.views.month', icon: Squares2X2Icon },
    { key: 'year', label: 'calendar.views.year', icon: TableCellsIcon }
  ];

  const navigateDate = (direction) => {
    setIsLoading(true);
    let newDate = new Date(selectedDate);

    switch (currentView) {
      case 'day':
        newDate = direction === 'prev' ? subDays(selectedDate, 1) : addDays(selectedDate, 1);
        break;
      case 'week':
        newDate = direction === 'prev' ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1);
        break;
      case 'month':
        newDate = direction === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1);
        break;
      case 'year':
        newDate = direction === 'prev' ? subMonths(selectedDate, 12) : addMonths(selectedDate, 12);
        break;
    }

    setSelectedDate(newDate);
    setTimeout(() => setIsLoading(false), 150);
  };

  const goToToday = () => {
    setIsLoading(true);
    setSelectedDate(new Date());
    setTimeout(() => setIsLoading(false), 150);
  };

  const getDateTitle = (locale = es) => {
    switch (currentView) {
      case 'day':
        return format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale });
      case 'week':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return `${format(weekStart, 'd MMM', { locale })} - ${format(weekEnd, 'd MMM yyyy', { locale })}`;
      case 'month':
        return format(selectedDate, "MMMM 'de' yyyy", { locale });
      case 'year':
        return format(selectedDate, 'yyyy');
      default:
        return '';
    }
  };

  const getCurrentViewIcon = () => {
    const currentViewOption = viewOptions.find(option => option.key === currentView);
    return currentViewOption ? currentViewOption.icon : CalendarDaysIcon;
  };

  const handleViewChange = (viewKey) => {
    setIsLoading(true);
    setCurrentView(viewKey);
    setTimeout(() => setIsLoading(false), 150);
  };

  return {
    user,
    currentView,
    selectedDate,
    isLoading,
    viewOptions,
    navigateDate,
    goToToday,
    getDateTitle,
    getCurrentViewIcon,
    handleViewChange
  };
};

export default useFantasticalLayout;