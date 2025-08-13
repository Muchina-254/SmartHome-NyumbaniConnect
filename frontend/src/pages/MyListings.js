import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyListings.css';

const MyListings = () => {
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);

  const fetchMyListings = () => {
    axios.get('http://localhost:5000/api/properties/my', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => setMyListings(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    axios.delete(`http://localhost:5000/api/properties/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(() => {
      alert('Property deleted');
      fetchMyListings();
    }).catch(err => {
      console.error(err);
      alert('Failed to delete');
    });
  };

  const handleEdit = (property) => {
    navigate(`/edit/${property._id}`);
  };

  return (
    <div className="my-listings-page">
      <h2>My Properties</h2>

      <div className="my-listings-container">
        {myListings.length === 0 ? (
          <div className="empty-state">
            <p>You haven't posted any properties yet.</p>
            <button 
              className="add-property-button"
              onClick={() => navigate('/add-property')}
            >
              Add Your First Property
            </button>
          </div>
        ) : (
          myListings.map(property => (
            <div key={property._id} className="my-listing-card">
              <div className="my-listing-image">
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={`http://localhost:5000/uploads/${property.images[0]}`}
                      alt={property.title}
                      onError={(e) => {
                        e.target.src = `http://localhost:5000/uploads/default.jpg`;
                      }}
                    />
                    {property.images.length > 1 && (
                      <div className="image-count-badge">
                        +{property.images.length - 1}
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src={`http://localhost:5000/uploads/default.jpg`}
                    alt={property.title}
                  />
                )}
              </div>

              <div className="my-listing-content">
                <div className="my-listing-header">
                  <h3 className="my-listing-title">{property.title}</h3>
                  <p className="my-listing-location">{property.location}</p>
                  <p className="my-listing-price">
                    KSh {property.priceType === 'range' 
                      ? `${property.priceMin?.toLocaleString()} - ${property.priceMax?.toLocaleString()}` 
                      : property.price?.toLocaleString()}
                  </p>
                </div>

                <div className="my-listing-details">
                  {property.type && (
                    <div className="detail-item">
                      <span className="detail-value">{property.type}</span>
                      <span className="detail-label">Type</span>
                    </div>
                  )}
                  {property.bedrooms && (
                    <div className="detail-item">
                      <span className="detail-value">{property.bedrooms}</span>
                      <span className="detail-label">Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="detail-item">
                      <span className="detail-value">{property.bathrooms}</span>
                      <span className="detail-label">Bathrooms</span>
                    </div>
                  )}
                </div>

                <div className={`verification-status ${property.verified ? 'verified' : 'not-verified'}`}>
                  {property.verified ? 'Property Verified' : 'Pending Verification'}
                </div>

                <div className="my-listing-actions">
                  <button
                    onClick={() => navigate(`/property/${property._id}`)}
                    className="action-button view-details-button"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEdit(property)}
                    className="action-button edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="action-button delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyListings;
