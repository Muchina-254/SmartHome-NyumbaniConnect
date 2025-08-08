const express = require('express');
const router = express.Router();

// Simulated payment endpoint
router.post('/pay', async (req, res) => {
  const { title, amount } = req.body;

  try {
    console.log(`Simulated payment for ${title} - KES ${amount}`);
    res.status(200).json({ message: 'Payment simulated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment simulation failed' });
  }
});

module.exports = router;

