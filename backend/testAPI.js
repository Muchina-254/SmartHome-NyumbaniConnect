// Simple API test script
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing SmartHome API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log(`   ✅ Status: ${health.data.status}`);

    // Test 2: Get all properties
    console.log('\n2. Testing properties endpoint...');
    const properties = await axios.get(`${BASE_URL}/api/properties`);
    console.log(`   ✅ Found ${properties.data.properties.length} properties`);
    
    if (properties.data.properties.length > 0) {
      const firstProperty = properties.data.properties[0];
      console.log(`   📍 Sample: "${firstProperty.title}" in ${firstProperty.location.area}`);
      console.log(`   💰 Price: KES ${firstProperty.pricing.rentAmount || firstProperty.pricing.salePrice}`);
    }

    // Test 3: User registration
    console.log('\n3. Testing user registration...');
    const newUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      phone: `+25470${Math.floor(Math.random() * 1000000)}`,
      password: 'password123',
      userType: 'tenant',
      county: 'Nairobi',
      city: 'Nairobi'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, newUser);
    console.log(`   ✅ User registered: ${registerResponse.data.user.email}`);
    console.log(`   🔑 Token received: ${registerResponse.data.token.substring(0, 20)}...`);

    // Test 4: User login
    console.log('\n4. Testing user login...');
    const loginData = {
      email: 'mary.wanjiku@gmail.com',
      password: 'password123'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    console.log(`   ✅ Logged in as: ${loginResponse.data.user.firstName} ${loginResponse.data.user.lastName}`);
    console.log(`   👥 User type: ${loginResponse.data.user.userType}`);

    // Test 5: Property search with filters
    console.log('\n5. Testing property search with filters...');
    const searchResponse = await axios.get(`${BASE_URL}/api/properties?location=Nairobi&propertyType=apartment&minPrice=20000&maxPrice=50000`);
    console.log(`   ✅ Found ${searchResponse.data.properties.length} apartments in Nairobi (KES 20K-50K)`);

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Health check: Working`);
    console.log(`   • Properties API: ${properties.data.properties.length} properties loaded`);
    console.log(`   • User registration: Working`);
    console.log(`   • User login: Working`);
    console.log(`   • Property search: Working`);

    console.log('\n🔑 Test login credentials:');
    console.log('   Email: mary.wanjiku@gmail.com');
    console.log('   Password: password123');
    console.log('   Type: landlord');

  } catch (error) {
    console.error('❌ API Test failed:', error.response?.data || error.message);
  }
}

testAPI();
