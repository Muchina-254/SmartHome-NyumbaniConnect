const axios = require('axios');

async function testAdminQuick() {
  try {
    console.log('Testing admin access...');
    
    // Login as admin
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });
    
    console.log(`✅ Admin login: ${adminLogin.data.user.name} (${adminLogin.data.user.role})`);
    const token = adminLogin.data.token;
    
    // Test admin route
    const testResponse = await axios.get('http://localhost:5000/api/admin/test', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Admin test route: ${testResponse.data.message}`);
    
    // Test dashboard
    const dashboardResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Dashboard: ${dashboardResponse.data.statistics.totalProperties} properties, ${dashboardResponse.data.statistics.totalUsers} users`);
    
    console.log('\n🎉 Admin routes are working! You can now use the admin dashboard.');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAdminQuick();
