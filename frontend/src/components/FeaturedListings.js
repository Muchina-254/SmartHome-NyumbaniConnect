import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeaturedListings.css';

const FeaturedListings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/properties')
      .then(res => setListings(res.data.slice(0, 10))) // Limit to 10 featured
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="featured-listings-section">
      <h2>Featured Listings</h2>
      <div className="scroll-container">
        {listings.map(listing => (
          <div key={listing._id} className="listing-card">
            {listing.image ? (
              <img src={`http://localhost:5000/uploads/${listing.image}`} alt={listing.title} />
            ) : (
              <div className="fallback-img">No Image</div>
            )}
            <div className="listing-info">
              <h3>{listing.title}</h3>
              <p>{listing.location}</p>
              <p><strong>KES {listing.price}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedListings;
