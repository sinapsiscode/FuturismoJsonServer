/**
 * Servicio mock para la gestión de vehículos
 */

import { 
  VEHICLE_DOCUMENTS,
  VEHICLE_MESSAGES
} from '../constants/vehiclesConstants';

// Generador de datos mock
const generateMockVehicles = (count = 25) => {
  const vehicles = [];
  const brands = ['Toyota', 'Nissan', 'Mercedes-Benz', 'Volkswagen', 'Hyundai', 'Kia', 'Chevrolet', 'Ford', 'Mitsubishi', 'Suzuki'];
  const models = {
    'Toyota': ['Hiace', 'Coaster', 'Corolla', 'RAV4', 'Land Cruiser'],
    'Nissan': ['Urvan', 'Civilian', 'Sentra', 'X-Trail', 'Patrol'],
    'Mercedes-Benz': ['Sprinter', 'Vito', 'Marco Polo'],
    'Volkswagen': ['Crafter', 'Transporter', 'Amarok'],
    'Hyundai': ['H1', 'H350', 'Santa Fe', 'Tucson'],
    'Kia': ['Carnival', 'Sportage', 'Sorento'],
    'Chevrolet': ['Express', 'Suburban', 'Tahoe'],
    'Ford': ['Transit', 'Explorer', 'Expedition'],
    'Mitsubishi': ['L300', 'Outlander', 'Montero'],
    'Suzuki': ['APV', 'Grand Vitara', 'Swift']
  };
  
  for (let i = 1; i <= count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const modelList = models[brand];
    const model = modelList[Math.floor(Math.random() * modelList.length)];
    const year = Math.floor(Math.random() * 10) + 2015; // 2015-2024
    
    // Generar placas (formato peruano: ABC-123)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const plate = `${letters.charAt(Math.floor(Math.random() * 26))}${letters.charAt(Math.floor(Math.random() * 26))}${letters.charAt(Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 900) + 100}`;
    
    // Generar fechas de documentos
    const soatExpiry = new Date();
    soatExpiry.setMonth(soatExpiry.getMonth() + Math.floor(Math.random() * 12) - 3);
    
    const technicalExpiry = new Date();
    technicalExpiry.setMonth(technicalExpiry.getMonth() + Math.floor(Math.random() * 12) - 3);
    
    vehicles.push({
      id: `VHC${String(i).padStart(3, '0')}`,
      plate,
      brand,
      model,
      year,
      documents: {
        [VEHICLE_DOCUMENTS.SOAT]: {
          number: `SOAT${year}${Math.floor(Math.random() * 100000)}`,
          expiry: soatExpiry.toISOString(),
        },
        [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: {
          number: `RT${year}${Math.floor(Math.random() * 10000)}`,
          expiry: technicalExpiry.toISOString(),
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return vehicles;
};

// Estado inicial
let mockVehicles = generateMockVehicles();

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MockVehiclesService {
  // Obtener todos los vehículos
  async getVehicles(params = {}) {
    await delay(300);
    
    let result = [...mockVehicles];
    
    // Filtrado por búsqueda
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(vehicle => 
        vehicle.plate.toLowerCase().includes(searchLower) ||
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower)
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

  // Obtener un vehículo por ID
  async getVehicleById(id) {
    await delay(200);
    
    const vehicle = mockVehicles.find(v => v.id === id);
    
    if (!vehicle) {
      return {
        success: false,
        error: 'Vehículo no encontrado'
      };
    }
    
    return {
      success: true,
      data: vehicle
    };
  }

  // Crear nuevo vehículo
  async createVehicle(vehicleData) {
    await delay(300);
    
    // Validaciones
    if (mockVehicles.some(v => v.plate === vehicleData.plate)) {
      return {
        success: false,
        error: 'Ya existe un vehículo con esa placa'
      };
    }
    
    const newVehicle = {
      id: `VHC${String(mockVehicles.length + 1).padStart(3, '0')}`,
      ...vehicleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockVehicles.unshift(newVehicle);
    
    return {
      success: true,
      data: newVehicle,
      message: VEHICLE_MESSAGES.CREATE_SUCCESS
    };
  }

  // Actualizar vehículo
  async updateVehicle(id, vehicleData) {
    await delay(300);
    
    const index = mockVehicles.findIndex(v => v.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Vehículo no encontrado'
      };
    }
    
    // Validar placa única
    if (vehicleData.plate && vehicleData.plate !== mockVehicles[index].plate) {
      if (mockVehicles.some(v => v.plate === vehicleData.plate && v.id !== id)) {
        return {
          success: false,
          error: 'Ya existe un vehículo con esa placa'
        };
      }
    }
    
    mockVehicles[index] = {
      ...mockVehicles[index],
      ...vehicleData,
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: mockVehicles[index],
      message: VEHICLE_MESSAGES.UPDATE_SUCCESS
    };
  }

  // Eliminar vehículo
  async deleteVehicle(id) {
    await delay(300);
    
    const index = mockVehicles.findIndex(v => v.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Vehículo no encontrado'
      };
    }
    
    mockVehicles.splice(index, 1);
    
    return {
      success: true,
      message: VEHICLE_MESSAGES.DELETE_SUCCESS
    };
  }

  // Obtener vehículos disponibles
  async getAvailableVehicles(date) {
    await delay(200);
    
    // Por simplicidad, retornar todos los vehículos como disponibles
    return {
      success: true,
      data: mockVehicles.slice(0, 10)
    };
  }

  // Asignar vehículo
  async assignVehicle(vehicleId, assignmentData) {
    await delay(200);
    
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
      return {
        success: false,
        error: 'Vehículo no encontrado'
      };
    }
    
    return {
      success: true,
      data: {
        ...vehicle,
        currentAssignment: assignmentData
      }
    };
  }

  // Verificar disponibilidad
  async checkAvailability(vehicleId, date) {
    await delay(100);
    
    return {
      success: true,
      data: {
        available: Math.random() > 0.3,
        reason: 'Vehículo asignado a otro tour'
      }
    };
  }
}

// Exportar instancia única
export default new MockVehiclesService();