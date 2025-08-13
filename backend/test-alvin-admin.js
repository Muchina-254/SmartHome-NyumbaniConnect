const axios = require('axios');

async function testAlvinAdmin() {
    try {
        console.log('🚀 Testing Alvin Admin Account');
        console.log('===============================');
        
        // Test login with new admin credentials
        console.log('\n1️⃣ Testing login with Alvin admin...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'alvin@nyumbaniconnect.com',
            password: 'alvin123456'
        }, { 
            timeout: 10000,
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
        
        // Test admin endpoints with Alvin's token
        console.log('\n2️⃣ Testing admin endpoints access...');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Test dashboard
        const dashboardResponse = await axios.get('http://localhost:5000/api/admin/dashboard', { headers });
        console.log('✅ Dashboard access successful!');
        
        // Test properties
        const propertiesResponse = await axios.get('http://localhost:5000/api/admin/properties', { headers });
        console.log('✅ Properties access successful! Count:', propertiesResponse.data.length);
        
        // Test users
        const usersResponse = await axios.get('http://localhost:5000/api/admin/users', { headers });
        console.log('✅ Users access successful! Count:', usersResponse.data.length);
        
        // Test contact messages
        const contactResponse = await axios.get('http://localhost:5000/api/contact', { headers });
        console.log('✅ Contact messages access successful!');
        
        // Test admin test endpoint
        const testResponse = await axios.get('http://localhost:5000/api/admin/test', { headers });
        console.log('✅ Admin test endpoint successful!');
        console.log('  Message:', testResponse.data.message);
        console.log('  User:', testResponse.data.user);
        
        console.log('\n🎉 ALL ALVIN ADMIN TESTS PASSED!');
        console.log('✅ Alvin admin account is fully functional');
        
        // Show both admin accounts
        console.log('\n👥 Available Admin Accounts:');
        console.log('1. admin@nyumbaniconnect.com (password: admin123456)');
        console.log('2. alvin@nyumbaniconnect.com (password: alvin123456)');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.response) {
            console.error('Status Code:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testAlvinAdmin();
