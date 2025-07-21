const express = require('express');
const { body, validationResult } = require('express-validator');
const Property = require('../models/Property');
const auth = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

// Multer configuration for file uploads
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   GET /api/properties
// @desc    Get all properties with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      amenities,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = {
      isActive: true,
      status: 'available'
    };

    if (location) {
      filters.$or = [
        { 'location.county': new RegExp(location, 'i') },
        { 'location.city': new RegExp(location, 'i') },
        { 'location.area': new RegExp(location, 'i') }
      ];
    }

    if (propertyType) filters.propertyType = propertyType;
    if (listingType) filters.listingType = listingType;
    if (bedrooms) filters.bedrooms = parseInt(bedrooms);
    if (bathrooms) filters.bathrooms = parseInt(bathrooms);

    // Price filtering
    if (minPrice || maxPrice) {
      const priceField = listingType === 'sale' ? 'pricing.salePrice' : 'pricing.rentAmount';
      filters[priceField] = {};
      if (minPrice) filters[priceField].$gte = parseInt(minPrice);
      if (maxPrice) filters[priceField].$lte = parseInt(maxPrice);
    }

    // Amenities filtering
    if (amenities) {
      const amenityList = amenities.split(',');
      filters['amenities.name'] = { $in: amenityList };
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const properties = await Property.find(filters)
      .populate('owner', 'firstName lastName phone email userType isVerified')
      .populate('agent', 'firstName lastName phone email')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Property.countDocuments(filters);

    res.json({
      properties,
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

// @route   GET /api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName phone email userType isVerified businessInfo')
      .populate('agent', 'firstName lastName phone email businessInfo');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Increment views
    await property.incrementViews();

    res.json(property);

  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/properties
// @desc    Create new property listing
// @access  Private (Landlords, Agents, Developers)
router.post('/', auth, [
  body('title').trim().isLength({ min: 10, max: 200 }).withMessage('Title must be 10-200 characters'),
  body('description').trim().isLength({ min: 50, max: 2000 }).withMessage('Description must be 50-2000 characters'),
  body('propertyType').isIn(['apartment', 'house', 'studio', 'bedsitter', 'commercial', 'land']),
  body('listingType').isIn(['rent', 'sale']),
  body('location.county').notEmpty().withMessage('County is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.area').notEmpty().withMessage('Area is required'),
  body('pricing.rentAmount').if(body('listingType').equals('rent')).isNumeric().withMessage('Rent amount is required for rental properties'),
  body('pricing.salePrice').if(body('listingType').equals('sale')).isNumeric().withMessage('Sale price is required for sale properties')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user can create properties
    if (!['landlord', 'agent', 'developer'].includes(req.userProfile.userType)) {
      return res.status(403).json({ message: 'Only landlords, agents, and developers can create property listings' });
    }

    const propertyData = {
      ...req.body,
      owner: req.user.id
    };

    const property = new Property(propertyData);
    await property.save();

    const savedProperty = await Property.findById(property._id)
      .populate('owner', 'firstName lastName phone email userType');

    res.status(201).json({
      property: savedProperty,
      message: 'Property listing created successfully'
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update property listing
// @access  Private (Owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName phone email userType');

    res.json({
      property,
      message: 'Property updated successfully'
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property listing
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/properties/my/listings
// @desc    Get current user's property listings
// @access  Private
router.get('/my/listings', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filters = { owner: req.user.id };
    if (status) filters.status = status;

    const properties = await Property.find(filters)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Property.countDocuments(filters);

    res.json({
      properties,
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
