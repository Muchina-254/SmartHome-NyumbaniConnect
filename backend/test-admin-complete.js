const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const ADMIN_CREDENTIALS = {
  email: 'admin@nyumbaniconnect.com',
  password: 'admin123456'
};

async function testCompleteAdminFunctionality() {
  try {
    console.log('🔍 Testing Complete Admin Functionality...\n');

    // 1. Login as admin
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, ADMIN_CREDENTIALS);
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log(`✅ Admin login successful: ${loginResponse.data.user.name} (${loginResponse.data.user.role})\n`);

    // 2. Test dashboard endpoint
    console.log('2️⃣ Testing admin dashboard...');
    const dashboardResponse = await axios.get(`${BASE_URL}/api/admin/dashboard`, { headers });
    const stats = dashboardResponse.data.statistics;
    console.log(`✅ Dashboard working!`);
    console.log(`   Total Users: ${stats.totalUsers}`);
    console.log(`   Total Properties: ${stats.totalProperties}`);
    console.log(`   Verified Properties: ${stats.verifiedProperties}`);
    console.log(`   Pending Properties: ${stats.pendingProperties}\n`);

    // 3. Test properties endpoint
    console.log('3️⃣ Testing admin properties...');
    const propertiesResponse = await axios.get(`${BASE_URL}/api/admin/properties`, { headers });
    console.log(`✅ Properties endpoint working! Found ${propertiesResponse.data.length} properties`);
    if (propertiesResponse.data.length > 0) {
      const firstProperty = propertiesResponse.data[0];
      console.log(`   Sample: ${firstProperty.title} - ${firstProperty.verified ? 'Verified' : 'Pending'}\n`);
    }

    // 4. Test users endpoint (NEW)
    console.log('4️⃣ Testing admin users...');
    const usersResponse = await axios.get(`${BASE_URL}/api/admin/users`, { headers });
    console.log(`✅ Users endpoint working! Found ${usersResponse.data.length} users`);
    const userRoles = {};
    usersResponse.data.forEach(user => {
      userRoles[user.role] = (userRoles[user.role] || 0) + 1;
    });
    console.log(`   User breakdown:`, userRoles);

    console.log('\n🎉 All admin endpoints are working perfectly!');
    console.log('🚀 The admin dashboard should now load completely!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.status) {
      console.error(`   Status: ${error.response.status}`);
    }
  }
}

testCompleteAdminFunctionality();
