import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Listings.css';

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({}); // Track current image for each property

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    // Fetch properties
    axios.get('http://localhost:5000/api/properties')
      .then(res => {
        setProperties(res.data);
        // Initialize image indexes for all properties
        const initialIndexes = {};
        res.data.forEach(prop => {
          initialIndexes[prop._id] = 0;
        });
        setCurrentImageIndexes(initialIndexes);
      })
      .catch(err => console.error(err));
  }, []);

  const nextImage = (propertyId, totalImages) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] + 1) % totalImages
    }));
  };

  const prevImage = (propertyId, totalImages) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [propertyId]: prev[propertyId] === 0 ? totalImages - 1 : prev[propertyId] - 1
    }));
  };

  const handleVerify = async (id, isVerified) => {
    try {
      const endpoint = isVerified ? 'unverify' : 'verify';
      const apiUrl = `http://localhost:5000/api/admin/properties/${id}/${endpoint}`;
      
      await axios.patch(apiUrl, 
        isVerified ? { reason: 'Admin decision' } : {}, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Refresh properties list
      const updatedProperties = await axios.get('http://localhost:5000/api/properties');
      setProperties(updatedProperties.data);
      
      alert(isVerified ? 'Property unverified successfully' : 'Property verified successfully');
    } catch (err) {
      console.error('Verification error:', err);
      if (err.response?.status === 403) {
        alert("Access denied. Admin privileges required.");
      } else {
        alert("Verification failed. Please try again.");
      }
    }
  };

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'Admin';

  return (
    <div className="listings-container">
      <h2>Featured Listings</h2>
      <div className="listings-scroll">
        {properties.map((prop) => {
          const images = prop.images && prop.images.length > 0 
            ? prop.images 
            : prop.image 
            ? [prop.image] 
            : ['default.jpg'];
          const currentIndex = currentImageIndexes[prop._id] || 0;
          
          return (
            <div className="listing-card" key={prop._id}>
              {/* Image carousel container */}
              <div className="listing-image-container">
                <img
                  src={`http://localhost:5000/uploads/${images[currentIndex]}`}
                  alt={`${prop.title} - Image ${currentIndex + 1}`}
                  className="listing-image"
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

                {/* Image dots indicator */}
                {images.length > 1 && (
                  <div className="listing-image-dots">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndexes(prev => ({
                            ...prev,
                            [prop._id]: index
                          }));
                        }}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            <h3>{prop.title}</h3>
            <p>{prop.location}</p>
            
            {/* Dynamic price display based on pricing type */}
            <p>
              <strong>
                {prop.priceType === 'fixed' && prop.price
                  ? `KES ${prop.price.toLocaleString()}`
                  : prop.priceMin && prop.priceMax
                  ? `KES ${prop.priceMin.toLocaleString()} - ${prop.priceMax.toLocaleString()}`
                  : prop.price
                  ? `KES ${prop.price.toLocaleString()}`
                  : 'Price on request'
                }
              </strong>
            </p>
            
            {/* Enhanced verified indicator */}
            <div className="verification-status">
              {prop.verified ? (
                <span className="verified-badge">
                  ✅ Verified Property
                </span>
              ) : (
                <span className="pending-badge">
                  ⏳ Pending Verification
                </span>
              )}
            </div>
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(prop.location)}&output=embed`}
              width="100%"
              height="150"
              allowFullScreen=""
              loading="lazy"
              title="Map"
            ></iframe>
            
            {/* Admin-only verification buttons */}
            {isAdmin && (
              <button 
                onClick={() => handleVerify(prop._id, prop.verified)}
                style={{
                  background: prop.verified ? '#ef4444' : '#10b981',
                  color: '#fff',
                  marginBottom: '8px',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                {prop.verified ? 'Unverify Property' : 'Verify Property'}
              </button>
            )}
            
            <button
              style={{ background: '#10b981', color: '#fff' }}
              onClick={() => window.open('https://buy.stripe.com/test_dummy_link', '_blank')}
            >
              Pay Now
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default Listings;
