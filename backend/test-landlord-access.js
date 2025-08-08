const axios = require('axios');

async function testAuthorizedRole() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('🏠 Testing with AUTHORIZED role (Landlord)...\n');
    
    // Create a Landlord user
    console.log('1. Creating Landlord user...');
    const landlordData = {
      name: 'Test Landlord',
      email: 'landlord@test.com',
      password: 'password123',
      phone: '1234567890', // Adding phone in case it's required
      role: 'Landlord'
    };
    
    try {
      const registerResponse = await axios.post(`${baseURL}/auth/register`, landlordData);
      console.log(`✅ Landlord user created successfully: ${registerResponse.data.message}`);
    } catch (registerError) {
      if (registerError.response?.status === 400 && registerError.response?.data?.error?.includes('already in use')) {
        console.log('ℹ️  Landlord user already exists, continuing with login...');
      } else {
        console.log('❌ Registration failed:', registerError.response?.data?.error || registerError.message);
        return;
      }
    }
    
    // Login as Landlord
    console.log('\n2. Logging in as Landlord...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'landlord@test.com',
      password: 'password123'
    });
    console.log(`✅ Login successful: ${loginResponse.data.user.name} (Role: ${loginResponse.data.user.role})`);
    
    const token = loginResponse.data.token;
    
    // Test property creation (should work)
    console.log('\n3. Testing property creation as Landlord...');
    const propertyData = {
      title: 'Landlord Test Property',
      description: 'Created by authorized Landlord user',
      price: 200000,
      location: 'Authorized Location',
      bedrooms: 3,
      bathrooms: 2,
      type: 'house'
    };
    
    const createResponse = await axios.post(`${baseURL}/properties`, propertyData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Property creation ALLOWED for Landlord: ${createResponse.data.title}`);
    console.log(`   Property ID: ${createResponse.data._id}`);
    
    // Test property editing (should work)
    console.log('\n4. Testing property editing as Landlord...');
    const editData = {
      title: 'Updated Landlord Property',
      price: 220000
    };
    
    const editResponse = await axios.put(`${baseURL}/properties/${createResponse.data._id}`, editData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Property editing ALLOWED for Landlord: ${editResponse.data.title}`);
    
    // Test property deletion (should work)
    console.log('\n5. Testing property deletion as Landlord...');
    await axios.delete(`${baseURL}/properties/${createResponse.data._id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Property deletion ALLOWED for Landlord`);
    
    console.log('\n🎉 SUMMARY: Landlord role has FULL ACCESS to property management as expected!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

// Run the test
testAuthorizedRole();
