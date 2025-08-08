const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testPropertyCreation() {
  try {
    console.log('🏠 Testing Property Creation...\n');
    
    // First, login to get a token
    console.log('1. Logging in to get authentication token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'newtestuser@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log(`✅ Logged in as: ${user.name} (${user.role})`);
    console.log(`Token: ${token.substring(0, 20)}...`);
    
    // 2. Create a test property without image first
    console.log('\n2. Creating a test property...');
    const propertyData = {
      title: 'Test Property from API',
      location: 'Test Location, Nairobi',
      price: 85000,
      description: 'This is a test property created via API to verify functionality.'
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/properties', propertyData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Property created successfully!');
    console.log(`Property ID: ${createResponse.data._id}`);
    console.log(`Title: ${createResponse.data.title}`);
    console.log(`Price: KSh ${createResponse.data.price.toLocaleString()}`);
    
    // 3. Test fetching the user's properties
    console.log('\n3. Fetching user\'s properties...');
    const myPropertiesResponse = await axios.get('http://localhost:5000/api/properties/my', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✅ User has ${myPropertiesResponse.data.length} property(ies):`);
    myPropertiesResponse.data.forEach((prop, index) => {
      console.log(`   ${index + 1}. ${prop.title} - KSh ${prop.price.toLocaleString()}`);
    });
    
    // 4. Test with file upload (if a test image exists)
    const testImagePath = path.join(__dirname, 'uploads', 'house1.jpg');
    if (fs.existsSync(testImagePath)) {
      console.log('\n4. Testing property creation with image...');
      
      const formData = new FormData();
      formData.append('title', 'Property with Image Test');
      formData.append('location', 'Image Test Location');
      formData.append('price', '120000');
      formData.append('description', 'Test property with image upload');
      formData.append('image', fs.createReadStream(testImagePath));
      
      const imageUploadResponse = await axios.post('http://localhost:5000/api/properties', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      });
      
      console.log('✅ Property with image created successfully!');
      console.log(`Image filename: ${imageUploadResponse.data.image}`);
    } else {
      console.log('\n4. ⚠️ No test image found, skipping image upload test');
    }
    
    console.log('\n🎉 Property creation functionality is working perfectly!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testPropertyCreation();
