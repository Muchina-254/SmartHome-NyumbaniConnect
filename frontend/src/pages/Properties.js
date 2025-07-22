import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const response = await propertyService.getAll(cleanFilters);
      setProperties(response.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

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

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-down">
            <span className="gradient-text">Discover Properties</span> in Kenya 🇰🇪
          </h1>
          <p className="text-xl text-gray-600 animate-fade-in-up max-w-2xl mx-auto">
            Find your perfect home from our collection of verified listings across all 47 counties
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass p-4 rounded-xl text-center animate-fade-in-up">
            <div className="text-2xl mb-2">🏠</div>
            <div className="text-lg font-bold gradient-text">{properties.length}</div>
            <div className="text-sm text-gray-600">Available Properties</div>
          </div>
          <div className="glass p-4 rounded-xl text-center animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="text-2xl mb-2">📍</div>
            <div className="text-lg font-bold gradient-text">47</div>
            <div className="text-sm text-gray-600">Counties Covered</div>
          </div>
          <div className="glass p-4 rounded-xl text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="text-2xl mb-2">✅</div>
            <div className="text-lg font-bold gradient-text">100%</div>
            <div className="text-sm text-gray-600">Verified Listings</div>
          </div>
          <div className="glass p-4 rounded-xl text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-lg font-bold gradient-text">24hrs</div>
            <div className="text-sm text-gray-600">Response Time</div>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="btn-modern flex items-center gap-2 relative"
          >
            🔍 Advanced Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center animate-pulse">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className={`transition-all duration-500 overflow-hidden ${filtersVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="glass p-8 rounded-2xl mb-8 animate-fade-in-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                🎯 Find Your Perfect Match
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors flex items-center gap-2"
                >
                  ❌ Clear All ({activeFiltersCount})
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="animate-slide-in-left">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  📍 Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Nairobi, Westlands, Karen"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="focus-ring w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-all duration-300"
                />
              </div>
              
              <div className="animate-slide-in-left" style={{animationDelay: '0.1s'}}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  🏢 Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="focus-ring w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-all duration-300"
                >
                  <option value="">All Types</option>
                  <option value="apartment">🏢 Apartment</option>
                  <option value="house">🏠 House</option>
                  <option value="studio">🏘️ Studio</option>
                  <option value="bedsitter">🛏️ Bedsitter</option>
                  <option value="commercial">🏬 Commercial</option>
                </select>
              </div>

              <div className="animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  🏷️ Listing Type
                </label>
                <select
                  value={filters.listingType}
                  onChange={(e) => handleFilterChange('listingType', e.target.value)}
                  className="focus-ring w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-all duration-300"
                >
                  <option value="">All Listings</option>
                  <option value="rent">🏠 For Rent</option>
                  <option value="sale">🏡 For Sale</option>
                </select>
              </div>

              <div className="animate-slide-in-right">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  💰 Min Price (KES)
                </label>
                <input
                  type="number"
                  placeholder="10,000"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="focus-ring w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-all duration-300"
                />
              </div>

              <div className="animate-slide-in-right" style={{animationDelay: '0.1s'}}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  💸 Max Price (KES)
                </label>
                <input
                  type="number"
                  placeholder="100,000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="focus-ring w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-all duration-300"
                />
              </div>

              <div className="animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  🛏️ Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="focus-ring w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-all duration-300"
                >
                  <option value="">Any Number</option>
                  <option value="0">Studio</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 glass p-4 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {loading ? (
              <>🔄 Searching...</>
            ) : (
              <>🎯 {properties.length} Properties Found</>
            )}
          </h2>
          
          {!loading && properties.length > 0 && (
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <select className="p-2 border-2 border-gray-200 rounded-lg focus:border-green-500 transition-all">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Bedrooms</option>
              </select>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-bounce mb-6">
              <div className="text-6xl">🏠</div>
            </div>
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 font-medium">Finding amazing properties for you... ✨</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <div className="text-8xl mb-6 animate-bounce">🔍</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              No Properties Found
            </h3>
            <p className="text-xl text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search filters or explore different areas to find more properties.
            </p>
            <button
              onClick={clearFilters}
              className="btn-modern"
            >
              🔄 Reset Filters & Start Fresh
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <div
                key={property._id}
                className="property-card-enhanced animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="h-56 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <span className="text-white text-6xl z-10">🏠</span>
                  
                  {/* Property Type Badge */}
                  <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-white text-sm font-medium">
                    {property.propertyType === 'apartment' ? '🏢' : 
                     property.propertyType === 'house' ? '🏠' : 
                     property.propertyType === 'studio' ? '🏘️' : '🛏️'} {property.propertyType}
                  </div>
                  
                  {/* Listing Type Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium ${
                    property.listingType === 'rent' 
                      ? 'bg-blue-500 bg-opacity-90' 
                      : 'bg-green-500 bg-opacity-90'
                  }`}>
                    {property.listingType === 'rent' ? '🏠 For Rent' : '🏡 For Sale'}
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute bottom-4 left-4 bg-green-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    ✅ Verified
                  </div>
                </div>
                
                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-green-600 transition-colors line-clamp-1">
                    {property.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 flex items-center gap-2">
                    📍 <span className="font-medium">{property.location.area}, {property.location.county}</span>
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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        🛏️ {property.bedrooms}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                        🚿 {property.bathrooms}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/properties/${property._id}`}
                    className="block w-full text-center btn-modern py-3 hover:scale-105"
                  >
                    View Details & Contact
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && properties.length > 0 && properties.length >= 9 && (
          <div className="text-center mt-12">
            <button className="btn-modern text-lg px-8 py-4">
              📄 Load More Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
