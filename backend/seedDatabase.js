const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Property = require('./models/Property');

// Sample users data
const sampleUsers = [
  // Landlords
  {
    firstName: 'Mary',
    lastName: 'Wanjiku',
    email: 'mary.wanjiku@gmail.com',
    phone: '+254712345678',
    password: 'password123',
    userType: 'landlord',
    county: 'Nairobi',
    city: 'Nairobi',
    isVerified: true,
    businessInfo: {
      companyName: 'Wanjiku Properties',
      businessAddress: 'Westlands, Nairobi',
      description: 'Quality rental properties in Nairobi'
    }
  },
  {
    firstName: 'John',
    lastName: 'Kimani',
    email: 'john.kimani@yahoo.com',
    phone: '+254723456789',
    password: 'password123',
    userType: 'landlord',
    county: 'Kiambu',
    city: 'Kiambu',
    isVerified: true,
    businessInfo: {
      companyName: 'Kimani Estates',
      businessAddress: 'Kiambu Town',
      description: 'Affordable housing solutions'
    }
  },
  {
    firstName: 'Grace',
    lastName: 'Njeri',
    email: 'grace.njeri@gmail.com',
    phone: '+254734567890',
    password: 'password123',
    userType: 'landlord',
    county: 'Nakuru',
    city: 'Nakuru',
    isVerified: true,
    businessInfo: {
      companyName: 'Njeri Holdings',
      businessAddress: 'Nakuru CBD',
      description: 'Premium properties in Nakuru'
    }
  },
  // Agents
  {
    firstName: 'Peter',
    lastName: 'Mwangi',
    email: 'peter.mwangi@realtor.com',
    phone: '+254745678901',
    password: 'password123',
    userType: 'agent',
    county: 'Nairobi',
    city: 'Nairobi',
    isVerified: true,
    businessInfo: {
      companyName: 'Prime Realty Kenya',
      licenseNumber: 'REA123456',
      businessAddress: 'Upper Hill, Nairobi',
      website: 'www.primerealty.co.ke',
      description: 'Leading real estate agency in Kenya'
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Mutua',
    email: 'sarah.mutua@homes.co.ke',
    phone: '+254756789012',
    password: 'password123',
    userType: 'agent',
    county: 'Mombasa',
    city: 'Mombasa',
    isVerified: true,
    businessInfo: {
      companyName: 'Coastal Homes',
      licenseNumber: 'REA789012',
      businessAddress: 'Nyali, Mombasa',
      website: 'www.coastalhomes.co.ke',
      description: 'Coastal property specialists'
    }
  },
  // Developers
  {
    firstName: 'David',
    lastName: 'Kinyua',
    email: 'david.kinyua@constructors.co.ke',
    phone: '+254767890123',
    password: 'password123',
    userType: 'developer',
    county: 'Nairobi',
    city: 'Nairobi',
    isVerified: true,
    businessInfo: {
      companyName: 'Kinyua Constructors Ltd',
      businessAddress: 'Industrial Area, Nairobi',
      website: 'www.kinyuaconstructors.co.ke',
      description: 'Modern residential and commercial developments'
    }
  },
  // Tenants
  {
    firstName: 'Ann',
    lastName: 'Wanjiru',
    email: 'ann.wanjiru@student.uon.ac.ke',
    phone: '+254778901234',
    password: 'password123',
    userType: 'tenant',
    county: 'Nairobi',
    city: 'Nairobi',
    preferences: {
      minBudget: 15000,
      maxBudget: 30000,
      preferredLocations: ['Westlands', 'Kilimani', 'Lavington'],
      propertyTypes: ['apartment', 'studio'],
      amenities: ['wifi', 'parking', 'security']
    }
  },
  {
    firstName: 'James',
    lastName: 'Ochieng',
    email: 'james.ochieng@tech.com',
    phone: '+254789012345',
    password: 'password123',
    userType: 'tenant',
    county: 'Nairobi',
    city: 'Nairobi',
    preferences: {
      minBudget: 40000,
      maxBudget: 80000,
      preferredLocations: ['Karen', 'Runda', 'Gigiri'],
      propertyTypes: ['house', 'apartment'],
      amenities: ['gym', 'swimming_pool', 'garden']
    }
  }
];

// Sample properties data
const sampleProperties = [
  {
    title: '2 Bedroom Apartment in Westlands',
    description: 'Modern 2-bedroom apartment in the heart of Westlands. Features include a spacious living room, fitted kitchen, master bedroom with ensuite, and secure parking. Located near shopping centers, restaurants, and public transport.',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    size: { value: 900, unit: 'sqft' },
    location: {
      county: 'Nairobi',
      city: 'Nairobi',
      area: 'Westlands',
      street: 'Ring Road',
      nearbyLandmarks: ['Westgate Mall', 'Sarit Centre', 'ABC Place']
    },
    pricing: {
      rentAmount: 45000,
      deposit: 90000,
      currency: 'KES',
      paymentFrequency: 'monthly'
    },
    listingType: 'rent',
    status: 'available',
    images: [
      { url: 'https://example.com/property1_1.jpg', caption: 'Living room', isPrimary: true },
      { url: 'https://example.com/property1_2.jpg', caption: 'Kitchen' },
      { url: 'https://example.com/property1_3.jpg', caption: 'Master bedroom' }
    ],
    amenities: [
      { name: 'Secure Parking', category: 'security' },
      { name: 'High-speed Internet', category: 'utility' },
      { name: '24/7 Security', category: 'security' },
      { name: 'Backup Generator', category: 'utility' }
    ],
    utilities: {
      electricity: { included: false, type: 'prepaid' },
      water: { included: true, source: 'county' },
      internet: { available: true, provider: 'Safaricom', speed: '50Mbps' },
      parking: { available: true, spaces: 1, covered: true }
    },
    isVerified: true,
    availableFrom: new Date('2025-08-01'),
    leaseTerm: { minimum: 6, maximum: 24 },
    tags: ['modern', 'secure', 'convenient', 'westlands'],
    searchKeywords: ['apartment', 'westlands', 'nairobi', '2bedroom']
  },
  {
    title: '3 Bedroom House in Karen',
    description: 'Luxurious 3-bedroom house in the prestigious Karen estate. Features include a large compound, modern kitchen, spacious bedrooms, guest bathroom, and servant quarters. Perfect for families looking for privacy and tranquility.',
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 3,
    size: { value: 1800, unit: 'sqft' },
    location: {
      county: 'Nairobi',
      city: 'Nairobi',
      area: 'Karen',
      street: 'Karen Road',
      nearbyLandmarks: ['Karen Hospital', 'Junction Mall', 'Galleria Mall']
    },
    pricing: {
      rentAmount: 120000,
      deposit: 240000,
      currency: 'KES',
      paymentFrequency: 'monthly'
    },
    listingType: 'rent',
    status: 'available',
    images: [
      { url: 'https://example.com/property2_1.jpg', caption: 'Front view', isPrimary: true },
      { url: 'https://example.com/property2_2.jpg', caption: 'Living room' },
      { url: 'https://example.com/property2_3.jpg', caption: 'Garden' }
    ],
    amenities: [
      { name: 'Large Garden', category: 'entertainment' },
      { name: 'Swimming Pool', category: 'entertainment' },
      { name: 'Servant Quarters', category: 'basic' },
      { name: 'Electric Fence', category: 'security' }
    ],
    utilities: {
      electricity: { included: false, type: 'postpaid' },
      water: { included: true, source: 'borehole' },
      internet: { available: true, provider: 'Zuku', speed: '100Mbps' },
      parking: { available: true, spaces: 3, covered: false }
    },
    isVerified: true,
    availableFrom: new Date('2025-07-25'),
    leaseTerm: { minimum: 12, maximum: 36 },
    tags: ['luxury', 'family', 'garden', 'karen'],
    searchKeywords: ['house', 'karen', 'nairobi', '3bedroom', 'luxury']
  },
  {
    title: 'Studio Apartment near University of Nairobi',
    description: 'Affordable studio apartment perfect for students and young professionals. Located within walking distance of University of Nairobi. Features include a kitchenette, private bathroom, and study area.',
    propertyType: 'studio',
    bedrooms: 0,
    bathrooms: 1,
    size: { value: 400, unit: 'sqft' },
    location: {
      county: 'Nairobi',
      city: 'Nairobi',
      area: 'Kikuyu Road',
      street: 'University Way',
      nearbyLandmarks: ['University of Nairobi', 'Kenyatta National Hospital', 'CBD']
    },
    pricing: {
      rentAmount: 18000,
      deposit: 36000,
      currency: 'KES',
      paymentFrequency: 'monthly'
    },
    listingType: 'rent',
    status: 'available',
    images: [
      { url: 'https://example.com/property3_1.jpg', caption: 'Studio interior', isPrimary: true },
      { url: 'https://example.com/property3_2.jpg', caption: 'Kitchenette' }
    ],
    amenities: [
      { name: 'Study Desk', category: 'basic' },
      { name: 'Free WiFi', category: 'utility' },
      { name: 'Laundry Service', category: 'basic' },
      { name: 'Security Guard', category: 'security' }
    ],
    utilities: {
      electricity: { included: true, type: 'prepaid' },
      water: { included: true, source: 'county' },
      internet: { available: true, provider: 'Safaricom', speed: '20Mbps' },
      parking: { available: false, spaces: 0, covered: false }
    },
    isVerified: true,
    availableFrom: new Date('2025-07-22'),
    leaseTerm: { minimum: 3, maximum: 12 },
    tags: ['student', 'affordable', 'university', 'cbd'],
    searchKeywords: ['studio', 'university', 'nairobi', 'student', 'affordable']
  },
  {
    title: '4 Bedroom House for Sale in Kiambu',
    description: 'Newly constructed 4-bedroom house in Kiambu. Features modern finishes, spacious rooms, fitted kitchen, master ensuite, and a large compound. Perfect investment opportunity or family home.',
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 4,
    size: { value: 2200, unit: 'sqft' },
    location: {
      county: 'Kiambu',
      city: 'Kiambu',
      area: 'Kiambu Town',
      street: 'Kiambu Road',
      nearbyLandmarks: ['Kiambu Level 5 Hospital', 'Kiambu Institute', 'Tuskys Kiambu']
    },
    pricing: {
      salePrice: 8500000,
      currency: 'KES'
    },
    listingType: 'sale',
    status: 'available',
    images: [
      { url: 'https://example.com/property4_1.jpg', caption: 'House exterior', isPrimary: true },
      { url: 'https://example.com/property4_2.jpg', caption: 'Modern kitchen' },
      { url: 'https://example.com/property4_3.jpg', caption: 'Master bedroom' }
    ],
    amenities: [
      { name: 'Modern Kitchen', category: 'basic' },
      { name: 'Large Compound', category: 'entertainment' },
      { name: 'Water Tank', category: 'utility' },
      { name: 'Gate and Fence', category: 'security' }
    ],
    utilities: {
      electricity: { included: false, type: 'postpaid' },
      water: { included: false, source: 'county' },
      internet: { available: true, provider: 'Safaricom', speed: '50Mbps' },
      parking: { available: true, spaces: 2, covered: false }
    },
    isVerified: true,
    availableFrom: new Date('2025-07-21'),
    tags: ['new', 'family', 'investment', 'kiambu'],
    searchKeywords: ['house', 'kiambu', '4bedroom', 'sale', 'new']
  },
  {
    title: 'Bedsitter in Kasarani',
    description: 'Affordable bedsitter in Kasarani, perfect for young professionals and students. Features include a combined bedroom/living area, kitchenette, and private bathroom. Good public transport connections.',
    propertyType: 'bedsitter',
    bedrooms: 1,
    bathrooms: 1,
    size: { value: 300, unit: 'sqft' },
    location: {
      county: 'Nairobi',
      city: 'Nairobi',
      area: 'Kasarani',
      street: 'Thika Road',
      nearbyLandmarks: ['Kasarani Stadium', 'Thika Road Mall', 'Roysambu']
    },
    pricing: {
      rentAmount: 12000,
      deposit: 24000,
      currency: 'KES',
      paymentFrequency: 'monthly'
    },
    listingType: 'rent',
    status: 'available',
    images: [
      { url: 'https://example.com/property5_1.jpg', caption: 'Bedsitter interior', isPrimary: true },
      { url: 'https://example.com/property5_2.jpg', caption: 'Bathroom' }
    ],
    amenities: [
      { name: 'Public Transport', category: 'transport' },
      { name: 'Shops Nearby', category: 'basic' },
      { name: 'Water Supply', category: 'utility' },
      { name: 'Security Lights', category: 'security' }
    ],
    utilities: {
      electricity: { included: false, type: 'prepaid' },
      water: { included: true, source: 'county' },
      internet: { available: true, provider: 'Safaricom', speed: '10Mbps' },
      parking: { available: false, spaces: 0, covered: false }
    },
    isVerified: true,
    availableFrom: new Date('2025-08-01'),
    leaseTerm: { minimum: 6, maximum: 24 },
    tags: ['affordable', 'kasarani', 'transport', 'young-professional'],
    searchKeywords: ['bedsitter', 'kasarani', 'nairobi', 'affordable', 'thika-road']
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smarthome', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create users
    const createdUsers = [];
    for (let userData of sampleUsers) {
      const salt = await bcrypt.genSalt(12);
      userData.password = await bcrypt.hash(userData.password, salt);
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create properties and assign to landlords/developers
    const landlords = createdUsers.filter(user => ['landlord', 'developer'].includes(user.userType));
    
    for (let i = 0; i < sampleProperties.length; i++) {
      const propertyData = sampleProperties[i];
      propertyData.owner = landlords[i % landlords.length]._id;
      
      const property = new Property(propertyData);
      await property.save();
    }
    console.log(`🏠 Created ${sampleProperties.length} properties`);

    console.log('\n🎉 Sample data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${createdUsers.filter(u => u.userType === 'landlord').length} Landlords`);
    console.log(`   • ${createdUsers.filter(u => u.userType === 'agent').length} Agents`);
    console.log(`   • ${createdUsers.filter(u => u.userType === 'developer').length} Developers`);
    console.log(`   • ${createdUsers.filter(u => u.userType === 'tenant').length} Tenants`);
    console.log(`   • ${sampleProperties.length} Properties`);
    
    console.log('\n🔑 Test login credentials:');
    console.log('   Landlord: mary.wanjiku@gmail.com / password123');
    console.log('   Agent: peter.mwangi@realtor.com / password123');
    console.log('   Tenant: ann.wanjiru@student.uon.ac.ke / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📝 Database connection closed');
  }
}

// Run the seeding script
seedDatabase();
