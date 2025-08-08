import React, { useState } from 'react';
import axios from 'axios';
import './AddProperty.css';

const AddProperty = () => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    type: 'apartment',
    description: '',
    image: null
  });
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'loading'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear message when user starts typing
    if (message) setMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        setMessageType('error');
        return;
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setMessage('Only JPEG, PNG, JPG and WebP images are allowed');
        setMessageType('error');
        return;
      }
    }
    setForm({ ...form, image: file });
    if (message) setMessage('');
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      setMessage('Property title is required');
      setMessageType('error');
      return false;
    }
    if (!form.location.trim()) {
      setMessage('Location is required');
      setMessageType('error');
      return false;
    }
    if (!form.priceMin || !form.priceMax) {
      setMessage('Both minimum and maximum price are required');
      setMessageType('error');
      return false;
    }
    if (parseInt(form.priceMin) >= parseInt(form.priceMax)) {
      setMessage('Maximum price must be higher than minimum price');
      setMessageType('error');
      return false;
    }
    if (!form.bedrooms || !form.bathrooms) {
      setMessage('Bedrooms and bathrooms are required');
      setMessageType('error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to post a property');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('Creating your property listing...');
    setMessageType('loading');

    const formData = new FormData();
    
    // Calculate average price for the main price field
    const avgPrice = (parseInt(form.priceMin) + parseInt(form.priceMax)) / 2;
    
    formData.append('title', form.title);
    formData.append('location', form.location);
    formData.append('price', avgPrice);
    formData.append('priceMin', form.priceMin);
    formData.append('priceMax', form.priceMax);
    formData.append('bedrooms', form.bedrooms);
    formData.append('bathrooms', form.bathrooms);
    formData.append('type', form.type);
    formData.append('description', form.description);
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setMessage(' Property added successfully! Your listing is now live.');
      setMessageType('success');
      
      // Reset form
      setForm({ 
        title: '', 
        location: '', 
        priceMin: '', 
        priceMax: '',
        bedrooms: '',
        bathrooms: '',
        type: 'apartment',
        description: '', 
        image: null 
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Property creation error:', err);
      if (err.response?.status === 403) {
        setMessage('❌ Access denied. Only Landlords, Developers, and Agents can add properties.');
      } else if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage('❌ Failed to add property. Please try again.');
      }
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-property-container">
      <div className="add-property-card">
        <div className="card-header">
          <h2> Add New Property</h2>
          <p>Create a new property listing for rent or sale</p>
        </div>
        
        {message && (
          <div className={`message ${messageType}`}>
            <span className="message-text">{message}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-group">
            <label htmlFor="title">Property Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g., Modern 2BR Apartment in Kilimani"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="e.g., Kilimani, Nairobi"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priceMin">Min Price (KES) *</label>
              <input
                id="priceMin"
                type="number"
                name="priceMin"
                placeholder="50,000"
                value={form.priceMin}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="priceMax">Max Price (KES) *</label>
              <input
                id="priceMax"
                type="number"
                name="priceMax"
                placeholder="80,000"
                value={form.priceMax}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          {form.priceMin && form.priceMax && parseInt(form.priceMin) < parseInt(form.priceMax) && (
            <div className="price-range-display">
              💰 Price Range: KES {parseInt(form.priceMin).toLocaleString()} - {parseInt(form.priceMax).toLocaleString()}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms *</label>
              <select
                id="bedrooms"
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="bathrooms">Bathrooms *</label>
              <select
                id="bathrooms"
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="1">1 Bathroom</option>
                <option value="2">2 Bathrooms</option>
                <option value="3">3 Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="type">Property Type</label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="bungalow">Bungalow</option>
              <option value="studio">Studio</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your property features, amenities, and what makes it special..."
              value={form.description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Property Image *</label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            <small className="help-text">
              Upload a high-quality image (JPEG, PNG, JPG, WebP - Max 5MB)
            </small>
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Creating Property...
              </>
            ) : (
              <>
                🏠 Add Property
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
