import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PropertyImageGallery from '../components/PropertyImageGallery';
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
      <div className="listing-card" style={{ maxWidth: '800px', margin: '40px auto', padding: '30px' }}>
        
        {/* Property Image Gallery */}
        <PropertyImageGallery 
          images={property.images || (property.image ? [property.image] : [])} 
          title={property.title}
        />

        <h3 style={{ fontSize: '28px', marginTop: '30px', marginBottom: '20px', color: '#333' }}>
          {property.title}
        </h3>
        
        <div style={{ display: 'grid', gap: '15px', marginBottom: '25px' }}>
          <p style={{ fontSize: '18px', color: '#555' }}>
            <strong>📍 Location:</strong> {property.location}
          </p>
          
          <p style={{ fontSize: '20px', color: '#667eea', fontWeight: 'bold' }}>
            <strong>💰 Price:</strong> KES {
              property.priceType === 'range' 
                ? `${property.priceMin?.toLocaleString()} - ${property.priceMax?.toLocaleString()}` 
                : property.price?.toLocaleString()
            }
          </p>

          {property.bedrooms && (
            <p style={{ fontSize: '16px', color: '#555' }}>
              <strong>🛏️ Bedrooms:</strong> {property.bedrooms}
            </p>
          )}

          {property.bathrooms && (
            <p style={{ fontSize: '16px', color: '#555' }}>
              <strong>🚿 Bathrooms:</strong> {property.bathrooms}
            </p>
          )}

          <p style={{ fontSize: '16px', color: '#555' }}>
            <strong>🏢 Type:</strong> {property.type}
          </p>
        </div>

        {property.description && (
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#333', marginBottom: '10px' }}>📝 Description</h4>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
              {property.description}
            </p>
          </div>
        )}

        {/* Contact Information */}
        {(property.contactName || property.contactPhone || property.contactEmail) && (
          <div style={{ 
            marginBottom: '25px', 
            padding: '20px', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '12px',
            border: '1px solid #e0f2fe'
          }}>
            <h4 style={{ color: '#333', marginBottom: '15px', fontSize: '18px' }}>📞 Contact Information</h4>
            
            {property.contactName && (
              <p style={{ fontSize: '16px', color: '#555', marginBottom: '8px' }}>
                <strong>👤 Name:</strong> {property.contactName}
              </p>
            )}
            
            {property.contactPhone && (
              <p style={{ fontSize: '16px', color: '#555', marginBottom: '8px' }}>
                <strong>📱 Phone:</strong> 
                <a href={`tel:${property.contactPhone}`} style={{ color: '#667eea', textDecoration: 'none', marginLeft: '5px' }}>
                  {property.contactPhone}
                </a>
              </p>
            )}
            
            {property.contactEmail && (
              <p style={{ fontSize: '16px', color: '#555', marginBottom: '0' }}>
                <strong>📧 Email:</strong> 
                <a href={`mailto:${property.contactEmail}`} style={{ color: '#667eea', textDecoration: 'none', marginLeft: '5px' }}>
                  {property.contactEmail}
                </a>
              </p>
            )}
          </div>
        )}

        {property.verified && (
          <span
            style={{
              display: 'inline-block',
              marginBottom: '20px',
              padding: '8px 16px',
              backgroundColor: '#22c55e',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            ✅ Verified Property
          </span>
        )}

        {/* Map */}
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ color: '#333', marginBottom: '15px' }}>🗺️ Location on Map</h4>
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            title="Property Location"
            style={{ borderRadius: '12px', border: '1px solid #e5e5e5' }}
          ></iframe>
        </div>

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
