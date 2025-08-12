const axios = require('axios');

async function testBasicRoutes() {
  console.log('Testing basic API routes...\n');
  
  try {
    // Test existing property routes
    const propertiesResponse = await axios.get('http://localhost:5000/api/properties');
    console.log(`✅ Properties route works: ${propertiesResponse.data.length} properties`);
    
    // Test admin login
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });
    console.log(`✅ Admin login works: ${loginResponse.data.user.role}`);
    
    // Test admin dashboard route
    try {
      const adminResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${loginResponse.data.token}` }
      });
      console.log('✅ Admin dashboard works');
    } catch (adminError) {
      console.log(`❌ Admin dashboard failed: ${adminError.response?.status} - ${adminError.response?.statusText}`);
      console.log('   Admin routes might not be loaded properly');
    }
    
  } catch (error) {
    console.error('❌ Basic route test failed:', error.message);
  }
}

testBasicRoutes();
