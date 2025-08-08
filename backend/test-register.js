const axios = require('axios');

async function testRegistration() {
  try {
    const userData = {
      name: "New Test User",
      email: "newtestuser@example.com",
      phone: "0799999999",
      password: "password123",
      role: "Tenant"
    };

    console.log('Attempting to register user with data:', userData);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', userData);
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    
    // Now test login
    const loginData = {
      email: "newtestuser@example.com",
      password: "password123"
    };
    
    console.log('\nTesting login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData);
    
    console.log('✅ Login successful!');
    console.log('Login Response:', loginResponse.data);
    
  } catch (error) {
    console.log('❌ Error occurred:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.error || error.message);
  }
}

testRegistration();
