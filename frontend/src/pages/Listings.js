import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Listings.css';

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    // Fetch properties
    axios.get('http://localhost:5000/api/properties')
      .then(res => setProperties(res.data))
      .catch(err => console.error(err));
  }, []);

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
        {properties.map((prop) => (
          <div className="listing-card" key={prop._id}>
            {/* Display first image or fallback */}
            <img
              src={
                prop.images && prop.images.length > 0
                  ? `http://localhost:5000/uploads/${prop.images[0]}`
                  : prop.image
                  ? `http://localhost:5000/uploads/${prop.image}`
                  : '/placeholder-image.jpg'
              }
              alt={prop.title}
              className="listing-image"
            />
            {/* Image count indicator */}
            {prop.images && prop.images.length > 1 && (
              <div className="image-count-badge">
                📸 {prop.images.length} photos
              </div>
            )}
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
        ))}
      </div>
    </div>
  );
};

export default Listings;
