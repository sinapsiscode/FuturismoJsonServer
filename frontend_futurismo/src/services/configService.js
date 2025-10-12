import api from './api';

/**
 * Service for fetching application configuration from backend
 * Replaces hardcoded constants with dynamic API calls
 */
const configService = {
  /**
   * Get system configuration (currencies, languages, status colors, etc.)
   */
  getSystemConfig: async () => {
    try {
      const response = await api.get('/config/system');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching system config:', error);
      throw error;
    }
  },

  /**
   * Get emergency configuration (numbers, contacts, materials, etc.)
   */
  getEmergencyConfig: async () => {
    try {
      const response = await api.get('/config/emergency');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching emergency config:', error);
      throw error;
    }
  },

  /**
   * Get guides configuration (levels, languages, museums, etc.)
   */
  getGuidesConfig: async () => {
    try {
      const response = await api.get('/config/guides');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching guides config:', error);
      throw error;
    }
  },

  /**
   * Get app configuration (features, limits, external services, etc.)
   */
  getAppConfig: async () => {
    try {
      const response = await api.get('/config/app');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching app config:', error);
      throw error;
    }
  },

  /**
   * Get validation schemas
   */
  getValidationSchemas: async () => {
    try {
      const response = await api.get('/config/validation-schemas');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching validation schemas:', error);
      throw error;
    }
  },

  /**
   * Get all configuration in a single call (recommended for app initialization)
   */
  getAllConfig: async () => {
    try {
      const response = await api.get('/config/all');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching all config:', error);
      throw error;
    }
  },

  /**
   * Legacy endpoints for backward compatibility
   */
  getConstants: async () => {
    try {
      const response = await api.get('/config/constants');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching constants:', error);
      throw error;
    }
  },

  getWorkZones: async () => {
    try {
      const response = await api.get('/config/work-zones');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching work zones:', error);
      throw error;
    }
  },

  getTourTypes: async () => {
    try {
      const response = await api.get('/config/tour-types');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching tour types:', error);
      throw error;
    }
  },

  getGroupTypes: async () => {
    try {
      const response = await api.get('/config/group-types');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching group types:', error);
      throw error;
    }
  },

  getLanguages: async () => {
    try {
      const response = await api.get('/config/languages');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching languages:', error);
      throw error;
    }
  },

  getSettings: async () => {
    try {
      const response = await api.get('/config/settings');
      return response.data;
    } catch (error) {
      console.error('[configService] Error fetching settings:', error);
      throw error;
    }
  }
};

export default configService;
export { configService };
