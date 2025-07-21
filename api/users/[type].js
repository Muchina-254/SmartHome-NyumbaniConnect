const { connectToDatabase, handleError } = require('../utils/database');
const User = require('../models/User');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const { type } = req.query;

    let userType;
    switch (type) {
      case 'landlords':
        userType = 'landlord';
        break;
      case 'agents':
        userType = 'agent';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user type. Use "landlords" or "agents"'
        });
    }

    const users = await User.find({
      userType,
      isActive: true,
      isVerified: true
    }).select('-password -emailVerificationToken -passwordResetToken');

    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    handleError(res, error);
  }
};
