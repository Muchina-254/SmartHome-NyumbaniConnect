const axios = require('axios');

console.log('🔄 Testing Admin Panel Access...');

setTimeout(async () => {
  try {
    // Test login first
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });
    
    const token = loginRes.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    console.log('✅ Admin login successful');
    
    // Test all endpoints
    const dashboardRes = await axios.get('http://localhost:5000/api/admin/dashboard', { headers });
    console.log('✅ Dashboard endpoint working');
    
    const propertiesRes = await axios.get('http://localhost:5000/api/admin/properties', { headers });
    console.log(`✅ Properties endpoint working (${propertiesRes.data.length} properties)`);
    
    const usersRes = await axios.get('http://localhost:5000/api/admin/users', { headers });
    console.log(`✅ Users endpoint working (${usersRes.data.length} users)`);
    
    console.log('\n🎉 ALL ADMIN ENDPOINTS WORKING!');
    console.log('✅ The admin dashboard should now load completely in the browser!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response?.status === 404) {
      console.error('   Route not found - check server.js routing');
    }
  }
}, 3000);

console.log('Waiting 3 seconds for server...');
