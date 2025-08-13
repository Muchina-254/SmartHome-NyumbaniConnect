const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Admin-only middleware
const adminOnly = async (req, res, next) => {
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
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    if (user.role !== 'Admin') {
      return res.status(403).json({ 
        message: 'Access forbidden. Admin privileges required.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { adminOnly };
