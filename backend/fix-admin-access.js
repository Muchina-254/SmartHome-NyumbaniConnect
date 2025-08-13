require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixAdminAccess() {
  try {
    console.log('🔧 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Find and update the admin user
    const adminEmail = 'admin@nyumbaniconnect.com';
    console.log(`🔍 Looking for admin user: ${adminEmail}`);
    
    const adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      console.log('📝 Creating new admin user...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123456', 10);
      
      const newAdmin = new User({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'Admin'
      });
      
      await newAdmin.save();
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('✅ Admin user found!');
      console.log('Current role:', adminUser.role);
      
      if (adminUser.role !== 'Admin') {
        console.log('🔧 Updating role to Admin...');
        adminUser.role = 'Admin';
        await adminUser.save();
        console.log('✅ Admin role updated successfully!');
      } else {
        console.log('✅ Admin role is already correct');
      }
    }

    // Verify the admin user
    const verifiedAdmin = await User.findOne({ email: adminEmail });
    console.log('📊 Final admin user details:');
    console.log('- Name:', verifiedAdmin.name);
    console.log('- Email:', verifiedAdmin.email);
    console.log('- Role:', verifiedAdmin.role);
    console.log('- ID:', verifiedAdmin._id);

    mongoose.connection.close();
    console.log('✅ Database connection closed');
    console.log('🎉 Admin access fix completed successfully!');

  } catch (error) {
    console.error('❌ Error fixing admin access:', error);
    process.exit(1);
  }
}

fixAdminAccess();
