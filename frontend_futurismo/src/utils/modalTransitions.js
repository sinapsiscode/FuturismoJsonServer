/**
 * Utilidades para manejar transiciones suaves en modales
 */

/**
 * Cierra un modal con animación suave
 * @param {Function} onClose - Función callback para cerrar el modal
 * @param {HTMLElement} modalElement - Elemento del modal (opcional)
 */
export const closeModalWithAnimation = (onClose, modalElement = null) => {
  // Buscar el elemento del modal si no se proporciona
  const modal = modalElement || document.querySelector('.modal-overlay');
  
  if (modal) {
    // Añadir clase de cierre para activar animaciones
    modal.classList.add('modal-closing');
    
    // Esperar a que termine la animación (1 segundo) antes de cerrar
    setTimeout(() => {
      onClose();
    }, 1000);
  } else {
    // Si no hay modal, cerrar inmediatamente
    onClose();
  }
};

/**
 * Abre un modal con animación de entrada personalizada
 * @param {Function} onOpen - Función callback para abrir el modal
 * @param {string} animationType - Tipo de animación ('scale', 'slide', 'fade')
 */
export const openModalWithAnimation = (onOpen, animationType = 'scale') => {
  onOpen();
  
  // Aplicar animación específica después de que el modal se monte
  setTimeout(() => {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.classList.add(`modal-animation-${animationType}`);
    }
  }, 50);
};

/**
 * Maneja la transición entre modales diferentes
 * @param {Function} closeCurrentModal - Función para cerrar el modal actual
 * @param {Function} openNewModal - Función para abrir el nuevo modal
 * @param {number} delay - Delay entre cierre y apertura (ms)
 */
export const transitionBetweenModals = (closeCurrentModal, openNewModal, delay = 500) => {
  const currentModal = document.querySelector('.modal-overlay');
  
  if (currentModal) {
    // Aplicar animación de transición
    currentModal.classList.add('modal-transition-exit');
    
    setTimeout(() => {
      closeCurrentModal();
      
      setTimeout(() => {
        openNewModal();
        
        // Aplicar animación de entrada al nuevo modal
        setTimeout(() => {
          const newModal = document.querySelector('.modal-overlay');
          if (newModal) {
            newModal.classList.add('modal-transition-enter');
          }
        }, 50);
      }, 100);
    }, delay);
  } else {
    openNewModal();
  }
};

/**
 * Añade listeners para cerrar modal con Escape
 * @param {Function} onClose - Función callback para cerrar el modal
 */
export const addModalKeyListeners = (onClose) => {
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      closeModalWithAnimation(onClose);
      document.removeEventListener('keydown', handleEscape);
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  
  // Retornar función para limpiar el listener
  return () => document.removeEventListener('keydown', handleEscape);
};

/**
 * Añade listener para cerrar modal al hacer clic en el overlay
 * @param {Function} onClose - Función callback para cerrar el modal
 */
export const addModalOverlayListener = (onClose) => {
  const handleOverlayClick = (event) => {
    if (event.target.classList.contains('modal-overlay')) {
      closeModalWithAnimation(onClose);
    }
  };
  
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.addEventListener('click', handleOverlayClick);
    
    // Retornar función para limpiar el listener
    return () => modal.removeEventListener('click', handleOverlayClick);
  }
  
  return () => {};
};

/**
 * Hook de utilidad para React que maneja todas las funcionalidades de modal
 * @param {Function} onClose - Función callback para cerrar el modal
 * @param {Object} options - Opciones adicionales
 */
export const useModalTransitions = (onClose, options = {}) => {
  const {
    closeOnEscape = true,
    closeOnOverlay = true,
    animationType = 'scale'
  } = options;
  
  // Esta función se puede usar en useEffect de React
  const setupModal = () => {
    const cleanupFunctions = [];
    
    if (closeOnEscape) {
      cleanupFunctions.push(addModalKeyListeners(onClose));
    }
    
    if (closeOnOverlay) {
      cleanupFunctions.push(addModalOverlayListener(onClose));
    }
    
    // Retornar función de limpieza
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  };
  
  return {
    closeWithAnimation: () => closeModalWithAnimation(onClose),
    setupModal,
    transitionTo: (newOnOpen) => transitionBetweenModals(onClose, newOnOpen)
  };
};

export default {
  closeModalWithAnimation,
  openModalWithAnimation,
  transitionBetweenModals,
  addModalKeyListeners,
  addModalOverlayListener,
  useModalTransitions
};