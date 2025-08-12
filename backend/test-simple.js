const axios = require('axios');

async function simpleTest() {
  try {
    console.log('1. Testing server connectivity...');
    const response = await axios.get('http://localhost:5000/');
    console.log('✅ Server is responding:', response.data);
    
  } catch (error) {
    console.log('❌ Server not responding:', error.code || error.message);
  }
}

simpleTest();
