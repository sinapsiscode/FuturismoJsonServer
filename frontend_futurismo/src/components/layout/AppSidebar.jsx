import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLayout } from '../../contexts/LayoutContext';
import useSidebarMenu from '../../hooks/useSidebarMenu';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';

const AppSidebar = () => {
  const { closeSidebar, viewport } = useLayout();
  const { menuItems, handleNavClick } = useSidebarMenu();

  return (
    <div className="h-full bg-white shadow-xl lg:shadow-lg flex flex-col">
      <SidebarHeader 
        isMobile={viewport.isMobile} 
        onClose={closeSidebar} 
      />

      <nav className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto overscroll-contain">
        <ul className="space-y-1 sm:space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => `
                  flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-lg 
                  transition-all duration-200 touch-manipulation
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                    : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                  isActive ? 'text-blue-600 scale-110' : 'text-gray-400'
                }`} />
                <span className="font-medium text-sm sm:text-base truncate flex-1">
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <SidebarFooter />
    </div>
  );
};

export default AppSidebar;