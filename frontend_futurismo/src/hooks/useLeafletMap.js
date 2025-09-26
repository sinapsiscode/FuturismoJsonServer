import { useEffect, useRef, useCallback } from 'react';
import { useLayout } from '../contexts/LayoutContext';

/**
 * Hook personalizado para manejar mapas de Leaflet con responsive
 * @param {Object} mapInstance - Instancia del mapa de Leaflet
 * @param {Object} options - Opciones adicionales
 */
const useLeafletMap = (mapInstance, options = {}) => {
  const { sidebarOpen, viewport } = useLayout();
  const resizeTimeoutRef = useRef(null);
  const lastSidebarState = useRef(sidebarOpen);

  // Función para invalidar el tamaño del mapa
  const invalidateMapSize = useCallback(() => {
    if (mapInstance && typeof mapInstance.invalidateSize === 'function') {
      // Limpiar timeout anterior
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Esperar a que termine la animación del sidebar
      resizeTimeoutRef.current = setTimeout(() => {
        try {
          mapInstance.invalidateSize({
            animate: true,
            duration: 0.25
          });
          
          // Si hay una vista guardada, restaurarla
          if (options.maintainView && options.savedView) {
            mapInstance.setView(options.savedView.center, options.savedView.zoom);
          }
        } catch (error) {
          console.warn('Error al redimensionar el mapa:', error);
        }
      }, 350); // Esperar un poco más que la animación del sidebar (300ms)
    }
  }, [mapInstance, options]);

  // Detectar cambios en el sidebar
  useEffect(() => {
    if (lastSidebarState.current !== sidebarOpen) {
      invalidateMapSize();
      lastSidebarState.current = sidebarOpen;
    }
  }, [sidebarOpen, invalidateMapSize]);

  // Detectar cambios en el viewport
  useEffect(() => {
    const handleResize = () => {
      invalidateMapSize();
    };

    // Debounce para evitar múltiples llamadas
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    };

    window.addEventListener('resize', debouncedResize);
    
    // Invalidar tamaño inicial
    invalidateMapSize();

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [invalidateMapSize]);

  // Función helper para contenedores de mapa
  const getMapContainerStyle = useCallback(() => {
    const baseStyle = {
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: 'calc(100vh - 4rem)' // Altura menos header
    };

    // Ajustar altura en móvil si es necesario
    if (viewport.isMobile && options.mobileHeight) {
      baseStyle.minHeight = options.mobileHeight;
    }

    return baseStyle;
  }, [viewport.isMobile, options.mobileHeight]);

  // Función para manejar pantalla completa
  const toggleFullscreen = useCallback(() => {
    const mapContainer = mapInstance?.getContainer();
    if (!mapContainer) return;

    if (!document.fullscreenElement) {
      mapContainer.requestFullscreen().catch(err => {
        console.error('Error al entrar en pantalla completa:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }, [mapInstance]);

  return {
    invalidateMapSize,
    getMapContainerStyle,
    toggleFullscreen,
    isFullscreen: !!document.fullscreenElement
  };
};

export default useLeafletMap;