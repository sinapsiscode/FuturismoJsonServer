/**
 * Servicio mock para la gestión de choferes
 */

import { 
  LICENSE_CATEGORIES,
  DRIVER_MESSAGES
} from '../constants/driversConstants';

// Generador de datos mock
const generateMockDrivers = (count = 20) => {
  const drivers = [];
  const firstNames = ['Carlos', 'Miguel', 'José', 'Luis', 'Pedro', 'Juan', 'Roberto', 'Eduardo', 'Sergio', 'Raúl'];
  const lastNames = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Sánchez', 'Torres', 'Ramírez', 'Flores', 'Rivera'];
  const emergencyNames = ['María', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Isabel', 'Laura', 'Sofia', 'Beatriz', 'Julia'];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const emergencyName = emergencyNames[Math.floor(Math.random() * emergencyNames.length)];
    
    // Generar fecha de nacimiento (entre 25 y 60 años)
    const birthYear = new Date().getFullYear() - Math.floor(Math.random() * 35 + 25);
    const birthDate = new Date(birthYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    
    // Generar fecha de contratación (entre 0 y 10 años atrás)
    const hireYearsAgo = Math.floor(Math.random() * 10);
    const hireDate = new Date();
    hireDate.setFullYear(hireDate.getFullYear() - hireYearsAgo);
    
    // Generar vencimientos de documentos
    const licenseExpiry = new Date();
    licenseExpiry.setMonth(licenseExpiry.getMonth() + Math.floor(Math.random() * 24) - 6);
    
    const medicalExpiry = new Date();
    medicalExpiry.setMonth(medicalExpiry.getMonth() + Math.floor(Math.random() * 12) - 3);
    
    const backgroundExpiry = new Date();
    backgroundExpiry.setMonth(backgroundExpiry.getMonth() + Math.floor(Math.random() * 36) - 12);

    const licenseOptions = [LICENSE_CATEGORIES.A_IIIC, LICENSE_CATEGORIES.B_IIA, LICENSE_CATEGORIES.B_IIB, LICENSE_CATEGORIES.B_IIC];

    drivers.push({
      id: `DRV${String(i).padStart(3, '0')}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      dni: `${Math.floor(Math.random() * 90000000) + 10000000}`,
      
      // Licencia
      licenseNumber: `${firstName.charAt(0)}${Math.floor(Math.random() * 90000000) + 10000000}`,
      licenseCategory: licenseOptions[Math.floor(Math.random() * licenseOptions.length)],
      licenseExpiry: licenseExpiry.toISOString(),
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return drivers;
};


// Estado inicial
let mockDrivers = generateMockDrivers();

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MockDriversService {
  // Obtener todos los choferes
  async getDrivers(params = {}) {
    await delay(300);
    
    let result = [...mockDrivers];
    
    // Filtrado
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(driver => 
        driver.fullName.toLowerCase().includes(searchLower) ||
        driver.dni.includes(searchLower) ||
        driver.licenseNumber.toLowerCase().includes(searchLower)
      );
    }
    
    // Paginación
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      success: true,
      data: {
        items: result.slice(startIndex, endIndex),
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages
        }
      }
    };
  }
  
  // Obtener un chofer por ID
  async getDriverById(id) {
    await delay(200);
    
    const driver = mockDrivers.find(d => d.id === id);
    
    if (!driver) {
      return {
        success: false,
        error: 'Chofer no encontrado'
      };
    }
    
    return {
      success: true,
      data: driver
    };
  }
  
  // Crear un nuevo chofer
  async createDriver(driverData) {
    await delay(500);
    
    // Validar DNI duplicado
    if (mockDrivers.some(d => d.dni === driverData.dni)) {
      return {
        success: false,
        error: DRIVER_MESSAGES.DUPLICATE_DNI
      };
    }
    
    // Validar licencia duplicada
    if (mockDrivers.some(d => d.licenseNumber === driverData.licenseNumber)) {
      return {
        success: false,
        error: DRIVER_MESSAGES.DUPLICATE_LICENSE
      };
    }
    
    const newDriver = {
      id: `DRV${String(mockDrivers.length + 1).padStart(3, '0')}`,
      ...driverData,
      fullName: `${driverData.firstName} ${driverData.lastName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockDrivers.unshift(newDriver);
    
    return {
      success: true,
      data: newDriver,
      message: DRIVER_MESSAGES.CREATE_SUCCESS
    };
  }
  
  // Actualizar un chofer
  async updateDriver(id, driverData) {
    await delay(400);
    
    const index = mockDrivers.findIndex(d => d.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Chofer no encontrado'
      };
    }
    
    // Validar DNI duplicado (excepto el mismo chofer)
    if (driverData.dni && mockDrivers.some(d => d.dni === driverData.dni && d.id !== id)) {
      return {
        success: false,
        error: DRIVER_MESSAGES.DUPLICATE_DNI
      };
    }
    
    // Validar licencia duplicada (excepto el mismo chofer)
    if (driverData.licenseNumber && mockDrivers.some(d => d.licenseNumber === driverData.licenseNumber && d.id !== id)) {
      return {
        success: false,
        error: DRIVER_MESSAGES.DUPLICATE_LICENSE
      };
    }
    
    const updatedDriver = {
      ...mockDrivers[index],
      ...driverData,
      fullName: driverData.firstName && driverData.lastName 
        ? `${driverData.firstName} ${driverData.lastName}`
        : mockDrivers[index].fullName,
      updatedAt: new Date().toISOString()
    };
    
    
    mockDrivers[index] = updatedDriver;
    
    return {
      success: true,
      data: updatedDriver,
      message: DRIVER_MESSAGES.UPDATE_SUCCESS
    };
  }
  
  // Eliminar un chofer
  async deleteDriver(id) {
    await delay(300);
    
    const index = mockDrivers.findIndex(d => d.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Chofer no encontrado'
      };
    }
    
    
    mockDrivers.splice(index, 1);
    
    return {
      success: true,
      message: DRIVER_MESSAGES.DELETE_SUCCESS
    };
  }
  
  // Verificar disponibilidad de un chofer
  async checkAvailability(driverId, date, duration = 8) {
    await delay(200);
    
    const driver = mockDrivers.find(d => d.id === driverId);
    
    if (!driver) {
      return {
        success: false,
        error: 'Chofer no encontrado'
      };
    }
    
    // Simular verificación de disponibilidad (80% disponible)
    const isAvailable = Math.random() > 0.2;
    
    return {
      success: true,
      data: {
        isAvailable,
        reason: isAvailable ? null : 'El chofer ya tiene una asignación en esa fecha'
      }
    };
  }
  
  // Obtener choferes disponibles para una fecha
  async getAvailableDrivers(date, vehicleType = null) {
    await delay(400);
    
    const availableDrivers = [];
    
    for (const driver of mockDrivers) {
      // Si se especifica tipo de vehículo, verificar licencia compatible
      if (vehicleType) {
        const requiresSpecialLicense = ['bus', 'minibus'].includes(vehicleType);
        const hasSpecialLicense = driver.licenseCategory.startsWith('B-');
        
        if (requiresSpecialLicense && !hasSpecialLicense) continue;
      }
      
      // Simular disponibilidad
      if (Math.random() > 0.3) {
        availableDrivers.push(driver);
      }
    }
    
    return {
      success: true,
      data: availableDrivers
    };
  }
  
  // Asignar chofer a un tour/servicio
  async assignDriver(driverId, assignmentData) {
    await delay(300);
    
    const driver = mockDrivers.find(d => d.id === driverId);
    
    if (!driver) {
      return {
        success: false,
        error: 'Chofer no encontrado'
      };
    }
    
    // Verificar disponibilidad
    const availabilityCheck = await this.checkAvailability(driverId, assignmentData.date);
    if (!availabilityCheck.data.isAvailable) {
      return {
        success: false,
        error: DRIVER_MESSAGES.NOT_AVAILABLE
      };
    }
    
    // Crear asignación
    const assignment = {
      id: `ASSIGN${Date.now()}`,
      ...assignmentData,
      assignedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: assignment,
      message: DRIVER_MESSAGES.ASSIGN_SUCCESS
    };
  }
  
}

export default new MockDriversService();