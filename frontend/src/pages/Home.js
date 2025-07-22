import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/api';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);

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

    // Trigger stats animation after component mounts
    const timer = setTimeout(() => setStatsVisible(true), 1000);
    return () => clearTimeout(timer);
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

  const stats = [
    { number: '10,000+', label: 'Properties Listed', icon: '🏠' },
    { number: '5,000+', label: 'Happy Tenants', icon: '😊' },
    { number: '1,200+', label: 'Verified Landlords', icon: '✅' },
    { number: '47', label: 'Counties Covered', icon: '📍' }
  ];

  const features = [
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'AI-powered search helps you find the perfect home based on your preferences and budget.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: '🛡️',
      title: 'Verified Listings',
      description: 'All properties and landlords are thoroughly verified to ensure authenticity and safety.',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: '💸',
      title: 'Transparent Pricing',
      description: 'No hidden fees. See all costs upfront including deposit, rent, and service charges.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Designed for mobile users with offline capabilities and instant notifications.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: '🤝',
      title: 'Direct Connect',
      description: 'Connect directly with property owners and agents without intermediaries.',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Book property viewings instantly and get quick responses from landlords.',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Hero Section */}
      <section className="gradient-hero text-white py-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="animate-float absolute top-20 left-10 text-6xl opacity-20">🏠</div>
          <div className="animate-float absolute top-32 right-20 text-4xl opacity-20" style={{animationDelay: '1s'}}>🌟</div>
          <div className="animate-float absolute bottom-20 left-1/4 text-5xl opacity-20" style={{animationDelay: '2s'}}>🔑</div>
          <div className="animate-float absolute bottom-32 right-1/3 text-3xl opacity-20" style={{animationDelay: '0.5s'}}>✨</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in-up hero-text text-shadow-lg">
            Find Your Perfect
            <span className="block text-yellow-300">Kenyan Home</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto animate-fade-in-up text-shadow opacity-90" style={{animationDelay: '0.2s'}}>
            SmartNyumba connects you with verified properties, trusted landlords, 
            and quality rental solutions across all 47 counties in Kenya. Safe, transparent, and mobile-first. 🇰🇪
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link
              to="/properties"
              className="btn-modern text-lg px-10 py-4"
            >
              🔍 Explore Properties
            </Link>
            <Link
              to="/register"
              className="glass border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 hover:scale-105"
            >
              🚀 Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center animate-fade-in-up ${statsVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold gradient-text mb-1">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Why Choose <span className="gradient-text">SmartNyumba</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Experience the future of property hunting in Kenya with our innovative platform designed for modern renters and landlords.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-hover glass p-8 rounded-2xl text-center animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-5xl mb-4 animate-bounce-custom" style={{animationDelay: `${index * 0.5}s`}}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className={`mt-6 h-1 bg-gradient-to-r ${feature.color} rounded-full mx-auto w-12`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-in-left">
                Featured <span className="gradient-text">Properties</span>
              </h2>
              <p className="text-xl text-gray-600 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                Handpicked premium properties across Kenya 🏆
              </p>
            </div>
            <Link
              to="/properties"
              className="hidden md:block text-green-600 hover:text-green-700 font-semibold text-lg transition-all duration-300 hover:scale-110 animate-slide-in-right"
            >
              View All Properties →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading amazing properties... ✨</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <div
                  key={property._id}
                  className="property-card-enhanced animate-fade-in-up"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="h-56 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <span className="text-white text-6xl z-10">🏠</span>
                    <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-white text-sm font-medium">
                      {property.listingType === 'rent' ? '🏠 For Rent' : '🏡 For Sale'}
                    </div>
                  </div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-green-600 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 mb-3 flex items-center">
                      📍 {property.location.area}, {property.location.county}
                    </p>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold gradient-text">
                          {formatPrice(property)}
                        </span>
                        {property.listingType === 'rent' && (
                          <span className="text-gray-500 text-sm">/month</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                          🛏️ {property.bedrooms} BR
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                          🚿 {property.bathrooms} BA
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/properties/${property._id}`}
                      className="block w-full text-center btn-modern py-3"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/properties"
              className="btn-modern text-lg px-8"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="animate-float absolute top-10 left-1/4 text-4xl opacity-30">🌟</div>
          <div className="animate-float absolute bottom-10 right-1/4 text-5xl opacity-30" style={{animationDelay: '1s'}}>🔑</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up text-shadow-lg">
            Ready to Find Your 
            <span className="block text-yellow-300">Dream Home? 🏡</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-up opacity-90" style={{animationDelay: '0.2s'}}>
            Join thousands of Kenyans who trust SmartNyumba for their housing needs. 
            Start your journey to the perfect home today! 🚀
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link
              to="/register"
              className="btn-modern text-lg px-10 py-4 bg-white text-green-600 hover:bg-gray-100"
            >
              🎯 Start Your Search Today
            </Link>
            <Link
              to="/properties"
              className="glass border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 hover:scale-105"
            >
              🔍 Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
