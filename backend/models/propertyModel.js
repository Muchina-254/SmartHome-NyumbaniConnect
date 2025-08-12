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
  price: {
    type: Number,
    required: function() {
      return this.priceType === 'fixed';
    }
  },
  priceType: {
    type: String,
    enum: ['fixed', 'range'],
    default: 'range'
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
  bedrooms: {
    type: Number,
    required: false
  },
  bathrooms: {
    type: Number,
    required: false
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'bungalow', 'studio', 'penthouse'],
    default: 'apartment'
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Property', propertySchema);
