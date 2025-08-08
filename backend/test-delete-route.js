const axios = require('axios');

async function testDeleteRoute() {
  try {
    console.log('🧪 Testing DELETE route...\n');
    
    // Test if DELETE route exists by trying to access non-existent property
    const response = await axios.delete('http://localhost:5000/api/properties/nonexistent123', {
      headers: { 'Authorization': 'Bearer fake-token' }
    });
    
  } catch (error) {
    if (error.response) {
      console.log(`✅ DELETE route exists! Status: ${error.response.status}`);
      console.log(`Response: ${error.response.data.error || error.response.statusText}`);
    } else {
      console.log('❌ Cannot reach server');
    }
  }
}

testDeleteRoute();
