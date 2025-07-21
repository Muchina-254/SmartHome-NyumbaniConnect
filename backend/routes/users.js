const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -emailVerificationToken -passwordResetToken -nationalId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/landlords
// @desc    Get verified landlords
// @access  Public
router.get('/landlords', async (req, res) => {
  try {
    const { page = 1, limit = 10, county, city } = req.query;

    const filters = {
      userType: 'landlord',
      isVerified: true,
      isActive: true
    };

    if (county) filters.county = new RegExp(county, 'i');
    if (city) filters.city = new RegExp(city, 'i');

    const landlords = await User.find(filters)
      .select('firstName lastName email phone county city businessInfo avatar isVerified')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filters);

    res.json({
      landlords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/agents
// @desc    Get verified agents
// @access  Public
router.get('/agents', async (req, res) => {
  try {
    const { page = 1, limit = 10, county, city } = req.query;

    const filters = {
      userType: 'agent',
      isVerified: true,
      isActive: true
    };

    if (county) filters.county = new RegExp(county, 'i');
    if (city) filters.city = new RegExp(city, 'i');

    const agents = await User.find(filters)
      .select('firstName lastName email phone county city businessInfo avatar isVerified')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filters);

    res.json({
      agents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
