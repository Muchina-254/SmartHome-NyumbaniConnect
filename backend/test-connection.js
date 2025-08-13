const axios = require('axios');

async function testConnection() {
  try {
    console.log('🔧 Testing backend connection...');
    const response = await axios.get('http://localhost:5000');
    console.log('✅ Backend is reachable');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Backend connection failed');
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
  }
}

testConnection();
