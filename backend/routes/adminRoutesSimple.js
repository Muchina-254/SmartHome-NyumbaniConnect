const express = require('express');
const router = express.Router();
const Property = require('../models/propertyModel');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Simple admin middleware
const checkAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle both id and userId fields for compatibility
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token. No user ID found.' });
    }
    
    const user = await User.findById(userId);
    
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Simple test route
router.get('/test', checkAdmin, (req, res) => {
  res.json({ message: 'Admin routes working!', user: req.user.name });
});

// Dashboard route
router.get('/dashboard', checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const verifiedProperties = await Property.countDocuments({ verified: true });
    const pendingProperties = await Property.countDocuments({ verified: false });
    
    res.json({
      statistics: {
        totalUsers,
        totalProperties,
        verifiedProperties,
        pendingProperties
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all properties for admin
router.get('/properties', checkAdmin, async (req, res) => {
  try {
    const properties = await Property.find({})
      .populate('user', 'name email phone role')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users for admin
router.get('/users', checkAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email phone role createdAt')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify property
router.patch('/properties/:id/verify', checkAdmin, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id, 
      { 
        verified: true,
        verifiedBy: req.user._id,
        verifiedAt: new Date()
      }, 
      { new: true }
    ).populate('user', 'name email phone role');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property verified successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unverify property
router.patch('/properties/:id/unverify', checkAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id, 
      { 
        verified: false,
        verifiedBy: null,
        verifiedAt: null,
        unverificationReason: reason || 'Admin decision',
        unverifiedBy: req.user._id,
        unverifiedAt: new Date()
      }, 
      { new: true }
    ).populate('user', 'name email phone role');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property unverified successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
