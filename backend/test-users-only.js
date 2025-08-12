const axios = require('axios');

async function testUsersEndpoint() {
  try {
    console.log('Testing admin users endpoint...');

    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Test users endpoint
    const response = await axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Users endpoint working!');
    console.log(`Found ${response.data.length} users`);
    console.log('First user:', response.data[0]);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
  }
}

testUsersEndpoint();
