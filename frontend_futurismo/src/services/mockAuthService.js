/**
 * Servicio mock de autenticación
 * Simula las respuestas del backend para desarrollo
 */

import { APP_CONFIG } from '../config/app.config';

// Datos mock de usuarios para desarrollo
const MOCK_USERS_DB = [
  {
    id: 'admin-001',
    email: 'admin@futurismo.com',
    password: 'admin123', // En producción esto sería un hash
    name: 'Administrador Sistema',
    role: 'admin',
    status: 'active',
    avatar: null,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'agency-001',
    email: 'agencia@test.com',
    password: 'agencia123',
    name: 'Agencia Turística Test',
    role: 'agency',
    status: 'active',
    avatar: null,
    agencyData: {
      companyName: 'Agencia Test S.L.',
      cif: 'B12345678',
      address: 'Calle Principal 123',
      phone: '+34 666 777 888'
    },
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'guide-001',
    email: 'guia@test.com',
    password: 'guia123',
    name: 'Juan Pérez',
    role: 'guide',
    guideType: 'planta',
    status: 'active',
    avatar: null,
    languages: ['es', 'en', 'fr'],
    specialties: ['museums', 'historical'],
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'guide-002',
    email: 'freelance@test.com',
    password: 'freelance123',
    name: 'María Torres',
    role: 'guide',
    guideType: 'freelance',
    status: 'active',
    avatar: null,
    languages: ['es', 'en', 'de'],
    specialties: ['cultural', 'gastronomy'],
    rating: 4.8,
    completedTours: 156,
    createdAt: '2024-02-15T00:00:00Z'
  }
];

class MockAuthService {
  constructor() {
    this.users = [...MOCK_USERS_DB];
    this.tokens = new Map(); // Simular tokens activos
  }

  // Simular delay de red
  async simulateDelay(ms = 1000) {
    if (APP_CONFIG.app.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // Generar token mock
  generateMockToken(userId) {
    const token = `mock_jwt_${userId}_${Date.now()}`;
    this.tokens.set(token, {
      userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + APP_CONFIG.security.tokenExpiryHours * 3600000)
    });
    return token;
  }

  // Generar avatar URL
  generateAvatarUrl(user) {
    const name = encodeURIComponent(user.name);
    const bgColors = {
      admin: '0D8ABC',
      agency: 'F59E0B',
      guide: '10B981'
    };
    const bg = bgColors[user.role] || '6B7280';
    return `${APP_CONFIG.external.avatarServiceUrl}?name=${name}&background=${bg}&color=fff`;
  }

  // Preparar datos de usuario para respuesta
  prepareUserResponse(user) {
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      avatar: user.avatar || this.generateAvatarUrl(user)
    };
  }

  async login(credentials) {
    await this.simulateDelay();

    const user = this.users.find(u => u.email === credentials.email);

    if (!user || user.password !== credentials.password) {
      return {
        success: false,
        error: 'Credenciales inválidas'
      };
    }

    if (user.status !== 'active') {
      return {
        success: false,
        error: 'Usuario inactivo o suspendido'
      };
    }

    const token = this.generateMockToken(user.id);
    
    return {
      success: true,
      data: {
        token,
        user: this.prepareUserResponse(user)
      }
    };
  }

  async register(userData) {
    await this.simulateDelay(1500);

    // Verificar si el email ya existe
    if (this.users.some(u => u.email === userData.email)) {
      return {
        success: false,
        error: 'Este email ya está registrado'
      };
    }

    // Crear nuevo usuario
    const newUser = {
      id: `${userData.role}-${Date.now()}`,
      ...userData,
      status: userData.role === 'admin' ? 'pending' : 'active',
      avatar: null,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    const token = this.generateMockToken(newUser.id);

    return {
      success: true,
      data: {
        token,
        user: this.prepareUserResponse(newUser)
      }
    };
  }

  async verifyToken(token) {
    await this.simulateDelay(500);

    const tokenData = this.tokens.get(token);
    
    if (!tokenData || new Date() > tokenData.expiresAt) {
      return {
        valid: false,
        error: 'Token inválido o expirado'
      };
    }

    const user = this.users.find(u => u.id === tokenData.userId);
    
    if (!user) {
      return {
        valid: false,
        error: 'Usuario no encontrado'
      };
    }

    return {
      valid: true,
      user: this.prepareUserResponse(user)
    };
  }

  async refreshToken(refreshToken) {
    await this.simulateDelay(500);

    // En un sistema real, verificaríamos el refresh token
    // Para el mock, simplemente generamos uno nuevo
    const tokenData = Array.from(this.tokens.entries())
      .find(([_, data]) => data.userId);

    if (!tokenData) {
      return {
        success: false,
        error: 'Refresh token inválido'
      };
    }

    const newToken = this.generateMockToken(tokenData[1].userId);

    return {
      success: true,
      data: {
        token: newToken
      }
    };
  }

  async updateProfile(userId, profileData) {
    await this.simulateDelay();

    const userIndex = this.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }

    // Actualizar usuario
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        user: this.prepareUserResponse(this.users[userIndex])
      }
    };
  }

  async changePassword(userId, passwordData) {
    await this.simulateDelay();

    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }

    if (user.password !== passwordData.currentPassword) {
      return {
        success: false,
        error: 'Contraseña actual incorrecta'
      };
    }

    // Actualizar contraseña
    user.password = passwordData.newPassword;
    user.updatedAt = new Date().toISOString();

    return { success: true };
  }

  async requestPasswordReset(email) {
    await this.simulateDelay();

    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      // Por seguridad, no revelamos si el email existe
      return { success: true };
    }

    // En un sistema real, enviaríamos un email
    console.log(`[MOCK] Password reset token for ${email}: reset_${user.id}_${Date.now()}`);

    return { success: true };
  }

  async resetPassword(token, newPassword) {
    await this.simulateDelay();

    // En un sistema real, verificaríamos el token
    // Para el mock, asumimos que es válido
    return { success: true };
  }
}

export const mockAuthService = new MockAuthService();
export default mockAuthService;