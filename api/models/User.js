const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // User Type and Status
  userType: {
    type: String,
    enum: ['tenant', 'landlord', 'agent', 'developer', 'admin'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationLevel: {
    type: String,
    enum: ['none', 'phone', 'id', 'full'],
    default: 'none'
  },
  
  // Profile Information
  avatar: {
    type: String, // Cloudinary URL
    default: null
  },
  dateOfBirth: Date,
  nationalId: {
    type: String,
    sparse: true,
    unique: true
  },
  
  // Location
  county: String,
  city: String,
  address: String,
  
  // Preferences (for tenants)
  preferences: {
    minBudget: Number,
    maxBudget: Number,
    preferredLocations: [String],
    propertyTypes: [String],
    amenities: [String]
  },
  
  // Business Information (for landlords/agents)
  businessInfo: {
    companyName: String,
    licenseNumber: String,
    businessAddress: String,
    website: String,
    description: String
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  
  // Security
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
}, {
  timestamps: true
});

// Index for search optimization
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ county: 1, city: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Get user public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.nationalId;
  return userObject;
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
