import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Listings.css';

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
    <div className="listings-page">
      <h2>My Properties</h2>

      <div className="listings-grid">
        {myListings.length === 0 ? (
          <p>You haven’t posted any properties yet.</p>
        ) : (
          myListings.map(property => (
            <div key={property._id} className="listing-card">
              {property.images && property.images.length > 0 ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={`http://localhost:5000/uploads/${property.images[0]}`}
                    alt={property.title}
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  {property.images.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      +{property.images.length - 1}
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src="/uploads/default.jpg"
                  alt={property.title}
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              )}

              <h3>{property.title}</h3>
              <p>{property.location}</p>
              <p>
                KES {property.priceType === 'range' 
                  ? `${property.priceMin} - ${property.priceMax}` 
                  : property.price}
              </p>
              <p style={{ color: property.verified ? 'green' : 'red' }}>
                {property.verified ? 'Verified' : 'Not Verified'}
              </p>

              <button
                onClick={() => handleEdit(property)}
                style={{
                  backgroundColor: '#2980b9',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  marginTop: '8px',
                  marginRight: '6px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(property._id)}
                style={{
                  backgroundColor: '#c0392b',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  marginTop: '8px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyListings;
