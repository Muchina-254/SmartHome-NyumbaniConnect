const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Property Details
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'studio', 'bedsitter', 'commercial', 'land'],
    required: true
  },
  bedrooms: {
    type: Number,
    min: 0,
    max: 20
  },
  bathrooms: {
    type: Number,
    min: 0,
    max: 20
  },
  size: {
    value: Number, // in square feet or meters
    unit: {
      type: String,
      enum: ['sqft', 'sqm'],
      default: 'sqft'
    }
  },
  
  // Location
  location: {
    county: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    street: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    nearbyLandmarks: [String]
  },
  
  // Financial Information
  pricing: {
    rentAmount: {
      type: Number,
      required: function() { return this.listingType === 'rent'; }
    },
    salePrice: {
      type: Number,
      required: function() { return this.listingType === 'sale'; }
    },
    deposit: Number,
    currency: {
      type: String,
      default: 'KES'
    },
    paymentFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'annually'],
      default: 'monthly'
    }
  },
  
  // Listing Information
  listingType: {
    type: String,
    enum: ['rent', 'sale'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'inactive'],
    default: 'available'
  },
  
  // Media
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  virtualTourUrl: String,
  videos: [String],
  
  // Amenities and Features
  amenities: [{
    name: String,
    category: {
      type: String,
      enum: ['basic', 'security', 'entertainment', 'transport', 'utility']
    }
  }],
  
  // Utilities and Services
  utilities: {
    electricity: {
      included: Boolean,
      type: String // prepaid, postpaid
    },
    water: {
      included: Boolean,
      source: String // borehole, county, piped
    },
    internet: {
      available: Boolean,
      provider: String,
      speed: String
    },
    parking: {
      available: Boolean,
      spaces: Number,
      covered: Boolean
    }
  },
  
  // Owner/Agent Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Verification and Quality
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Availability
  availableFrom: Date,
  leaseTerm: {
    minimum: Number, // in months
    maximum: Number  // in months
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  },
  lastViewedAt: Date,
  
  // SEO and Search
  tags: [String],
  searchKeywords: [String],
  
  // Status tracking
  isActive: {
    type: Boolean,
    default: true
  },
  featuredUntil: Date,
  
}, {
  timestamps: true
});

// Indexes for search optimization
propertySchema.index({ 'location.county': 1, 'location.city': 1, 'location.area': 1 });
propertySchema.index({ propertyType: 1, listingType: 1 });
propertySchema.index({ 'pricing.rentAmount': 1, 'pricing.salePrice': 1 });
propertySchema.index({ bedrooms: 1, bathrooms: 1 });
propertySchema.index({ status: 1, isActive: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ tags: 1 });
propertySchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  const price = this.listingType === 'rent' ? this.pricing.rentAmount : this.pricing.salePrice;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: this.pricing.currency || 'KES'
  }).format(price);
});

// Method to increment views
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

// Static method for search
propertySchema.statics.searchProperties = function(filters) {
  const query = { isActive: true, status: 'available' };
  
  if (filters.location) {
    query.$or = [
      { 'location.county': new RegExp(filters.location, 'i') },
      { 'location.city': new RegExp(filters.location, 'i') },
      { 'location.area': new RegExp(filters.location, 'i') }
    ];
  }
  
  if (filters.propertyType) {
    query.propertyType = filters.propertyType;
  }
  
  if (filters.listingType) {
    query.listingType = filters.listingType;
  }
  
  if (filters.minPrice || filters.maxPrice) {
    const priceField = filters.listingType === 'sale' ? 'pricing.salePrice' : 'pricing.rentAmount';
    query[priceField] = {};
    if (filters.minPrice) query[priceField].$gte = filters.minPrice;
    if (filters.maxPrice) query[priceField].$lte = filters.maxPrice;
  }
  
  if (filters.bedrooms) {
    query.bedrooms = filters.bedrooms;
  }
  
  if (filters.bathrooms) {
    query.bathrooms = filters.bathrooms;
  }
  
  return this.find(query).populate('owner', 'firstName lastName phone email userType isVerified');
};

module.exports = mongoose.model('Property', propertySchema);
