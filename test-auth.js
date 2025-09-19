// Test simple del authService
async function testAuth() {
  const url = 'http://localhost:4050/api/auth/login';

  console.log('🔗 Testing auth endpoint:', url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@futurismo.com',
        password: 'demo123'
      })
    });

    console.log('🔄 Response status:', response.status);
    console.log('🔄 Response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Response not OK:', response.status, errorData);
      return;
    }

    const data = await response.json();
    console.log('✅ Login response:', data);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAuth();