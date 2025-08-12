const axios = require('axios');

async function testAdminAccess() {
  console.log('🔍 Testing Admin Access...\n');
  
  try {
    // Step 1: Test basic server connection
    console.log('1️⃣ Testing server connection...');
    const serverTest = await axios.get('http://localhost:5000/');
    console.log('✅ Server responding:', serverTest.data);

    // Step 2: Login as admin
    console.log('\n2️⃣ Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });
    
    console.log(`✅ Admin login successful: ${loginResponse.data.user.name} (${loginResponse.data.user.role})`);
    const token = loginResponse.data.token;

    // Step 3: Test admin dashboard route
    console.log('\n3️⃣ Testing admin dashboard...');
    try {
      const dashboardResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Admin dashboard working!');
      console.log(`   Total Users: ${dashboardResponse.data.statistics.totalUsers}`);
      console.log(`   Total Properties: ${dashboardResponse.data.statistics.totalProperties}`);
      console.log(`   Verified Properties: ${dashboardResponse.data.statistics.verifiedProperties}`);
    } catch (dashError) {
      console.log('❌ Admin dashboard failed:', dashError.response?.status, dashError.response?.statusText);
      console.log('   Error:', dashError.response?.data);
    }

    // Step 4: Test admin properties route
    console.log('\n4️⃣ Testing admin properties...');
    try {
      const propertiesResponse = await axios.get('http://localhost:5000/api/admin/properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`✅ Admin properties working! Found ${propertiesResponse.data.length} properties`);
    } catch (propError) {
      console.log('❌ Admin properties failed:', propError.response?.status, propError.response?.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Wait for servers to start then test
setTimeout(testAdminAccess, 3000);
