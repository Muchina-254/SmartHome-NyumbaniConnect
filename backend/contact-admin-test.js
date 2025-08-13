const axios = require('axios');

async function testContactSystemAndAdmin() {
    try {
        console.log('🚀 Testing Contact System + Admin Integration');
        console.log('================================================');
        
        // Step 1: Login as admin
        console.log('\n1️⃣ Admin Login...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@nyumbaniconnect.com',
            password: 'admin123456'
        }, {
            timeout: 10000
        });
        
        const token = loginResponse.data.token;
        const headers = { 'Authorization': `Bearer ${token}` };
        console.log('✅ Admin logged in successfully');
        
        // Step 2: Test contact submission (public endpoint)
        console.log('\n2️⃣ Testing contact form submission...');
        const contactData = {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Contact Subject',
            message: 'This is a test contact message from the admin system test.'
        };
        
        const contactResponse = await axios.post('http://localhost:5000/api/contact', contactData);
        console.log('✅ Contact message submitted:', contactResponse.data.message);
        if (contactResponse.data.contact?._id) {
            console.log('   Message ID:', contactResponse.data.contact._id);
        }
        
        // Step 3: Test admin contact endpoints
        console.log('\n3️⃣ Testing admin contact management...');
        
        // Get all contact messages (admin only) - correct endpoint
        const contactsResponse = await axios.get('http://localhost:5000/api/contact', { headers });
        const contactCount = contactsResponse.data.success ? contactsResponse.data.data?.length : contactsResponse.data.length;
        console.log('✅ Contact messages retrieved:', contactCount, 'messages');
        
        // Get contact statistics (admin only) - correct endpoint
        const statsResponse = await axios.get('http://localhost:5000/api/contact/stats/summary', { headers });
        console.log('✅ Contact stats retrieved:', statsResponse.data);
        
        console.log('\n4️⃣ Testing complete admin dashboard with contact data...');
        const fullDashboard = await axios.get('http://localhost:5000/api/admin/dashboard', { headers });
        console.log('✅ Full dashboard data:');
        console.log('   Users:', fullDashboard.data.statistics.totalUsers);
        console.log('   Properties:', fullDashboard.data.statistics.totalProperties);
        console.log('   Verified Properties:', fullDashboard.data.statistics.verifiedProperties);
        console.log('   Pending Properties:', fullDashboard.data.statistics.pendingProperties);
        
        console.log('\n🎉 ALL CONTACT & ADMIN TESTS PASSED!');
        console.log('✅ Complete system is functional');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testContactSystemAndAdmin();
