const axios = require('axios');

async function testAdminAccess() {
  console.log('🔧 Testing Admin Access Step by Step\n');

  try {
    // Step 1: Login as admin
    console.log('1️⃣ Step 1: Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });

    console.log('✅ Login successful');
    console.log('📄 Response:', JSON.stringify(loginResponse.data, null, 2));
    
    const { token, user } = loginResponse.data;
    
    if (!token) {
      console.log('❌ No token received');
      return;
    }
    
    if (!user || user.role !== 'Admin') {
      console.log('❌ User role is not Admin:', user?.role);
      return;
    }

    console.log('✅ Token received, user role:', user.role);
    console.log('🔑 Token preview:', token.substring(0, 50) + '...\n');

    // Step 2: Test admin endpoint
    console.log('2️⃣ Step 2: Testing admin dashboard endpoint...');
    try {
      const dashboardResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('✅ Dashboard access successful');
      console.log('📊 Dashboard data:', JSON.stringify(dashboardResponse.data, null, 2));
    } catch (dashboardError) {
      console.log('❌ Dashboard access failed');
      console.log('Error status:', dashboardError.response?.status);
      console.log('Error message:', dashboardError.response?.data?.message);
      console.log('Full error:', dashboardError.response?.data);
    }

    // Step 3: Test properties endpoint
    console.log('\n3️⃣ Step 3: Testing admin properties endpoint...');
    try {
      const propertiesResponse = await axios.get('http://localhost:5000/api/admin/properties', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('✅ Properties access successful');
      console.log('🏠 Properties count:', propertiesResponse.data.length);
    } catch (propertiesError) {
      console.log('❌ Properties access failed');
      console.log('Error status:', propertiesError.response?.status);
      console.log('Error message:', propertiesError.response?.data?.message);
    }

    // Step 4: Test users endpoint
    console.log('\n4️⃣ Step 4: Testing admin users endpoint...');
    try {
      const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('✅ Users access successful');
      console.log('👥 Users count:', usersResponse.data.length);
    } catch (usersError) {
      console.log('❌ Users access failed');
      console.log('Error status:', usersError.response?.status);
      console.log('Error message:', usersError.response?.data?.message);
    }

    // Step 5: Test contact endpoint
    console.log('\n5️⃣ Step 5: Testing contact endpoint...');
    try {
      const contactResponse = await axios.get('http://localhost:5000/api/contact', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('✅ Contact access successful');
      console.log('📧 Contacts count:', contactResponse.data.data?.length || 0);
    } catch (contactError) {
      console.log('❌ Contact access failed');
      console.log('Error status:', contactError.response?.status);
      console.log('Error message:', contactError.response?.data?.message);
    }

  } catch (loginError) {
    console.log('❌ Login failed');
    console.log('Error status:', loginError.response?.status);
    console.log('Error message:', loginError.response?.data?.error);
    console.log('Full error:', loginError.response?.data);
  }
}

testAdminAccess();
