const express = require('express');
const { adminOnly } = require('../middlewares/authorize');

module.exports = (router) => {
  const settingsRouter = express.Router();

  // Get all settings
  settingsRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      const settings = db.get('settings').value() || {};

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuraciones'
      });
    }
  });

  // Get settings by category
  settingsRouter.get('/category/:category', (req, res) => {
    try {
      const db = router.db;
      const { category } = req.params;
      const settings = db.get('settings').value() || {};
      const categorySettings = settings[category] || {};

      res.json({
        success: true,
        data: categorySettings
      });
    } catch (error) {
      console.error('Error fetching category settings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuraciones de la categoría'
      });
    }
  });

  // Get setting by path
  settingsRouter.get('/path/:path', (req, res) => {
    try {
      const db = router.db;
      const { path } = req.params;
      const settings = db.get('settings').value() || {};

      // Navigate the path (e.g., "general.timezone" -> settings.general.timezone)
      const pathParts = path.split('.');
      let value = settings;

      for (const part of pathParts) {
        if (value && typeof value === 'object') {
          value = value[part];
        } else {
          value = undefined;
          break;
        }
      }

      if (value === undefined) {
        return res.status(404).json({
          success: false,
          error: 'Configuración no encontrada'
        });
      }

      res.json({
        success: true,
        data: value
      });
    } catch (error) {
      console.error('Error fetching setting by path:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener configuración'
      });
    }
  });

  // Get settings options/schema
  settingsRouter.get('/options', (req, res) => {
    try {
      const db = router.db;
      const settingsOptions = db.get('settings_options').value() || {};

      res.json({
        success: true,
        data: settingsOptions
      });
    } catch (error) {
      console.error('Error fetching settings options:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener opciones de configuración'
      });
    }
  });

  // Get settings history
  settingsRouter.get('/history', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const settingsHistory = db.get('settings_history').value() || [];

      res.json({
        success: true,
        data: settingsHistory
      });
    } catch (error) {
      console.error('Error fetching settings history:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener historial de configuraciones'
      });
    }
  });

  // Get settings backups
  settingsRouter.get('/backups', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const backups = db.get('settings_backups').value() || [];

      res.json({
        success: true,
        data: backups
      });
    } catch (error) {
      console.error('Error fetching settings backups:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener respaldos de configuraciones'
      });
    }
  });

  // Get settings status
  settingsRouter.get('/status', (req, res) => {
    try {
      const db = router.db;
      const settings = db.get('settings').value() || {};
      const settingsHistory = db.get('settings_history').value() || [];
      const backups = db.get('settings_backups').value() || [];

      res.json({
        success: true,
        data: {
          categoriesCount: Object.keys(settings).length,
          lastModified: settingsHistory.length > 0 ? settingsHistory[0].timestamp : null,
          backupsCount: backups.length,
          isConfigured: Object.keys(settings).length > 0
        }
      });
    } catch (error) {
      console.error('Error fetching settings status:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estado de configuraciones'
      });
    }
  });

  // Search settings
  settingsRouter.get('/search', (req, res) => {
    try {
      const db = router.db;
      const { q } = req.query;
      const settings = db.get('settings').value() || {};

      if (!q) {
        return res.json({
          success: true,
          data: []
        });
      }

      const results = [];
      const searchLower = q.toLowerCase();

      // Search recursively through settings
      const searchObject = (obj, path = '') => {
        for (const key in obj) {
          const currentPath = path ? `${path}.${key}` : key;
          const value = obj[key];

          if (key.toLowerCase().includes(searchLower) ||
              (typeof value === 'string' && value.toLowerCase().includes(searchLower))) {
            results.push({
              path: currentPath,
              key: key,
              value: value
            });
          }

          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            searchObject(value, currentPath);
          }
        }
      };

      searchObject(settings);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error searching settings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al buscar configuraciones'
      });
    }
  });

  // Update all settings
  settingsRouter.put('/', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const newSettings = req.body;
      const oldSettings = db.get('settings').value() || {};

      // Save to history
      const historyEntry = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: req.user?.email || 'system',
        changes: newSettings,
        oldSettings: oldSettings
      };

      const history = db.get('settings_history').value() || [];
      history.unshift(historyEntry);

      // Keep only last 50 history entries
      if (history.length > 50) {
        history.splice(50);
      }

      db.set('settings_history', history).write();

      // Update settings
      db.set('settings', newSettings).write();

      res.json({
        success: true,
        data: newSettings,
        message: 'Configuraciones actualizadas exitosamente'
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar configuraciones'
      });
    }
  });

  // Update settings by category
  settingsRouter.put('/category/:category', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { category } = req.params;
      const categorySettings = req.body;
      const settings = db.get('settings').value() || {};

      // Save old value to history
      const historyEntry = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: req.user?.email || 'system',
        category: category,
        changes: categorySettings,
        oldSettings: settings[category] || {}
      };

      const history = db.get('settings_history').value() || [];
      history.unshift(historyEntry);
      if (history.length > 50) history.splice(50);
      db.set('settings_history', history).write();

      // Update category
      settings[category] = categorySettings;
      db.set('settings', settings).write();

      res.json({
        success: true,
        data: categorySettings,
        message: `Configuraciones de ${category} actualizadas exitosamente`
      });
    } catch (error) {
      console.error('Error updating category settings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar configuraciones de la categoría'
      });
    }
  });

  // Update setting by path
  settingsRouter.put('/path/:path', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { path } = req.params;
      const { value } = req.body;
      const settings = db.get('settings').value() || {};

      // Navigate and update the path
      const pathParts = path.split('.');
      let current = settings;

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }

      const lastPart = pathParts[pathParts.length - 1];
      const oldValue = current[lastPart];
      current[lastPart] = value;

      // Save to history
      const historyEntry = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: req.user?.email || 'system',
        path: path,
        newValue: value,
        oldValue: oldValue
      };

      const history = db.get('settings_history').value() || [];
      history.unshift(historyEntry);
      if (history.length > 50) history.splice(50);
      db.set('settings_history', history).write();

      // Update settings
      db.set('settings', settings).write();

      res.json({
        success: true,
        data: { path, value },
        message: 'Configuración actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error updating setting by path:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar configuración'
      });
    }
  });

  // Validate settings
  settingsRouter.post('/validate', adminOnly(), (req, res) => {
    try {
      const settingsToValidate = req.body;
      const errors = [];
      const warnings = [];

      // Basic validation - can be extended
      if (!settingsToValidate || typeof settingsToValidate !== 'object') {
        errors.push('Configuraciones inválidas');
      }

      // Validate required fields
      const requiredCategories = ['general', 'security', 'notifications'];
      requiredCategories.forEach(cat => {
        if (!settingsToValidate[cat]) {
          warnings.push(`Categoría requerida faltante: ${cat}`);
        }
      });

      res.json({
        success: true,
        data: {
          valid: errors.length === 0,
          errors: errors,
          warnings: warnings
        }
      });
    } catch (error) {
      console.error('Error validating settings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al validar configuraciones'
      });
    }
  });

  // Reset all settings to default
  settingsRouter.post('/reset', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const oldSettings = db.get('settings').value() || {};
      const defaultSettings = db.get('default_settings').value() || {
        general: {
          appName: 'Futurismo',
          timezone: 'America/Lima',
          language: 'es',
          dateFormat: 'DD/MM/YYYY'
        },
        security: {
          sessionTimeout: 30,
          requireStrongPasswords: true,
          twoFactorEnabled: false
        },
        notifications: {
          emailEnabled: true,
          pushEnabled: false,
          smsEnabled: false
        }
      };

      // Save to history
      const historyEntry = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: req.user?.email || 'system',
        action: 'reset',
        oldSettings: oldSettings
      };

      const history = db.get('settings_history').value() || [];
      history.unshift(historyEntry);
      if (history.length > 50) history.splice(50);
      db.set('settings_history', history).write();

      // Reset settings
      db.set('settings', defaultSettings).write();

      res.json({
        success: true,
        data: defaultSettings,
        message: 'Configuraciones restablecidas a valores predeterminados'
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al restablecer configuraciones'
      });
    }
  });

  // Reset settings by category
  settingsRouter.post('/category/:category/reset', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { category } = req.params;
      const settings = db.get('settings').value() || {};
      const defaultSettings = db.get('default_settings').value() || {};

      if (!defaultSettings[category]) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada en configuraciones predeterminadas'
        });
      }

      const oldCategorySettings = settings[category];
      settings[category] = defaultSettings[category];

      // Save to history
      const historyEntry = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: req.user?.email || 'system',
        action: 'reset_category',
        category: category,
        oldSettings: oldCategorySettings
      };

      const history = db.get('settings_history').value() || [];
      history.unshift(historyEntry);
      if (history.length > 50) history.splice(50);
      db.set('settings_history', history).write();

      // Update settings
      db.set('settings', settings).write();

      res.json({
        success: true,
        data: settings[category],
        message: `Configuraciones de ${category} restablecidas`
      });
    } catch (error) {
      console.error('Error resetting category settings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al restablecer configuraciones de la categoría'
      });
    }
  });

  // Create backup
  settingsRouter.post('/backups', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const settings = db.get('settings').value() || {};
      const { name, description } = req.body;

      const backup = {
        id: `backup-${Date.now()}`,
        name: name || `Backup ${new Date().toLocaleDateString()}`,
        description: description || '',
        timestamp: new Date().toISOString(),
        user: req.user?.email || 'system',
        settings: JSON.parse(JSON.stringify(settings)) // Deep copy
      };

      const backups = db.get('settings_backups').value() || [];
      backups.unshift(backup);

      // Keep only last 10 backups
      if (backups.length > 10) {
        backups.splice(10);
      }

      db.set('settings_backups', backups).write();

      res.json({
        success: true,
        data: backup,
        message: 'Respaldo creado exitosamente'
      });
    } catch (error) {
      console.error('Error creating backup:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear respaldo'
      });
    }
  });

  // Restore backup
  settingsRouter.post('/backups/:id/restore', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const backups = db.get('settings_backups').value() || [];

      const backup = backups.find(b => b.id === id);
      if (!backup) {
        return res.status(404).json({
          success: false,
          error: 'Respaldo no encontrado'
        });
      }

      const oldSettings = db.get('settings').value() || {};

      // Save current state to history before restoring
      const historyEntry = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: req.user?.email || 'system',
        action: 'restore_backup',
        backupId: id,
        oldSettings: oldSettings
      };

      const history = db.get('settings_history').value() || [];
      history.unshift(historyEntry);
      if (history.length > 50) history.splice(50);
      db.set('settings_history', history).write();

      // Restore settings from backup
      db.set('settings', backup.settings).write();

      res.json({
        success: true,
        data: backup.settings,
        message: 'Configuraciones restauradas desde respaldo'
      });
    } catch (error) {
      console.error('Error restoring backup:', error);
      res.status(500).json({
        success: false,
        error: 'Error al restaurar respaldo'
      });
    }
  });

  // Export settings
  settingsRouter.get('/export', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const settings = db.get('settings').value() || {};

      res.json({
        success: true,
        data: {
          exportDate: new Date().toISOString(),
          version: '1.0',
          settings: settings
        }
      });
    } catch (error) {
      console.error('Error exporting settings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al exportar configuraciones'
      });
    }
  });

  // Import settings
  settingsRouter.post('/import', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { settings: importedSettings } = req.body;

      if (!importedSettings || typeof importedSettings !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Datos de importación inválidos'
        });
      }

      const oldSettings = db.get('settings').value() || {};

      // Save to history
      const historyEntry = {
        id: `history-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: req.user?.email || 'system',
        action: 'import',
        oldSettings: oldSettings
      };

      const history = db.get('settings_history').value() || [];
      history.unshift(historyEntry);
      if (history.length > 50) history.splice(50);
      db.set('settings_history', history).write();

      // Import settings
      db.set('settings', importedSettings).write();

      res.json({
        success: true,
        data: importedSettings,
        message: 'Configuraciones importadas exitosamente'
      });
    } catch (error) {
      console.error('Error importing settings:', error);
      res.status(500).json({
        success: false,
        error: 'Error al importar configuraciones'
      });
    }
  });

  return settingsRouter;
};
