const mongoose = require('mongoose');
const Property = require('./models/propertyModel');
require('dotenv').config();

async function insertPropertyData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Property data to insert
    const propertyData = [
      {
        title: "Luxury Apartment in Kileleshwa",
        location: "Kileleshwa, Nairobi",
        price: 95000,
        image: "house1.jpg",
        verified: true,
        description: "Beautiful luxury apartment in the heart of Kileleshwa with modern amenities."
      },
      {
        title: "3 Bedroom Bungalow",
        location: "Thika",
        price: 75000,
        image: "house3.jpg",
        verified: true,
        description: "Spacious 3 bedroom bungalow perfect for families, located in peaceful Thika."
      },
      {
        title: "Penthouse in Upper Hill",
        location: "Upper Hill, Nairobi",
        price: 200000,
        image: "house2.jpg",
        verified: true,
        description: "Luxurious penthouse with stunning city views in prestigious Upper Hill."
      },
      {
        title: "Ocean View Villa",
        location: "Diani Beach",
        price: 270000,
        image: "villa.jpg",
        verified: true,
        description: "Stunning oceanfront villa with private beach access and tropical gardens."
      },
      {
        title: "Furnished Studio",
        location: "Nairobi CBD",
        price: 40000,
        image: "sample.jpg",
        verified: true,
        description: "Modern furnished studio apartment in the heart of Nairobi's business district."
      }
    ];

    // Check if properties already exist
    const existingCount = await Property.countDocuments();
    console.log(`Current properties in database: ${existingCount}`);

    if (existingCount === 0) {
      // Insert the properties
      const insertedProperties = await Property.insertMany(propertyData);
      console.log(`✅ Successfully inserted ${insertedProperties.length} properties!`);
      
      // Display inserted properties
      insertedProperties.forEach((property, index) => {
        console.log(`${index + 1}. ${property.title} - KSh ${property.price.toLocaleString()}`);
      });
    } else {
      console.log('📋 Properties already exist in database. Here are the current properties:');
      const existingProperties = await Property.find().limit(10);
      existingProperties.forEach((property, index) => {
        console.log(`${index + 1}. ${property.title} - KSh ${property.price.toLocaleString()} (${property.location})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
  }
}

insertPropertyData();
