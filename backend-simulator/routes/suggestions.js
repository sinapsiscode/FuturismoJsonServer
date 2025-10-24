const express = require('express');
const { generateId } = require('../middlewares/helpers');
const { authenticated, adminOnly } = require('../middlewares/authorize');

module.exports = (router) => {
  const suggestionsRouter = express.Router();

  // Get suggestions stats (MUST be before /:id route)
  suggestionsRouter.get('/stats', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const suggestions = db.get('suggestions').value() || [];

      const stats = {
        total: suggestions.length,
        byStatus: {
          pending: suggestions.filter(s => s.status === 'pending').length,
          in_review: suggestions.filter(s => s.status === 'in_review').length,
          approved: suggestions.filter(s => s.status === 'approved').length,
          implemented: suggestions.filter(s => s.status === 'implemented').length,
          rejected: suggestions.filter(s => s.status === 'rejected').length
        },
        byCategory: {},
        byPriority: {
          low: suggestions.filter(s => s.priority === 'low').length,
          medium: suggestions.filter(s => s.priority === 'medium').length,
          high: suggestions.filter(s => s.priority === 'high').length,
          critical: suggestions.filter(s => s.priority === 'critical').length
        },
        recentCount: suggestions.filter(s => {
          const createdDate = new Date(s.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdDate >= weekAgo;
        }).length
      };

      // Count by category
      suggestions.forEach(s => {
        if (!stats.byCategory[s.category]) {
          stats.byCategory[s.category] = 0;
        }
        stats.byCategory[s.category]++;
      });

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching suggestions stats:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas de sugerencias'
      });
    }
  });

  // Get all suggestions
  suggestionsRouter.get('/', authenticated(), (req, res) => {
    try {
      const db = router.db;
      let suggestions = db.get('suggestions').value() || [];

      // Filter by status if provided
      const { status, category, priority, userId } = req.query;

      if (status) {
        suggestions = suggestions.filter(s => s.status === status);
      }

      if (category) {
        suggestions = suggestions.filter(s => s.category === category);
      }

      if (priority) {
        suggestions = suggestions.filter(s => s.priority === priority);
      }

      if (userId) {
        suggestions = suggestions.filter(s => s.userId === userId);
      }

      // Sort by date (most recent first)
      suggestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener sugerencias'
      });
    }
  });

  // Get suggestion by ID
  suggestionsRouter.get('/:id', authenticated(), (req, res) => {
    try {
      const db = router.db;
      const suggestion = db.get('suggestions').find({ id: req.params.id }).value();

      if (!suggestion) {
        return res.status(404).json({
          success: false,
          error: 'Sugerencia no encontrada'
        });
      }

      res.json({
        success: true,
        data: suggestion
      });
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener sugerencia'
      });
    }
  });


  // Create new suggestion
  suggestionsRouter.post('/', authenticated(), (req, res) => {
    try {
      const db = router.db;
      const {
        title,
        description,
        category,
        priority,
        attachments
      } = req.body;

      // Validate required fields
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: 'Título y descripción son requeridos'
        });
      }

      const newSuggestion = {
        id: generateId('suggestion'),
        title,
        description,
        category: category || 'general',
        priority: priority || 'medium',
        status: 'pending',
        userId: req.user?.userId || 'anonymous',
        userEmail: req.user?.email || 'anonymous',
        attachments: attachments || [],
        responses: [],
        votes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const suggestions = db.get('suggestions').value() || [];
      suggestions.push(newSuggestion);
      db.set('suggestions', suggestions).write();

      res.status(201).json({
        success: true,
        data: newSuggestion,
        message: 'Sugerencia creada exitosamente'
      });
    } catch (error) {
      console.error('Error creating suggestion:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear sugerencia'
      });
    }
  });

  // Update suggestion
  suggestionsRouter.patch('/:id', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const updateData = req.body;

      const suggestions = db.get('suggestions').value() || [];
      const suggestionIndex = suggestions.findIndex(s => s.id === id);

      if (suggestionIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Sugerencia no encontrada'
        });
      }

      const updatedSuggestion = {
        ...suggestions[suggestionIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      suggestions[suggestionIndex] = updatedSuggestion;
      db.set('suggestions', suggestions).write();

      res.json({
        success: true,
        data: updatedSuggestion,
        message: 'Sugerencia actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error updating suggestion:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar sugerencia'
      });
    }
  });

  // Add response to suggestion
  suggestionsRouter.post('/:id/responses', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;
      const { message, status } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          error: 'El mensaje es requerido'
        });
      }

      const suggestions = db.get('suggestions').value() || [];
      const suggestionIndex = suggestions.findIndex(s => s.id === id);

      if (suggestionIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Sugerencia no encontrada'
        });
      }

      const response = {
        id: generateId('response'),
        message,
        userId: req.user?.userId || 'admin',
        userEmail: req.user?.email || 'admin',
        createdAt: new Date().toISOString()
      };

      if (!suggestions[suggestionIndex].responses) {
        suggestions[suggestionIndex].responses = [];
      }

      suggestions[suggestionIndex].responses.push(response);
      suggestions[suggestionIndex].updatedAt = new Date().toISOString();

      // Update status if provided
      if (status) {
        suggestions[suggestionIndex].status = status;
      }

      db.set('suggestions', suggestions).write();

      res.json({
        success: true,
        data: suggestions[suggestionIndex],
        message: 'Respuesta agregada exitosamente'
      });
    } catch (error) {
      console.error('Error adding response:', error);
      res.status(500).json({
        success: false,
        error: 'Error al agregar respuesta'
      });
    }
  });

  // Delete suggestion
  suggestionsRouter.delete('/:id', adminOnly(), (req, res) => {
    try {
      const db = router.db;
      const { id } = req.params;

      const suggestions = db.get('suggestions').value() || [];
      const suggestionIndex = suggestions.findIndex(s => s.id === id);

      if (suggestionIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Sugerencia no encontrada'
        });
      }

      suggestions.splice(suggestionIndex, 1);
      db.set('suggestions', suggestions).write();

      res.json({
        success: true,
        message: 'Sugerencia eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar sugerencia'
      });
    }
  });

  return suggestionsRouter;
};
