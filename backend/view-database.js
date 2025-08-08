const mongoose = require('mongoose');
require('dotenv').config();

async function viewDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Connect to MongoDB (same as your app)
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/NyumbaniConnect', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!\n');
    
    // Get all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📚 Available Collections:');
    console.log('=' .repeat(40));
    collections.forEach(col => console.log(`• ${col.name}`));
    
    // View Users Collection
    console.log('\n👥 USERS COLLECTION:');
    console.log('=' .repeat(40));
    const User = require('./models/User');
    const users = await User.find({}).select('-password'); // Hide passwords
    
    if (users.length === 0) {
      console.log('No users found.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Phone: ${user.phone}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('   ' + '-'.repeat(35));
      });
    }
    
    // View Properties Collection
    console.log('\n🏠 PROPERTIES COLLECTION:');
    console.log('=' .repeat(40));
    const Property = require('./models/propertyModel');
    const properties = await Property.find({}).populate('user', 'name email role');
    
    if (properties.length === 0) {
      console.log('No properties found.');
    } else {
      properties.forEach((property, index) => {
        console.log(`${index + 1}. ${property.title}`);
        console.log(`   Location: ${property.location}`);
        console.log(`   Price: KES ${property.price?.toLocaleString()}`);
        console.log(`   Owner: ${property.user?.name || 'Unknown'} (${property.user?.role || 'N/A'})`);
        console.log(`   Bedrooms: ${property.bedrooms} | Bathrooms: ${property.bathrooms}`);
        console.log(`   Type: ${property.type}`);
        console.log(`   Verified: ${property.verified ? 'Yes' : 'No'}`);
        console.log(`   Created: ${property.createdAt}`);
        console.log('   ' + '-'.repeat(35));
      });
    }
    
    // Database Statistics
    console.log('\n📊 DATABASE STATISTICS:');
    console.log('=' .repeat(40));
    console.log(`Total Users: ${users.length}`);
    console.log(`Total Properties: ${properties.length}`);
    
    const roleStats = {};
    users.forEach(user => {
      roleStats[user.role] = (roleStats[user.role] || 0) + 1;
    });
    
    console.log('\nUser Roles Breakdown:');
    Object.entries(roleStats).forEach(([role, count]) => {
      console.log(`• ${role}: ${count} user${count > 1 ? 's' : ''}`);
    });
    
    console.log('\n🔗 Database Connection Info:');
    console.log(`• Host: ${mongoose.connection.host}`);
    console.log(`• Port: ${mongoose.connection.port}`);
    console.log(`• Database: ${mongoose.connection.name}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the database viewer
viewDatabase();
