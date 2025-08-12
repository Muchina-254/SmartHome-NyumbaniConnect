const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const adminData = require('./admin-data.json');

async function createAdminFromJSON() {
  try {
    console.log('📋 Creating admin user from JSON data...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/nyumbaniconnect');
    console.log('✅ Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.adminUser.email });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists, updating role...');
      existingAdmin.role = 'Admin';
      existingAdmin.name = adminData.adminUser.name;
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully');
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminData.adminUser.password, 10);
      
      // Create new admin user
      const newAdmin = new User({
        name: adminData.adminUser.name,
        email: adminData.adminUser.email,
        phone: adminData.adminUser.phone,
        password: hashedPassword,
        role: adminData.adminUser.role
      });
      
      await newAdmin.save();
      console.log('✅ Admin user created successfully');
    }
    
    // Verify the admin user
    const verifyAdmin = await User.findOne({ email: adminData.adminUser.email });
    console.log('\n🔍 Admin User Verification:');
    console.log('   Name:', verifyAdmin.name);
    console.log('   Email:', verifyAdmin.email);
    console.log('   Role:', verifyAdmin.role);
    console.log('   Phone:', verifyAdmin.phone);
    console.log('   Created:', verifyAdmin.createdAt);
    
    console.log('\n🚀 Admin Credentials for Login:');
    console.log('   Email:', adminData.adminCredentials.email);
    console.log('   Password:', adminData.adminCredentials.password);
    
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
    console.log('🎉 Admin setup complete! You can now login with the admin credentials.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminFromJSON();
