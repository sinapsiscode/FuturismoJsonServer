/**
 * Complete Authorization Testing Script
 * Tests all authorization scenarios with verbose output
 */

const BASE_URL = 'http://localhost:4050/api';

// Credenciales según db.json
const credentials = {
  admin: { email: 'admin@futurismo.com', password: 'demo123' },
  agency: { email: 'contacto@tourslima.com', password: 'demo123' },
  guide: { email: 'carlos@guia.com', password: 'demo123' }
};

// Helper para hacer login
async function login(role) {
  console.log(`\n🔐 Login como ${role}: ${credentials[role].email}`);

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials[role])
    });

    const data = await response.json();

    if (data.success && data.data && data.data.token) {
      console.log(`   ✅ Login exitoso`);
      return data.data.token;
    } else {
      console.log(`   ❌ Login falló: ${data.error || 'Sin token'}`);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Error en login: ${error.message}`);
    return null;
  }
}

// Helper para probar endpoint
async function testEndpoint(method, endpoint, token, description, shouldSucceed) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    const success = response.ok;
    const passed = (success === shouldSucceed);
    const icon = passed ? '✅' : '❌';
    const status = success ? 'PERMITIDO' : 'BLOQUEADO';

    console.log(`${icon} ${status} - ${description}`);

    if (!response.ok && data.error) {
      console.log(`   ↳ ${data.error}`);
    }

    return passed;
  } catch (error) {
    console.log(`❌ ERROR - ${description}: ${error.message}`);
    return false;
  }
}

// Main test function
async function runCompleteTests() {
  console.log('🚀 SISTEMA DE AUTORIZACIÓN - TESTING COMPLETO\n');
  console.log('='.repeat(70));

  let passedTests = 0;
  let totalTests = 0;

  // ========== TEST 1: ADMIN ==========
  console.log('\n📋 TEST 1: PERMISOS DE ADMINISTRADOR');
  console.log('-'.repeat(70));

  const adminToken = await login('admin');

  if (!adminToken) {
    console.log('❌ No se pudo obtener token de admin, saltando tests...');
  } else {
    console.log('\n▶️  Tests con rol ADMIN:\n');

    // Admin puede acceder a /users
    totalTests++;
    if (await testEndpoint('GET', '/users', adminToken, 'Admin accediendo a lista de usuarios', true)) {
      passedTests++;
    }

    // Admin puede acceder a /users/stats/overview
    totalTests++;
    if (await testEndpoint('GET', '/users/stats/overview', adminToken, 'Admin accediendo a estadísticas', true)) {
      passedTests++;
    }

    // Admin puede acceder a /reservations
    totalTests++;
    if (await testEndpoint('GET', '/reservations', adminToken, 'Admin accediendo a reservaciones', true)) {
      passedTests++;
    }

    // Admin puede acceder a /marketplace/stats
    totalTests++;
    if (await testEndpoint('GET', '/marketplace/stats', adminToken, 'Admin accediendo a stats de marketplace', true)) {
      passedTests++;
    }
  }

  // ========== TEST 2: AGENCY ==========
  console.log('\n📋 TEST 2: PERMISOS DE AGENCIA');
  console.log('-'.repeat(70));

  const agencyToken = await login('agency');

  if (!agencyToken) {
    console.log('❌ No se pudo obtener token de agencia, saltando tests...');
  } else {
    console.log('\n▶️  Tests con rol AGENCY:\n');

    // Agencia NO puede acceder a /users
    totalTests++;
    if (await testEndpoint('GET', '/users', agencyToken, 'Agencia intentando acceder a usuarios (debe bloquear)', false)) {
      passedTests++;
    }

    // Agencia SÍ puede acceder a /reservations
    totalTests++;
    if (await testEndpoint('GET', '/reservations', agencyToken, 'Agencia accediendo a reservaciones', true)) {
      passedTests++;
    }

    // Agencia SÍ puede acceder a /marketplace/requests
    totalTests++;
    if (await testEndpoint('GET', '/marketplace/requests', agencyToken, 'Agencia accediendo a solicitudes de marketplace', true)) {
      passedTests++;
    }

    // Agencia SÍ puede acceder a /marketplace/stats
    totalTests++;
    if (await testEndpoint('GET', '/marketplace/stats', agencyToken, 'Agencia accediendo a stats de marketplace', true)) {
      passedTests++;
    }
  }

  // ========== TEST 3: GUIDE ==========
  console.log('\n📋 TEST 3: PERMISOS DE GUÍA');
  console.log('-'.repeat(70));

  const guideToken = await login('guide');

  if (!guideToken) {
    console.log('❌ No se pudo obtener token de guía, saltando tests...');
  } else {
    console.log('\n▶️  Tests con rol GUIDE:\n');

    // Guía NO puede acceder a /users
    totalTests++;
    if (await testEndpoint('GET', '/users', guideToken, 'Guía intentando acceder a usuarios (debe bloquear)', false)) {
      passedTests++;
    }

    // Guía NO puede acceder a /reservations
    totalTests++;
    if (await testEndpoint('GET', '/reservations', guideToken, 'Guía intentando acceder a reservaciones (debe bloquear)', false)) {
      passedTests++;
    }

    // Guía SÍ puede buscar en marketplace
    totalTests++;
    if (await testEndpoint('GET', '/marketplace/search', guideToken, 'Guía buscando en marketplace', true)) {
      passedTests++;
    }

    // Guía NO puede acceder a /marketplace/stats
    totalTests++;
    if (await testEndpoint('GET', '/marketplace/stats', guideToken, 'Guía intentando acceder a stats (debe bloquear)', false)) {
      passedTests++;
    }
  }

  // ========== TEST 4: SIN TOKEN ==========
  console.log('\n📋 TEST 4: ACCESO SIN AUTENTICACIÓN');
  console.log('-'.repeat(70));
  console.log('\n▶️  Tests sin token (deben bloquearse todos):\n');

  // Sin token - /users
  totalTests++;
  if (await testEndpoint('GET', '/users', null, 'Sin token intentando acceder a usuarios', false)) {
    passedTests++;
  }

  // Sin token - /reservations
  totalTests++;
  if (await testEndpoint('GET', '/reservations', null, 'Sin token intentando acceder a reservaciones', false)) {
    passedTests++;
  }

  // Sin token - /marketplace/search
  totalTests++;
  if (await testEndpoint('GET', '/marketplace/search', null, 'Sin token intentando buscar en marketplace', false)) {
    passedTests++;
  }

  // ========== RESULTADOS ==========
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESULTADOS FINALES');
  console.log('='.repeat(70));
  console.log(`\nTests ejecutados: ${totalTests}`);
  console.log(`Tests pasados:    ${passedTests}`);
  console.log(`Tests fallidos:   ${totalTests - passedTests}`);
  console.log(`Tasa de éxito:    ${((passedTests/totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n✅ ¡TODOS LOS TESTS PASARON! El sistema de autorización funciona correctamente.\n');
  } else {
    console.log(`\n❌ ${totalTests - passedTests} test(s) fallaron. Revisar configuración de autorización.\n`);
  }

  console.log('='.repeat(70) + '\n');
}

// Ejecutar tests
runCompleteTests().catch(error => {
  console.error('❌ Error crítico en suite de tests:', error);
  process.exit(1);
});
