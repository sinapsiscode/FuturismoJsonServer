// Test del authService usando la misma lógica que el frontend

// Simular configuración del frontend
const APP_CONFIG = {
  api: {
    baseUrl: 'http://localhost:4050/api'
  },
  features: {
    mockData: false
  }
};

class AuthService {
  constructor() {
    this.baseURL = APP_CONFIG.api.baseUrl;
    this.isUsingMockData = APP_CONFIG.features.mockData;
  }

  async login(credentials) {
    console.log('🔐 AuthService.login called with mockData:', this.isUsingMockData);
    console.log('🔗 Base URL:', this.baseURL);

    const url = `${this.baseURL}/auth/login`;
    console.log('🌐 Using REAL API call to:', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      console.log('🔄 Response status:', response.status);
      console.log('🔄 Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Response not OK:', response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Login response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Login failed');
      }

      return {
        success: true,
        data: {
          token: data.data.token,
          user: data.data.user
        }
      };

    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);

      return {
        success: false,
        error: error.message || 'Error al iniciar sesión'
      };
    }
  }
}

// Test
async function testFrontendAuth() {
  console.log('🧪 Testing frontend auth logic...\n');

  const authService = new AuthService();

  const result = await authService.login({
    email: 'admin@futurismo.com',
    password: 'demo123'
  });

  console.log('\n📋 Final result:');
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log('\n✅ AUTH SUCCESS: Frontend debería funcionar correctamente!');
  } else {
    console.log('\n❌ AUTH FAILED:', result.error);
  }
}

testFrontendAuth();