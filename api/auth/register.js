const { connectToDatabase, handleError, validateRequiredFields } = require('../utils/database');
const { generateToken } = require('../utils/auth');
const User = require('../models/User');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const { firstName, lastName, email, phone, password, userType } = req.body;

    // Validate required fields
    validateRequiredFields(req.body, ['firstName', 'lastName', 'email', 'phone', 'password', 'userType']);

    // Validate phone number format (Kenyan format)
    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Kenyan phone number'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone number already exists'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      userType
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    handleError(res, error, 'Registration failed');
  }
};
