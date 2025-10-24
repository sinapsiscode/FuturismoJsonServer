const express = require('express');

module.exports = (router) => {
  const validatorsRouter = express.Router();

  // Get configuration values from environment
  const CANCELLATION_HOURS = parseInt(process.env.CANCELLATION_HOURS, 10) || 24;
  const MAX_GROUP_SIZE = parseInt(process.env.MAX_GROUP_SIZE, 10) || 50;
  const RESERVATION_DAYS_AHEAD = parseInt(process.env.RESERVATION_DAYS_AHEAD, 10) || 365;

  // Validate email format
  validatorsRouter.post('/email', (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.json({
          success: false,
          error: 'Email es requerido'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);

      // Check if email exists in database
      const db = router.db;
      const existingUser = db.get('users').find({ email }).value();

      res.json({
        success: true,
        data: {
          isValid,
          isAvailable: !existingUser,
          format: isValid ? 'valid' : 'invalid'
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al validar email'
      });
    }
  });

  // Validate phone number
  validatorsRouter.post('/phone', (req, res) => {
    try {
      const { phone, country = 'PE' } = req.body;

      if (!phone) {
        return res.json({
          success: false,
          error: 'Teléfono es requerido'
        });
      }

      let isValid = false;
      let format = '';

      // Basic phone validation patterns
      const patterns = {
        PE: /^\+51[0-9]{9}$|^[0-9]{9}$/,
        US: /^\+1[0-9]{10}$|^[0-9]{10}$/,
        ES: /^\+34[0-9]{9}$|^[0-9]{9}$/
      };

      const pattern = patterns[country] || patterns.PE;
      isValid = pattern.test(phone);

      if (isValid) {
        format = country === 'PE' ? '+51XXXXXXXXX' : 'Valid format';
      }

      res.json({
        success: true,
        data: {
          isValid,
          format,
          country
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al validar teléfono'
      });
    }
  });

  // Validate reservation data
  validatorsRouter.post('/reservation', (req, res) => {
    try {
      const {
        tour_date,
        group_size,
        client_id,
        guide_id,
        service_id
      } = req.body;

      const errors = [];
      const warnings = [];

      // Validate required fields
      if (!tour_date) errors.push('Fecha del tour es requerida');
      if (!group_size || group_size < 1) errors.push('Tamaño del grupo debe ser mayor a 0');
      if (!client_id) errors.push('Cliente es requerido');
      if (!service_id) errors.push('Servicio es requerido');

      // Validate tour date
      if (tour_date) {
        const tourDate = new Date(tour_date);
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + RESERVATION_DAYS_AHEAD);

        const minAdvanceTime = CANCELLATION_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds

        if (tourDate < today) {
          errors.push('La fecha del tour no puede ser en el pasado');
        } else if (tourDate > maxDate) {
          warnings.push(`La fecha del tour excede el límite de ${RESERVATION_DAYS_AHEAD} días`);
        } else if (tourDate.getTime() - today.getTime() < minAdvanceTime) {
          warnings.push(`Reserva con menos de ${CANCELLATION_HOURS} horas de anticipación`);
        }
      }

      // Validate group size
      if (group_size > MAX_GROUP_SIZE) {
        errors.push(`El tamaño del grupo no puede exceder ${MAX_GROUP_SIZE} personas`);
      } else if (group_size > 15) {
        warnings.push('Grupo grande, considere dividir la reserva');
      }

      const isValid = errors.length === 0;

      res.json({
        success: true,
        data: {
          isValid,
          errors,
          warnings,
          canProceed: isValid
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al validar reserva'
      });
    }
  });

  // Validate user registration data
  validatorsRouter.post('/user-registration', (req, res) => {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
        phone,
        role
      } = req.body;

      const errors = [];
      const warnings = [];

      // Validate required fields
      if (!email) errors.push('Email es requerido');
      if (!password) errors.push('Contraseña es requerida');
      if (!first_name) errors.push('Nombre es requerido');
      if (!last_name) errors.push('Apellido es requerido');
      if (!role) errors.push('Rol es requerido');

      // Validate email format
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push('Formato de email inválido');
        } else {
          // Check if email exists
          const db = router.db;
          const existingUser = db.get('users').find({ email }).value();
          if (existingUser) {
            errors.push('Email ya está registrado');
          }
        }
      }

      // Validate password strength
      if (password) {
        if (password.length < 6) {
          errors.push('Contraseña debe tener al menos 6 caracteres');
        } else if (password.length < 8) {
          warnings.push('Contraseña débil, recomendamos al menos 8 caracteres');
        }
      }

      // Validate role
      const validRoles = ['admin', 'agency', 'guide', 'client'];
      if (role && !validRoles.includes(role)) {
        errors.push('Rol inválido');
      }

      const isValid = errors.length === 0;

      res.json({
        success: true,
        data: {
          isValid,
          errors,
          warnings,
          canProceed: isValid
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al validar registro'
      });
    }
  });

  // Validate service data
  validatorsRouter.post('/service', (req, res) => {
    try {
      const {
        name,
        price,
        category,
        duration,
        description
      } = req.body;

      const errors = [];
      const warnings = [];

      // Validate required fields
      if (!name) errors.push('Nombre del servicio es requerido');
      if (!price || price <= 0) errors.push('Precio debe ser mayor a 0');
      if (!category) errors.push('Categoría es requerida');
      if (!duration) errors.push('Duración es requerida');

      // Validate price
      if (price > 10000) {
        warnings.push('Precio muy alto, verificar si es correcto');
      }

      // Validate category
      const validCategories = ['tours', 'accommodation', 'transport', 'activities', 'meals'];
      if (category && !validCategories.includes(category)) {
        errors.push('Categoría inválida');
      }

      // Validate description length
      if (description && description.length > 500) {
        warnings.push('Descripción muy larga');
      }

      const isValid = errors.length === 0;

      res.json({
        success: true,
        data: {
          isValid,
          errors,
          warnings,
          canProceed: isValid
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al validar servicio'
      });
    }
  });

  return validatorsRouter;
};