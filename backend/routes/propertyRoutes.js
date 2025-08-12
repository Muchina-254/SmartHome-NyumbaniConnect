const express = require('express');
const router = express.Router();
const multer = require('multer');
const Property = require('../models/propertyModel');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save in /uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Middleware to check if user can manage properties
const canManageProperties = async (req, res, next) => {
  try {
    const userId = req.user.userId || req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!['Landlord', 'Developer', 'Agent'].includes(user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Only Landlords, Developers, and Agents can manage properties. Your role: ${user.role}` 
      });
    }
    
    req.userRole = user.role;
    next();
  } catch (err) {
    console.error('Role check error:', err);
    res.status(500).json({ error: 'Server error during role verification' });
  }
};

const upload = multer({ storage });

// @route   POST /api/properties
// @desc    Create new property
// @access  Private (Landlord, Developer, Agent only)
router.post('/', authMiddleware, canManageProperties, upload.array('images', 5), async (req, res) => {
  try {
    const imageFilenames = req.files ? req.files.map(file => file.filename) : [];
    
    const newProperty = new Property({
      ...req.body,
      images: imageFilenames, // Changed from 'image' to 'images'
      user: req.user.userId || req.user.id // Handle both JWT token structures
    });
    const saved = await newProperty.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Property creation error:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// @route   GET /api/properties/my
// @desc    Get listings by logged-in user
// @access  Private (Landlord, Developer, Agent only)
router.get('/my', authMiddleware, canManageProperties, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const listings = await Property.find({ user: userId });
    res.json(listings);
  } catch (err) {
    console.error('Fetch my properties error:', err);
    res.status(500).json({ error: 'Failed to fetch your properties' });
  }
});

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const props = await Property.find().sort({ createdAt: -1 });
    res.json(props);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// @route   PATCH /api/properties/:id/verify
// @desc    Verify a property
// @access  Private
router.patch('/:id/verify', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    property.verified = true;
    await property.save();

    res.json({ message: 'Property verified successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify property' });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('user', 'name email');
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (err) {
    console.error('Get property error:', err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property
// @access  Private
router.put('/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    // Check if property belongs to user
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.user.toString() !== req.user.userId && property.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }

    const updateData = { ...req.body };

    // Handle image updates
    let existingImages = [];
    if (req.body.existingImages) {
      // Parse existing images from form data
      if (typeof req.body.existingImages === 'string') {
        try {
          existingImages = JSON.parse(req.body.existingImages);
        } catch (e) {
          existingImages = [req.body.existingImages];
        }
      } else if (Array.isArray(req.body.existingImages)) {
        existingImages = req.body.existingImages;
      }
    }

    // Add new uploaded images
    const newImageFilenames = req.files ? req.files.map(file => file.filename) : [];
    
    // Combine existing and new images
    updateData.images = [...existingImages, ...newImageFilenames];

    // Remove existingImages from update data as it's not a model field
    delete updateData.existingImages;

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Update property error:', err);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if property exists and belongs to user
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    // Check ownership (handle both userId and id from different JWT structures)
    if (property.user.toString() !== req.user.userId && property.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

module.exports = router;
