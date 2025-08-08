const axios = require('axios');

async function testRoleBasedAccessSimple() {
  console.log('🔐 Testing Role-Based Access Control...\n');
  
  try {
    // Test with existing user (newtestuser@example.com is a Tenant)
    console.log('1. Testing with existing Tenant user...');
    
    const tenantLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'newtestuser@example.com',
      password: 'password123'
    });
    
    console.log(`✅ Logged in as: ${tenantLogin.data.user.name} (${tenantLogin.data.user.role})`);
    const tenantToken = tenantLogin.data.token;
    
    // Test 1: Try to create property as Tenant
    console.log('\n   Testing property creation...');
    try {
      const createResponse = await axios.post('http://localhost:5000/api/properties', {
        title: 'Tenant Test Property',
        location: 'Should Fail',
        price: 50000,
        description: 'This should be blocked'
      }, {
        headers: { 'Authorization': `Bearer ${tenantToken}` }
      });
      
      console.log('❌ ERROR: Tenant was able to create property!');
      
    } catch (err) {
      if (err.response?.status === 403) {
        console.log('✅ SUCCESS: Tenant correctly blocked from creating properties');
        console.log(`   Message: ${err.response.data.error}`);
      } else {
        console.log(`❓ Unexpected response: ${err.response?.status} - ${err.response?.data?.error}`);
      }
    }
    
    // Test 2: Try to access my listings as Tenant
    console.log('\n   Testing my listings access...');
    try {
      const myListingsResponse = await axios.get('http://localhost:5000/api/properties/my', {
        headers: { 'Authorization': `Bearer ${tenantToken}` }
      });
      
      console.log('❌ ERROR: Tenant was able to access my listings!');
      
    } catch (err) {
      if (err.response?.status === 403) {
        console.log('✅ SUCCESS: Tenant correctly blocked from accessing my listings');
        console.log(`   Message: ${err.response.data.error}`);
      } else {
        console.log(`❓ Unexpected response: ${err.response?.status} - ${err.response?.data?.error}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testRoleBasedAccessSimple();
