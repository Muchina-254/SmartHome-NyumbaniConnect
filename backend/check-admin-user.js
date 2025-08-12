const mongoose = require('mongoose');
const User = require('./models/User');

async function checkAdminUser() {
  try {
    console.log('🔍 Checking admin user in database...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/nyumbaniconnect');
    console.log('✅ Connected to MongoDB');
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@nyumbaniconnect.com' });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('   Name:', adminUser.name);
      console.log('   Email:', adminUser.email);
      console.log('   Role:', adminUser.role);
      console.log('   ID:', adminUser._id);
      console.log('   Role Type:', typeof adminUser.role);
      console.log('   Role === "Admin":', adminUser.role === 'Admin');
    } else {
      console.log('❌ Admin user not found!');
    }
    
    // Check all users with Admin role
    const allAdmins = await User.find({ role: 'Admin' });
    console.log(`\n📊 Total users with Admin role: ${allAdmins.length}`);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAdminUser();
