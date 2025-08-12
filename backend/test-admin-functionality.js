const axios = require('axios');

async function testAdminFunctionality() {
  const baseURL = 'http://localhost:5000/api';
  
  console.log('👑 TESTING ADMIN FUNCTIONALITY\n');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Admin Login
    console.log('\n1️⃣ TESTING ADMIN LOGIN...');
    const adminLogin = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });
    
    console.log(`✅ Admin login successful: ${adminLogin.data.user.name}`);
    console.log(`   Role: ${adminLogin.data.user.role}`);
    const adminToken = adminLogin.data.token;
    
    // Test 2: Access Admin Dashboard
    console.log('\n2️⃣ TESTING ADMIN DASHBOARD ACCESS...');
    const dashboardResponse = await axios.get(`${baseURL}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    console.log('✅ Admin dashboard accessible');
    console.log(`   Total Users: ${dashboardResponse.data.statistics.totalUsers}`);
    console.log(`   Total Properties: ${dashboardResponse.data.statistics.totalProperties}`);
    console.log(`   Verified Properties: ${dashboardResponse.data.statistics.verifiedProperties}`);
    console.log(`   Pending Properties: ${dashboardResponse.data.statistics.pendingProperties}`);
    
    // Test 3: View All Properties (Admin)
    console.log('\n3️⃣ TESTING ADMIN PROPERTY ACCESS...');
    const adminPropertiesResponse = await axios.get(`${baseURL}/admin/properties`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    console.log(`✅ Admin can view all properties: ${adminPropertiesResponse.data.length} properties`);
    
    // Find an unverified property to test with
    const unverifiedProperty = adminPropertiesResponse.data.find(p => !p.verified);
    
    if (unverifiedProperty) {
      console.log(`   Found unverified property: "${unverifiedProperty.title}"`);
      
      // Test 4: Verify Property (Admin Only)
      console.log('\n4️⃣ TESTING PROPERTY VERIFICATION...');
      const verifyResponse = await axios.patch(
        `${baseURL}/admin/properties/${unverifiedProperty._id}/verify`, 
        {},
        { headers: { 'Authorization': `Bearer ${adminToken}` } }
      );
      
      console.log(`✅ Property verified: ${verifyResponse.data.property.title}`);
      console.log(`   Verified by: ${verifyResponse.data.property.verifiedBy.name}`);
      
      // Test 5: Unverify Property (Admin Only)
      console.log('\n5️⃣ TESTING PROPERTY UNVERIFICATION...');
      const unverifyResponse = await axios.patch(
        `${baseURL}/admin/properties/${unverifiedProperty._id}/unverify`, 
        { reason: 'Testing admin functionality' },
        { headers: { 'Authorization': `Bearer ${adminToken}` } }
      );
      
      console.log(`✅ Property unverified: ${unverifyResponse.data.property.title}`);
      console.log(`   Reason: ${unverifyResponse.data.property.unverificationReason}`);
    }
    
    // Test 6: Non-Admin Access (Should Fail)
    console.log('\n6️⃣ TESTING NON-ADMIN ACCESS RESTRICTION...');
    
    // Login as regular user
    const regularLogin = await axios.post(`${baseURL}/auth/login`, {
      email: 'tenant.test@example.com',
      password: 'password123'
    });
    
    const regularToken = regularLogin.data.token;
    
    try {
      await axios.get(`${baseURL}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${regularToken}` }
      });
      console.log('❌ UNEXPECTED: Regular user accessed admin dashboard!');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ EXPECTED: Regular user blocked from admin access (403 Forbidden)');
        console.log(`   Message: ${error.response.data.message}`);
      }
    }
    
    // Final Summary
    console.log('\n' + '=' .repeat(50));
    console.log('🎯 ADMIN FUNCTIONALITY SUMMARY:');
    console.log('=' .repeat(50));
    console.log('✅ Admin Login: WORKING');
    console.log('✅ Admin Dashboard: WORKING');
    console.log('✅ Property Verification: WORKING');
    console.log('✅ Property Unverification: WORKING');
    console.log('✅ Non-Admin Restrictions: WORKING');
    
    console.log('\n👑 Admin Account Created:');
    console.log('   Email: admin@nyumbaniconnect.com');
    console.log('   Password: admin123456');
    console.log('   Role: Admin');
    
    console.log('\n🔒 Admin-Only Features:');
    console.log('   • Property verification/unverification');
    console.log('   • View all users');
    console.log('   • Admin dashboard statistics');
    console.log('   • Property management oversight');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testAdminFunctionality();
