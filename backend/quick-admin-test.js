const axios = require('axios');

async function quickAdminTest() {
  try {
    console.log('🔍 Testing admin route accessibility...');
    
    // Test with invalid token to see if route exists
    await axios.get('http://localhost:5000/api/admin/dashboard', {
      headers: { 'Authorization': 'Bearer invalid' }
    });
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      if (error.response.status === 401) {
        console.log('✅ Admin route exists (401 Unauthorized - expected with invalid token)');
      } else if (error.response.status === 404) {
        console.log('❌ Admin route NOT found (404)');
      }
    } else {
      console.log('❌ Server not responding:', error.message);
    }
  }
}

quickAdminTest();
