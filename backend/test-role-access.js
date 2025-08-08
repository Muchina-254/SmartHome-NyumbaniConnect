const axios = require('axios');

async function testRoleBasedAccess() {
  try {
    console.log('🔐 Testing Role-Based Access Control...\n');
    
    // Test 1: Login as Tenant (should not be able to manage properties)
    console.log('1. Testing Tenant Role Access...');
    try {
      // First, let's create a tenant user for testing
      await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test Tenant',
        email: 'tenant.test@example.com',
        phone: '0700000001',
        password: 'password123',
        role: 'Tenant'
      });
      console.log('✅ Tenant user created');
    } catch (err) {
      if (err.response?.data?.error?.includes('already in use')) {
        console.log('ℹ️ Tenant user already exists');
      }
    }
    
    // Login as tenant
    const tenantLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'tenant.test@example.com',
      password: 'password123'
    });
    
    const tenantToken = tenantLogin.data.token;
    console.log(`✅ Logged in as Tenant: ${tenantLogin.data.user.name}`);
    
    // Try to create property as tenant (should fail)
    try {
      await axios.post('http://localhost:5000/api/properties', {
        title: 'Tenant Property Test',
        location: 'Should Not Work',
        price: 50000,
        description: 'This should fail'
      }, {
        headers: { 'Authorization': `Bearer ${tenantToken}` }
      });
      console.log('❌ ERROR: Tenant was able to create property!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.log('✅ CORRECT: Tenant blocked from creating properties');
        console.log(`   Message: ${err.response.data.error}`);
      } else {
        console.log('❓ Unexpected error:', err.response?.data?.error || err.message);
      }
    }
    
    // Try to access my listings as tenant (should fail)
    try {
      await axios.get('http://localhost:5000/api/properties/my', {
        headers: { 'Authorization': `Bearer ${tenantToken}` }
      });
      console.log('❌ ERROR: Tenant was able to access my listings!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.log('✅ CORRECT: Tenant blocked from accessing my listings');
      } else {
        console.log('❓ Unexpected error:', err.response?.data?.error || err.message);
      }
    }
    
    // Test 2: Test with Landlord (should work)
    console.log('\n2. Testing Landlord Role Access...');
    
    // Create landlord user
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test Landlord',
        email: 'landlord.test@example.com',
        phone: '0700000002',
        password: 'password123',
        role: 'Landlord'
      });
      console.log('✅ Landlord user created');
    } catch (err) {
      if (err.response?.data?.error?.includes('already in use')) {
        console.log('ℹ️ Landlord user already exists');
      }
    }
    
    // Login as landlord
    const landlordLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'landlord.test@example.com',
      password: 'password123'
    });
    
    const landlordToken = landlordLogin.data.token;
    console.log(`✅ Logged in as Landlord: ${landlordLogin.data.user.name}`);
    
    // Try to create property as landlord (should work)
    try {
      const createResponse = await axios.post('http://localhost:5000/api/properties', {
        title: 'Landlord Property Test',
        location: 'Should Work Fine',
        price: 75000,
        description: 'This should work perfectly'
      }, {
        headers: { 'Authorization': `Bearer ${landlordToken}` }
      });
      console.log('✅ CORRECT: Landlord can create properties');
      console.log(`   Property ID: ${createResponse.data._id}`);
      
      // Clean up - delete the test property
      await axios.delete(`http://localhost:5000/api/properties/${createResponse.data._id}`, {
        headers: { 'Authorization': `Bearer ${landlordToken}` }
      });
      console.log('✅ Test property cleaned up');
      
    } catch (err) {
      console.log('❌ ERROR: Landlord blocked from creating properties');
      console.log('   Error:', err.response?.data?.error || err.message);
    }
    
    console.log('\n🎉 Role-Based Access Control Testing Complete!');
    
  } catch (error) {
    console.error('❌ Test Error:', error.response?.data || error.message);
  }
}

testRoleBasedAccess();
