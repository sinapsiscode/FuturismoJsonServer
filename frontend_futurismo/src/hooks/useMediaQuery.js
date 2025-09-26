import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si una media query coincide
 * @param {string} query - Media query string (ej: '(min-width: 768px)')
 * @returns {boolean} True si la media query coincide
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    // SSR safe - retorna false si window no está definido
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // Función para manejar cambios
    const listener = (event) => {
      setMatches(event.matches);
    };

    // Establecer el valor inicial (por si cambió durante SSR)
    setMatches(media.matches);

    // Agregar listener con compatibilidad para navegadores antiguos
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener); // Fallback para navegadores antiguos
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener); // Fallback para navegadores antiguos
      }
    };
  }, [query]);

  return matches;
};

/**
 * Hook para detectar múltiples media queries a la vez
 * @param {Object} queries - Objeto con nombres y queries
 * @returns {Object} Objeto con los resultados de cada query
 */
export const useMediaQueries = (queries) => {
  const [results, setResults] = useState(() => {
    if (typeof window === 'undefined') {
      return Object.keys(queries).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
    }

    return Object.entries(queries).reduce((acc, [key, query]) => {
      acc[key] = window.matchMedia(query).matches;
      return acc;
    }, {});
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueries = {};
    const handlers = {};

    Object.entries(queries).forEach(([key, query]) => {
      mediaQueries[key] = window.matchMedia(query);
      
      handlers[key] = (event) => {
        setResults(prev => ({
          ...prev,
          [key]: event.matches
        }));
      };

      // Establecer valor inicial
      setResults(prev => ({
        ...prev,
        [key]: mediaQueries[key].matches
      }));

      // Agregar listener
      if (mediaQueries[key].addEventListener) {
        mediaQueries[key].addEventListener('change', handlers[key]);
      } else {
        mediaQueries[key].addListener(handlers[key]);
      }
    });

    // Cleanup
    return () => {
      Object.entries(queries).forEach(([key]) => {
        if (mediaQueries[key]?.removeEventListener) {
          mediaQueries[key].removeEventListener('change', handlers[key]);
        } else if (mediaQueries[key]?.removeListener) {
          mediaQueries[key].removeListener(handlers[key]);
        }
      });
    };
  }, [queries]);

  return results;
};

// Hooks predefinidos para breakpoints comunes (consistentes con Tailwind)
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)');

// Hooks adicionales útiles
export const useIsPortrait = () => useMediaQuery('(orientation: portrait)');
export const useIsLandscape = () => useMediaQuery('(orientation: landscape)');
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const useIsReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useIsTouchDevice = () => useMediaQuery('(hover: none) and (pointer: coarse)');
export const useIsRetina = () => useMediaQuery('(min-resolution: 2dppx)');

export default useMediaQuery;