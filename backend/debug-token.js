// Debug JWT token to check user role
const jwt = require('jsonwebtoken');

// Get token from frontend (you'll need to copy it from browser)
// Check localStorage in browser developer tools for 'token'
const token = 'YOUR_TOKEN_HERE'; // Replace this with actual token from browser

try {
  const decoded = jwt.decode(token, { complete: true });
  console.log('🔍 JWT Token Debug:');
  console.log('Header:', JSON.stringify(decoded.header, null, 2));
  console.log('Payload:', JSON.stringify(decoded.payload, null, 2));
  console.log('User Role:', decoded.payload.role);
} catch (error) {
  console.error('❌ Error decoding token:', error.message);
}
