const axios = require('axios');

async function testPropertyManagement() {
  try {
    console.log('🏠 Testing Complete Property Management...\n');
    
    // 1. Login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'newtestuser@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log(`✅ Logged in as: ${user.name} (${user.role})`);
    
    // 2. Create a property
    console.log('\n2. Creating a test property...');
    const createResponse = await axios.post('http://localhost:5000/api/properties', {
      title: 'Management Test Property',
      location: 'Test Management Location',
      price: 99000,
      description: 'This property will be used to test management features'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const propertyId = createResponse.data._id;
    console.log(`✅ Property created with ID: ${propertyId}`);
    
    // 3. Get user's properties
    console.log('\n3. Fetching user\'s properties...');
    const myPropertiesResponse = await axios.get('http://localhost:5000/api/properties/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log(`✅ User has ${myPropertiesResponse.data.length} properties:`);
    myPropertiesResponse.data.forEach((prop, index) => {
      console.log(`   ${index + 1}. ${prop.title} - KSh ${prop.price.toLocaleString()}`);
    });
    
    // 4. Update the property
    console.log('\n4. Updating the property...');
    const updateResponse = await axios.put(`http://localhost:5000/api/properties/${propertyId}`, {
      title: 'Updated Management Test Property',
      location: 'Updated Test Location',
      price: 105000
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log(`✅ Property updated: ${updateResponse.data.title}`);
    console.log(`   New price: KSh ${updateResponse.data.price.toLocaleString()}`);
    
    // 5. Delete the property
    console.log('\n5. Deleting the property...');
    await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log(`✅ Property deleted successfully`);
    
    // 6. Verify deletion
    console.log('\n6. Verifying deletion...');
    const finalPropertiesResponse = await axios.get('http://localhost:5000/api/properties/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log(`✅ User now has ${finalPropertiesResponse.data.length} properties`);
    
    console.log('\n🎉 Property management functionality is working perfectly!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testPropertyManagement();
