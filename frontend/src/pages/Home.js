import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/api';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await propertyService.getAll({ limit: 3 });
        setFeaturedProperties(response.properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const formatPrice = (property) => {
    const price = property.listingType === 'rent' 
      ? property.pricing.rentAmount 
      : property.pricing.salePrice;
    
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Perfect Home in Kenya
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            SmartNyumba connects you with verified properties, trusted landlords, 
            and quality rental solutions across Kenya. Safe, transparent, and mobile-first.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/properties"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose SmartNyumba?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Verified Listings
              </h3>
              <p className="text-gray-600">
                All properties and landlords are verified to ensure authentic listings and prevent fraud.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Smart Search
              </h3>
              <p className="text-gray-600">
                Advanced filters help you find properties that match your budget, location, and preferences.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Seamless Connection
              </h3>
              <p className="text-gray-600">
                Connect directly with verified landlords and agents through our secure platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Properties
            </h2>
            <Link
              to="/properties"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              View All Properties →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">📸 Image placeholder</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      📍 {property.location.area}, {property.location.county}
                    </p>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {property.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(property)}
                        </span>
                        {property.listingType === 'rent' && (
                          <span className="text-gray-500 text-sm">/month</span>
                        )}
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {property.bedrooms} BR
                      </span>
                    </div>
                    <Link
                      to={`/properties/${property._id}`}
                      className="mt-4 block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Next Home?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of Kenyans who trust SmartNyumba for their housing needs.
          </p>
          <Link
            to="/register"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Your Search Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
