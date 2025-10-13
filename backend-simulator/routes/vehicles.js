const express = require('express');

module.exports = (router) => {
  const vehiclesRouter = express.Router();

  // Get all vehicles with filters
  vehiclesRouter.get('/', (req, res) => {
    try {
      const db = router.db;
      let vehicles = db.get('vehicles').value() || [];

      // Apply filters
      const { status, type, agency_id, driver_id, available, page, pageSize, search } = req.query;

      if (status) {
        vehicles = vehicles.filter(v => v.status === status);
      }

      if (type) {
        vehicles = vehicles.filter(v => v.type === type);
      }

      if (agency_id) {
        vehicles = vehicles.filter(v => v.agency_id === agency_id);
      }

      if (driver_id) {
        vehicles = vehicles.filter(v => v.current_driver_id === driver_id);
      }

      if (available !== undefined) {
        const isAvailable = available === 'true';
        vehicles = vehicles.filter(v => v.is_available === isAvailable);
      }

      // Add driver information
      const drivers = db.get('drivers').value() || [];
      vehicles = vehicles.map(vehicle => {
        const driver = drivers.find(d => d.id === vehicle.current_driver_id);
        return {
          ...vehicle,
          fullName: `${vehicle.brand || ''} ${vehicle.model || ''} - ${vehicle.plate || ''}`.trim(),
          driver: driver ? {
            id: driver.id,
            fullName: `${driver.firstName || ''} ${driver.lastName || ''}`.trim(),
            license_number: driver.license_number,
            phone: driver.phone
          } : null
        };
      });

      // Apply search filter if provided
      if (search) {
        const searchLower = search.toLowerCase();
        vehicles = vehicles.filter(v =>
          v.brand?.toLowerCase().includes(searchLower) ||
          v.model?.toLowerCase().includes(searchLower) ||
          v.plate?.toLowerCase().includes(searchLower) ||
          v.type?.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(pageSize) || 10;
      const totalItems = vehicles.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedVehicles = vehicles.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          items: paginatedVehicles,
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
        error: 'Error al obtener vehículos'
      });
    }
  });

  // Get vehicle by ID
  vehiclesRouter.get('/:id', (req, res) => {
    try {
      const db = router.db;
      const vehicle = db.get('vehicles').find({ id: req.params.id }).value();

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehículo no encontrado'
        });
      }

      // Add driver information
      const driver = db.get('drivers').find({ id: vehicle.current_driver_id }).value();

      // Add maintenance records
      const maintenanceRecords = db.get('maintenance_records')
        .filter({ vehicle_id: vehicle.id })
        .orderBy('date', 'desc')
        .value() || [];

      // Add assignment history
      const assignments = db.get('vehicle_assignments')
        .filter({ vehicle_id: vehicle.id })
        .orderBy('created_at', 'desc')
        .take(10)
        .value() || [];

      res.json({
        success: true,
        data: {
          ...vehicle,
          driver: driver ? {
            id: driver.id,
            name: driver.name,
            license_number: driver.license_number,
            phone: driver.phone
          } : null,
          maintenance_records: maintenanceRecords,
          recent_assignments: assignments
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener vehículo'
      });
    }
  });

  // Create new vehicle
  vehiclesRouter.post('/', (req, res) => {
    try {
      const db = router.db;
      const newVehicle = {
        id: `vehicle-${Date.now()}`,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_available: true,
        status: 'active',
        current_driver_id: null
      };

      db.get('vehicles').push(newVehicle).write();

      res.status(201).json({
        success: true,
        data: newVehicle,
        message: 'Vehículo creado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear vehículo'
      });
    }
  });

  // Update vehicle
  vehiclesRouter.put('/:id', (req, res) => {
    try {
      const db = router.db;
      const vehicle = db.get('vehicles').find({ id: req.params.id });

      if (!vehicle.value()) {
        return res.status(404).json({
          success: false,
          error: 'Vehículo no encontrado'
        });
      }

      const updatedVehicle = {
        ...req.body,
        updated_at: new Date().toISOString()
      };

      vehicle.assign(updatedVehicle).write();

      res.json({
        success: true,
        data: vehicle.value(),
        message: 'Vehículo actualizado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar vehículo'
      });
    }
  });

  // Delete vehicle
  vehiclesRouter.delete('/:id', (req, res) => {
    try {
      const db = router.db;
      const vehicle = db.get('vehicles').find({ id: req.params.id }).value();

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehículo no encontrado'
        });
      }

      db.get('vehicles').remove({ id: req.params.id }).write();

      res.json({
        success: true,
        message: 'Vehículo eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al eliminar vehículo'
      });
    }
  });

  // Assign driver to vehicle
  vehiclesRouter.post('/:id/assign-driver', (req, res) => {
    try {
      const db = router.db;
      const { driver_id } = req.body;

      const vehicle = db.get('vehicles').find({ id: req.params.id });
      const driver = db.get('drivers').find({ id: driver_id });

      if (!vehicle.value()) {
        return res.status(404).json({
          success: false,
          error: 'Vehículo no encontrado'
        });
      }

      if (!driver.value()) {
        return res.status(404).json({
          success: false,
          error: 'Conductor no encontrado'
        });
      }

      // Create assignment record
      const assignment = {
        id: `assignment-${Date.now()}`,
        vehicle_id: req.params.id,
        driver_id: driver_id,
        assigned_at: new Date().toISOString(),
        assigned_by: req.body.assigned_by || 'system',
        status: 'active'
      };

      // Update vehicle
      vehicle.assign({
        current_driver_id: driver_id,
        updated_at: new Date().toISOString()
      }).write();

      // Update driver
      driver.assign({
        current_vehicle_id: req.params.id,
        updated_at: new Date().toISOString()
      }).write();

      // Save assignment
      db.get('vehicle_assignments').push(assignment).write();

      res.json({
        success: true,
        data: assignment,
        message: 'Conductor asignado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al asignar conductor'
      });
    }
  });

  // Unassign driver from vehicle
  vehiclesRouter.post('/:id/unassign-driver', (req, res) => {
    try {
      const db = router.db;
      const vehicle = db.get('vehicles').find({ id: req.params.id });

      if (!vehicle.value()) {
        return res.status(404).json({
          success: false,
          error: 'Vehículo no encontrado'
        });
      }

      const currentDriverId = vehicle.value().current_driver_id;

      if (currentDriverId) {
        // Update driver
        const driver = db.get('drivers').find({ id: currentDriverId });
        if (driver.value()) {
          driver.assign({
            current_vehicle_id: null,
            updated_at: new Date().toISOString()
          }).write();
        }

        // Update assignment record
        db.get('vehicle_assignments')
          .find({ vehicle_id: req.params.id, driver_id: currentDriverId, status: 'active' })
          .assign({
            status: 'completed',
            unassigned_at: new Date().toISOString(),
            unassigned_by: req.body.unassigned_by || 'system'
          })
          .write();
      }

      // Update vehicle
      vehicle.assign({
        current_driver_id: null,
        updated_at: new Date().toISOString()
      }).write();

      res.json({
        success: true,
        message: 'Conductor desasignado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al desasignar conductor'
      });
    }
  });

  // Get vehicle maintenance records
  vehiclesRouter.get('/:id/maintenance', (req, res) => {
    try {
      const db = router.db;
      const records = db.get('maintenance_records')
        .filter({ vehicle_id: req.params.id })
        .orderBy('date', 'desc')
        .value() || [];

      res.json({
        success: true,
        data: records
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener registros de mantenimiento'
      });
    }
  });

  // Add maintenance record
  vehiclesRouter.post('/:id/maintenance', (req, res) => {
    try {
      const db = router.db;
      const vehicle = db.get('vehicles').find({ id: req.params.id }).value();

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehículo no encontrado'
        });
      }

      const maintenanceRecord = {
        id: `maintenance-${Date.now()}`,
        vehicle_id: req.params.id,
        ...req.body,
        created_at: new Date().toISOString()
      };

      db.get('maintenance_records').push(maintenanceRecord).write();

      res.status(201).json({
        success: true,
        data: maintenanceRecord,
        message: 'Registro de mantenimiento agregado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al agregar registro de mantenimiento'
      });
    }
  });

  // Get vehicle availability
  vehiclesRouter.get('/:id/availability', (req, res) => {
    try {
      const db = router.db;
      const { start_date, end_date } = req.query;

      const vehicle = db.get('vehicles').find({ id: req.params.id }).value();

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehículo no encontrado'
        });
      }

      // Get assignments in date range
      let assignments = db.get('vehicle_assignments')
        .filter({ vehicle_id: req.params.id, status: 'active' })
        .value() || [];

      if (start_date && end_date) {
        assignments = assignments.filter(a => {
          const assignedDate = new Date(a.assigned_at);
          return assignedDate >= new Date(start_date) && assignedDate <= new Date(end_date);
        });
      }

      res.json({
        success: true,
        data: {
          vehicle_id: req.params.id,
          is_available: vehicle.is_available,
          status: vehicle.status,
          assignments: assignments
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener disponibilidad'
      });
    }
  });

  return vehiclesRouter;
};