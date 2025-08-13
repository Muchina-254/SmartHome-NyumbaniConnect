import React, { useState, useEffect } from 'react';
import './PropertyFilter.css';

const PropertyFilter = ({ onFilterChange, isLoading }) => {
  const [filters, setFilters] = useState({
    transactionType: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    furnishingStatus: '',
    amenities: []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityChange = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    const newFilters = { ...filters, amenities: newAmenities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      transactionType: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      location: '',
      furnishingStatus: '',
      amenities: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const amenitiesList = [
    { value: 'parking', label: 'Parking' },
    { value: 'gym', label: 'Gym' },
    { value: 'pool', label: 'Swimming Pool' },
    { value: 'security', label: '24/7 Security' },
    { value: 'garden', label: 'Garden' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'elevator', label: 'Elevator' },
    { value: 'backup_power', label: 'Backup Power' },
    { value: 'water_supply', label: 'Water Supply' },
    { value: 'internet', label: 'Internet/WiFi' }
  ];

  return (
    <div className="property-filter">
      <div className="filter-header">
        <h3>🔍 Filter Properties</h3>
        <button onClick={clearFilters} className="clear-filters-btn">
          Clear All
        </button>
      </div>

      {/* Primary Filters */}
      <div className="primary-filters">
        <div className="filter-group">
          <label>Transaction Type</label>
          <select
            value={filters.transactionType}
            onChange={(e) => handleFilterChange('transactionType', e.target.value)}
          >
            <option value="">All</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Property Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="bungalow">Bungalow</option>
            <option value="studio">Studio</option>
            <option value="penthouse">Penthouse</option>
            <option value="townhouse">Townhouse</option>
            <option value="condo">Condo</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="Search location..."
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="price-range">
        <label>Price Range (KES)</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        className="advanced-toggle"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? '▼' : '▶'} Advanced Filters
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              >
                <option value="">Any</option>
                <option value="0">Studio</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Bathrooms</label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Furnishing</label>
              <select
                value={filters.furnishingStatus}
                onChange={(e) => handleFilterChange('furnishingStatus', e.target.value)}
              >
                <option value="">Any</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div className="amenities-filter">
            <label>Amenities</label>
            <div className="amenities-grid">
              {amenitiesList.map((amenity) => (
                <label key={amenity.value} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity.value)}
                    onChange={() => handleAmenityChange(amenity.value)}
                  />
                  <span>{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="filter-loading">
          <span>Searching properties...</span>
        </div>
      )}
    </div>
  );
};

export default PropertyFilter;
