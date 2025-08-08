const express = require('express');
const router = express.Router();
const Property = require('../models/propertyModel');
const User = require('../models/User');
const { adminOnly } = require('../middleware/adminMiddleware');

// Get all properties for admin review (including unverified)
router.get('/properties', adminOnly, async (req, res) => {
  try {
    const properties = await Property.find({})
      .populate('user', 'name email phone role')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify a property (Admin only)
router.patch('/properties/:id/verify', adminOnly, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.verified = true;
    property.verifiedBy = req.user._id;
    property.verifiedAt = new Date();
    
    await property.save();
    
    const updatedProperty = await Property.findById(req.params.id)
      .populate('user', 'name email phone role')
      .populate('verifiedBy', 'name email');

    res.json({ 
      message: 'Property verified successfully',
      property: updatedProperty 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unverify a property (Admin only)
router.patch('/properties/:id/unverify', adminOnly, async (req, res) => {
  try {
    const { reason } = req.body;
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.verified = false;
    property.verifiedBy = null;
    property.verifiedAt = null;
    property.unverificationReason = reason || 'Admin decision';
    property.unverifiedBy = req.user._id;
    property.unverifiedAt = new Date();
    
    await property.save();
    
    const updatedProperty = await Property.findById(req.params.id)
      .populate('user', 'name email phone role')
      .populate('unverifiedBy', 'name email');

    res.json({ 
      message: 'Property unverified successfully',
      property: updatedProperty 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (Admin only)
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get admin dashboard statistics
router.get('/dashboard', adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const verifiedProperties = await Property.countDocuments({ verified: true });
    const pendingProperties = await Property.countDocuments({ verified: false });
    
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    const recentProperties = await Property.find({})
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      statistics: {
        totalUsers,
        totalProperties,
        verifiedProperties,
        pendingProperties,
        usersByRole
      },
      recentProperties
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
