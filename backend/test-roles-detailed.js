const axios = require('axios');

async function testRoleBasedAccess() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('🔐 Testing Role-Based Access Control...\n');
    
    // Test 1: Check if server is responding
    console.log('1. Testing server connection...');
    const healthCheck = await axios.get(`${baseURL}/properties`);
    console.log(`✅ Server responding. Found ${healthCheck.data.length} properties\n`);
    
    // Test 2: Login as existing user (should be Tenant from previous tests)
    console.log('2. Testing login with existing user...');
    const loginData = {
      email: 'newtestuser@example.com',
      password: 'password123'
    };
    
    let loginResponse;
    try {
      loginResponse = await axios.post(`${baseURL}/auth/login`, loginData);
      console.log(`✅ Login successful: ${loginResponse.data.user.name} (Role: ${loginResponse.data.user.role})`);
      console.log(`   User ID: ${loginResponse.data.user.id}`);
      console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);
    } catch (loginError) {
      console.log('❌ Login failed:', loginError.response?.data || loginError.message);
      return;
    }
    
    const token = loginResponse.data.token;
    const userRole = loginResponse.data.user.role;
    
    // Test 3: Try to create a property with this user
    console.log('\n3. Testing property creation...');
    const propertyData = {
      title: 'Role Test Property',
      description: 'Testing role-based access',
      price: 150000,
      location: 'Test Location',
      bedrooms: 2,
      bathrooms: 1,
      type: 'apartment'
    };
    
    try {
      const createResponse = await axios.post(`${baseURL}/properties`, propertyData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`✅ Property creation ALLOWED for ${userRole}: ${createResponse.data.title}`);
      
      // If creation succeeded, try to delete it
      console.log('\n4. Testing property deletion...');
      try {
        await axios.delete(`${baseURL}/properties/${createResponse.data._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`✅ Property deletion ALLOWED for ${userRole}`);
      } catch (deleteError) {
        console.log(`❌ Property deletion DENIED for ${userRole}:`, deleteError.response?.data?.message || deleteError.message);
      }
      
    } catch (createError) {
      console.log(`❌ Property creation DENIED for ${userRole}:`, createError.response?.data?.message || createError.message);
    }
    
    // Test 4: Show what roles should be allowed
    console.log('\n5. Role-based access summary:');
    console.log(`   Current user role: ${userRole}`);
    console.log('   Roles allowed to manage properties: Landlord, Developer, Agent');
    console.log('   Roles NOT allowed to manage properties: Tenant');
    
    if (userRole === 'Tenant') {
      console.log('   ✅ EXPECTED: Tenant should be DENIED property management');
    } else {
      console.log(`   ✅ EXPECTED: ${userRole} should be ALLOWED property management`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

// Run the test
testRoleBasedAccess();
