const axios = require('axios');

async function testErrorHandling() {
  console.log('🧪 Testing improved error handling...\n');
  
  // Test 1: Login with invalid email format
  console.log('1. Testing invalid email format (should be caught by frontend validation)');
  
  // Test 2: Login with non-existent user
  console.log('2. Testing login with non-existent user...');
  try {
    await axios.post('http://localhost:5000/api/auth/login', {
      email: 'nonexistent@example.com',
      password: 'password123'
    });
  } catch (error) {
    console.log('✅ Backend error message:', error.response?.data?.error);
  }
  
  // Test 3: Login with wrong password
  console.log('\n3. Testing login with wrong password...');
  try {
    await axios.post('http://localhost:5000/api/auth/login', {
      email: 'newtestuser@example.com',
      password: 'wrongpassword'
    });
  } catch (error) {
    console.log('✅ Backend error message:', error.response?.data?.error);
  }
  
  // Test 4: Registration with duplicate email
  console.log('\n4. Testing registration with duplicate email...');
  try {
    await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Another User',
      email: 'newtestuser@example.com', // This email already exists
      phone: '0788888888',
      password: 'password123',
      role: 'Landlord'
    });
  } catch (error) {
    console.log('✅ Backend error message:', error.response?.data?.error);
  }
  
  // Test 5: Registration with invalid role (lowercase)
  console.log('\n5. Testing registration with invalid role...');
  try {
    await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User Invalid',
      email: 'testinvalid@example.com',
      phone: '0777777777',
      password: 'password123',
      role: 'tenant' // lowercase should fail
    });
  } catch (error) {
    console.log('✅ Backend error message:', error.response?.data?.error);
  }
  
  console.log('\n🎉 Error handling tests completed!');
}

testErrorHandling();
