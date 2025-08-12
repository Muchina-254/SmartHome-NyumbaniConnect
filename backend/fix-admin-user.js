const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function fixAdminUser() {
  try {
    console.log('🔧 Fixing admin user...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/nyumbaniconnect');
    console.log('✅ Connected to MongoDB');
    
    // First, let's check the current admin user
    const existingAdmin = await User.findOne({ email: 'admin@nyumbaniconnect.com' });
    if (existingAdmin) {
      console.log('📋 Current admin user:');
      console.log('   Name:', existingAdmin.name);
      console.log('   Email:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role, '(type:', typeof existingAdmin.role, ')');
      
      // Update the role to ensure it's set correctly
      console.log('\n🔄 Updating admin role...');
      existingAdmin.role = 'Admin';
      await existingAdmin.save();
      console.log('✅ Admin role updated to:', existingAdmin.role);
      
    } else {
      console.log('❌ No existing admin user found. Creating new one...');
      
      const hashedPassword = await bcrypt.hash('admin123456', 10);
      
      const adminUser = new User({
        name: 'System Administrator',
        email: 'admin@nyumbaniconnect.com',
        phone: '+254700000000',
        password: hashedPassword,
        role: 'Admin'
      });
      
      await adminUser.save();
      console.log('✅ New admin user created successfully!');
    }
    
    // Verify the admin user
    const verifyAdmin = await User.findOne({ email: 'admin@nyumbaniconnect.com' });
    console.log('\n🔍 Verification:');
    console.log('   Name:', verifyAdmin.name);
    console.log('   Email:', verifyAdmin.email);
    console.log('   Role:', verifyAdmin.role);
    console.log('   Role type:', typeof verifyAdmin.role);
    console.log('   Role === "Admin":', verifyAdmin.role === 'Admin');
    
    await mongoose.disconnect();
    console.log('\n✅ Admin user fixed! You can now access the admin panel.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAdminUser();
