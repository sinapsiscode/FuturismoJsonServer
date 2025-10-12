import { useEffect } from 'react';
import { useAppConfigStore } from '../stores/appConfigStore';

/**
 * Hook centralizado para acceder a la configuración de la aplicación
 * Reemplaza el acceso directo a constantes hardcodeadas
 *
 * @example
 * const { system, emergency, guides, app, isLoaded, isLoading } = useConfig();
 * const currencies = system?.currencies || [];
 * const emergencyNumbers = emergency?.emergencyNumbers || {};
 */
export const useConfig = () => {
  const {
    system,
    emergency,
    guides,
    app,
    validationSchemas,
    isLoaded,
    isLoading,
    error,
    loadAllConfig
  } = useAppConfigStore();

  // Auto-load config if not loaded
  useEffect(() => {
    if (!isLoaded && !isLoading && !error) {
      loadAllConfig();
    }
  }, [isLoaded, isLoading, error, loadAllConfig]);

  return {
    // Configuraciones
    system,
    emergency,
    guides,
    app,
    validationSchemas,

    // Estados
    isLoaded,
    isLoading,
    error,

    // Funciones
    reload: loadAllConfig,

    // Helper functions para acceso rápido
    get: {
      // System config helpers
      currencies: () => system?.currencies || [],
      languages: () => system?.languages || [],
      guideTypes: () => system?.guideTypes || {},
      statusValues: () => system?.statusValues || {},
      statusColors: () => system?.statusColors || {},
      priorityColors: () => system?.priorityColors || {},
      documentTypes: () => system?.documentTypes || {},
      contactTypes: () => system?.contactTypes || {},
      dateFormats: () => system?.dateFormats || {},
      validationPatterns: () => system?.validationPatterns || {},
      fileSizeLimits: () => system?.fileSizeLimits || {},
      acceptedFileTypes: () => system?.acceptedFileTypes || {},
      paginationDefaults: () => system?.paginationDefaults || {},
      ratingScale: () => system?.ratingScale || {},

      // Emergency config helpers
      emergencyNumbers: () => emergency?.emergencyNumbers || {},
      emergencyContacts: () => emergency?.contacts || {},
      protocolIcons: () => emergency?.protocolIcons || {},
      standardMaterials: () => emergency?.standardMaterials || {},
      standardSteps: () => emergency?.standardSteps || {},

      // Guides config helpers
      levelOptions: () => guides?.levelOptions || [],
      availableLanguages: () => guides?.availableLanguages || [],
      commonMuseums: () => guides?.commonMuseums || [],

      // App config helpers
      apiConfig: () => app?.api || {},
      websocketConfig: () => app?.websocket || {},
      features: () => app?.features || {},
      security: () => app?.security || {},
      storage: () => app?.storage || {},
      externalServices: () => app?.external || {},
      limits: () => app?.limits || {},
      uiConfig: () => app?.ui || {},
      mapConfig: () => app?.map || {},

      // Validation schemas
      schemas: () => validationSchemas?.schemas || {}
    }
  };
};

/**
 * Hook específico para configuración del sistema
 */
export const useSystemConfig = () => {
  const { system, isLoaded, isLoading } = useConfig();
  return { config: system, isLoaded, isLoading };
};

/**
 * Hook específico para configuración de emergencias
 */
export const useEmergencyConfig = () => {
  const { emergency, isLoaded, isLoading } = useConfig();
  return { config: emergency, isLoaded, isLoading };
};

/**
 * Hook específico para configuración de guías
 */
export const useGuidesConfig = () => {
  const { guides, isLoaded, isLoading } = useConfig();
  return { config: guides, isLoaded, isLoading };
};

/**
 * Hook específico para configuración de la app
 */
export const useAppSettings = () => {
  const { app, isLoaded, isLoading } = useConfig();
  return { config: app, isLoaded, isLoading };
};

export default useConfig;
