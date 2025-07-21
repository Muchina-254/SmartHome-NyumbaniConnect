const { connectToDatabase, handleError } = require('../utils/database');
const { authenticateToken } = require('../utils/auth');
const Property = require('../models/Property');

module.exports = async function handler(req, res) {
  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        return await getProperties(req, res);
      case 'POST':
        return await createProperty(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function getProperties(req, res) {
  try {
    const {
      location,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filters = {};
    if (location) filters.location = location;
    if (propertyType) filters.propertyType = propertyType;
    if (listingType) filters.listingType = listingType;
    if (minPrice) filters.minPrice = parseInt(minPrice);
    if (maxPrice) filters.maxPrice = parseInt(maxPrice);
    if (bedrooms) filters.bedrooms = parseInt(bedrooms);
    if (bathrooms) filters.bathrooms = parseInt(bathrooms);

    // Use the search method from the model
    const properties = await Property.searchProperties(filters)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Property.countDocuments({
      isActive: true,
      status: 'available',
      ...filters
    });

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    throw error;
  }
}

async function createProperty(req, res) {
  try {
    // Authenticate user
    const user = await authenticateToken(req);

    // Only landlords, agents, and developers can create properties
    if (!['landlord', 'agent', 'developer'].includes(user.userType)) {
      return res.status(403).json({
        success: false,
        message: 'Only landlords, agents, and developers can create properties'
      });
    }

    const propertyData = {
      ...req.body,
      owner: user._id
    };

    const property = new Property(propertyData);
    await property.save();

    // Populate owner information
    await property.populate('owner', 'firstName lastName phone email userType isVerified');

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    throw error;
  }
}
