const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createAdminUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!\n');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:');
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log('\n🔑 You can login with this admin account.');
      return;
    }
    
    // Create admin user
    console.log('👑 Creating Admin user...');
    
    const adminData = {
      name: 'System Administrator',
      email: 'admin@nyumbaniconnect.com',
      phone: '0700000000',
      password: await bcrypt.hash('admin123456', 10),
      role: 'Admin'
    };
    
    const adminUser = new User(adminData);
    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log('=' .repeat(40));
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: admin123456`);
    console.log(`Role: Admin`);
    console.log('=' .repeat(40));
    
    console.log('\n🔐 Admin Privileges:');
    console.log('• Verify/Unverify properties');
    console.log('• View all users');
    console.log('• Access admin dashboard');
    console.log('• Manage property listings');
    
    console.log('\n⚠️  SECURITY NOTE:');
    console.log('Please change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the script
createAdminUser();
