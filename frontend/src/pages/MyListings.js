import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Listings.css';

const MyListings = () => {
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
    const title = prompt('Edit Title:', property.title);
    const location = prompt('Edit Location:', property.location);
    const price = prompt('Edit Price:', property.price);

    if (!title || !location || !price) return alert("All fields are required");

    axios.put(`http://localhost:5000/api/properties/${property._id}`, {
      title, location, price
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(() => {
      alert("Property updated");
      fetchMyListings();
    }).catch(err => {
      console.error(err);
      alert("Failed to update");
    });
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
              {property.image ? (
                <img
                  src={`http://localhost:5000/uploads/${property.image}`}
                  alt={property.title}
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              ) : (
                <div className="no-image">No Image</div>
              )}

              <h3>{property.title}</h3>
              <p>{property.location}</p>
              <p>KES {property.price}</p>
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
