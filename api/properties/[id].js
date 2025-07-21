const { connectToDatabase, handleError } = require('../utils/database');
const { authenticateToken } = require('../utils/auth');
const Property = require('../models/Property');

module.exports = async function handler(req, res) {
  try {
    await connectToDatabase();

    const { id } = req.query;

    switch (req.method) {
      case 'GET':
        return await getProperty(req, res, id);
      case 'PUT':
        return await updateProperty(req, res, id);
      case 'DELETE':
        return await deleteProperty(req, res, id);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function getProperty(req, res, id) {
  try {
    const property = await Property.findById(id)
      .populate('owner', 'firstName lastName phone email userType isVerified businessInfo')
      .populate('agent', 'firstName lastName phone email userType isVerified businessInfo');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    await property.incrementViews();

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    throw error;
  }
}

async function updateProperty(req, res, id) {
  try {
    // Authenticate user
    const user = await authenticateToken(req);

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user owns the property or is an admin
    if (property.owner.toString() !== user._id.toString() && user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own properties'
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName phone email userType isVerified');

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });
  } catch (error) {
    throw error;
  }
}

async function deleteProperty(req, res, id) {
  try {
    // Authenticate user
    const user = await authenticateToken(req);

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user owns the property or is an admin
    if (property.owner.toString() !== user._id.toString() && user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own properties'
      });
    }

    await Property.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    throw error;
  }
}
