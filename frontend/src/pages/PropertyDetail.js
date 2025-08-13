import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PropertyDetail.css';

const PropertyDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
      setProperty(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property details:', error);
      setError('Failed to load property details');
      setLoading(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="property-detail-container">
        <div className="loading">Loading property details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-detail-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/listings')} className="back-button">
          Back to Listings
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail-container">
        <div className="error">Property not found</div>
        <button onClick={() => navigate('/listings')} className="back-button">
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="property-detail-container">
      <button onClick={() => navigate('/listings')} className="back-button">
        ← Back to Listings
      </button>

      <div className="property-detail-content">
        <div className="property-images">
          <div 
            className="main-image"
            onClick={() => handleImageClick(`http://localhost:5000/uploads/${property.images?.[0] || 'default.jpg'}`)}
          >
            <img
              src={`http://localhost:5000/uploads/${property.images?.[0] || 'default.jpg'}`}
              alt={property.title}
              onError={(e) => {
                e.target.src = `http://localhost:5000/uploads/default.jpg`;
              }}
            />
          </div>
          
          {property.images && property.images.length > 1 && (
            <div className="additional-images">
              {property.images.slice(1).map((img, index) => (
                <div 
                  key={index}
                  className="thumb-image"
                  onClick={() => handleImageClick(`http://localhost:5000/uploads/${img}`)}
                >
                  <img
                    src={`http://localhost:5000/uploads/${img}`}
                    alt={`${property.title} ${index + 2}`}
                    onError={(e) => {
                      e.target.src = `http://localhost:5000/uploads/default.jpg`;
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="property-info">
          <div className="property-header">
            <h1>{property.title}</h1>
            <div className="property-price">
              KSh {property.price?.toLocaleString()}
              {property.transactionType === 'rent' && property.rentPeriod && (
                <span className="price-period">/{property.rentPeriod}</span>
              )}
            </div>
            <div className="property-location">📍 {property.location}</div>
            {property.transactionType && (
              <div className={`transaction-badge ${property.transactionType}`}>
                {property.transactionType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
              </div>
            )}
          </div>

          <div className="property-details">
            <div className="detail-row">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{property.type || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Transaction:</span>
              <span className="detail-value transaction-type">
                {property.transactionType === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
            </div>
            {property.bedrooms !== undefined && (
              <div className="detail-row">
                <span className="detail-label">Bedrooms:</span>
                <span className="detail-value">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="detail-row">
                <span className="detail-label">Bathrooms:</span>
                <span className="detail-value">{property.bathrooms}</span>
              </div>
            )}
            {property.size && (
              <div className="detail-row">
                <span className="detail-label">Size:</span>
                <span className="detail-value">{property.size} sq ft</span>
              </div>
            )}
            {property.furnishingStatus && (
              <div className="detail-row">
                <span className="detail-label">Furnishing:</span>
                <span className="detail-value furnishing-status">
                  {property.furnishingStatus.replace('-', ' ')}
                </span>
              </div>
            )}
            {property.ownershipType && (
              <div className="detail-row">
                <span className="detail-label">Ownership:</span>
                <span className="detail-value">{property.ownershipType}</span>
              </div>
            )}
            {property.transactionType === 'rent' && property.rentPeriod && (
              <div className="detail-row">
                <span className="detail-label">Rent Period:</span>
                <span className="detail-value">{property.rentPeriod}</span>
              </div>
            )}
            {property.transactionType === 'rent' && property.securityDeposit && (
              <div className="detail-row">
                <span className="detail-label">Security Deposit:</span>
                <span className="detail-value">KSh {property.securityDeposit?.toLocaleString()}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status ${property.verified ? 'verified' : 'pending'}`}>
                {property.verified ? '✅ Verified' : '⏳ Pending Verification'}
              </span>
            </div>
          </div>

          {/* Amenities Section */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="amenities-section">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">✓</span>
                    <span className="amenity-name">{amenity.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description - Always visible */}
          <div className="property-description">
            <h3>Description</h3>
            <p>{property.description || 'No description available.'}</p>
          </div>

          {/* Contact Information - Authentication Required */}
          <div className="contact-section">
            <h3>Contact Information</h3>
            {user ? (
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Contact Person:</span>
                  <span className="contact-value">{property.contactName || property.user?.name || 'Not available'}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <span className="contact-value">{property.contactPhone || 'Not available'}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span className="contact-value">{property.contactEmail || property.user?.email || 'Not available'}</span>
                </div>
              </div>
            ) : (
              <div className="login-prompt">
                <p>Please log in to view contact information</p>
                <button 
                  onClick={() => navigate('/login')} 
                  className="login-button"
                >
                  Login to View Contact
                </button>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="property-map">
            <h3>Location</h3>
            <div className="map-placeholder">
              <p>📍 {property.location}</p>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-on-maps"
              >
                View on Google Maps
              </a>
            </div>
          </div>

          {/* Payment Section - Authentication Required */}
          {user && (
            <div className="payment-section">
              <h3>Payment</h3>
              <button className="pay-button">
                Pay Now - KSh {property.price?.toLocaleString()}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <img src={selectedImage} alt="Enlarged view" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
