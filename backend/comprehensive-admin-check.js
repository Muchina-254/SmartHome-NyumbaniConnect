const axios = require('axios');
const jwt = require('jsonwebtoken');

async function comprehensiveAdminCheck() {
  console.log('🔍 COMPREHENSIVE ADMIN SYSTEM CHECK\n');
  console.log('=' .repeat(60));

  try {
    // 1. Test server connectivity
    console.log('\n1️⃣ TESTING SERVER CONNECTIVITY');
    console.log('-'.repeat(40));
    try {
      const serverResponse = await axios.get('http://localhost:5000');
      console.log('✅ Backend server is accessible');
      console.log('📝 Response:', serverResponse.data);
    } catch (serverError) {
      console.log('❌ Backend server not accessible');
      console.log('Error:', serverError.message);
      return;
    }

    // 2. Test admin login
    console.log('\n2️⃣ TESTING ADMIN LOGIN');
    console.log('-'.repeat(40));
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });

    console.log('✅ Admin login successful');
    const { token, user } = loginResponse.data;
    console.log('👤 User details:', JSON.stringify(user, null, 2));

    // 3. Decode and analyze JWT token
    console.log('\n3️⃣ ANALYZING JWT TOKEN');
    console.log('-'.repeat(40));
    const decoded = jwt.decode(token, { complete: true });
    console.log('🔑 Token payload:', JSON.stringify(decoded.payload, null, 2));
    
    const hasUserId = !!decoded.payload.userId;
    const hasId = !!decoded.payload.id;
    const hasRole = !!decoded.payload.role;
    
    console.log('📊 Token analysis:');
    console.log('   - Has userId:', hasUserId, hasUserId ? `(${decoded.payload.userId})` : '');
    console.log('   - Has id:', hasId, hasId ? `(${decoded.payload.id})` : '');
    console.log('   - Has role:', hasRole, hasRole ? `(${decoded.payload.role})` : '');

    // 4. Test each admin endpoint individually
    console.log('\n4️⃣ TESTING ADMIN ENDPOINTS');
    console.log('-'.repeat(40));
    
    const headers = { Authorization: `Bearer ${token}` };
    const endpoints = [
      { name: 'Dashboard', url: '/api/admin/dashboard' },
      { name: 'Properties', url: '/api/admin/properties' },
      { name: 'Users', url: '/api/admin/users' },
      { name: 'Contact Messages', url: '/api/contact' },
      { name: 'Contact Stats', url: '/api/contact/stats/summary' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:5000${endpoint.url}`, { headers });
        console.log(`✅ ${endpoint.name}: SUCCESS (${Array.isArray(response.data) ? response.data.length + ' items' : 'data received'})`);
      } catch (error) {
        console.log(`❌ ${endpoint.name}: FAILED`);
        console.log(`   Status: ${error.response?.status}`);
        console.log(`   Message: ${error.response?.data?.message || error.message}`);
      }
    }

    // 5. Check middleware configuration
    console.log('\n5️⃣ MIDDLEWARE ANALYSIS');
    console.log('-'.repeat(40));
    console.log('🔍 Checking if middleware expects:');
    console.log('   - userId field:', hasUserId ? '✅ Available' : '❌ Missing');
    console.log('   - id field:', hasId ? '✅ Available' : '❌ Missing');
    console.log('   - role field:', hasRole ? '✅ Available' : '❌ Missing');

    if (!hasRole) {
      console.log('⚠️  CRITICAL ISSUE: JWT token missing role field!');
      console.log('   This will cause admin middleware to fail.');
    }

  } catch (error) {
    console.log('❌ Admin check failed');
    console.log('Error details:', error.response?.data || error.message);
  }

  console.log('\n' + '=' .repeat(60));
  console.log('ADMIN SYSTEM CHECK COMPLETE');
}

comprehensiveAdminCheck();
