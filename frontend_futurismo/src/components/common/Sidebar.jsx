// ARCHIVO NO UTILIZADO - El sistema usa SidebarEnhanced.jsx en su lugar
// TODO: Considerar eliminar este archivo si no se va a usar

/*
import { NavLink, Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HomeIcon, MapIcon, CalendarIcon, ClockIcon, ChatBubbleLeftRightIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon, UserGroupIcon, DocumentTextIcon, CalendarDaysIcon, BuildingOffice2Icon, ShieldCheckIcon, ChartBarIcon, StarIcon, UserCircleIcon, CurrencyDollarIcon, MagnifyingGlassIcon, BriefcaseIcon, TruckIcon, GiftIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const location = useLocation();
  
  // Menú diferente según el tipo de usuario
  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: HomeIcon, label: t('navigation.dashboard') }
    ];
    
    if (user?.role === 'agency') {
      return [
        ...baseItems,
        { path: '/monitoring', icon: MapIcon, label: t('navigation.monitoring') },
        { path: '/reservations', icon: CalendarIcon, label: t('navigation.reservations') },
        { path: '/marketplace', icon: MagnifyingGlassIcon, label: t('navigation.searchGuides') },
        { path: '/marketplace/requests', icon: BriefcaseIcon, label: t('navigation.myContracts') },
        { path: '/agency/calendar', icon: CalendarDaysIcon, label: t('navigation.calendar') },
        { path: '/agency/reports', icon: ChartBarIcon, label: t('navigation.reports') },
        { path: '/agency/points', icon: StarIcon, label: 'Mis Puntos' },
        { path: '/agency/rewards', icon: GiftIcon, label: 'Tienda de Premios' },
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
      
      // Agregar opciones específicas para guías freelance
      if (user?.guideType === 'freelance') {
        guideItems.splice(-1, 0, { path: '/agenda', icon: CalendarDaysIcon, label: t('navigation.myAgenda') });
        guideItems.splice(-1, 0, { path: '/marketplace/guide-dashboard', icon: BriefcaseIcon, label: t('navigation.myServices') });
        guideItems.splice(-1, 0, { path: '/guide/finances', icon: CurrencyDollarIcon, label: t('navigation.finances') });
      }
      
      guideItems.splice(-1, 0, { path: '/emergency', icon: ShieldCheckIcon, label: t('navigation.emergencies') });
      guideItems.push({ path: '/profile', icon: UserIcon, label: t('navigation.profile') });
      return guideItems;
    } else if (user?.role === 'admin') {
      try {
        return [
          ...baseItems,
          { path: '/monitoring', icon: MapIcon, label: t('navigation.monitoring') },
          { path: '/admin/reservations', icon: CalendarIcon, label: t('navigation.reservationManagement') },
          { path: '/assignments', icon: UserCircleIcon, label: t('navigation.assignments') },
          { path: '/guides', icon: UserIcon, label: t('navigation.guides') },
          { path: '/clients', icon: BuildingOffice2Icon, label: 'Agencias' },
          { path: '/drivers', icon: TruckIcon, label: 'Choferes' },
          { path: '/vehicles', icon: TruckIcon, label: 'Vehículos' },
          { path: '/marketplace', icon: MagnifyingGlassIcon, label: t('navigation.marketplace') },
          { path: '/providers', icon: BuildingOffice2Icon, label: t('navigation.providers') },
          { path: '/emergency', icon: ShieldCheckIcon, label: t('navigation.emergencies') },
          { path: '/agenda', icon: CalendarDaysIcon, label: t('navigation.coordination') },
          { path: '/admin/reports', icon: ChartBarIcon, label: t('navigation.reports') },
          { path: '/admin/rewards', icon: GiftIcon, label: 'Sistema de Premios' },
          { path: '/history', icon: DocumentTextIcon, label: t('navigation.history') },
          { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') },
          { path: '/users', icon: UserGroupIcon, label: t('navigation.users') },
          { path: '/profile', icon: UserIcon, label: t('navigation.profile') }
        ];
      } catch (error) {
        console.error('Error generating admin menu:', error);
        return baseItems;
      }
    }
    
    return baseItems;
  };
  
  const menuItems = getMenuItems();
  
  // Debug: verificar que los items se generen correctamente
  console.log('Sidebar rendering for user:', user);
  console.log('Menu items generated:', menuItems);
  
  // Routes that should only match exactly (not as prefixes)
  const exactMatchRoutes = ['/marketplace', '/dashboard', '/monitoring', '/reservations', '/history', '/chat', '/profile'];

  return (
    <aside className={`
      ${isOpen ? 'w-64' : 'w-20'} 
      ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative h-screen'}
      ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      bg-white shadow-lg transition-all duration-300 flex flex-col
    `}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
            <span className="text-2xl">🌎</span>
            {isOpen && (
              <h1 className="ml-3 text-xl font-bold text-gray-900">Futurismo</h1>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className={`p-1 rounded-lg hover:bg-gray-100 transition-colors ${isMobile ? 'hidden' : 'block'}`}
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto min-h-0">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            // Lógica mejorada para determinar si está activo
            let isActive = false;
            if (item.path === '/marketplace') {
              // Para /marketplace, solo activar si es exactamente esa ruta
              isActive = location.pathname === '/marketplace';
            } else if (item.path === '/marketplace/requests') {
              // Para /marketplace/requests, activar si coincide exactamente o es una subruta
              isActive = location.pathname === '/marketplace/requests' || location.pathname.startsWith('/marketplace/requests/');
            } else {
              // Para otras rutas, usar la lógica por defecto
              isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            }
            
            return (
              <li key={`nav-${item.path}`}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors group relative ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="ml-3">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed sidebar */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={`text-center ${!isOpen && 'hidden'}`}>
          <p className="text-xs text-gray-500">
            © 2024 Futurismo
          </p>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

export default Sidebar;
*/