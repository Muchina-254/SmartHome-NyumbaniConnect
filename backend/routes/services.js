const express = require('express');
const router = express.Router();

// Placeholder routes for service providers (WiFi, water, etc.)

// @route   GET /api/services
// @desc    Get available services
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'Services endpoint - Coming soon' });
});

// @route   POST /api/services/request
// @desc    Request a service
// @access  Private
router.post('/request', (req, res) => {
  res.json({ message: 'Service request endpoint - Coming soon' });
});

module.exports = router;
