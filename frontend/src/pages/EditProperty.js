import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddProperty.css';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    title: '',
    location: '',
    priceType: 'fixed',
    price: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    type: 'apartment',
    description: '',
    existingImages: [], // Current images from database
    newImages: [], // New images to be added
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch existing property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const property = response.data;
        setForm({
          title: property.title || '',
          location: property.location || '',
          priceType: property.priceType || (property.priceMin && property.priceMax ? 'range' : 'fixed'),
          price: property.price || '',
          priceMin: property.priceMin || '',
          priceMax: property.priceMax || '',
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          type: property.type || 'apartment',
          description: property.description || '',
          existingImages: property.images || (property.image ? [property.image] : []),
          newImages: [],
          contactName: property.contactName || '',
          contactPhone: property.contactPhone || '',
          contactEmail: property.contactEmail || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setMessage('Failed to load property data');
        setMessageType('error');
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (message) setMessage('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate total image count (existing + new)
    const totalImages = form.existingImages.length + files.length;
    if (totalImages > 5) {
      setMessage(`Maximum 5 images allowed. You have ${form.existingImages.length} existing images.`);
      setMessageType('error');
      return;
    }
    
    // Validate each file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (let file of files) {
      if (file.size > maxSize) {
        setMessage('Each file must be less than 5MB');
        setMessageType('error');
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setMessage('Only JPEG, PNG, JPG and WebP images are allowed');
        setMessageType('error');
        return;
      }
    }
    
    setForm({ ...form, newImages: files });
    if (message) setMessage('');
  };

  const removeExistingImage = (index) => {
    const updatedImages = form.existingImages.filter((_, i) => i !== index);
    setForm({ ...form, existingImages: updatedImages });
  };

  const removeNewImage = (index) => {
    const updatedImages = Array.from(form.newImages).filter((_, i) => i !== index);
    setForm({ ...form, newImages: updatedImages });
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
    
    // Validate pricing based on type
    if (form.priceType === 'fixed') {
      if (!form.price) {
        setMessage('Price is required');
        setMessageType('error');
        return false;
      }
    } else {
      if (!form.priceMin || !form.priceMax) {
        setMessage('Both minimum and maximum price are required for range pricing');
        setMessageType('error');
        return false;
      }
      if (parseInt(form.priceMin) >= parseInt(form.priceMax)) {
        setMessage('Maximum price must be higher than minimum price');
        setMessageType('error');
        return false;
      }
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
      setMessage('You must be logged in to edit properties');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('Updating your property...');
    setMessageType('loading');

    try {
      const formData = new FormData();
      
      formData.append('title', form.title);
      formData.append('location', form.location);
      formData.append('bedrooms', form.bedrooms);
      formData.append('bathrooms', form.bathrooms);
      formData.append('type', form.type);
      formData.append('description', form.description);
      formData.append('contactName', form.contactName);
      formData.append('contactPhone', form.contactPhone);
      formData.append('contactEmail', form.contactEmail);
      
      // Handle pricing based on type
      if (form.priceType === 'fixed') {
        formData.append('price', form.price);
        formData.append('priceType', 'fixed');
      } else {
        formData.append('priceMin', form.priceMin);
        formData.append('priceMax', form.priceMax);
        formData.append('priceType', 'range');
      }

      // Send existing images that user wants to keep
      formData.append('existingImages', JSON.stringify(form.existingImages));

      // Append new images with the correct field name
      if (form.newImages && form.newImages.length > 0) {
        Array.from(form.newImages).forEach((image) => {
          formData.append('images', image);
        });
      }

      await axios.put(`http://localhost:5000/api/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setMessage('Property updated successfully!');
      setMessageType('success');
      
      // Redirect to My Listings after 2 seconds
      setTimeout(() => {
        navigate('/my-listings');
      }, 2000);
      
    } catch (err) {
      console.error('Update error:', err);
      if (err.response) {
        setMessage(err.response.data?.error || 'Update failed');
      } else if (err.request) {
        setMessage('Network error. Please check your connection.');
      } else {
        setMessage('An unexpected error occurred');
      }
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="add-property-container">
        <div className="add-property-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading-spinner"></div>
            <p>Loading property data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-property-container">
      <div className="add-property-card">
        <div className="card-header">
          <h2>Edit Property</h2>
          <p>Update your property listing details</p>
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

          {/* Pricing Type Selection */}
          <div className="form-group">
            <label htmlFor="priceType">Pricing Type *</label>
            <select
              id="priceType"
              name="priceType"
              value={form.priceType}
              onChange={handleChange}
              required
            >
              <option value="fixed">Fixed Price</option>
              <option value="range">Price Range</option>
            </select>
          </div>

          {/* Conditional Price Fields */}
          {form.priceType === 'fixed' ? (
            <div className="form-group">
              <label htmlFor="price">Price (KES) *</label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder="65,000"
                value={form.price}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          ) : (
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

          {/* Contact Information Section */}
          <div className="form-section">
            <h3>Contact Information (Optional)</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactName">Contact Name</label>
                <input
                  id="contactName"
                  type="text"
                  name="contactName"
                  placeholder="Your full name"
                  value={form.contactName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactPhone">Phone Number</label>
                <input
                  id="contactPhone"
                  type="tel"
                  name="contactPhone"
                  placeholder="e.g., +254 700 123456"
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="contactEmail">Email Address</label>
              <input
                id="contactEmail"
                type="email"
                name="contactEmail"
                placeholder="your.email@example.com"
                value={form.contactEmail}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Existing Images */}
          {form.existingImages.length > 0 && (
            <div className="form-group">
              <label>Current Images ({form.existingImages.length})</label>
              <div className="existing-images">
                {form.existingImages.map((image, index) => (
                  <div key={index} className="existing-image-container">
                    <img 
                      src={`http://localhost:5000/uploads/${image}`} 
                      alt={`Property ${index + 1}`}
                      className="existing-image"
                    />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => removeExistingImage(index)}
                      title="Remove this image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <small className="help-text">
                Click the × button to remove an image. Changes will be saved when you update the property.
              </small>
            </div>
          )}

          {/* Add New Images */}
          <div className="form-group">
            <label htmlFor="newImages">Add More Images</label>
            <input
              id="newImages"
              type="file"
              name="newImages"
              accept="image/*"
              onChange={handleFileChange}
              multiple
            />
            <small className="help-text">
              Add up to {5 - form.existingImages.length} more images (JPEG, PNG, JPG, WebP - Max 5MB each)
            </small>
            {form.newImages.length > 0 && (
              <div className="selected-files">
                <p><strong>New files selected ({form.newImages.length}):</strong></p>
                <div className="selected-files-list">
                  {Array.from(form.newImages).map((file, index) => (
                    <div key={index} className="selected-file-item">
                      <span className="file-name">{file.name}</span>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => removeNewImage(index)}
                        aria-label={`Remove ${file.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/my-listings')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Updating...
                </>
              ) : (
                'Update Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
