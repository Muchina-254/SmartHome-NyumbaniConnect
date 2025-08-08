import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Listings.css';

const Listings = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/properties')
      .then(res => setProperties(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleVerify = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/properties/${id}/verify`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      window.location.reload();
    } catch (err) {
      alert("Verification failed");
    }
  };

  return (
    <div className="listings-container">
      <h2>Featured Listings</h2>
      <div className="listings-scroll">
        {properties.map((prop) => (
          <div className="listing-card" key={prop._id}>
            <img
              src={`http://localhost:5000/uploads/${prop.image}`}
              alt={prop.title}
              className="listing-image"
            />
            <h3>{prop.title}</h3>
            <p>{prop.location}</p>
            <p><strong>KES {prop.price.toLocaleString()}</strong></p>
            {prop.verified && <span className="verified-tag">✔ Verified</span>}
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(prop.location)}&output=embed`}
              width="100%"
              height="150"
              allowFullScreen=""
              loading="lazy"
              title="Map"
            ></iframe>
            <button onClick={() => handleVerify(prop._id)}>
              {prop.verified ? 'Unverify' : 'Verify'}
            </button>
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
