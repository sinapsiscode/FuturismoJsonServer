const express = require('express');

module.exports = (router) => {
  const utilsRouter = express.Router();

  // Format currency
  utilsRouter.post('/format-currency', (req, res) => {
    try {
      const { amount, currency = 'USD', locale = 'en-US' } = req.body;

      if (!amount && amount !== 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount is required'
        });
      }

      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      });

      const formatted = formatter.format(amount);

      res.json({
        success: true,
        data: {
          original: amount,
          formatted,
          currency,
          locale
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al formatear moneda'
      });
    }
  });

  // Format date
  utilsRouter.post('/format-date', (req, res) => {
    try {
      const { date, format = 'DD/MM/YYYY', timezone = 'America/Lima' } = req.body;

      if (!date) {
        return res.status(400).json({
          success: false,
          error: 'Date is required'
        });
      }

      const dateObj = new Date(date);

      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format'
        });
      }

      // Basic formatting
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');

      let formatted = '';
      switch (format) {
        case 'DD/MM/YYYY':
          formatted = `${day}/${month}/${year}`;
          break;
        case 'MM/DD/YYYY':
          formatted = `${month}/${day}/${year}`;
          break;
        case 'YYYY-MM-DD':
          formatted = `${year}-${month}-${day}`;
          break;
        case 'DD/MM/YYYY HH:mm':
          formatted = `${day}/${month}/${year} ${hours}:${minutes}`;
          break;
        default:
          formatted = dateObj.toLocaleDateString();
      }

      res.json({
        success: true,
        data: {
          original: date,
          formatted,
          timestamp: dateObj.getTime(),
          iso: dateObj.toISOString()
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al formatear fecha'
      });
    }
  });

  // Generate unique ID
  utilsRouter.get('/generate-id/:prefix?', (req, res) => {
    try {
      const { prefix = 'item' } = req.params;
      const timestamp = Date.now();
      const random = Math.random().toString(36).substr(2, 9);

      const id = `${prefix}-${timestamp}-${random}`;

      res.json({
        success: true,
        data: {
          id,
          prefix,
          timestamp
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al generar ID'
      });
    }
  });

  // Calculate distance between coordinates
  utilsRouter.post('/calculate-distance', (req, res) => {
    try {
      const { lat1, lon1, lat2, lon2, unit = 'km' } = req.body;

      if (!lat1 || !lon1 || !lat2 || !lon2) {
        return res.status(400).json({
          success: false,
          error: 'Coordenadas lat1, lon1, lat2, lon2 son requeridas'
        });
      }

      // Haversine formula
      const R = unit === 'miles' ? 3959 : 6371; // Earth's radius
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;

      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      res.json({
        success: true,
        data: {
          distance: Math.round(distance * 100) / 100,
          unit,
          coordinates: {
            from: { lat: lat1, lon: lon1 },
            to: { lat: lat2, lon: lon2 }
          }
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al calcular distancia'
      });
    }
  });

  // Get weather simulation
  utilsRouter.get('/weather/:location?', (req, res) => {
    try {
      const { location = 'Lima' } = req.params;

      // Simulate weather data
      const weatherConditions = ['sunny', 'cloudy', 'rainy', 'partly-cloudy'];
      const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      const temperature = Math.floor(Math.random() * 15) + 15; // 15-30°C
      const humidity = Math.floor(Math.random() * 50) + 40; // 40-90%

      const weather = {
        location,
        condition: randomCondition,
        temperature,
        humidity,
        wind_speed: Math.floor(Math.random() * 20) + 5,
        visibility: Math.floor(Math.random() * 5) + 5,
        updated_at: new Date().toISOString(),
        forecast: {
          today: randomCondition,
          tomorrow: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
          day_after: weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
        }
      };

      res.json({
        success: true,
        data: weather
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener clima'
      });
    }
  });

  // Get timezone info
  utilsRouter.get('/timezone/:timezone?', (req, res) => {
    try {
      const { timezone = 'America/Lima' } = req.params;

      const now = new Date();
      const offset = now.getTimezoneOffset();

      const timezoneInfo = {
        timezone,
        current_time: now.toISOString(),
        local_time: now.toLocaleString('es-PE', { timeZone: timezone }),
        offset_minutes: offset,
        offset_hours: offset / 60,
        is_dst: false // Simplified
      };

      res.json({
        success: true,
        data: timezoneInfo
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener información de zona horaria'
      });
    }
  });

  // Calculate price with taxes and discounts
  utilsRouter.post('/calculate-price', (req, res) => {
    try {
      const {
        base_price,
        tax_rate = 0.18, // IGV Peru
        discount_percent = 0,
        group_size = 1,
        group_discount_threshold = 5,
        group_discount_rate = 0.1
      } = req.body;

      if (!base_price || base_price <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Precio base es requerido y debe ser mayor a 0'
        });
      }

      let subtotal = base_price * group_size;

      // Apply individual discount
      if (discount_percent > 0) {
        subtotal = subtotal * (1 - discount_percent / 100);
      }

      // Apply group discount
      let group_discount_applied = 0;
      if (group_size >= group_discount_threshold) {
        group_discount_applied = subtotal * group_discount_rate;
        subtotal = subtotal - group_discount_applied;
      }

      // Calculate tax
      const tax_amount = subtotal * tax_rate;
      const total = subtotal + tax_amount;

      res.json({
        success: true,
        data: {
          base_price,
          group_size,
          subtotal_before_discounts: base_price * group_size,
          discount_amount: (base_price * group_size * discount_percent / 100),
          group_discount_applied,
          subtotal,
          tax_rate,
          tax_amount,
          total,
          price_per_person: total / group_size
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al calcular precio'
      });
    }
  });

  return utilsRouter;
};