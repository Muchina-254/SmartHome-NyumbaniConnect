const express = require('express');

try {
  console.log('Testing adminRoutes require...');
  const adminRoutes = require('./routes/adminRoutes');
  console.log('✅ Admin routes loaded successfully');
  console.log('Type:', typeof adminRoutes);
} catch (error) {
  console.log('❌ Error loading admin routes:', error.message);
}
