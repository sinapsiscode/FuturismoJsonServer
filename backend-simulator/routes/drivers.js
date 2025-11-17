const express = require('express');

module.exports = (router) => {
  const driversRouter = express.Router();

  // Helper function to convert camelCase driver data to snake_case for DB
  const toSnakeCase = (data) => {
    return {
      first_name: data.firstName || data.first_name,
      last_name: data.lastName || data.last_name,
      dni: data.dni,
      license_number: data.licenseNumber || data.license_number,
      license_type: data.licenseCategory || data.license_type || data.licenseType,
      license_expiry: data.licenseExpiry || data.license_expiry || data.licenseExpiryDate,
      phone: data.phone,
      email: data.email,
      status: data.status,
      agency_id: data.agency_id || data.agencyId
    };
  };

  // Get all drivers with filters
  driversRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      let drivers = db.get('drivers').value() || [];

      // Apply filters
      const { status, license_type, agency_id, available, vehicle_assigned, page, pageSize, search } = req.query;

      if (status) {
        drivers = drivers.filter(d => d.status === status);
      }

      if (license_type) {
        drivers = drivers.filter(d => d.license_type === license_type);
      }

      if (agency_id) {
        drivers = drivers.filter(d => d.agency_id === agency_id);
      }

      if (available !== undefined) {
        const isAvailable = available === 'true';
        drivers = drivers.filter(d => d.is_available === isAvailable);
      }

      if (vehicle_assigned !== undefined) {
        const hasVehicle = vehicle_assigned === 'true';
        drivers = drivers.filter(d => hasVehicle ? d.current_vehicle_id : !d.current_vehicle_id);
      }

      // Add user information and vehicle details
      const users = db.get('users').value() || [];
      const vehicles = db.get('vehicles').value() || [];

      drivers = drivers.map(driver => {
        const user = users.find(u => u.id === driver.user_id);
        const vehicle = vehicles.find(v => v.id === driver.current_vehicle_id);

        return {
          ...driver,
          fullName: `${driver.first_name || driver.firstName || ''} ${driver.last_name || driver.lastName || ''}`.trim(),
          user: user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar
          } : null,
          current_vehicle: vehicle ? {
            id: vehicle.id,
            brand: vehicle.brand,
            model: vehicle.model,
            plate: vehicle.plate,
            type: vehicle.type
          } : null
        };
      });

      // Apply search filter if provided
      if (search) {
        const searchLower = search.toLowerCase();
        drivers = drivers.filter(d =>
          d.fullName?.toLowerCase().includes(searchLower) ||
          d.dni?.includes(search) ||
          d.license_number?.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(pageSize) || 10;
      const totalItems = drivers.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedDrivers = drivers.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          items: paginatedDrivers,
          pagination: {
            page: currentPage,
            pageSize: itemsPerPage,
            totalItems,
            totalPages
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener conductores'
      });
    }
  });

  // Get available drivers for a specific date
  driversRouter.get('/available', (req, res) => {
    try {
      const db = router.db;
      const { date, vehicleType } = req.query;

      // Get all active drivers
      let drivers = db.get('drivers').filter({ status: 'active' }).value() || [];

      // If date is provided, filter by availability
      if (date) {
        // Check driver assignments on that date
        const assignments = db.get('driver_assignments')
          .filter({ date, status: 'active' })
          .value() || [];

        const busyDriverIds = assignments.map(a => a.driver_id);
        drivers = drivers.filter(d => !busyDriverIds.includes(d.id));
      }

      // Filter by vehicle type if provided
      if (vehicleType) {
        drivers = drivers.filter(d => {
          const licenseCategory = d.license_category || d.licenseCategory;
          // Map license categories to vehicle types
          if (vehicleType === 'bus' && licenseCategory === 'A-III') return true;
          if (vehicleType === 'van' && ['A-I', 'A-II', 'A-III'].includes(licenseCategory)) return true;
          if (vehicleType === 'car' && ['A-I', 'A-II'].includes(licenseCategory)) return true;
          return false;
        });
      }

      // Add full name
      drivers = drivers.map(driver => ({
        ...driver,
        fullName: `${driver.first_name || driver.firstName || ''} ${driver.last_name || driver.lastName || ''}`.trim()
      }));

      res.json({
        success: true,
        data: drivers
      });
    } catch (error) {
      console.error('Error getting available drivers:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener conductores disponibles'
      });
    }
  });

  // Get driver by ID
  driversRouter.get('/:id', (req, res) => {
    try {
      const db = router.db;
      const driver = db.get('drivers').find({ id: req.params.id }).value();

      if (!driver) {
        return res.status(404).json({
          success: false,
          error: 'Conductor no encontrado'
        });
      }

      // Get user information
      const user = db.get('users').find({ id: driver.user_id }).value();

      // Get current vehicle
      const vehicle = driver.current_vehicle_id ?
        db.get('vehicles').find({ id: driver.current_vehicle_id }).value() : null;

      // Get vehicle assignment history
      const assignments = db.get('vehicle_assignments')
        .filter({ driver_id: driver.id })
        .orderBy('assigned_at', 'desc')
        .take(10)
        .value() || [];

      // Get performance evaluations
      const evaluations = db.get('driver_evaluations')
        .filter({ driver_id: driver.id })
        .orderBy('evaluation_date', 'desc')
        .take(5)
        .value() || [];

      // Get license history
      const licenseHistory = db.get('driver_license_history')
        .filter({ driver_id: driver.id })
        .orderBy('issued_date', 'desc')
        .value() || [];

      res.json({
        success: true,
        data: {
          ...driver,
          user,
          current_vehicle: vehicle,
          assignment_history: assignments,
          evaluations,
          license_history: licenseHistory
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener conductor'
      });
    }
  });

  // Create new driver
  driversRouter.post('/', (req, res) => {
    try {
      const db = router.db;

      // Transform camelCase to snake_case
      const driverData = toSnakeCase(req.body);
      const { user_id, license_number } = driverData;

      // Validation: Check required fields
      if (!driverData.first_name || !driverData.last_name) {
        return res.status(400).json({
          success: false,
          error: 'Nombre y apellido son requeridos'
        });
      }

      if (!driverData.dni) {
        return res.status(400).json({
          success: false,
          error: 'DNI es requerido'
        });
      }

      if (!license_number) {
        return res.status(400).json({
          success: false,
          error: 'Número de licencia es requerido'
        });
      }

      // Check if user exists (optional - only if user_id is provided)
      if (user_id) {
        const user = db.get('users').find({ id: user_id }).value();
        if (!user) {
          return res.status(404).json({
            success: false,
            error: 'Usuario no encontrado'
          });
        }

        // Check if driver profile already exists for this user
        const existingDriver = db.get('drivers').find({ user_id }).value();
        if (existingDriver) {
          return res.status(400).json({
            success: false,
            error: 'Ya existe un perfil de conductor para este usuario'
          });
        }
      }

      // Check if license number already exists
      const existingLicense = db.get('drivers').find({ license_number }).value();
      if (existingLicense) {
        return res.status(400).json({
          success: false,
          error: 'El número de licencia ya está registrado'
        });
      }

      const newDriver = {
        id: `driver-${Date.now()}`,
        ...driverData,
        user_id: user_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: driverData.status || 'active',
        is_available: true,
        current_vehicle_id: null,
        total_services: 0,
        average_rating: 0,
        total_reviews: 0,
        experience_years: 0,
        languages: ['es'],
        specialties: [],
        certifications: [],
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false
        }
      };

      db.get('drivers').push(newDriver).write();

      // Create initial license record
      const licenseRecord = {
        id: `license-${Date.now()}`,
        driver_id: newDriver.id,
        license_number: newDriver.license_number,
        license_type: newDriver.license_type,
        issued_date: newDriver.license_issued_date,
        expiry_date: newDriver.license_expiry_date,
        issuing_authority: newDriver.license_authority,
        status: 'active',
        created_at: new Date().toISOString()
      };

      db.get('driver_license_history').push(licenseRecord).write();

      // Add fullName for frontend compatibility
      newDriver.fullName = `${newDriver.first_name || ''} ${newDriver.last_name || ''}`.trim();

      res.status(201).json({
        success: true,
        data: newDriver,
        message: 'Conductor creado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear conductor'
      });
    }
  });

  // Update driver
  driversRouter.put('/:id', (req, res) => {
    try {
      const db = router.db;
      const driver = db.get('drivers').find({ id: req.params.id });

      if (!driver.value()) {
        return res.status(404).json({
          success: false,
          error: 'Conductor no encontrado'
        });
      }

      // Transform camelCase to snake_case
      const driverData = toSnakeCase(req.body);

      // Check license uniqueness if license is being changed
      const newLicenseNumber = driverData.license_number || req.body.license_number;
      if (newLicenseNumber && newLicenseNumber !== driver.value().license_number) {
        const existingLicense = db.get('drivers')
          .find({ license_number: newLicenseNumber })
          .value();
        if (existingLicense) {
          return res.status(400).json({
            success: false,
            error: 'El número de licencia ya está registrado'
          });
        }
      }

      // Merge with existing data, only update provided fields
      const updatedDriver = {};
      Object.keys(driverData).forEach(key => {
        if (driverData[key] !== undefined && driverData[key] !== null) {
          updatedDriver[key] = driverData[key];
        }
      });

      updatedDriver.updated_at = new Date().toISOString();

      driver.assign(updatedDriver).write();

      // Get updated driver and add fullName
      const resultDriver = driver.value();
      resultDriver.fullName = `${resultDriver.first_name || resultDriver.firstName || ''} ${resultDriver.last_name || resultDriver.lastName || ''}`.trim();

      res.json({
        success: true,
        data: resultDriver,
        message: 'Conductor actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar conductor'
      });
    }
  });

  // Delete driver
  driversRouter.delete('/:id', (req, res) => {
    try {
      const db = router.db;
      const driver = db.get('drivers').find({ id: req.params.id }).value();

      if (!driver) {
        return res.status(404).json({
          success: false,
          error: 'Conductor no encontrado'
        });
      }

      // Optional: Check if driver has active assignments
      const activeAssignments = db.get('driver_assignments')
        .filter({ driver_id: req.params.id, status: 'active' })
        .value();

      if (activeAssignments && activeAssignments.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'No se puede eliminar un conductor con asignaciones activas'
        });
      }

      // Remove driver
      db.get('drivers')
        .remove({ id: req.params.id })
        .write();

      res.json({
        success: true,
        message: 'Conductor eliminado exitosamente',
        data: { id: req.params.id }
      });
    } catch (error) {
      console.error('Error deleting driver:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar conductor'
      });
    }
  });

  // Update driver status
  driversRouter.put('/:id/status', (req, res) => {
    try {
      const db = router.db;
      const { status, reason } = req.body;

      const driver = db.get('drivers').find({ id: req.params.id });

      if (!driver.value()) {
        return res.status(404).json({
          success: false,
          error: 'Conductor no encontrado'
        });
      }

      driver.assign({
        status,
        status_reason: reason,
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: { status, reason },
        message: 'Estado del conductor actualizado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar estado'
      });
    }
  });

  // Update driver availability
  driversRouter.put('/:id/availability', (req, res) => {
    try {
      const db = router.db;
      const { is_available, availability_notes } = req.body;

      const driver = db.get('drivers').find({ id: req.params.id });

      if (!driver.value()) {
        return res.status(404).json({
          success: false,
          error: 'Conductor no encontrado'
        });
      }

      driver.assign({
        is_available,
        availability_notes,
        availability_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: { is_available, availability_notes },
        message: 'Disponibilidad actualizada'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar disponibilidad'
      });
    }
  });

  // Get driver assignments
  driversRouter.get('/:id/assignments', (req, res) => {
    try {
      const db = router.db;
      const { status, start_date, end_date } = req.query;

      let assignments = db.get('vehicle_assignments')
        .filter({ driver_id: req.params.id })
        .value() || [];

      if (status) {
        assignments = assignments.filter(a => a.status === status);
      }

      if (start_date && end_date) {
        assignments = assignments.filter(a => {
          const assignmentDate = new Date(a.assigned_at);
          return assignmentDate >= new Date(start_date) && assignmentDate <= new Date(end_date);
        });
      }

      // Add vehicle details
      const vehicles = db.get('vehicles').value() || [];
      assignments = assignments.map(assignment => {
        const vehicle = vehicles.find(v => v.id === assignment.vehicle_id);
        return {
          ...assignment,
          vehicle: vehicle ? {
            id: vehicle.id,
            brand: vehicle.brand,
            model: vehicle.model,
            plate: vehicle.plate,
            type: vehicle.type
          } : null
        };
      });

      assignments = assignments.sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at));

      res.json({
        success: true,
        data: assignments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener asignaciones'
      });
    }
  });

  // Add driver evaluation
  driversRouter.post('/:id/evaluations', (req, res) => {
    try {
      const db = router.db;
      const driver = db.get('drivers').find({ id: req.params.id }).value();

      if (!driver) {
        return res.status(404).json({
          success: false,
          error: 'Conductor no encontrado'
        });
      }

      const newEvaluation = {
        id: `eval-${Date.now()}`,
        driver_id: req.params.id,
        ...req.body,
        created_at: new Date().toISOString()
      };

      db.get('driver_evaluations').push(newEvaluation).write();

      // Update driver average rating
      const allEvaluations = db.get('driver_evaluations')
        .filter({ driver_id: req.params.id })
        .value() || [];

      const averageRating = allEvaluations.reduce((sum, eval) => sum + eval.rating, 0) / allEvaluations.length;

      db.get('drivers')
        .find({ id: req.params.id })
        .assign({
          average_rating: Math.round(averageRating * 100) / 100,
          total_evaluations: allEvaluations.length,
          updated_at: new Date().toISOString()
        })
        .write();

      res.status(201).json({
        success: true,
        data: newEvaluation,
        message: 'Evaluación agregada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar evaluación'
      });
    }
  });

  // Get driver evaluations
  driversRouter.get('/:id/evaluations', (req, res) => {
    try {
      const db = router.db;
      const evaluations = db.get('driver_evaluations')
        .filter({ driver_id: req.params.id })
        .orderBy('evaluation_date', 'desc')
        .value() || [];

      res.json({
        success: true,
        data: evaluations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener evaluaciones'
      });
    }
  });

  // Update driver license
  driversRouter.put('/:id/license', (req, res) => {
    try {
      const db = router.db;
      const driver = db.get('drivers').find({ id: req.params.id });

      if (!driver.value()) {
        return res.status(404).json({
          success: false,
          error: 'Conductor no encontrado'
        });
      }

      // Create new license record
      const licenseRecord = {
        id: `license-${Date.now()}`,
        driver_id: req.params.id,
        ...req.body,
        created_at: new Date().toISOString(),
        status: 'active'
      };

      db.get('driver_license_history').push(licenseRecord).write();

      // Update driver with new license info
      driver.assign({
        license_number: req.body.license_number,
        license_type: req.body.license_type,
        license_issued_date: req.body.issued_date,
        license_expiry_date: req.body.expiry_date,
        license_authority: req.body.issuing_authority,
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        data: licenseRecord,
        message: 'Licencia actualizada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar licencia'
      });
    }
  });

  // Get available drivers for assignment
  driversRouter.get('/available/list', (req, res) => {
    try {
      const db = router.db;
      const { agency_id, license_type, date } = req.query;

      let drivers = db.get('drivers')
        .filter({ status: 'active', is_available: true })
        .value() || [];

      if (agency_id) {
        drivers = drivers.filter(d => d.agency_id === agency_id);
      }

      if (license_type) {
        drivers = drivers.filter(d => d.license_type === license_type);
      }

      // Filter by date availability (if provided)
      if (date) {
        // Check if driver has any conflicting assignments on that date
        const assignments = db.get('vehicle_assignments').value() || [];
        const conflictingAssignments = assignments.filter(a => {
          const assignmentDate = new Date(a.assigned_at).toDateString();
          return assignmentDate === new Date(date).toDateString() && a.status === 'active';
        });

        const busyDriverIds = conflictingAssignments.map(a => a.driver_id);
        drivers = drivers.filter(d => !busyDriverIds.includes(d.id));
      }

      // Add user information
      const users = db.get('users').value() || [];
      drivers = drivers.map(driver => {
        const user = users.find(u => u.id === driver.user_id);
        return {
          ...driver,
          user: user ? {
            id: user.id,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar
          } : null
        };
      });

      res.json({
        success: true,
        data: drivers,
        total: drivers.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener conductores disponibles'
      });
    }
  });

  // Get driver performance metrics
  driversRouter.get('/:id/performance', (req, res) => {
    try {
      const db = router.db;
      const { start_date, end_date } = req.query;

      const driver = db.get('drivers').find({ id: req.params.id }).value();

      if (!driver) {
        return res.status(404).json({
          success: false,
          error: 'Conductor no encontrado'
        });
      }

      // Get evaluations in date range
      let evaluations = db.get('driver_evaluations')
        .filter({ driver_id: req.params.id })
        .value() || [];

      if (start_date && end_date) {
        evaluations = evaluations.filter(e => {
          const evalDate = new Date(e.evaluation_date);
          return evalDate >= new Date(start_date) && evalDate <= new Date(end_date);
        });
      }

      // Get assignments in date range
      let assignments = db.get('vehicle_assignments')
        .filter({ driver_id: req.params.id })
        .value() || [];

      if (start_date && end_date) {
        assignments = assignments.filter(a => {
          const assignmentDate = new Date(a.assigned_at);
          return assignmentDate >= new Date(start_date) && assignmentDate <= new Date(end_date);
        });
      }

      // Calculate metrics
      const metrics = {
        total_assignments: assignments.length,
        active_assignments: assignments.filter(a => a.status === 'active').length,
        completed_assignments: assignments.filter(a => a.status === 'completed').length,
        total_evaluations: evaluations.length,
        average_rating: evaluations.length > 0 ?
          evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length : 0,
        ratings_distribution: {
          '5_stars': evaluations.filter(e => e.rating === 5).length,
          '4_stars': evaluations.filter(e => e.rating === 4).length,
          '3_stars': evaluations.filter(e => e.rating === 3).length,
          '2_stars': evaluations.filter(e => e.rating === 2).length,
          '1_star': evaluations.filter(e => e.rating === 1).length
        }
      };

      res.json({
        success: true,
        data: {
          driver_id: req.params.id,
          period: { start_date, end_date },
          metrics
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener métricas de rendimiento'
      });
    }
  });

  // Assign driver to tour/service
  driversRouter.post('/:id/assignments', (req, res) => {
    try {
      const db = router.db;
      const { tourId, tourCode, date, vehicleId } = req.body;

      const driver = db.get('drivers').find({ id: req.params.id });

      if (!driver.value()) {
        return res.status(404).json({
          success: false,
          error: 'Conductor no encontrado'
        });
      }

      // Check if tour exists and assign driver
      if (tourId) {
        const tour = db.get('tours').find({ id: tourId });

        if (tour.value()) {
          tour.assign({
            assignedDriver: req.params.id,
            updated_at: new Date().toISOString()
          }).write();
        }
      }

      // Create driver assignment record
      const assignment = {
        id: `driver-assignment-${Date.now()}`,
        driver_id: req.params.id,
        tour_id: tourId,
        tour_code: tourCode,
        date: date || new Date().toISOString(),
        vehicle_id: vehicleId || null,
        status: 'active',
        created_at: new Date().toISOString()
      };

      db.get('driver_assignments').push(assignment).write();

      // Update driver current assignment status
      driver.assign({
        is_available: false,
        updated_at: new Date().toISOString()
      }).write();

      res.status(201).json({
        success: true,
        data: assignment,
        message: 'Conductor asignado exitosamente'
      });
    } catch (error) {
      console.error('Error assigning driver:', error);
      res.status(500).json({
        success: false,
        error: 'Error al asignar conductor'
      });
    }
  });

  return driversRouter;
};