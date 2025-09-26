import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useLayout } from '../contexts/LayoutContext';
import { 
  HomeIcon, 
  MapIcon, 
  CalendarIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon, 
  UserIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  ChartBarIcon,
  StarIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const useSidebarMenu = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { closeSidebar, viewport } = useLayout();

  const iconMap = {
    HomeIcon,
    MapIcon,
    CalendarIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    UserIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    BuildingOffice2Icon,
    ShieldCheckIcon,
    ChartBarIcon,
    StarIcon,
    UserCircleIcon,
    CurrencyDollarIcon,
    MagnifyingGlassIcon,
    BriefcaseIcon,
    ClipboardDocumentListIcon
  };

  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: HomeIcon, label: t('navigation.dashboard') }
    ];
    
    if (user?.role === 'agency') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: t('navigation.monitoring') },
        { path: '/services', icon: ClipboardDocumentListIcon, label: t('navigation.services') },
        { path: '/reservations', icon: CalendarIcon, label: t('navigation.reservations') },
        { path: '/marketplace', icon: MagnifyingGlassIcon, label: t('navigation.searchGuides') },
        { path: '/marketplace/requests', icon: BriefcaseIcon, label: t('navigation.myContracts') },
        { path: '/agency/calendar', icon: CalendarDaysIcon, label: t('navigation.calendar') },
        { path: '/agency/reports', icon: ChartBarIcon, label: t('navigation.reports') },
        { path: '/agency/points', icon: StarIcon, label: t('navigation.points') },
        { path: '/history', icon: ClockIcon, label: t('navigation.history') },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') },
        { path: '/profile', icon: UserIcon, label: t('navigation.profile') }
      ];
    } else if (user?.role === 'guide') {
      const guideItems = [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: t('navigation.myTours') },
        { path: '/history', icon: ClockIcon, label: t('navigation.history') },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') }
      ];
      
      if (user?.guideType === 'freelance') {
        guideItems.splice(-1, 0, 
          { path: '/agenda', icon: CalendarDaysIcon, label: t('navigation.myAgenda') },
          { path: '/marketplace/guide-dashboard', icon: BriefcaseIcon, label: t('navigation.myServices') },
          { path: '/guide/finances', icon: CurrencyDollarIcon, label: t('navigation.finances') }
        );
      }
      
      guideItems.splice(-1, 0, { path: '/emergency', icon: ShieldCheckIcon, label: t('navigation.emergencies') });
      guideItems.push({ path: '/profile', icon: UserIcon, label: t('navigation.profile') });
      return guideItems;
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: t('navigation.monitoring') },
        { path: '/services', icon: ClipboardDocumentListIcon, label: t('navigation.services') },
        { path: '/admin/reservations', icon: CalendarIcon, label: t('navigation.reservationManagement') },
        { path: '/assignments', icon: UserCircleIcon, label: t('navigation.assignments') },
        { path: '/guides', icon: UserIcon, label: t('navigation.guides') },
        { path: '/marketplace', icon: MagnifyingGlassIcon, label: t('navigation.marketplace') },
        { path: '/providers', icon: BuildingOffice2Icon, label: t('navigation.providers') },
        { path: '/emergency', icon: ShieldCheckIcon, label: t('navigation.emergencies') },
        { path: '/agenda', icon: CalendarDaysIcon, label: t('navigation.coordination') },
        { path: '/admin/reports', icon: ChartBarIcon, label: t('navigation.reports') },
        { path: '/history', icon: DocumentTextIcon, label: t('navigation.history') },
        { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') },
        { path: '/users', icon: UserGroupIcon, label: t('navigation.users') },
        { path: '/profile', icon: UserIcon, label: t('navigation.profile') }
      ];
    }
    
    return baseItems;
  };

  const handleNavClick = () => {
    if (viewport.isMobile) {
      closeSidebar();
    }
  };

  return {
    menuItems: getMenuItems(),
    handleNavClick,
    iconMap
  };
};

export default useSidebarMenu;