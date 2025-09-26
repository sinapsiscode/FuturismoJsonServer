import React from 'react';
import { Outlet } from 'react-router-dom';
import useLayout from '../../hooks/useLayout';
import SidebarEnhanced from './SidebarEnhanced';
import Header from './Header';
import MobileOverlay from './MobileOverlay';
import NotificationCenter from '../notifications/NotificationCenter';

const Layout = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    showMobileOverlay,
    isDesktop,
    mainContentClassName
  } = useLayout();

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile-first responsive overlay */}
      <MobileOverlay 
        isVisible={showMobileOverlay}
        onClick={closeSidebar}
      />

      {/* Mobile-first responsive sidebar */}
      <SidebarEnhanced 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        isMobile={!isDesktop}
      />

      {/* Mobile-first responsive main content area */}
      <div className={`${mainContentClassName} min-w-0 flex-1`}>
        <Header 
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        {/* Mobile-first responsive main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 relative">
          <div className="
            w-full max-w-none sm:max-w-screen-2xl mx-auto 
            px-3 sm:px-4 md:px-6 lg:px-8 
            py-3 sm:py-4 md:py-6 lg:py-8
            min-h-full
          ">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile-first responsive notification center */}
      <NotificationCenter />
    </div>
  );
};

export default Layout;