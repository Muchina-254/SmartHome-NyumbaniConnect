const axios = require('axios');

async function quickTest() {
  try {
    console.log('Testing server connection...');
    const response = await axios.get('http://localhost:5000/api/properties');
    console.log(`✅ Server responding. Found ${response.data.length} properties`);
    
    console.log('\nTesting login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'newtestuser@example.com',
      password: 'password123'
    });
    console.log(`✅ Login successful: ${loginResponse.data.user.name} (${loginResponse.data.user.role})`);
    
  } catch (error) {
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }
}

quickTest();
