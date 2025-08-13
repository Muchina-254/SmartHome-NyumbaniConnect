import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyFilter from '../components/PropertyFilter';
import { useToast } from '../hooks/useToast';
import './Listings.css';
import '../styles/toast.css';

const Listings = ({ user }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const { showNotification, ToastContainer } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'Admin') {
      setIsAdmin(true);
    }
    fetchProperties();
  }, [user]);

  const fetchProperties = async (filters = {}) => {
    try {
      setFilterLoading(true);
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          if (key === 'amenities' && Array.isArray(value) && value.length > 0) {
            queryParams.append(key, value.join(','));
          } else if (key !== 'amenities') {
            queryParams.append(key, value);
          }
        }
      });

      const response = await axios.get(`http://localhost:5000/api/properties?${queryParams.toString()}`);
      setProperties(response.data);
      setLoading(false);
      setFilterLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    fetchProperties(filters);
  };

  const nextImage = (propertyId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (propertyId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleVerify = async (propertyId, isCurrentlyVerified) => {
    if (!user || user.role !== 'Admin') {
      showNotification('Only administrators can verify properties', 'warning');
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/properties/${propertyId}/verify`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update the property in the local state
      setProperties(prev => prev.map(prop => 
        prop._id === propertyId ? { ...prop, verified: !isCurrentlyVerified } : prop
      ));
      
      showNotification(`Property ${isCurrentlyVerified ? 'unverified' : 'verified'} successfully`, 'success');
    } catch (error) {
      console.error('Error updating verification:', error);
      showNotification('Failed to update property verification', 'error');
    }
  };

  if (loading) {
    return (
      <div className="listings-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="listings-page">
      <div className="listings-header">
        <h1>Property Listings</h1>
        <p>Find your perfect home from our curated selection of properties</p>
      </div>

      <PropertyFilter onFilterChange={handleFilterChange} isLoading={filterLoading} />

      <div className="listings-summary">
        <p>{properties.length} propert{properties.length === 1 ? 'y' : 'ies'} found</p>
      </div>

      <div className="listings-grid">
        {properties.length === 0 ? (
          <div className="no-properties">
            <div className="empty-state">
              <h3>No properties found</h3>
              <p>Try adjusting your search filters or check back later for new listings.</p>
            </div>
          </div>
        ) : (
          properties.map(prop => {
            const images = prop.images && prop.images.length > 0 ? prop.images : ['default.jpg'];
            const currentIndex = currentImageIndex[prop._id] || 0;
            
            return (
              <div key={prop._id} className="listings-page-card">
                {/* Image carousel container */}
                <div className="listing-image-container">
                  <img
                    src={`http://localhost:5000/uploads/${images[currentIndex]}`}
                    alt={`${prop.title} - Image ${currentIndex + 1}`}
                    className="listing-image"
                    onError={(e) => {
                      e.target.src = `http://localhost:5000/uploads/default.jpg`;
                    }}
                  />
                  
                  {/* Navigation arrows - only show if multiple images */}
                  {images.length > 1 && (
                    <>
                      <button 
                        className="listing-nav-arrow prev-arrow"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage(prop._id, images.length);
                        }}
                        aria-label="Previous image"
                      >
                        ❮
                      </button>
                      <button 
                        className="listing-nav-arrow next-arrow"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage(prop._id, images.length);
                        }}
                        aria-label="Next image"
                      >
                        ❯
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  {images.length > 1 && (
                    <div className="listing-image-counter">
                      {currentIndex + 1} / {images.length}
                    </div>
                  )}

                  {/* Transaction type badge */}
                  <div className={`transaction-badge ${prop.transactionType}`}>
                    {prop.transactionType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                  </div>
                </div>

                {/* Property Information */}
                <div className="listing-content">
                  <h3 className="listing-title">{prop.title}</h3>
                  <p className="listing-location">📍 {prop.location}</p>
                  
                  {/* Enhanced property details */}
                  <div className="listing-details">
                    <div className="detail-item">
                      <span className="detail-value">{prop.type}</span>
                      <span className="detail-label">Type</span>
                    </div>
                    {prop.bedrooms !== undefined && (
                      <div className="detail-item">
                        <span className="detail-value">{prop.bedrooms}</span>
                        <span className="detail-label">BR</span>
                      </div>
                    )}
                    {prop.bathrooms !== undefined && (
                      <div className="detail-item">
                        <span className="detail-value">{prop.bathrooms}</span>
                        <span className="detail-label">BA</span>
                      </div>
                    )}
                    {prop.size && (
                      <div className="detail-item">
                        <span className="detail-value">{prop.size}</span>
                        <span className="detail-label">Sq Ft</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Dynamic price display */}
                  <div className="listing-price">
                    {prop.priceType === 'fixed' && prop.price
                      ? `KSh ${prop.price.toLocaleString()}`
                      : prop.priceMin && prop.priceMax
                      ? `KSh ${prop.priceMin.toLocaleString()} - ${prop.priceMax.toLocaleString()}`
                      : prop.price
                      ? `KSh ${prop.price.toLocaleString()}`
                      : 'Price on request'
                    }
                    {prop.transactionType === 'rent' && prop.rentPeriod && (
                      <span className="price-period">/{prop.rentPeriod}</span>
                    )}
                  </div>

                  {/* Amenities preview */}
                  {prop.amenities && prop.amenities.length > 0 && (
                    <div className="amenities-preview">
                      {prop.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="amenity-tag">
                          {amenity.replace('_', ' ')}
                        </span>
                      ))}
                      {prop.amenities.length > 3 && (
                        <span className="amenity-tag more">+{prop.amenities.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  {/* Enhanced verification status */}
                  <div className="verification-status">
                    {prop.verified ? (
                      <span className="verified-badge">
                        ✅ Verified
                      </span>
                    ) : (
                      <span className="pending-badge">
                        ⏳ Pending
                      </span>
                    )}
                    {prop.furnishingStatus && (
                      <span className="furnishing-badge">
                        {prop.furnishingStatus.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                  
                  {/* Admin verification controls */}
                  {isAdmin && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerify(prop._id, prop.verified);
                      }}
                      className={`admin-verify-btn ${prop.verified ? 'unverify' : 'verify'}`}
                    >
                      {prop.verified ? 'Unverify' : 'Verify'}
                    </button>
                  )}
                  
                  {/* View Details Button */}
                  <button
                    className="view-details-btn"
                    onClick={() => navigate(`/property/${prop._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Listings;
