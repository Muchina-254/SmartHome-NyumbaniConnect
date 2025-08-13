const jwt = require('jsonwebtoken');

// Test JWT token decoding
const testToken = async () => {
  try {
    // First login to get a fresh token
    const axios = require('axios');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });

    const token = loginResponse.data.token;
    console.log('🔍 Decoding JWT token...\n');

    // Decode without verification to see the payload
    const decoded = jwt.decode(token, { complete: true });
    console.log('📦 Full token structure:', JSON.stringify(decoded, null, 2));
    console.log('🔑 Payload only:', JSON.stringify(decoded.payload, null, 2));

    // Check what the middleware sees
    console.log('\n🔍 What the middleware sees:');
    console.log('- decoded.userId:', decoded.payload.userId);
    console.log('- decoded.id:', decoded.payload.id);
    console.log('- decoded.role:', decoded.payload.role);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testToken();
