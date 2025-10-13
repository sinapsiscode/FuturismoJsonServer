import { useState, useEffect } from 'react';
import { api } from '../services';
import useModulesConfigStore from '../stores/modulesConfigStore';

// Default configuration fallback
const defaultConfig = {
  app: {
    name: 'Futurismo',
    version: '25.07.0001',
    environment: 'development'
  },
  contact: {
    whatsapp: '+51999888777',
    email: 'info@futurismo.com',
    website: 'https://futurismo.com',
    emergency: {
      police: '105',
      fire: '116',
      medical: '106',
      company: '+51 999 888 777'
    }
  },
  api: {
    baseUrl: 'http://localhost:4050/api',
    wsUrl: 'http://localhost:3000',
    timeout: 30000
  },
  features: {
    notifications: true,
    emergency_alerts: true,
    multi_language: true,
    payment_gateway: false,
    real_time_tracking: true
  },
  limits: {
    max_file_size: 5242880, // 5MB
    max_group_size: 50,
    max_tour_capacity: 20,
    reservation_days_ahead: 365,
    cancellation_hours: 24,
    session_timeout: 1800000,
    whatsapp_cutoff_hour: 17
  },
  intervals: {
    fast_update: 30000,
    medium_update: 60000,
    slow_update: 300000,
    debounce_delay: 300
  },
  formats: {
    date: 'DD/MM/YYYY',
    time: 'HH:mm',
    currency: 'USD',
    timezone: 'America/Lima'
  },
  external_services: {
    google_maps_api: '',
    avatars_service: 'https://ui-avatars.com/api/',
    osm_tiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  }
};

export const useAppConfig = () => {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { loadModules } = useModulesConfigStore();

  useEffect(() => {
    let mounted = true;

    const loadConfig = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        setError(null);

        // Load both app settings and modules config in parallel
        const [settingsResponse] = await Promise.all([
          api.get('/config/settings'),
          loadModules() // Load all module configurations
        ]);

        if (!mounted) return;

        if (settingsResponse.data.success) {
          setConfig(settingsResponse.data.data);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error loading app config:', error);
        setError(error.message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadConfig();

    return () => {
      mounted = false;
    };
  }, [loadModules]);

  const refreshConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      // Reload both app settings and modules config in parallel
      const [response] = await Promise.all([
        api.get('/config/settings'),
        loadModules()
      ]);

      if (response.data.success) {
        setConfig(response.data.data);
      }
    } catch (error) {
      console.error('Error refreshing config:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for common config access
  const getContactInfo = () => config?.contact || defaultConfig.contact;
  const getApiConfig = () => config?.api || defaultConfig.api;
  const getFeatures = () => config?.features || defaultConfig.features;
  const getLimits = () => config?.limits || defaultConfig.limits;
  const getIntervals = () => config?.intervals || defaultConfig.intervals;
  const getFormats = () => config?.formats || defaultConfig.formats;
  const getExternalServices = () => config?.external_services || defaultConfig.external_services;

  // Specific helper functions
  const getWhatsappNumber = () => getContactInfo().whatsapp;
  const getEmergencyContacts = () => getContactInfo().emergency;
  const getMaxTourCapacity = () => getLimits().max_tour_capacity;
  const getSessionTimeout = () => getLimits().session_timeout;
  const getDebounceDelay = () => getIntervals().debounce_delay;
  const getUpdateInterval = (type = 'medium') => {
    const intervals = getIntervals();
    const key = `${type}_update`;
    return intervals[key] || intervals.medium_update;
  };

  return {
    config,
    loading,
    error,
    refreshConfig,
    // Helper functions
    getContactInfo,
    getApiConfig,
    getFeatures,
    getLimits,
    getIntervals,
    getFormats,
    getExternalServices,
    // Specific helpers
    getWhatsappNumber,
    getEmergencyContacts,
    getMaxTourCapacity,
    getSessionTimeout,
    getDebounceDelay,
    getUpdateInterval
  };
};

export default useAppConfig;