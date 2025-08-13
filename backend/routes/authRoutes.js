const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) return res.status(400).json({ error: 'Email or phone already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, phone, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt for:', req.body.email);
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? 'YES' : 'NO');
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    // Compare passwords
    console.log('🔑 Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔑 Password match:', isMatch);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // Check JWT_SECRET
    console.log('🔐 JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Generate JWT
    const token = jwt.sign({ 
      id: user._id, 
      userId: user._id, 
      role: user.role 
    }, process.env.JWT_SECRET, {
      expiresIn: '3d'
    });
    console.log('🎟️  Token generated successfully, length:', token.length);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
    console.log('✅ Login successful for:', email);
  } catch (err) {
    console.error('❌ Login Error Details:', err.message);
    console.error('❌ Full Error:', err);
    res.status(500).json({ error: 'Login failed. Try again.' });
  }
});

// VERIFY TOKEN
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    // The authMiddleware already verified the token and attached user info
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(500).json({ error: 'Token verification failed' });
  }
});

// GET PROFILE
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's property count
    const Property = require('../models/propertyModel');
    const propertyCount = await Property.countDocuments({ 
      $or: [{ userId: user._id }, { user: user._id }] 
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      stats: {
        propertiesListed: propertyCount,
        memberSince: user.createdAt
      }
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// UPDATE PROFILE
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, role, currentPassword, newPassword } = req.body;
    
    // Find the user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate input
    if (!name || !phone || !role) {
      return res.status(400).json({ error: 'Name, phone, and role are required' });
    }

    // Validate role
    const validRoles = ['Tenant', 'Landlord', 'Developer', 'Agent', 'Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check if phone is already taken by another user
    const existingUser = await User.findOne({ 
      phone, 
      _id: { $ne: req.user.userId } 
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already in use' });
    }

    // Handle password change if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set new password' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }

      // Hash new password
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user fields
    user.name = name;
    user.phone = phone;
    user.role = role;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
