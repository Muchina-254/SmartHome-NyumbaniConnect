const axios = require('axios');

async function testCompleteAdminFlow() {
    try {
        console.log('🚀 Complete Admin System Test');
        console.log('==============================');
        
        // Step 1: Test basic connectivity
        console.log('\n1️⃣ Testing server connectivity...');
        const rootResponse = await axios.get('http://localhost:5000', { timeout: 5000 });
        console.log('✅ Server is running:', rootResponse.data);
        
        // Step 2: Login with admin credentials
        console.log('\n2️⃣ Testing admin login...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@nyumbaniconnect.com',
            password: 'admin123456'  // Using the correct password from create-admin.js
        }, { 
            timeout: 15000,
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('✅ Login successful!');
        console.log('User details:');
        console.log('  ID:', loginResponse.data.user.id);
        console.log('  Name:', loginResponse.data.user.name);
        console.log('  Email:', loginResponse.data.user.email);
        console.log('  Role:', loginResponse.data.user.role);
        
        const token = loginResponse.data.token;
        console.log('\n🎟️  JWT Token Analysis:');
        
        // Decode JWT payload
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
        console.log('JWT Payload:');
        console.log('  id:', payload.id);
        console.log('  userId:', payload.userId);
        console.log('  role:', payload.role);
        console.log('  expires:', new Date(payload.exp * 1000).toLocaleString());
        
        // Step 3: Test admin endpoints
        console.log('\n3️⃣ Testing admin endpoints...');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Test admin dashboard
        console.log('\n  🎛️ Testing dashboard endpoint...');
        const dashboardResponse = await axios.get('http://localhost:5000/api/admin/dashboard', { headers });
        console.log('  ✅ Dashboard access successful!');
        console.log('  Statistics:', dashboardResponse.data.statistics);
        
        // Test admin properties
        console.log('\n  🏠 Testing properties endpoint...');
        const propertiesResponse = await axios.get('http://localhost:5000/api/admin/properties', { headers });
        console.log('  ✅ Properties access successful!');
        console.log('  Properties count:', propertiesResponse.data.length);
        
        // Test admin users
        console.log('\n  👥 Testing users endpoint...');
        const usersResponse = await axios.get('http://localhost:5000/api/admin/users', { headers });
        console.log('  ✅ Users access successful!');
        console.log('  Users count:', usersResponse.data.length);
        
        // Test admin test endpoint
        console.log('\n  🧪 Testing admin test endpoint...');
        const testResponse = await axios.get('http://localhost:5000/api/admin/test', { headers });
        console.log('  ✅ Test endpoint successful!');
        console.log('  Message:', testResponse.data.message);
        
        console.log('\n🎉 ALL TESTS PASSED!');
        console.log('✅ Admin system is fully functional');
        
    } catch (error) {
        console.error('\n❌ Test failed at step:', error.message);
        if (error.response) {
            console.error('Status Code:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
            console.error('Request URL:', error.config?.url);
            console.error('Request Method:', error.config?.method);
        } else if (error.code) {
            console.error('Error Code:', error.code);
        }
    }
}

testCompleteAdminFlow();
