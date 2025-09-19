const express = require('express');

module.exports = (router) => {
  const dataRouter = express.Router();

  // Get all available data sections
  dataRouter.get('/sections', (req, res) => {
    try {
      const db = router.db;
      const sections = Object.keys(db.getState());

      res.json({
        success: true,
        data: {
          totalSections: sections.length,
          sections: sections.sort(),
          description: 'All available data sections in the database'
        }
      });

    } catch (error) {
      console.error('Data sections error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener secciones de datos'
      });
    }
  });

  // Get specific section data
  dataRouter.get('/section/:sectionName', (req, res) => {
    try {
      const db = router.db;
      const sectionName = req.params.sectionName;
      const sectionData = db.get(sectionName).value();

      if (!sectionData) {
        return res.status(404).json({
          success: false,
          error: `Sección '${sectionName}' no encontrada`
        });
      }

      res.json({
        success: true,
        data: sectionData,
        meta: {
          section: sectionName,
          type: Array.isArray(sectionData) ? 'array' : 'object',
          size: Array.isArray(sectionData) ? sectionData.length : Object.keys(sectionData).length
        }
      });

    } catch (error) {
      console.error('Section data error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener datos de la sección'
      });
    }
  });

  // Search across all data
  dataRouter.get('/search', (req, res) => {
    try {
      const { query, sections } = req.query;
      const db = router.db;
      const allData = db.getState();

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Parámetro query es requerido'
        });
      }

      const results = {};
      const searchTerm = query.toLowerCase();
      const sectionsToSearch = sections ? sections.split(',') : Object.keys(allData);

      sectionsToSearch.forEach(section => {
        if (allData[section]) {
          const sectionData = allData[section];
          const sectionResults = [];

          // Search in arrays
          if (Array.isArray(sectionData)) {
            sectionData.forEach((item, index) => {
              const itemStr = JSON.stringify(item).toLowerCase();
              if (itemStr.includes(searchTerm)) {
                sectionResults.push({ index, item });
              }
            });
          }
          // Search in objects
          else if (typeof sectionData === 'object') {
            Object.keys(sectionData).forEach(key => {
              const valueStr = JSON.stringify(sectionData[key]).toLowerCase();
              if (key.toLowerCase().includes(searchTerm) || valueStr.includes(searchTerm)) {
                sectionResults.push({ key, value: sectionData[key] });
              }
            });
          }

          if (sectionResults.length > 0) {
            results[section] = sectionResults;
          }
        }
      });

      res.json({
        success: true,
        data: results,
        meta: {
          query,
          sectionsSearched: sectionsToSearch.length,
          sectionsWithResults: Object.keys(results).length,
          totalResults: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
        }
      });

    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        error: 'Error en la búsqueda'
      });
    }
  });

  // Get migration metadata
  dataRouter.get('/metadata', (req, res) => {
    try {
      const db = router.db;
      const metadata = db.get('migration_metadata').value();
      const allSections = Object.keys(db.getState());

      res.json({
        success: true,
        data: {
          migration: metadata,
          current: {
            totalSections: allSections.length,
            sections: allSections,
            timestamp: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      console.error('Metadata error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener metadatos'
      });
    }
  });

  // Get database statistics
  dataRouter.get('/stats', (req, res) => {
    try {
      const db = router.db;
      const allData = db.getState();
      const stats = {};

      Object.keys(allData).forEach(section => {
        const data = allData[section];
        stats[section] = {
          type: Array.isArray(data) ? 'array' : typeof data,
          size: Array.isArray(data) ? data.length : (typeof data === 'object' ? Object.keys(data).length : 1),
          hasData: !!(data && (Array.isArray(data) ? data.length : Object.keys(data).length))
        };
      });

      const totalArrayItems = Object.values(stats)
        .filter(s => s.type === 'array')
        .reduce((sum, s) => sum + s.size, 0);

      const totalObjects = Object.values(stats)
        .filter(s => s.type === 'object')
        .length;

      res.json({
        success: true,
        data: {
          summary: {
            totalSections: Object.keys(stats).length,
            totalArrayItems,
            totalObjects,
            sectionsWithData: Object.values(stats).filter(s => s.hasData).length
          },
          sections: stats
        }
      });

    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  });

  return dataRouter;
};