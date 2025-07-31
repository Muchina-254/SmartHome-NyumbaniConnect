const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const authenticate = require("../middleware/auth"); // JWT middleware

// POST new property (protected)
router.post("/", authenticate, async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;


