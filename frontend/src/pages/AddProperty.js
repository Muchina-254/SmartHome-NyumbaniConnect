import React, { useState } from 'react';
import axios from 'axios';
import './AddProperty.css';

const AddProperty = () => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    priceType: 'fixed', // 'fixed' or 'range'
    price: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    type: 'apartment',
    description: '',
    images: [] // Changed from image to images array
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
    const files = Array.from(e.target.files);
    
    console.log('Files selected:', files.length); // Debug log
    
    if (files.length === 0) return;
    
    // Validate file count (max 5 images)
    if (files.length > 5) {
      setMessage('Maximum 5 images allowed');
      setMessageType('error');
      return;
    }
    
    // Validate each file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (let file of files) {
      if (file.size > maxSize) {
        setMessage(`File "${file.name}" is too large. Each file must be less than 5MB`);
        setMessageType('error');
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setMessage(`File "${file.name}" has unsupported format. Only JPEG, PNG, JPG and WebP images are allowed`);
        setMessageType('error');
        return;
      }
    }
    
    setForm({ ...form, images: files });
    setMessage(`${files.length} image(s) selected successfully`);
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
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
      setMessage('You must be logged in to post a property');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('Creating your property listing...');
    setMessageType('loading');

    const formData = new FormData();
    
    formData.append('title', form.title);
    formData.append('location', form.location);
    formData.append('bedrooms', form.bedrooms);
    formData.append('bathrooms', form.bathrooms);
    formData.append('type', form.type);
    formData.append('description', form.description);
    
    // Handle pricing based on type
    if (form.priceType === 'fixed') {
      formData.append('price', form.price);
      formData.append('priceType', 'fixed');
    } else {
      formData.append('priceMin', form.priceMin);
      formData.append('priceMax', form.priceMax);
      formData.append('priceType', 'range');
    }

    // Append multiple images
    if (form.images && form.images.length > 0) {
      Array.from(form.images).forEach((image, index) => {
        formData.append('images', image);
      });
    }

    try {
      await axios.post('http://localhost:5000/api/properties', formData, {
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
        priceType: 'fixed',
        price: '',
        priceMin: '', 
        priceMax: '',
        bedrooms: '',
        bathrooms: '',
        type: 'apartment',
        description: '', 
        images: [] 
      });
      
      // Reset file input
      const fileInput = document.querySelector('#images');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Property creation error:', err);
      if (err.response?.status === 403) {
        setMessage(' Access denied. Only Landlords, Developers, and Agents can add properties.');
      } else if (err.response?.data?.message) {
        setMessage(` ${err.response.data.message}`);
      } else {
        setMessage(' Failed to add property. Please try again.');
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

          {/* Price Display */}
          {form.priceType === 'fixed' && form.price && (
            <div className="price-display">
              Fixed Price: KES {parseInt(form.price).toLocaleString()}
            </div>
          )}
          
          {form.priceType === 'range' && form.priceMin && form.priceMax && parseInt(form.priceMin) < parseInt(form.priceMax) && (
            <div className="price-range-display">
              Price Range: KES {parseInt(form.priceMin).toLocaleString()} - {parseInt(form.priceMax).toLocaleString()}
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
            <label htmlFor="images">Property Images *</label>
            <div className="file-upload-container">
              <input
                id="images"
                type="file"
                name="images"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                multiple
                required
                style={{ display: 'none' }}
                ref={(input) => {
                  if (input) input.setAttribute('multiple', 'multiple');
                }}
              />
              <button
                type="button"
                className="file-upload-btn"
                onClick={() => document.getElementById('images').click()}
              >
                📷 Choose Images (Max 5)
              </button>
            </div>
            <small className="help-text">
              Upload up to 5 high-quality images (JPEG, PNG, JPG, WebP - Max 5MB each)<br/>
              <strong>Tip:</strong> Hold Ctrl (Windows) or Cmd (Mac) to select multiple files in the file dialog
            </small>
            {form.images.length > 0 && (
              <div className="selected-files">
                <p>Selected files: <strong>{form.images.length}</strong></p>
                <ul>
                  {Array.from(form.images).map((file, index) => (
                    <li key={index}>
                      📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                 Add Property
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
