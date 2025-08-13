const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  transactionType: {
    type: String,
    enum: ['rent', 'sale'],
    required: true,
    default: 'rent'
  },
  price: {
    type: Number,
    required: function() {
      return this.priceType === 'fixed';
    }
  },
  priceType: {
    type: String,
    enum: ['fixed', 'range'],
    default: 'fixed'
  },
  priceMin: {
    type: Number,
    required: function() {
      return this.priceType === 'range';
    }
  },
  priceMax: {
    type: Number,
    required: function() {
      return this.priceType === 'range';
    }
  },
  // Rental specific fields
  rentPeriod: {
    type: String,
    enum: ['monthly', 'yearly', 'weekly'],
    default: 'monthly',
    required: function() {
      return this.transactionType === 'rent';
    }
  },
  securityDeposit: {
    type: Number,
    required: function() {
      return this.transactionType === 'rent';
    }
  },
  // Property details
  bedrooms: {
    type: Number,
    required: false
  },
  bathrooms: {
    type: Number,
    required: false
  },
  size: {
    type: Number, // in square feet
    required: false
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'bungalow', 'studio', 'penthouse', 'townhouse', 'condo', 'land', 'commercial'],
    default: 'apartment'
  },
  furnishingStatus: {
    type: String,
    enum: ['furnished', 'semi-furnished', 'unfurnished'],
    default: 'unfurnished'
  },
  description: {
    type: String,
    trim: true
  },
  amenities: [{
    type: String,
    enum: ['parking', 'gym', 'pool', 'security', 'garden', 'balcony', 'elevator', 'backup_power', 'water_supply', 'internet', 'air_conditioning', 'heating']
  }],
  images: [{
    type: String
  }],
  // Ownership and contact info
  ownershipType: {
    type: String,
    enum: ['owned', 'managed'], // owned by landlord, managed by agent
    required: true
  },
  contactName: {
    type: String,
    required: false,
    trim: true
  },
  contactPhone: {
    type: String,
    required: false,
    trim: true
  },
  contactEmail: {
    type: String,
    required: false,
    trim: true
  },
  // Verification system
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  unverificationReason: {
    type: String,
    default: null
  },
  unverifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  unverifiedAt: {
    type: Date,
    default: null
  },
  // User who posted this property
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Property', propertySchema);
