const axios = require('axios');
const jwt = require('jsonwebtoken');

async function debugAdminAccess() {
  try {
    console.log('🔍 Debugging Admin Access Issue...\n');
    
    // 1. Test login
    console.log('1️⃣ Testing admin login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });
    
    console.log('✅ Login successful!');
    console.log('   User data:', loginResponse.data.user);
    console.log('   Role:', loginResponse.data.user.role);
    console.log('   Role type:', typeof loginResponse.data.user.role);
    
    const token = loginResponse.data.token;
    console.log('   Token length:', token.length);
    
    // 2. Decode the token to see what's inside
    console.log('\n2️⃣ Decoding JWT token...');
    try {
      // Decode without verification to see contents
      const decoded = jwt.decode(token);
      console.log('   Token payload:', decoded);
      console.log('   User ID in token:', decoded.userId);
    } catch (decodeError) {
      console.error('   Token decode error:', decodeError.message);
    }
    
    // 3. Test admin endpoint with detailed error logging
    console.log('\n3️⃣ Testing admin endpoint access...');
    try {
      const adminResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Admin access successful!');
      console.log('   Dashboard data:', adminResponse.data);
    } catch (adminError) {
      console.error('❌ Admin access failed:');
      console.error('   Status:', adminError.response?.status);
      console.error('   Error message:', adminError.response?.data?.message);
      console.error('   Full error:', adminError.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Response:', error.response.data);
    }
  }
}

debugAdminAccess();
