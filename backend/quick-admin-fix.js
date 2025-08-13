// Quick admin fix script - Run this to test and fix admin access
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function quickFix() {
  console.log('🔧 QUICK ADMIN FIX');
  console.log('==================');

  // Step 1: Check current authRoutes.js content
  console.log('\n1️⃣ Checking authRoutes.js JWT generation...');
  const authRoutesPath = path.join(__dirname, 'routes', 'authRoutes.js');
  const authRoutesContent = fs.readFileSync(authRoutesPath, 'utf8');
  
  // Look for the JWT generation line
  const jwtLine = authRoutesContent.split('\n').find(line => line.includes('jwt.sign'));
  console.log('Current JWT generation:', jwtLine?.trim() || 'Not found');

  // Step 2: Test login and check token
  try {
    console.log('\n2️⃣ Testing admin login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@nyumbaniconnect.com',
      password: 'admin123456'
    });

    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    
    // Decode token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(token);
    console.log('🔑 Token payload:', JSON.stringify(decoded, null, 2));

    // Step 3: Test admin endpoint
    console.log('\n3️⃣ Testing admin dashboard...');
    try {
      await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Admin access working!');
      return true;
    } catch (adminError) {
      console.log('❌ Admin access failed:', adminError.response?.data?.message);
      
      // Step 4: Apply fix
      console.log('\n4️⃣ Applying fix...');
      
      // Check if role is missing from token
      if (!decoded.role) {
        console.log('⚠️ Token missing role field - fixing authRoutes.js');
        
        // Replace JWT generation to include role
        const fixedContent = authRoutesContent.replace(
          /jwt\.sign\(\s*\{\s*userId:\s*user\._id\s*\}/g,
          'jwt.sign({ userId: user._id, role: user.role }'
        );
        
        fs.writeFileSync(authRoutesPath, fixedContent);
        console.log('✅ Fixed JWT generation in authRoutes.js');
        console.log('⚠️ Please restart the server and try again');
        return false;
      }
      
      return false;
    }
  } catch (loginError) {
    console.log('❌ Login failed:', loginError.response?.data?.error || loginError.message);
    return false;
  }
}

quickFix().then(success => {
  if (success) {
    console.log('\n🎉 Admin system is working correctly!');
  } else {
    console.log('\n⚠️ Fix applied. Please restart the server.');
  }
});
