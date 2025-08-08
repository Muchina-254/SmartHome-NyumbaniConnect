import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Listings.css'; // Reuse existing styles

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!property) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="listings-container">
      <div className="listing-card" style={{ maxWidth: '700px', margin: '40px auto' }}>
        <img
          src={`http://localhost:5000/uploads/${property.image}`}
          alt={property.title}
          className="listing-image"
          style={{ maxHeight: '400px' }}
        />
        <h3 style={{ fontSize: '26px', marginTop: '20px' }}>{property.title}</h3>
        <p><strong>Location:</strong> {property.location}</p>
        <p><strong>Price:</strong> KES {property.price.toLocaleString()}</p>
        <p><strong>Description:</strong> {property.description || 'No description provided.'}</p>

        {property.verified && (
          <span
            style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '6px 12px',
              backgroundColor: '#22c55e',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            ✔ Verified
          </span>
        )}

        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
          width="100%"
          height="250"
          allowFullScreen=""
          loading="lazy"
          title="Map"
          style={{ marginTop: '30px', borderRadius: '10px' }}
        ></iframe>

        <button
          style={{
            marginTop: '20px',
            backgroundColor: '#10b981',
            color: '#fff',
            padding: '10px 16px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
          onClick={() => window.open('https://buy.stripe.com/test_dummy_link', '_blank')}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PropertyDetail;
