const express = require('express');

module.exports = (router) => {
  const guidesRouter = express.Router();

  // Get all guides with specializations
  guidesRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      let guides = db.get('guides').value() || [];

      // Apply filters
      const { status, agency_id, language, specialization, available } = req.query;

      if (status) {
        guides = guides.filter(g => g.status === status);
      }

      if (agency_id) {
        guides = guides.filter(g => g.agency_id === agency_id);
      }

      if (available !== undefined) {
        const isAvailable = available === 'true';
        guides = guides.filter(g => g.is_available === isAvailable);
      }

      // Transform guides to frontend format
      guides = guides.map(guide => {
        // Convert guide.type ("employed"/"freelance") to guideType ("planta"/"freelance")
        const guideType = guide.type === 'employed' ? 'planta' : guide.type;

        // Transform languages array to expected format
        const languagesData = (guide.languages || []).map(langCode => ({
          code: langCode,
          level: 'avanzado' // Default level since we don't have detailed data
        }));

        // Transform certifications array to objects
        const certificationsData = (guide.certifications || []).map((cert, idx) =>
          typeof cert === 'string'
            ? { id: `cert-${guide.id}-${idx}`, name: cert, issuer: 'MINCETUR', date: '2024-01-01' }
            : cert
        );

        return {
          ...guide,
          guideType: guideType,
          fullName: `${guide.first_name} ${guide.last_name}`.trim() || guide.name,
          specializations: {
            languages: languagesData,
            museums: [] // No museum data in current structure
          },
          stats: {
            rating: guide.rating || 0,
            toursCompleted: guide.total_tours || 0,
            yearsExperience: guide.experience_years || 0,
            certifications: (guide.certifications || []).length
          }
        };
      });

      // Filter by language if specified
      if (language) {
        guides = guides.filter(g =>
          g.languages.some(l => l.language_code === language)
        );
      }

      // Filter by specialization if specified
      if (specialization) {
        guides = guides.filter(g =>
          g.specializations.some(s => s.specialization_type === specialization)
        );
      }

      // Pagination
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 20;
      const total = guides.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedGuides = guides.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          guides: paginatedGuides,
          page,
          pageSize,
          total,
          totalPages
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener guías'
      });
    }
  });

  // Get guide by ID with full details
  guidesRouter.get('/:id', (req, res) => {
    try {
      const db = router.db;
      const guide = db.get('guides').find({ id: req.params.id }).value();

      if (!guide) {
        return res.status(404).json({
          success: false,
          error: 'Guía no encontrado'
        });
      }

      // Get all specialization data
      const languages = db.get('guide_languages').filter({ guide_id: guide.id }).value() || [];
      const specializations = db.get('guide_specializations').filter({ guide_id: guide.id }).value() || [];
      const museums = db.get('guide_museums').filter({ guide_id: guide.id }).value() || [];
      const certifications = db.get('guide_certifications').filter({ guide_id: guide.id }).value() || [];
      const availability = db.get('guide_availability').filter({ guide_id: guide.id }).value() || [];
      const pricing = db.get('guide_pricing').filter({ guide_id: guide.id }).value() || [];

      // Get recent service history
      const services = db.get('services').filter({ guide_id: guide.id }).orderBy('created_at', 'desc').take(10).value() || [];

      res.json({
        success: true,
        data: {
          ...guide,
          languages,
          specializations,
          museums,
          certifications,
          availability,
          pricing,
          recent_services: services
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener guía'
      });
    }
  });

  // Update guide basic info
  guidesRouter.put('/:id', (req, res) => {
    try {
      const db = router.db;
      const guide = db.get('guides').find({ id: req.params.id });

      if (!guide.value()) {
        return res.status(404).json({
          success: false,
          error: 'Guía no encontrado'
        });
      }

      // Merge existing data with update data (keep existing fields)
      const updatedGuide = {
        ...guide.value(),  // Keep all existing fields
        ...req.body,       // Overwrite with new data
        id: guide.value().id,  // Preserve ID
        updated_at: new Date().toISOString()
      };

      guide.assign(updatedGuide).write();

      console.log('✅ Guía actualizado:', updatedGuide.id);

      res.json({
        success: true,
        data: guide.value(),
        message: 'Guía actualizado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error actualizando guía:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar guía'
      });
    }
  });

  // Get guide languages
  guidesRouter.get('/:id/languages', (req, res) => {
    try {
      const db = router.db;
      const languages = db.get('guide_languages').filter({ guide_id: req.params.id }).value() || [];

      res.json({
        success: true,
        data: languages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener idiomas del guía'
      });
    }
  });

  // Add/Update guide language
  guidesRouter.post('/:id/languages', (req, res) => {
    try {
      const db = router.db;
      const { language_code, proficiency_level, is_native } = req.body;

      // Check if language already exists for this guide
      const existingLanguage = db.get('guide_languages')
        .find({ guide_id: req.params.id, language_code })
        .value();

      if (existingLanguage) {
        // Update existing
        db.get('guide_languages')
          .find({ guide_id: req.params.id, language_code })
          .assign({
            proficiency_level,
            is_native,
            updated_at: new Date().toISOString()
          })
          .write();

        res.json({
          success: true,
          message: 'Idioma actualizado exitosamente'
        });
      } else {
        // Add new
        const newLanguage = {
          id: `guide-lang-${Date.now()}`,
          guide_id: req.params.id,
          language_code,
          proficiency_level,
          is_native,
          created_at: new Date().toISOString()
        };

        db.get('guide_languages').push(newLanguage).write();

        res.status(201).json({
          success: true,
          data: newLanguage,
          message: 'Idioma agregado exitosamente'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al procesar idioma del guía'
      });
    }
  });

  // Remove guide language
  guidesRouter.delete('/:id/languages/:languageCode', (req, res) => {
    try {
      const db = router.db;
      const removed = db.get('guide_languages')
        .remove({ guide_id: req.params.id, language_code: req.params.languageCode })
        .write();

      if (removed.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Idioma no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Idioma eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al eliminar idioma'
      });
    }
  });

  // Get guide specializations
  guidesRouter.get('/:id/specializations', (req, res) => {
    try {
      const db = router.db;
      const specializations = db.get('guide_specializations').filter({ guide_id: req.params.id }).value() || [];

      res.json({
        success: true,
        data: specializations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener especializaciones'
      });
    }
  });

  // Add guide specialization
  guidesRouter.post('/:id/specializations', (req, res) => {
    try {
      const db = router.db;
      const newSpecialization = {
        id: `guide-spec-${Date.now()}`,
        guide_id: req.params.id,
        ...req.body,
        created_at: new Date().toISOString()
      };

      db.get('guide_specializations').push(newSpecialization).write();

      res.status(201).json({
        success: true,
        data: newSpecialization,
        message: 'Especialización agregada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar especialización'
      });
    }
  });

  // Remove guide specialization
  guidesRouter.delete('/:id/specializations/:specId', (req, res) => {
    try {
      const db = router.db;
      const removed = db.get('guide_specializations')
        .remove({ id: req.params.specId, guide_id: req.params.id })
        .write();

      if (removed.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Especialización no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Especialización eliminada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al eliminar especialización'
      });
    }
  });

  // Get guide museums
  guidesRouter.get('/:id/museums', (req, res) => {
    try {
      const db = router.db;
      const museums = db.get('guide_museums').filter({ guide_id: req.params.id }).value() || [];

      res.json({
        success: true,
        data: museums
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener museos del guía'
      });
    }
  });

  // Add guide museum specialization
  guidesRouter.post('/:id/museums', (req, res) => {
    try {
      const db = router.db;
      const newMuseum = {
        id: `guide-museum-${Date.now()}`,
        guide_id: req.params.id,
        ...req.body,
        created_at: new Date().toISOString()
      };

      db.get('guide_museums').push(newMuseum).write();

      res.status(201).json({
        success: true,
        data: newMuseum,
        message: 'Museo agregado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar museo'
      });
    }
  });

  // Get guide certifications
  guidesRouter.get('/:id/certifications', (req, res) => {
    try {
      const db = router.db;
      const certifications = db.get('guide_certifications').filter({ guide_id: req.params.id }).value() || [];

      res.json({
        success: true,
        data: certifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener certificaciones'
      });
    }
  });

  // Add guide certification
  guidesRouter.post('/:id/certifications', (req, res) => {
    try {
      const db = router.db;
      const newCertification = {
        id: `guide-cert-${Date.now()}`,
        guide_id: req.params.id,
        ...req.body,
        created_at: new Date().toISOString()
      };

      db.get('guide_certifications').push(newCertification).write();

      res.status(201).json({
        success: true,
        data: newCertification,
        message: 'Certificación agregada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar certificación'
      });
    }
  });

  // Get guide availability
  guidesRouter.get('/:id/availability', (req, res) => {
    try {
      const db = router.db;
      const { start_date, end_date } = req.query;

      let availability = db.get('guide_availability').filter({ guide_id: req.params.id }).value() || [];

      if (start_date && end_date) {
        availability = availability.filter(a => {
          const availDate = new Date(a.date);
          return availDate >= new Date(start_date) && availDate <= new Date(end_date);
        });
      }

      res.json({
        success: true,
        data: availability
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener disponibilidad'
      });
    }
  });

  // Update guide availability
  guidesRouter.post('/:id/availability', (req, res) => {
    try {
      const db = router.db;
      const { date, is_available, time_slots } = req.body;

      // Check if availability exists for this date
      const existingAvailability = db.get('guide_availability')
        .find({ guide_id: req.params.id, date })
        .value();

      if (existingAvailability) {
        // Update existing
        db.get('guide_availability')
          .find({ guide_id: req.params.id, date })
          .assign({
            is_available,
            time_slots,
            updated_at: new Date().toISOString()
          })
          .write();

        res.json({
          success: true,
          message: 'Disponibilidad actualizada exitosamente'
        });
      } else {
        // Create new
        const newAvailability = {
          id: `guide-avail-${Date.now()}`,
          guide_id: req.params.id,
          date,
          is_available,
          time_slots,
          created_at: new Date().toISOString()
        };

        db.get('guide_availability').push(newAvailability).write();

        res.status(201).json({
          success: true,
          data: newAvailability,
          message: 'Disponibilidad agregada exitosamente'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar disponibilidad'
      });
    }
  });

  // Get guide pricing
  guidesRouter.get('/:id/pricing', (req, res) => {
    try {
      const db = router.db;
      const pricing = db.get('guide_pricing').filter({ guide_id: req.params.id }).value() || [];

      res.json({
        success: true,
        data: pricing
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener precios'
      });
    }
  });

  // Update guide pricing
  guidesRouter.post('/:id/pricing', (req, res) => {
    try {
      const db = router.db;
      const { service_type, price_per_hour, price_per_day, currency } = req.body;

      // Check if pricing exists for this service type
      const existingPricing = db.get('guide_pricing')
        .find({ guide_id: req.params.id, service_type })
        .value();

      if (existingPricing) {
        // Update existing
        db.get('guide_pricing')
          .find({ guide_id: req.params.id, service_type })
          .assign({
            price_per_hour,
            price_per_day,
            currency,
            updated_at: new Date().toISOString()
          })
          .write();

        res.json({
          success: true,
          message: 'Precio actualizado exitosamente'
        });
      } else {
        // Create new
        const newPricing = {
          id: `guide-price-${Date.now()}`,
          guide_id: req.params.id,
          service_type,
          price_per_hour,
          price_per_day,
          currency,
          created_at: new Date().toISOString()
        };

        db.get('guide_pricing').push(newPricing).write();

        res.status(201).json({
          success: true,
          data: newPricing,
          message: 'Precio agregado exitosamente'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar precio'
      });
    }
  });

  return guidesRouter;
};