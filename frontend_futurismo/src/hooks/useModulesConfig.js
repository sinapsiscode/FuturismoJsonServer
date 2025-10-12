/**
 * Hook personalizado para acceder a configuraciones de módulos
 * Proporciona acceso fácil y tipado a todas las configuraciones de módulos
 */

import { useEffect } from 'react';
import useModulesConfigStore from '../stores/modulesConfigStore';

/**
 * Hook principal para acceder a todas las configuraciones de módulos
 */
export const useModulesConfig = () => {
  const {
    modules,
    isLoaded,
    isLoading,
    error,
    loadModules,
    loadModule,
    reloadModules,
    clearModules
  } = useModulesConfigStore();

  // Cargar automáticamente al montar
  useEffect(() => {
    if (!isLoaded && !isLoading && !error) {
      loadModules();
    }
  }, [isLoaded, isLoading, error, loadModules]);

  return {
    // Módulos individuales
    agencies: modules?.agencies || null,
    calendar: modules?.calendar || null,
    clients: modules?.clients || null,
    drivers: modules?.drivers || null,
    vehicles: modules?.vehicles || null,
    reservations: modules?.reservations || null,
    marketplace: modules?.marketplace || null,
    monitoring: modules?.monitoring || null,
    auth: modules?.auth || null,
    feedback: modules?.feedback || null,
    ratings: modules?.ratings || null,
    rewards: modules?.rewards || null,
    assignments: modules?.assignments || null,
    providers: modules?.providers || null,
    settings: modules?.settings || null,
    profile: modules?.profile || null,
    upload: modules?.upload || null,
    system: modules?.system || null,

    // Estado
    isLoaded,
    isLoading,
    error,

    // Acciones
    reload: reloadModules,
    clear: clearModules,
    loadModule,

    // Helpers de acceso rápido
    get: {
      // Agencies
      serviceTypes: () => modules?.agencies?.serviceTypes || [],
      membershipTiers: () => modules?.agencies?.membershipTiers || [],
      pointsConfig: () => modules?.agencies?.pointsConfig || {},
      availableTimes: () => modules?.agencies?.availableTimes || [],

      // Calendar
      calendarViews: () => modules?.calendar?.views || [],
      eventTypes: () => modules?.calendar?.eventTypes || [],
      weekdays: () => modules?.calendar?.weekdays || [],
      workingHours: () => modules?.calendar?.defaultWorkingHours || {},
      eventPriorities: () => modules?.calendar?.eventPriorities || [],
      eventVisibility: () => modules?.calendar?.eventVisibility || [],
      eventReminders: () => modules?.calendar?.eventReminders || [],
      recurrencePatterns: () => modules?.calendar?.recurrencePatterns || [],
      eventValidationLimits: () => modules?.calendar?.eventValidationLimits || {},
      defaultEventTimes: () => modules?.calendar?.defaultEventTimes || {},
      slotStatus: () => modules?.calendar?.slotStatus || [],
      timeSlotConfig: () => modules?.calendar?.timeSlotConfig || {},
      displayLimits: () => modules?.calendar?.displayLimits || {},
      dateNavigation: () => modules?.calendar?.dateNavigation || {},
      monthViewConfig: () => modules?.calendar?.monthViewConfig || {},
      hoverConfig: () => modules?.calendar?.hoverConfig || {},
      eventColors: () => modules?.calendar?.eventColors || {},

      // Clients
      clientTypes: () => modules?.clients?.clientTypes || [],
      clientStatus: () => modules?.clients?.clientStatus || [],
      documentTypes: () => modules?.clients?.documentTypes || [],
      commissionTypes: () => modules?.clients?.commissionTypes || [],

      // Drivers
      licenseCategories: () => modules?.drivers?.licenseCategories || [],

      // Vehicles
      vehicleTypes: () => modules?.vehicles?.vehicleTypes || [],
      vehicleStatus: () => modules?.vehicles?.vehicleStatus || [],
      fuelTypes: () => modules?.vehicles?.fuelTypes || [],
      vehicleFeatures: () => modules?.vehicles?.features || [],
      vehicleDocuments: () => modules?.vehicles?.documentTypes || [],
      maintenanceIntervals: () => modules?.vehicles?.maintenanceIntervals || {},

      // Reservations
      formSteps: () => modules?.reservations?.formSteps || [],
      reservationStatus: () => modules?.reservations?.reservationStatus || [],
      touristConfig: () => modules?.reservations?.touristConfig || {},
      durationConfig: () => modules?.reservations?.durationConfig || {},
      defaultFilterValues: () => modules?.reservations?.defaultFilterValues || {},
      filterLimits: () => modules?.reservations?.filterLimits || {},
      paginationConfig: () => modules?.reservations?.paginationConfig || {},

      // Marketplace
      workZones: () => modules?.marketplace?.workZones || [],
      tourTypes: () => modules?.marketplace?.tourTypes || [],
      groupTypes: () => modules?.marketplace?.groupTypes || [],
      languageLevels: () => modules?.marketplace?.languageLevels || [],
      experienceLevels: () => modules?.marketplace?.experienceLevels || [],
      defaultPricing: () => modules?.marketplace?.defaultPricing || {},
      ratingCategories: () => modules?.marketplace?.ratingCategories || [],

      // Monitoring
      tourStatus: () => modules?.monitoring?.tourStatus || [],
      guideStatus: () => modules?.monitoring?.guideStatus || [],
      signalQuality: () => modules?.monitoring?.signalQuality || [],
      batteryLevels: () => modules?.monitoring?.batteryLevels || {},

      // Auth
      userRoles: () => modules?.auth?.userRoles || [],
      guideTypes: () => modules?.auth?.guideTypes || [],
      userStatus: () => modules?.auth?.userStatus || [],
      authStates: () => modules?.auth?.authStates || [],
      sessionConfig: () => modules?.auth?.sessionConfig || {},
      passwordPolicy: () => modules?.auth?.passwordPolicy || {},

      // Feedback
      serviceAreas: () => modules?.feedback?.serviceAreas || [],
      feedbackStatus: () => modules?.feedback?.statusTypes || [],
      feedbackTypes: () => modules?.feedback?.feedbackTypes || [],
      feedbackPriority: () => modules?.feedback?.priorityLevels || [],
      feedbackCategories: () => modules?.feedback?.feedbackCategories || [],

      // Ratings
      ratingScale: () => modules?.ratings?.ratingScale || {},
      evaluationCriteria: () => modules?.ratings?.evaluationCriteria || [],
      recommendationTypes: () => modules?.ratings?.recommendationTypes || [],
      ratingAspects: () => modules?.ratings?.ratingAspects || [],
      touristRatingCategories: () => modules?.ratings?.touristRatingCategories || [],
      ratingStatus: () => modules?.ratings?.ratingStatus || [],
      chartColors: () => modules?.ratings?.chartColors || {},
      ratingIcons: () => modules?.ratings?.ratingIcons || {},
      ratingColors: () => modules?.ratings?.ratingColors || {},

      // Rewards
      servicePoints: () => modules?.rewards?.servicePoints || {},
      rewardCategories: () => modules?.rewards?.rewardCategories || [],
      redemptionStatus: () => modules?.rewards?.redemptionStatus || [],
      pointsLimits: () => modules?.rewards?.pointsLimits || {},
      serviceTypePoints: () => modules?.rewards?.serviceTypePoints || {},

      // Assignments
      assignmentStatus: () => modules?.assignments?.assignmentStatus || [],
      documentTypes: () => modules?.assignments?.documentTypes || [],
      licenseTypes: () => modules?.assignments?.licenseTypes || [],
      vehicleTypesAssignments: () => modules?.assignments?.vehicleTypes || [],
      assignmentLimits: () => modules?.assignments?.assignmentLimits || {},
      tourLanguages: () => modules?.assignments?.tourLanguages || [],
      guideSpecialties: () => modules?.assignments?.guideSpecialties || [],
      defaultAssignment: () => modules?.assignments?.defaultAssignment || {},

      // Providers
      providerCategories: () => modules?.providers?.providerCategories || [],
      pricingTypes: () => modules?.providers?.pricingTypes || [],
      providerStatus: () => modules?.providers?.providerStatus || [],
      serviceTypesProviders: () => modules?.providers?.serviceTypes || {},
      providerLocations: () => modules?.providers?.locations || {},
      ratingRange: () => modules?.providers?.ratingRange || {},
      timeSlots: () => modules?.providers?.timeSlots || {},
      currencies: () => modules?.providers?.currencies || [],

      // Settings
      notificationChannels: () => modules?.settings?.notificationChannels || [],
      notificationTypes: () => modules?.settings?.notificationTypes || [],
      timezones: () => modules?.settings?.timezones || [],
      settingsLanguages: () => modules?.settings?.languages || [],
      dateFormats: () => modules?.settings?.dateFormats || [],
      timeFormats: () => modules?.settings?.timeFormats || [],
      tourLimits: () => modules?.settings?.tourLimits || {},
      workingHours: () => modules?.settings?.workingHours || {},
      priceRangeTypes: () => modules?.settings?.priceRangeTypes || [],
      defaultToursConfig: () => modules?.settings?.defaultToursConfig || {},
      defaultAgenciesConfig: () => modules?.settings?.defaultAgenciesConfig || {},
      defaultGuidesConfig: () => modules?.settings?.defaultGuidesConfig || {},
      defaultMonitoringConfig: () => modules?.settings?.defaultMonitoringConfig || {},
      defaultSecurityConfig: () => modules?.settings?.defaultSecurityConfig || {},

      // Profile
      paymentMethodTypes: () => modules?.profile?.paymentMethodTypes || [],
      accountTypes: () => modules?.profile?.accountTypes || [],
      cardTypes: () => modules?.profile?.cardTypes || [],
      profileDocumentTypes: () => modules?.profile?.documentTypes || [],
      profileDocumentStatus: () => modules?.profile?.documentStatus || [],
      profileFeedbackCategories: () => modules?.profile?.feedbackCategories || [],
      ratingLevels: () => modules?.profile?.ratingLevels || [],
      accountStatus: () => modules?.profile?.accountStatus || [],
      contactTypes: () => modules?.profile?.contactTypes || [],
      profileDateFormats: () => modules?.profile?.dateFormats || {},
      maxFileSize: () => modules?.profile?.maxFileSize || 0,
      acceptedFileTypes: () => modules?.profile?.acceptedFileTypes || {},

      // Upload
      acceptedImageTypes: () => modules?.upload?.acceptedImageTypes || [],
      acceptedDocumentTypes: () => modules?.upload?.acceptedDocumentTypes || [],
      uploadFileSizeLimits: () => modules?.upload?.fileSizeLimits || {},
      uploadConfig: () => modules?.upload?.uploadConfig || {},
      uploadStates: () => modules?.upload?.uploadStates || [],
      imagePreviewConfig: () => modules?.upload?.imagePreviewConfig || {},
      dragStyles: () => modules?.upload?.dragStyles || {},
      thumbnailConfig: () => modules?.upload?.thumbnailConfig || {},

      // System
      currencies: () => modules?.system?.currencies || [],
      systemLanguages: () => modules?.system?.languages || [],
      guideTypes: () => modules?.system?.guideTypes || [],
      validationPatterns: () => modules?.system?.validationPatterns || {},
      statusValues: () => modules?.system?.statusValues || [],
      priorityLevels: () => modules?.system?.priorityLevels || [],
      systemDateFormats: () => modules?.system?.dateFormats || {},
      systemFileSizeLimits: () => modules?.system?.fileSizeLimits || {},
      systemAcceptedFileTypes: () => modules?.system?.acceptedFileTypes || {},
      statusColors: () => modules?.system?.statusColors || {},
      priorityColors: () => modules?.system?.priorityColors || {},
      timeConstants: () => modules?.system?.timeConstants || {},
      paginationDefaults: () => modules?.system?.paginationDefaults || {},
      systemRatingScale: () => modules?.system?.ratingScale || {},
      exportFormats: () => modules?.system?.exportFormats || [],
      systemDocumentTypes: () => modules?.system?.documentTypes || [],
      systemContactTypes: () => modules?.system?.contactTypes || [],
      systemServiceAreas: () => modules?.system?.serviceAreas || []
    }
  };
};

/**
 * Hook específico para configuración de agencias
 */
export const useAgenciesConfig = () => {
  const { agencies, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!agencies && !isLoading && !error) {
      loadModule('agencies');
    }
  }, [agencies, isLoading, error, loadModule]);

  return { config: agencies, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de calendario
 */
export const useCalendarConfig = () => {
  const { calendar, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!calendar && !isLoading && !error) {
      loadModule('calendar');
    }
  }, [calendar, isLoading, error, loadModule]);

  return { config: calendar, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de clientes
 */
export const useClientsConfig = () => {
  const { clients, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!clients && !isLoading && !error) {
      loadModule('clients');
    }
  }, [clients, isLoading, error, loadModule]);

  return { config: clients, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de conductores
 */
export const useDriversConfig = () => {
  const { drivers, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!drivers && !isLoading && !error) {
      loadModule('drivers');
    }
  }, [drivers, isLoading, error, loadModule]);

  return { config: drivers, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de vehículos
 */
export const useVehiclesConfig = () => {
  const { vehicles, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!vehicles && !isLoading && !error) {
      loadModule('vehicles');
    }
  }, [vehicles, isLoading, error, loadModule]);

  return { config: vehicles, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de reservaciones
 */
export const useReservationsConfig = () => {
  const { reservations, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!reservations && !isLoading && !error) {
      loadModule('reservations');
    }
  }, [reservations, isLoading, error, loadModule]);

  return { config: reservations, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración del marketplace
 */
export const useMarketplaceConfig = () => {
  const { marketplace, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!marketplace && !isLoading && !error) {
      loadModule('marketplace');
    }
  }, [marketplace, isLoading, error, loadModule]);

  return { config: marketplace, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de monitoreo
 */
export const useMonitoringConfig = () => {
  const { monitoring, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!monitoring && !isLoading && !error) {
      loadModule('monitoring');
    }
  }, [monitoring, isLoading, error, loadModule]);

  return { config: monitoring, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de autenticación
 */
export const useAuthConfig = () => {
  const { auth, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!auth && !isLoading && !error) {
      loadModule('auth');
    }
  }, [auth, isLoading, error, loadModule]);

  return { config: auth, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de feedback
 */
export const useFeedbackConfig = () => {
  const { feedback, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!feedback && !isLoading && !error) {
      loadModule('feedback');
    }
  }, [feedback, isLoading, error, loadModule]);

  return { config: feedback, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de ratings
 */
export const useRatingsConfig = () => {
  const { ratings, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!ratings && !isLoading && !error) {
      loadModule('ratings');
    }
  }, [ratings, isLoading, error, loadModule]);

  return { config: ratings, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de rewards
 */
export const useRewardsConfig = () => {
  const { rewards, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!rewards && !isLoading && !error) {
      loadModule('rewards');
    }
  }, [rewards, isLoading, error, loadModule]);

  return { config: rewards, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de assignments
 */
export const useAssignmentsConfig = () => {
  const { assignments, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!assignments && !isLoading && !error) {
      loadModule('assignments');
    }
  }, [assignments, isLoading, error, loadModule]);

  return { config: assignments, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de providers
 */
export const useProvidersConfig = () => {
  const { providers, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!providers && !isLoading && !error) {
      loadModule('providers');
    }
  }, [providers, isLoading, error, loadModule]);

  return { config: providers, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de settings
 */
export const useSettingsConfig = () => {
  const { settings, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!settings && !isLoading && !error) {
      loadModule('settings');
    }
  }, [settings, isLoading, error, loadModule]);

  return { config: settings, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de profile
 */
export const useProfileConfig = () => {
  const { profile, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!profile && !isLoading && !error) {
      loadModule('profile');
    }
  }, [profile, isLoading, error, loadModule]);

  return { config: profile, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración de upload
 */
export const useUploadConfig = () => {
  const { upload, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!upload && !isLoading && !error) {
      loadModule('upload');
    }
  }, [upload, isLoading, error, loadModule]);

  return { config: upload, isLoaded, isLoading, error };
};

/**
 * Hook específico para configuración del sistema
 */
export const useSystemConfig = () => {
  const { system, isLoaded, isLoading, error, loadModule } = useModulesConfig();

  useEffect(() => {
    if (!system && !isLoading && !error) {
      loadModule('system');
    }
  }, [system, isLoading, error, loadModule]);

  return { config: system, isLoaded, isLoading, error };
};

export default useModulesConfig;
