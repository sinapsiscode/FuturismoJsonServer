import { NavLink, Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  HomeIcon, MapIcon, CalendarIcon, ClockIcon, ChatBubbleLeftRightIcon, 
  UserIcon, ChevronLeftIcon, ChevronRightIcon, UserGroupIcon, DocumentTextIcon, 
  CalendarDaysIcon, BuildingOffice2Icon, ShieldCheckIcon, ChartBarIcon, 
  StarIcon, UserCircleIcon, CurrencyDollarIcon, MagnifyingGlassIcon, 
  BriefcaseIcon, TruckIcon, GiftIcon, Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';

const SidebarEnhanced = ({ isOpen, toggleSidebar, isMobile }) => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const location = useLocation();
  
  // Estructura mejorada del menú con secciones agrupadas
  const getMenuStructure = () => {
    if (user?.role === 'agency') {
      return [
        {
          section: 'Principal',
          items: [
            { path: '/dashboard', icon: HomeIcon, label: t('navigation.dashboard') }
          ]
        },
        {
          section: 'Operaciones',
          items: [
            { path: '/reservations', icon: CalendarIcon, label: t('navigation.reservations') },
            { path: '/services', icon: BriefcaseIcon, label: t('navigation.services') },
            { path: '/clients', icon: UserGroupIcon, label: t('navigation.clients') },
            { path: '/guides', icon: UserCircleIcon, label: t('navigation.guides') }
          ]
        },
        {
          section: 'Marketplace',
          items: [
            { path: '/marketplace', icon: MagnifyingGlassIcon, label: t('navigation.marketplace') },
            { path: '/agency/rewards', icon: GiftIcon, label: 'Tienda de Premios' }
          ]
        },
        {
          section: 'Comunicación',
          items: [
            { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') }
          ]
        },
        {
          section: 'Mi Cuenta',
          items: [
            { path: '/profile', icon: UserIcon, label: t('navigation.profile') }
          ]
        }
      ];
    }
    
    if (user?.role === 'guide') {
      return [
        {
          section: 'Principal',
          items: [
            { path: '/dashboard', icon: HomeIcon, label: t('navigation.dashboard') }
          ]
        },
        {
          section: 'Mi Trabajo',
          items: [
            { path: '/assignments', icon: CalendarIcon, label: t('navigation.myAssignments') },
            { path: '/availability', icon: ClockIcon, label: t('navigation.availability') }
          ]
        },
        {
          section: 'Marketplace',
          items: [
            { path: '/guide/marketplace', icon: MagnifyingGlassIcon, label: t('navigation.marketplace') }
          ]
        },
        {
          section: 'Finanzas',
          items: user?.guideType === 'freelance' ? [
            { path: '/guide/earnings', icon: CurrencyDollarIcon, label: t('navigation.earnings') },
            { path: '/guide/finances', icon: CurrencyDollarIcon, label: t('navigation.finances') }
          ] : [
            { path: '/guide/earnings', icon: CurrencyDollarIcon, label: t('navigation.earnings') }
          ]
        },
        {
          section: 'Comunicación',
          items: [
            { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') }
          ]
        },
        {
          section: 'Mi Cuenta',
          items: [
            { path: '/profile', icon: UserIcon, label: t('navigation.profile') }
          ]
        }
      ];
    }

    // Admin menu
    return [
      {
        section: 'Principal',
        items: [
          { path: '/dashboard', icon: HomeIcon, label: t('navigation.dashboard') },
          { path: '/monitoring', icon: MapIcon, label: t('navigation.monitoring') }
        ]
      },
      {
        section: 'Gestión Operativa',
        items: [
          { path: '/services', icon: BriefcaseIcon, label: t('navigation.services') },
          { path: '/reservations', icon: CalendarIcon, label: t('navigation.reservations') },
          { path: '/tour-assignments', icon: CalendarIcon, label: t('navigation.assignments') },
          { path: '/clients', icon: UserGroupIcon, label: t('navigation.clients') },
          { path: '/guides', icon: UserCircleIcon, label: t('navigation.guides') }
        ]
      },
      {
        section: 'Recursos',
        items: [
          { path: '/drivers', icon: TruckIcon, label: 'Choferes' },
          { path: '/vehicles', icon: TruckIcon, label: 'Vehículos' },
          { path: '/providers', icon: BuildingOffice2Icon, label: t('navigation.providers') }
        ]
      },
      {
        section: 'Marketplace & Premios',
        items: [
          { path: '/marketplace', icon: MagnifyingGlassIcon, label: t('navigation.marketplace') },
          { path: '/admin/rewards', icon: GiftIcon, label: 'Sistema de Premios' }
        ]
      },
      {
        section: 'Seguridad & Control',
        items: [
          { path: '/emergency', icon: ShieldCheckIcon, label: t('navigation.emergencies') },
          { path: '/agenda', icon: CalendarDaysIcon, label: t('navigation.coordination') }
        ]
      },
      {
        section: 'Análisis',
        items: [
          { path: '/admin/reports', icon: ChartBarIcon, label: t('navigation.reports') },
          { path: '/history', icon: DocumentTextIcon, label: t('navigation.history') }
        ]
      },
      {
        section: 'Administración',
        items: [
          { path: '/users', icon: UserGroupIcon, label: t('navigation.users') },
          { path: '/chat', icon: ChatBubbleLeftRightIcon, label: t('navigation.chat') },
          { path: '/profile', icon: UserIcon, label: t('navigation.profile') }
        ]
      }
    ];
  };

  const menuStructure = getMenuStructure();

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
          isActive
            ? 'bg-blue-50 text-blue-700 shadow-sm'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      <item.icon className={`h-5 w-5 mr-3 transition-transform group-hover:scale-110 ${
        location.pathname === item.path ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
      }`} />
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:h-screen`}>
      <div className="flex flex-col h-full">
        {/* Header Section - Fixed */}
        <div className="flex-shrink-0 h-16 px-6 border-b border-gray-200 flex items-center justify-end">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation con scroll */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0">
          {menuStructure.map((section, index) => (
            <div key={section.section} className="space-y-1">
              {/* Título de sección */}
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.section}
              </h3>
              
              {/* Items de la sección */}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
              
              {/* Separador entre secciones (excepto la última) */}
              {index < menuStructure.length - 1 && (
                <div className="pt-4 mt-4 border-t border-gray-100"></div>
              )}
            </div>
          ))}
        </nav>

        {/* Toggle button para desktop */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {isOpen ? (
              <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            )}
          </button>
        )}

        {/* Footer Section - Fixed */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              © 2024 Futurismo FF
            </p>
            <button
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
              title="Configuración"
            >
              <Cog6ToothIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

SidebarEnhanced.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

export default SidebarEnhanced;