const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testJWTFields() {
  try {
    console.log('🔍 Testing JWT Token Fields');
    console.log('============================');
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });

    const token = loginResponse.data.token;
    const decoded = jwt.decode(token);
    
    console.log('📦 Raw JWT Payload:', JSON.stringify(decoded, null, 2));
    console.log('\n🔍 Field Analysis:');
    console.log('   - id field:', decoded.id ? `✅ Present (${decoded.id})` : '❌ Missing');
    console.log('   - userId field:', decoded.userId ? `✅ Present (${decoded.userId})` : '❌ Missing');
    console.log('   - role field:', decoded.role ? `✅ Present (${decoded.role})` : '❌ Missing');
    
    // Test what middleware would receive
    console.log('\n🛠️ What middleware would create:');
    const mockMiddlewareUser = {
      ...decoded,
      id: decoded.id || decoded.userId,
      userId: decoded.userId || decoded.id
    };
    console.log('   Processed user object:', JSON.stringify(mockMiddlewareUser, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testJWTFields();
