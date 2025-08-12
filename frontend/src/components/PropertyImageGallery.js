import React, { useState } from 'react';
import './PropertyImageGallery.css';

const PropertyImageGallery = ({ images = [], title = 'Property' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Ensure we have at least one image (fallback to default)
  const imageList = images.length > 0 ? images : ['default.jpg'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') setIsFullScreen(false);
  };

  React.useEffect(() => {
    if (isFullScreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullScreen]);

  return (
    <>
      <div className="property-image-gallery">
        {/* Main Image Display */}
        <div className="main-image-container">
          <img
            src={`http://localhost:5000/uploads/${imageList[currentImageIndex]}`}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="main-image"
            onClick={toggleFullScreen}
          />
          
          {/* Navigation Arrows */}
          {imageList.length > 1 && (
            <>
              <button 
                className="nav-arrow prev-arrow"
                onClick={prevImage}
                aria-label="Previous image"
              >
                &#8249;
              </button>
              <button 
                className="nav-arrow next-arrow"
                onClick={nextImage}
                aria-label="Next image"
              >
                &#8250;
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="image-counter">
            {currentImageIndex + 1} / {imageList.length}
          </div>

          {/* Fullscreen Button */}
          <button 
            className="fullscreen-btn"
            onClick={toggleFullScreen}
            aria-label="View fullscreen"
          >
            ⛶
          </button>
        </div>

        {/* Thumbnail Gallery */}
        {imageList.length > 1 && (
          <div className="thumbnail-gallery">
            {imageList.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => goToImage(index)}
              >
                <img
                  src={`http://localhost:5000/uploads/${image}`}
                  alt={`${title} thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullScreen && (
        <div className="fullscreen-modal" onClick={toggleFullScreen}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:5000/uploads/${imageList[currentImageIndex]}`}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              className="fullscreen-image"
            />
            
            {/* Fullscreen Navigation */}
            {imageList.length > 1 && (
              <>
                <button 
                  className="fullscreen-nav prev"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  &#8249;
                </button>
                <button 
                  className="fullscreen-nav next"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  &#8250;
                </button>
              </>
            )}

            {/* Close Button */}
            <button 
              className="close-btn"
              onClick={toggleFullScreen}
              aria-label="Close fullscreen"
            >
              ✕
            </button>

            {/* Fullscreen Counter */}
            <div className="fullscreen-counter">
              {currentImageIndex + 1} / {imageList.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyImageGallery;
