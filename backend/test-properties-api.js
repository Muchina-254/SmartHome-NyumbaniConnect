const axios = require('axios');

async function testPropertiesAPI() {
  try {
    console.log('🏠 Testing Properties API...\n');
    
    // Fetch all properties
    const response = await axios.get('http://localhost:5000/api/properties');
    const properties = response.data;
    
    console.log(`✅ Found ${properties.length} properties:\n`);
    
    properties.forEach((property, index) => {
      console.log(`${index + 1}. ${property.title}`);
      console.log(`   📍 Location: ${property.location}`);
      console.log(`   💰 Price: KSh ${property.price.toLocaleString()}/month`);
      console.log(`   🖼️ Image: ${property.image}`);
      console.log(`   ✅ Verified: ${property.verified ? 'Yes' : 'No'}`);
      console.log(`   📝 Description: ${property.description}`);
      console.log(`   🆔 ID: ${property._id}`);
      console.log('   ─'.repeat(50));
    });
    
    console.log('🎉 Properties API is working perfectly!');
    
  } catch (error) {
    console.error('❌ Error fetching properties:', error.message);
  }
}

testPropertiesAPI();
