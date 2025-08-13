const axios = require('axios');

async function testJWT() {
    try {
        console.log('🔍 Testing JWT Token Fields');
        console.log('============================');
        
        // First check if server is reachable
        console.log('🔗 Checking server connectivity...');
        const healthResponse = await axios.get('http://localhost:5000/api/health').catch(() => null);
        
        if (!healthResponse) {
            console.log('⚠️  No health endpoint, trying login directly...');
        } else {
            console.log('✅ Server is reachable');
        }
        
        // Try to login with admin credentials
        console.log('\n📧 Attempting admin login...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@nyumbaniconnect.com',
            password: 'admin123'
        }, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Login successful');
        console.log('User ID:', loginResponse.data.user.id || loginResponse.data.user._id);
        console.log('User Role:', loginResponse.data.user.role);
        
        const token = loginResponse.data.token;
        console.log('\n🎟️  JWT Token Analysis:');
        console.log('Token length:', token.length);
        
        // Decode JWT manually (just the payload part)
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('❌ Invalid JWT format');
            return;
        }
        
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        console.log('Raw JWT Payload:', JSON.stringify(payload, null, 2));
        
        // Check for required fields
        console.log('\n🔍 Field Check:');
        console.log('Has id field:', !!payload.id);
        console.log('Has userId field:', !!payload.userId);
        console.log('Has role field:', !!payload.role);
        console.log('Has _id field:', !!payload._id);
        
        if (payload.id) console.log('id value:', payload.id);
        if (payload.userId) console.log('userId value:', payload.userId);
        if (payload.role) console.log('role value:', payload.role);
        if (payload._id) console.log('_id value:', payload._id);
        
        // Test if we can access admin endpoints
        console.log('\n🔐 Testing admin access...');
        const adminResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Admin access successful');
        
    } catch (error) {
        console.error('❌ Error details:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Message:', error.response.data?.message || 'No message');
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused - is server running on port 5000?');
        } else {
            console.error('Full error:', error.message);
            console.error('Code:', error.code);
        }
    }
}

testJWT();
