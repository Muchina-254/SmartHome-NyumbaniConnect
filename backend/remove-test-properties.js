const mongoose = require('mongoose');
const Property = require('./models/propertyModel');
require('dotenv').config();

async function removeTestProperties() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Find all properties to see what we have
    console.log('\n📋 Current properties in database:');
    const allProperties = await Property.find().sort({ createdAt: -1 });
    
    allProperties.forEach((property, index) => {
      console.log(`${index + 1}. ${property.title} - KSh ${property.price.toLocaleString()}`);
      console.log(`   📅 Created: ${property.createdAt}`);
      console.log(`   🆔 ID: ${property._id}`);
      console.log('   ─'.repeat(40));
    });

    // Identify test properties by title
    const testProperties = await Property.find({
      $or: [
        { title: { $regex: /test/i } },
        { title: "Test Property from API" },
        { title: "Property with Image Test" }
      ]
    });

    if (testProperties.length === 0) {
      console.log('\n✅ No test properties found to remove.');
      return;
    }

    console.log(`\n🗑️ Found ${testProperties.length} test properties to remove:`);
    testProperties.forEach((property, index) => {
      console.log(`${index + 1}. ${property.title} (ID: ${property._id})`);
    });

    // Remove test properties
    const deleteResult = await Property.deleteMany({
      $or: [
        { title: { $regex: /test/i } },
        { title: "Test Property from API" },
        { title: "Property with Image Test" }
      ]
    });

    console.log(`\n✅ Successfully removed ${deleteResult.deletedCount} test properties!`);

    // Show remaining properties
    const remainingProperties = await Property.find().sort({ createdAt: -1 });
    console.log(`\n📋 Remaining properties (${remainingProperties.length}):`);
    
    remainingProperties.forEach((property, index) => {
      console.log(`${index + 1}. ${property.title} - KSh ${property.price.toLocaleString()}`);
    });

    console.log('\n🎉 Database cleanup completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
  }
}

removeTestProperties();
