import { useState, useEffect } from 'react';
import { useIsDesktop } from './useMediaQuery';

const useLayout = () => {
  const isDesktop = useIsDesktop();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-open sidebar on desktop
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const showMobileOverlay = sidebarOpen && !isDesktop;

  const mainContentClassName = `flex-1 flex flex-col overflow-hidden ${
    sidebarOpen && !isDesktop ? 'ml-64' : ''
  }`;

  return {
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    showMobileOverlay,
    isDesktop,
    mainContentClassName
  };
};

export default useLayout;