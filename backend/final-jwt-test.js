const axios = require('axios');

async function testWithCorrectPassword() {
    try {
        console.log('🚀 Testing with correct admin password');
        
        // Test login with correct password
        console.log('\n📧 Testing login with admin123456...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@nyumbaniconnect.com',
            password: 'admin123456'
        }, { 
            timeout: 15000,
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('✅ Login successful!');
        console.log('User:', loginResponse.data.user);
        
        const token = loginResponse.data.token;
        console.log('\n🎟️  Token Analysis:');
        console.log('Token length:', token.length);
        
        // Decode JWT
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
        console.log('JWT Payload:', JSON.stringify(payload, null, 2));
        
        // Check required fields
        console.log('\n✅ Required Field Check:');
        console.log('✓ id field:', payload.id ? 'PRESENT (' + payload.id + ')' : '❌ MISSING');
        console.log('✓ userId field:', payload.userId ? 'PRESENT (' + payload.userId + ')' : '❌ MISSING');
        console.log('✓ role field:', payload.role ? 'PRESENT (' + payload.role + ')' : '❌ MISSING');
        
        // Test admin endpoint
        console.log('\n🔐 Testing admin dashboard access...');
        const adminResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Admin dashboard access successful!');
        console.log('Dashboard data keys:', Object.keys(adminResponse.data));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response?.status) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testWithCorrectPassword();
