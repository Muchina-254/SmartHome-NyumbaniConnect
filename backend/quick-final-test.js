console.log('Testing now...');

const axios = require('axios');

(async () => {
  try {
    console.log('1. Testing server...');
    const serverTest = await axios.get('http://localhost:5000');
    console.log('✅ Server OK');
    
    console.log('2. Testing admin login...');
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });
    console.log('✅ Login OK');
    
    const token = login.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    console.log('3. Testing admin users...');
    const users = await axios.get('http://localhost:5000/api/admin/users', { headers });
    console.log(`✅ Users OK: ${users.data.length} users found`);
    
    console.log('\n🎉 ALL WORKING! Admin panel should work now!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.status || error.message);
    if (error.response?.data) {
      console.error('Response:', error.response.data);
    }
  }
})();
