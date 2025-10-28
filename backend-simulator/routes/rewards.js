const express = require('express');

module.exports = (router) => {
  const rewardsRouter = express.Router();

  // ========================================
  // CRUD DE CATEGORÍAS DE PREMIOS
  // ========================================

  // Obtener todas las categorías
  rewardsRouter.get('/categories', (req, res) => {
    try {
      const db = router.db;
      const categories = db.get('rewards_categories').value() || [];

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching reward categories:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener categorías de premios'
      });
    }
  });

  // Obtener categoría por ID
  rewardsRouter.get('/categories/:id', (req, res) => {
    try {
      const db = router.db;
      const category = db.get('rewards_categories').find({ id: req.params.id }).value();

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error fetching reward category:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener categoría'
      });
    }
  });

  // Crear nueva categoría
  rewardsRouter.post('/categories', (req, res) => {
    try {
      const db = router.db;
      const { name, description, icon, color } = req.body;

      // Validaciones
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      // Generar ID único
      const categories = db.get('rewards_categories').value() || [];
      const maxId = categories.length > 0
        ? Math.max(...categories.map(c => parseInt(c.id.split('-').pop())))
        : 0;
      const newId = `reward-cat-${maxId + 1}`;

      const newCategory = {
        id: newId,
        name: name.trim(),
        description: description?.trim() || '',
        icon: icon || 'gift',
        color: color || '#3B82F6',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      db.get('rewards_categories').push(newCategory).write();

      res.status(201).json({
        success: true,
        data: newCategory,
        message: 'Categoría creada exitosamente'
      });
    } catch (error) {
      console.error('Error creating reward category:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear categoría'
      });
    }
  });

  // Actualizar categoría
  rewardsRouter.put('/categories/:id', (req, res) => {
    try {
      const db = router.db;
      const category = db.get('rewards_categories').find({ id: req.params.id });

      if (!category.value()) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }

      const { name, description, icon, color, active } = req.body;

      // Validaciones
      if (name !== undefined && (!name || !name.trim())) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      const updatedCategory = {
        ...category.value(),
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
        ...(active !== undefined && { active }),
        updated_at: new Date().toISOString()
      };

      category.assign(updatedCategory).write();

      res.json({
        success: true,
        data: category.value(),
        message: 'Categoría actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error updating reward category:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar categoría'
      });
    }
  });

  // Eliminar categoría
  rewardsRouter.delete('/categories/:id', (req, res) => {
    try {
      const db = router.db;
      const category = db.get('rewards_categories').find({ id: req.params.id }).value();

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }

      // Verificar si hay premios usando esta categoría
      const rewards = db.get('rewards_catalog').value() || [];
      const rewardsUsingCategory = rewards.filter(r => r.category === req.params.id);

      if (rewardsUsingCategory.length > 0) {
        return res.status(400).json({
          success: false,
          error: `No se puede eliminar la categoría porque hay ${rewardsUsingCategory.length} premio(s) usándola`
        });
      }

      db.get('rewards_categories').remove({ id: req.params.id }).write();

      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error deleting reward category:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar categoría'
      });
    }
  });

  // ========================================
  // CRUD DE PREMIOS (Catálogo)
  // ========================================

  // Obtener todos los premios
  rewardsRouter.get('/catalog', (req, res) => {
    try {
      const db = router.db;
      const rewards = db.get('rewards_catalog').value() || [];

      res.json({
        success: true,
        data: rewards
      });
    } catch (error) {
      console.error('Error fetching rewards:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener premios'
      });
    }
  });

  // Obtener premio por ID
  rewardsRouter.get('/catalog/:id', (req, res) => {
    try {
      const db = router.db;
      const reward = db.get('rewards_catalog').find({ id: req.params.id }).value();

      if (!reward) {
        return res.status(404).json({
          success: false,
          error: 'Premio no encontrado'
        });
      }

      res.json({
        success: true,
        data: reward
      });
    } catch (error) {
      console.error('Error fetching reward:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener premio'
      });
    }
  });

  // Crear nuevo premio
  rewardsRouter.post('/catalog', (req, res) => {
    try {
      const db = router.db;
      const { name, description, points, category, stock, image } = req.body;

      // Validaciones
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      if (!points || points < 0) {
        return res.status(400).json({
          success: false,
          error: 'Los puntos son requeridos y deben ser positivos'
        });
      }

      if (!category) {
        return res.status(400).json({
          success: false,
          error: 'La categoría es requerida'
        });
      }

      // Generar ID único
      const rewards = db.get('rewards_catalog').value() || [];
      const maxId = rewards.length > 0
        ? Math.max(...rewards.map(r => parseInt(r.id.split('-').pop())))
        : 0;
      const newId = `reward-${maxId + 1}`;

      const newReward = {
        id: newId,
        name: name.trim(),
        description: description?.trim() || '',
        points: parseInt(points),
        category,
        stock: parseInt(stock) || 0,
        image: image || '',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      db.get('rewards_catalog').push(newReward).write();

      res.status(201).json({
        success: true,
        data: newReward,
        message: 'Premio creado exitosamente'
      });
    } catch (error) {
      console.error('Error creating reward:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear premio'
      });
    }
  });

  // Actualizar premio
  rewardsRouter.put('/catalog/:id', (req, res) => {
    try {
      const db = router.db;
      const reward = db.get('rewards_catalog').find({ id: req.params.id });

      if (!reward.value()) {
        return res.status(404).json({
          success: false,
          error: 'Premio no encontrado'
        });
      }

      const { name, description, points, category, stock, image, active } = req.body;

      // Validaciones
      if (name !== undefined && (!name || !name.trim())) {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }

      if (points !== undefined && points < 0) {
        return res.status(400).json({
          success: false,
          error: 'Los puntos deben ser positivos'
        });
      }

      const updatedReward = {
        ...reward.value(),
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(points !== undefined && { points: parseInt(points) }),
        ...(category !== undefined && { category }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(image !== undefined && { image }),
        ...(active !== undefined && { active }),
        updated_at: new Date().toISOString()
      };

      reward.assign(updatedReward).write();

      res.json({
        success: true,
        data: reward.value(),
        message: 'Premio actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error updating reward:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar premio'
      });
    }
  });

  // Eliminar premio
  rewardsRouter.delete('/catalog/:id', (req, res) => {
    try {
      const db = router.db;
      const reward = db.get('rewards_catalog').find({ id: req.params.id }).value();

      if (!reward) {
        return res.status(404).json({
          success: false,
          error: 'Premio no encontrado'
        });
      }

      // Verificar si hay canjes usando este premio
      const redemptions = db.get('reward_redemptions').value() || [];
      const redemptionsUsingReward = redemptions.filter(r => r.rewardId === req.params.id);

      if (redemptionsUsingReward.length > 0) {
        return res.status(400).json({
          success: false,
          error: `No se puede eliminar el premio porque hay ${redemptionsUsingReward.length} canje(s) usándolo`
        });
      }

      db.get('rewards_catalog').remove({ id: req.params.id }).write();

      res.json({
        success: true,
        message: 'Premio eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error deleting reward:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar premio'
      });
    }
  });

  return rewardsRouter;
};
