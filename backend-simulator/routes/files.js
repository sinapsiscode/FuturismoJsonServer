const express = require('express');

module.exports = (router) => {
  const filesRouter = express.Router();

  // Simulate file upload
  filesRouter.post('/upload', (req, res) => {
    try {
      const db = router.db;
      const { filename, category = 'general', description, tags, entity_type, entity_id } = req.body;

      const fileRecord = {
        id: `file-${Date.now()}`,
        original_name: filename || `file-${Date.now()}.jpg`,
        filename: `uploaded-${Date.now()}.jpg`,
        path: `/uploads/${category}/${filename || 'file.jpg'}`,
        size: Math.floor(Math.random() * 5000000), // Random size up to 5MB
        mimetype: 'image/jpeg',
        category,
        description: description || '',
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        entity_type: entity_type || null,
        entity_id: entity_id || null,
        uploaded_by: req.body.uploaded_by || 'system',
        uploaded_at: new Date().toISOString(),
        url: `/api/files/download/${filename || 'file.jpg'}`,
        status: 'active'
      };

      db.get('uploaded_files').push(fileRecord).write();

      res.status(201).json({
        success: true,
        data: fileRecord,
        message: 'Archivo subido exitosamente (simulado)'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al simular subida de archivo'
      });
    }
  });

  // Simulate multiple file upload
  filesRouter.post('/upload-multiple', (req, res) => {
    try {
      const db = router.db;
      const { files_count = 3, category = 'general', entity_type, entity_id } = req.body;
      const uploadedFiles = [];

      for (let i = 0; i < parseInt(files_count); i++) {
        const fileRecord = {
          id: `file-${Date.now()}-${i}`,
          original_name: `file-${i + 1}.jpg`,
          filename: `uploaded-${Date.now()}-${i}.jpg`,
          path: `/uploads/${category}/file-${i}.jpg`,
          size: Math.floor(Math.random() * 5000000),
          mimetype: 'image/jpeg',
          category,
          description: `Archivo simulado ${i + 1}`,
          tags: ['simulado', 'test'],
          entity_type: entity_type || null,
          entity_id: entity_id || null,
          uploaded_by: req.body.uploaded_by || 'system',
          uploaded_at: new Date().toISOString(),
          url: `/api/files/download/file-${i}.jpg`,
          status: 'active'
        };

        db.get('uploaded_files').push(fileRecord).write();
        uploadedFiles.push(fileRecord);
      }

      res.status(201).json({
        success: true,
        data: uploadedFiles,
        message: `${uploadedFiles.length} archivos subidos exitosamente (simulado)`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al simular subida múltiple'
      });
    }
  });

  // Get all files with filters
  filesRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      let files = db.get('uploaded_files').value() || [];

      // Apply filters
      const {
        category,
        entity_type,
        entity_id,
        uploaded_by,
        file_type,
        search,
        page = 1,
        limit = 20
      } = req.query;

      if (category) {
        files = files.filter(f => f.category === category);
      }

      if (entity_type) {
        files = files.filter(f => f.entity_type === entity_type);
      }

      if (entity_id) {
        files = files.filter(f => f.entity_id === entity_id);
      }

      if (uploaded_by) {
        files = files.filter(f => f.uploaded_by === uploaded_by);
      }

      if (file_type) {
        files = files.filter(f => f.mimetype.startsWith(file_type));
      }

      if (search) {
        const searchLower = search.toLowerCase();
        files = files.filter(f =>
          f.original_name.toLowerCase().includes(searchLower) ||
          f.description.toLowerCase().includes(searchLower) ||
          f.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      // Sort by upload date descending
      files = files.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));

      // Pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const totalFiles = files.length;
      files = files.slice(offset, offset + parseInt(limit));

      res.json({
        success: true,
        data: files,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalFiles,
          pages: Math.ceil(totalFiles / parseInt(limit))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener archivos'
      });
    }
  });

  // Get file by ID
  filesRouter.get('/:id', (req, res) => {
    try {
      const db = router.db;
      const file = db.get('uploaded_files').find({ id: req.params.id }).value();

      if (!file) {
        return res.status(404).json({
          success: false,
          error: 'Archivo no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          ...file,
          file_exists: true // Always true for simulation
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener archivo'
      });
    }
  });

  // Simulate file download
  filesRouter.get('/download/:filename', (req, res) => {
    res.json({
      success: true,
      message: 'Descarga simulada',
      data: {
        filename: req.params.filename,
        download_url: `/api/files/download/${req.params.filename}`,
        simulated: true
      }
    });
  });

  // Simulate file view
  filesRouter.get('/view/:filename', (req, res) => {
    res.json({
      success: true,
      message: 'Vista de archivo simulada',
      data: {
        filename: req.params.filename,
        view_url: `/api/files/view/${req.params.filename}`,
        simulated: true
      }
    });
  });

  // Update file metadata
  filesRouter.put('/:id', (req, res) => {
    try {
      const db = router.db;
      const file = db.get('uploaded_files').find({ id: req.params.id });

      if (!file.value()) {
        return res.status(404).json({
          success: false,
          error: 'Archivo no encontrado'
        });
      }

      const updatedFile = {
        description: req.body.description,
        tags: req.body.tags,
        category: req.body.category,
        entity_type: req.body.entity_type,
        entity_id: req.body.entity_id,
        updated_at: new Date().toISOString()
      };

      file.assign(updatedFile).write();

      res.json({
        success: true,
        data: file.value(),
        message: 'Metadata de archivo actualizada'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar archivo'
      });
    }
  });

  // Delete file (simulation)
  filesRouter.delete('/:id', (req, res) => {
    try {
      const db = router.db;
      const file = db.get('uploaded_files').find({ id: req.params.id }).value();

      if (!file) {
        return res.status(404).json({
          success: false,
          error: 'Archivo no encontrado'
        });
      }

      // Soft delete
      db.get('uploaded_files')
        .find({ id: req.params.id })
        .assign({
          status: 'deleted',
          deleted_at: new Date().toISOString(),
          deleted_by: req.body.deleted_by || 'system'
        })
        .write();

      res.json({
        success: true,
        message: 'Archivo eliminado exitosamente (simulado)'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al eliminar archivo'
      });
    }
  });

  // Get files by entity
  filesRouter.get('/entity/:entityType/:entityId', (req, res) => {
    try {
      const db = router.db;
      const files = db.get('uploaded_files')
        .filter({
          entity_type: req.params.entityType,
          entity_id: req.params.entityId,
          status: 'active'
        })
        .orderBy('uploaded_at', 'desc')
        .value() || [];

      res.json({
        success: true,
        data: files,
        total: files.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener archivos de la entidad'
      });
    }
  });

  // Get file statistics
  filesRouter.get('/stats/overview', (req, res) => {
    try {
      const db = router.db;
      const files = db.get('uploaded_files').value() || [];

      const stats = {
        total_files: files.length,
        active_files: files.filter(f => f.status === 'active').length,
        deleted_files: files.filter(f => f.status === 'deleted').length,
        total_size: files.reduce((sum, f) => sum + (f.size || 0), 0),
        by_category: {},
        by_type: {},
        recent_uploads: files
          .filter(f => {
            const uploadDate = new Date(f.uploaded_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return uploadDate >= weekAgo;
          }).length
      };

      // Count by category
      files.forEach(file => {
        stats.by_category[file.category] = (stats.by_category[file.category] || 0) + 1;
      });

      // Count by file type
      files.forEach(file => {
        const type = file.mimetype.split('/')[0];
        stats.by_type[type] = (stats.by_type[type] || 0) + 1;
      });

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  });

  // Get file categories
  filesRouter.get('/categories/list', (req, res) => {
    try {
      const categories = [
        { id: 'general', name: 'General', description: 'Archivos generales' },
        { id: 'profiles', name: 'Perfiles', description: 'Fotos de perfil y avatares' },
        { id: 'documents', name: 'Documentos', description: 'Documentos oficiales y contratos' },
        { id: 'licenses', name: 'Licencias', description: 'Licencias y certificaciones' },
        { id: 'vehicles', name: 'Vehículos', description: 'Documentos y fotos de vehículos' },
        { id: 'tours', name: 'Tours', description: 'Imágenes y materiales de tours' },
        { id: 'reports', name: 'Reportes', description: 'Reportes y estadísticas' },
        { id: 'marketing', name: 'Marketing', description: 'Material publicitario' }
      ];

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener categorías'
      });
    }
  });

  return filesRouter;
};