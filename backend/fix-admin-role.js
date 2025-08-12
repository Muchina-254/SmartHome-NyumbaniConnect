const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function fixAdminUser() {
  try {
    console.log('🔧 Fixing admin user role...');
    
    await mongoose.connect('mongodb://localhost:27017/nyumbaniconnect');
    console.log('✅ Connected to MongoDB');
    
    // First check if admin exists
    let adminUser = await User.findOne({ email: 'admin@nyumbaniconnect.com' });
    
    if (adminUser) {
      console.log('📋 Current admin user:');
      console.log('   Role:', adminUser.role);
      console.log('   Name:', adminUser.name);
      
      // Update the role to Admin
      adminUser.role = 'Admin';
      await adminUser.save();
      console.log('✅ Admin role updated successfully!');
    } else {
      console.log('❌ Admin user not found, creating new one...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash('admin123456', 10);
      
      // Create admin user
      adminUser = new User({
        name: 'System Administrator',
        email: 'admin@nyumbaniconnect.com',
        phone: '0700000000',
        password: hashedPassword,
        role: 'Admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully!');
    }
    
    // Verify the admin user
    const verifyAdmin = await User.findOne({ email: 'admin@nyumbaniconnect.com' });
    console.log('\n🔍 Verification:');
    console.log('   Name:', verifyAdmin.name);
    console.log('   Email:', verifyAdmin.email);
    console.log('   Role:', verifyAdmin.role);
    console.log('   Role Type:', typeof verifyAdmin.role);
    console.log('   Role === "Admin":', verifyAdmin.role === 'Admin');
    
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAdminUser();
