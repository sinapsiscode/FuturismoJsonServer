/**
 * Authorization Testing Script
 *
 * Tests role-based authorization on protected endpoints
 */

const BASE_URL = 'http://localhost:4050/api';

// Test credentials (según db.json)
const credentials = {
  admin: { email: 'admin@futurismo.com', password: 'demo123' },
  agency: { email: 'contacto@tourslima.com', password: 'demo123' },
  guide: { email: 'carlos@guia.com', password: 'demo123' },
  guideFreelance: { email: 'ana@freelance.com', password: 'demo123' }
};

// Helper function to login
async function login(role) {
  console.log(`\n🔐 Logging in as ${role}...`);
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials[role])
  });

  const data = await response.json();
  if (data.success) {
    console.log(`✅ Login successful - Token received`);
    return data.token;
  } else {
    console.log(`❌ Login failed:`, data.error);
    return null;
  }
}

// Helper function to test endpoint
async function testEndpoint(method, endpoint, token, description, shouldSucceed) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    const success = response.ok;
    const icon = success === shouldSucceed ? '✅' : '❌';
    const status = success ? 'ALLOWED' : 'BLOCKED';
    const expected = shouldSucceed ? 'should allow' : 'should block';

    console.log(`${icon} ${status} - ${description} (${expected})`);

    if (!response.ok) {
      console.log(`   ↳ ${data.error || data.message}`);
    }

    return success === shouldSucceed;
  } catch (error) {
    console.log(`❌ ERROR - ${description}:`, error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 AUTHORIZATION TESTING SUITE\n');
  console.log('Testing endpoints with different user roles...\n');
  console.log('=' .repeat(60));

  let passedTests = 0;
  let totalTests = 0;

  // TEST 1: Admin access
  console.log('\n📋 TEST 1: ADMIN ROLE PERMISSIONS');
  console.log('-'.repeat(60));
  const adminToken = await login('admin');

  if (adminToken) {
    totalTests++;
    if (await testEndpoint('GET', '/users', adminToken, 'Admin accessing users list', true)) passedTests++;

    totalTests++;
    if (await testEndpoint('GET', '/users/stats/overview', adminToken, 'Admin accessing user stats', true)) passedTests++;

    totalTests++;
    if (await testEndpoint('GET', '/reservations', adminToken, 'Admin accessing reservations', true)) passedTests++;

    totalTests++;
    if (await testEndpoint('GET', '/marketplace/stats', adminToken, 'Admin accessing marketplace stats', true)) passedTests++;
  }

  // TEST 2: Agency access
  console.log('\n📋 TEST 2: AGENCY ROLE PERMISSIONS');
  console.log('-'.repeat(60));
  const agencyToken = await login('agency');

  if (agencyToken) {
    totalTests++;
    if (await testEndpoint('GET', '/users', agencyToken, 'Agency accessing users list', false)) passedTests++;

    totalTests++;
    if (await testEndpoint('GET', '/reservations', agencyToken, 'Agency accessing reservations', true)) passedTests++;

    totalTests++;
    if (await testEndpoint('GET', '/marketplace/requests', agencyToken, 'Agency accessing marketplace requests', true)) passedTests++;

    totalTests++;
    if (await testEndpoint('GET', '/marketplace/stats', agencyToken, 'Agency accessing marketplace stats', true)) passedTests++;
  }

  // TEST 3: Guide access
  console.log('\n📋 TEST 3: GUIDE ROLE PERMISSIONS');
  console.log('-'.repeat(60));
  const guideToken = await login('guide');

  if (guideToken) {
    totalTests++;
    if (await testEndpoint('GET', '/users', guideToken, 'Guide accessing users list', false)) passedTests++;

    totalTests++;
    if (await testEndpoint('GET', '/reservations', guideToken, 'Guide accessing reservations', false)) passedTests++;

    totalTests++;
    if (await testEndpoint('GET', '/marketplace/search', guideToken, 'Guide searching marketplace', true)) passedTests++;

    totalTests++;
    if (await testEndpoint('GET', '/marketplace/stats', guideToken, 'Guide accessing marketplace stats', false)) passedTests++;
  }

  // TEST 4: No token access
  console.log('\n📋 TEST 4: NO TOKEN (UNAUTHENTICATED)');
  console.log('-'.repeat(60));

  totalTests++;
  if (await testEndpoint('GET', '/users', null, 'No token accessing users', false)) passedTests++;

  totalTests++;
  if (await testEndpoint('GET', '/reservations', null, 'No token accessing reservations', false)) passedTests++;

  totalTests++;
  if (await testEndpoint('GET', '/marketplace/search', null, 'No token accessing marketplace', false)) passedTests++;

  // Results
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n✅ ALL TESTS PASSED! Authorization system is working correctly.');
  } else {
    console.log(`\n❌ ${totalTests - passedTests} test(s) failed. Please review the authorization configuration.`);
  }

  console.log('\n' + '='.repeat(60));
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
