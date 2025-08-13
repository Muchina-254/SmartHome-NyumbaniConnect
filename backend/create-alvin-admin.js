const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createAlvinAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!\n');
    
    // Check if alvin admin already exists
    const existingAlvin = await User.findOne({ email: 'alvin@nyumbaniconnect.com' });
    if (existingAlvin) {
      console.log('ℹ️  Alvin admin user already exists:');
      console.log(`   Name: ${existingAlvin.name}`);
      console.log(`   Email: ${existingAlvin.email}`);
      console.log(`   Role: ${existingAlvin.role}`);
      console.log('\n🔑 User already exists with admin privileges.');
      return;
    }
    
    // Create alvin admin user
    console.log('👑 Creating Alvin Admin user...');
    
    const adminData = {
      name: 'Alvin Kiprotich',
      email: 'alvin@nyumbaniconnect.com',
      phone: '0700123456',
      password: await bcrypt.hash('alvin123456', 10),
      role: 'Admin'
    };
    
    const adminUser = new User(adminData);
    await adminUser.save();
    
    console.log('✅ Alvin admin user created successfully!');
    console.log('\n📋 Alvin Admin Login Credentials:');
    console.log('=' .repeat(40));
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: alvin123456`);
    console.log(`Role: Admin`);
    console.log('=' .repeat(40));
    
    console.log('\n🔐 Admin Privileges:');
    console.log('• Verify/Unverify properties');
    console.log('• View all users');
    console.log('• Access admin dashboard');
    console.log('• Manage property listings');
    console.log('• View contact messages');
    
    console.log('\n⚠️  SECURITY NOTE:');
    console.log('Please change the default password after first login!');
    
    // Show total admin count
    const totalAdmins = await User.countDocuments({ role: 'Admin' });
    console.log(`\n👥 Total Admin Users: ${totalAdmins}`);
    
  } catch (error) {
    console.error('❌ Error creating Alvin admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the script
createAlvinAdmin();
