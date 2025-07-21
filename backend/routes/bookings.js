const express = require('express');
const router = express.Router();

// Placeholder routes for future implementation

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', (req, res) => {
  res.json({ message: 'Bookings endpoint - Coming soon' });
});

// @route   POST /api/bookings
// @desc    Create new booking/inquiry
// @access  Private
router.post('/', (req, res) => {
  res.json({ message: 'Create booking endpoint - Coming soon' });
});

module.exports = router;
