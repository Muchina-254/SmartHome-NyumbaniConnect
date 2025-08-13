const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const fixAdminRole = async () => {
  try {
    // Connect to MongoDB using MONGO_URI (not MONGODB_URI)
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/NyumbaniConnect';
    console.log('🔌 Connecting to:', mongoUri);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Find admin user by email
    const adminEmail = 'admin@nyumbaniconnect.com';
    console.log('🔍 Looking for admin user:', adminEmail);
    
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      console.log('❌ Admin user not found');
      console.log('📝 Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123456', 10);
      
      const newAdmin = new User({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'Admin',
        verified: true
      });
      
      await newAdmin.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('📝 Admin user found:', {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        currentRole: adminUser.role,
        verified: adminUser.verified
      });

      // Update role to Admin if it's not already
      if (adminUser.role !== 'Admin') {
        console.log('🔧 Updating role from', adminUser.role, 'to Admin');
        adminUser.role = 'Admin';
        adminUser.verified = true;
        await adminUser.save();
        console.log('✅ Admin role updated successfully');
      } else {
        console.log('✅ Admin role is already correct');
      }
    }

    // Verify the admin user
    const verifiedAdmin = await User.findOne({ email: adminEmail });
    console.log('🔍 Final admin user status:', {
      id: verifiedAdmin._id,
      name: verifiedAdmin.name,
      email: verifiedAdmin.email,
      role: verifiedAdmin.role,
      verified: verifiedAdmin.verified
    });

    await mongoose.connection.close();
    console.log('🎉 Admin role fix completed');

  } catch (error) {
    console.error('❌ Error fixing admin role:', error);
    await mongoose.connection.close();
  }
};

fixAdminRole();
