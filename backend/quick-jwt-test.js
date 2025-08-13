const axios = require('axios');

async function testJWT() {
    try {
        console.log('🔍 Testing JWT Token Fields');
        console.log('============================');
        
        // Try to login with admin credentials
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@nyumbaniconnect.com',
            password: 'admin123'
        });
        
        console.log('✅ Login successful');
        console.log('User ID:', loginResponse.data.user.id);
        console.log('User Role:', loginResponse.data.user.role);
        
        const token = loginResponse.data.token;
        console.log('\n🎟️  JWT Token Analysis:');
        
        // Decode JWT manually (just the payload part)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        console.log('Raw JWT Payload:', JSON.stringify(payload, null, 2));
        
        // Check for required fields
        console.log('\n🔍 Field Check:');
        console.log('Has id field:', !!payload.id);
        console.log('Has userId field:', !!payload.userId);
        console.log('Has role field:', !!payload.role);
        
        if (payload.id) console.log('id value:', payload.id);
        if (payload.userId) console.log('userId value:', payload.userId);
        if (payload.role) console.log('role value:', payload.role);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data?.message || error.message);
    }
}

testJWT();
