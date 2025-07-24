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
    <div className="min-h-screen bg-neutral-50">
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
      
      <div className="container-professional">
        <div className="section-professional">
          {/* Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-body-sm font-semibold mb-6 animate-scale-in">
              <span className="icon icon-home"></span>
              Premium Properties
            </div>
            <h1 className="text-display-2xl font-display font-bold text-neutral-900 mb-6 animate-slide-up">
              Discover Properties
              <span className="gradient-text-professional block">in Kenya</span>
            </h1>
            <p className="text-body-lg text-neutral-600 animate-slide-up animate-delay-200 max-w-3xl mx-auto">
              Find your perfect home from our collection of verified listings across all 47 counties
            </p>
          </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="glass-professional p-6 rounded-xl text-center animate-slide-up">
            <div className="icon icon-building text-4xl mb-3 text-primary-600"></div>
            <div className="text-heading-md gradient-text-professional">{properties.length}</div>
            <div className="text-body-sm text-neutral-600">Available Properties</div>
          </div>
          <div className="glass-professional p-6 rounded-xl text-center animate-slide-up animate-delay-100">
            <div className="icon icon-location text-4xl mb-3 text-primary-600"></div>
            <div className="text-heading-md gradient-text-professional">47</div>
            <div className="text-body-sm text-neutral-600">Counties Covered</div>
          </div>
          <div className="glass-professional p-6 rounded-xl text-center animate-slide-up animate-delay-200">
            <div className="icon icon-verified text-4xl mb-3 text-success-600"></div>
            <div className="text-heading-md gradient-text-professional">100%</div>
            <div className="text-body-sm text-neutral-600">Verified Listings</div>
          </div>
          <div className="glass-professional p-6 rounded-xl text-center animate-slide-up animate-delay-300">
            <div className="icon icon-lightning text-4xl mb-3 text-warning-600"></div>
            <div className="text-heading-md gradient-text-professional">24hrs</div>
            <div className="text-body-sm text-neutral-600">Response Time</div>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="btn btn-secondary hover-scale focus-professional relative"
          >
            <span className="icon icon-search mr-2"></span>
            Advanced Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full w-6 h-6 text-body-sm flex items-center justify-center animate-pulse-soft">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className={`transition-all duration-300 overflow-hidden ${filtersVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="glass-professional p-8 rounded-xl mb-12 animate-slide-down">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-heading-lg gradient-text-professional flex items-center gap-2">
                <span className="icon icon-target"></span>
                Find Your Perfect Match
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-error-500 hover:text-error-600 font-medium transition-colors flex items-center gap-2"
                >
                  <span className="icon icon-close"></span>
                  Clear All ({activeFiltersCount})
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="animate-slide-left">
                <label className="block text-body-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                  <span className="icon icon-location"></span>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Nairobi, Westlands, Karen"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="input-professional"
                />
              </div>
              
              <div className="animate-slide-left animate-delay-100">
                <label className="block text-body-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                  <span className="icon icon-building"></span>
                  Property Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="select-professional"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="bedsitter">Bedsitter</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="animate-slide-left animate-delay-200">
                <label className="block text-body-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                  <span className="icon icon-tag"></span>
                  Listing Type
                </label>
                <select
                  value={filters.listingType}
                  onChange={(e) => handleFilterChange('listingType', e.target.value)}
                  className="select-professional"
                >
                  <option value="">All Listings</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>

              <div className="animate-slide-right">
                <label className="block text-body-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                  <span className="icon icon-money"></span>
                  Min Price (KES)
                </label>
                <input
                  type="number"
                  placeholder="10,000"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="input-professional"
                />
              </div>

              <div className="animate-slide-right animate-delay-100">
                <label className="block text-body-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                  <span className="icon icon-money"></span>
                  Max Price (KES)
                </label>
                <input
                  type="number"
                  placeholder="100,000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input-professional"
                />
              </div>

              <div className="animate-slide-right animate-delay-200">
                <label className="block text-body-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                  <span className="icon icon-bed"></span>
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="select-professional"
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
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 glass-professional p-6 rounded-xl">
          <h2 className="text-heading-lg text-neutral-900 flex items-center gap-2 mb-4 lg:mb-0">
            {loading ? (
              <>
                <span className="icon icon-refresh animate-spin"></span>
                Searching...
              </>
            ) : (
              <>
                <span className="icon icon-target"></span>
                {properties.length} Properties Found
              </>
            )}
          </h2>
          
          {!loading && properties.length > 0 && (
            <div className="flex items-center gap-4">
              <select className="select-professional">
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
          <div className="text-center py-20">
            <div className="inline-block animate-float mb-6">
              <div className="icon icon-home text-8xl text-primary-500"></div>
            </div>
            <div className="spinner-professional mx-auto mb-6"></div>
            <p className="text-body-lg text-neutral-600 font-medium">Finding amazing properties for you...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 glass-professional rounded-xl">
            <div className="icon icon-search text-8xl mb-8 animate-float text-neutral-400"></div>
            <h3 className="text-heading-xl text-neutral-900 mb-6">
              No Properties Found
            </h3>
            <p className="text-body-lg text-neutral-600 mb-8 max-w-md mx-auto">
              Try adjusting your search filters or explore different areas to find more properties.
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary hover-scale focus-professional"
            >
              <span className="icon icon-refresh mr-2"></span>
              Reset Filters & Start Fresh
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <div
                key={property._id}
                className="property-card property-card-professional animate-slide-up hover-lift"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="h-64 gradient-hero-professional flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <span className="icon icon-home text-8xl z-10 text-white"></span>
                  
                  {/* Property Type Badge */}
                  <div className="absolute top-4 left-4 badge badge-premium">
                    <span className="icon icon-building mr-1"></span>
                    {property.propertyType}
                  </div>
                  
                  {/* Listing Type Badge */}
                  <div className={`absolute top-4 right-4 badge ${
                    property.listingType === 'rent' 
                      ? 'badge-info' 
                      : 'badge-success'
                  }`}>
                    <span className={`icon ${property.listingType === 'rent' ? 'icon-key' : 'icon-tag'} mr-1`}></span>
                    {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute bottom-4 left-4 status-verified">
                    <span className="icon icon-verified mr-1"></span>
                    Verified
                  </div>
                </div>
                
                <div className="p-6 relative z-10">
                  <h3 className="card-title text-heading-md mb-3 hover:text-primary-600 transition-colors line-clamp-1">
                    {property.title}
                  </h3>
                  
                  <p className="property-location text-body-md mb-3 flex items-center gap-2">
                    <span className="icon icon-location"></span>
                    <span className="font-medium">{property.location.area}, {property.location.county}</span>
                  </p>
                  
                  <p className="card-text text-body-sm mb-6 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="property-price text-2xl font-bold gradient-text-professional">
                        {formatPrice(property)}
                      </span>
                      {property.listingType === 'rent' && (
                        <span className="text-neutral-500 text-body-sm">/month</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-info">
                        <span className="icon icon-bed mr-1"></span>
                        {property.bedrooms}
                      </span>
                      <span className="badge badge-success">
                        <span className="icon icon-bath mr-1"></span>
                        {property.bathrooms}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/properties/${property._id}`}
                    className="btn btn-primary w-full justify-center hover-scale focus-professional"
                  >
                    <span className="icon icon-eye mr-2"></span>
                    View Details & Contact
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && properties.length > 0 && properties.length >= 9 && (
          <div className="text-center mt-16">
            <button className="btn btn-secondary btn-lg hover-scale focus-professional">
              <span className="icon icon-plus mr-2"></span>
              Load More Properties
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
