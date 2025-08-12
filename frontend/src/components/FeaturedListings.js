import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeaturedListings.css';

const FeaturedListings = () => {
  const [listings, setListings] = useState([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({}); // Track current image for each property

  useEffect(() => {
    axios.get('http://localhost:5000/api/properties')
      .then(res => {
        const featuredListings = res.data.slice(0, 10);
        setListings(featuredListings);
        // Initialize image indexes
        const initialIndexes = {};
        featuredListings.forEach(listing => {
          initialIndexes[listing._id] = 0;
        });
        setCurrentImageIndexes(initialIndexes);
      })
      .catch(err => console.error(err));
  }, []);

  const nextImage = (listingId, totalImages) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [listingId]: (prev[listingId] + 1) % totalImages
    }));
  };

  const prevImage = (listingId, totalImages) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [listingId]: prev[listingId] === 0 ? totalImages - 1 : prev[listingId] - 1
    }));
  };

  return (
    <div className="featured-listings-section">
      <h2>Featured Listings</h2>
      <div className="scroll-container">
        {listings.map(listing => {
          const images = listing.images && listing.images.length > 0 
            ? listing.images 
            : listing.image 
            ? [listing.image] 
            : ['default.jpg'];
          const currentIndex = currentImageIndexes[listing._id] || 0;
          
          return (
            <div key={listing._id} className="listing-card">
              <div className="featured-image-container">
                <img 
                  src={`http://localhost:5000/uploads/${images[currentIndex]}`} 
                  alt={`${listing.title} - Image ${currentIndex + 1}`} 
                />
                
                {/* Navigation arrows - only show if multiple images */}
                {images.length > 1 && (
                  <>
                    <button 
                      className="featured-nav-arrow prev-arrow"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage(listing._id, images.length);
                      }}
                      aria-label="Previous image"
                    >
                      ❮
                    </button>
                    <button 
                      className="featured-nav-arrow next-arrow"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage(listing._id, images.length);
                      }}
                      aria-label="Next image"
                    >
                      ❯
                    </button>
                  </>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="featured-image-counter">
                    {currentIndex + 1} / {images.length}
                  </div>
                )}
              </div>
              
              <div className="listing-info">
                <h3>{listing.title}</h3>
                <p>{listing.location}</p>
                <p><strong>KES {
                  listing.priceType === 'range' 
                    ? `${listing.priceMin?.toLocaleString()} - ${listing.priceMax?.toLocaleString()}` 
                    : listing.price?.toLocaleString()
                }</strong></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedListings;
