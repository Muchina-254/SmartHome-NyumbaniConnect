const express = require('express');
const router = express.Router();

// Placeholder routes for M-Pesa integration

// @route   POST /api/payments/mpesa/stk-push
// @desc    Initiate M-Pesa STK Push
// @access  Private
router.post('/mpesa/stk-push', (req, res) => {
  res.json({ message: 'M-Pesa STK Push endpoint - Coming soon' });
});

// @route   POST /api/payments/mpesa/callback
// @desc    M-Pesa callback URL
// @access  Public
router.post('/mpesa/callback', (req, res) => {
  res.json({ message: 'M-Pesa callback endpoint - Coming soon' });
});

module.exports = router;
