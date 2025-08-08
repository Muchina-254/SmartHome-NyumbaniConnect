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
    required: true
  },
  priceMin: {
    type: Number,
    required: false
  },
  priceMax: {
    type: Number,
    required: false
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
  image: String,
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
