import React, { useState } from 'react';
import axios from 'axios';
import './AddProperty.css';

const AddProperty = () => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    transactionType: 'rent', // 'rent' or 'sale'
    priceType: 'fixed', // 'fixed' or 'range'
    price: '',
    priceMin: '',
    priceMax: '',
    rentPeriod: 'monthly', // 'monthly', 'yearly', 'weekly'
    securityDeposit: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    type: 'apartment',
    furnishingStatus: 'unfurnished',
    amenities: [],
    description: '',
    images: [],
    contactName: '',
    contactPhone: '',
    contactEmail: ''
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

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    let newAmenities = [...form.amenities];
    
    if (checked) {
      newAmenities.push(value);
    } else {
      newAmenities = newAmenities.filter(amenity => amenity !== value);
    }
    
    setForm({ ...form, amenities: newAmenities });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    console.log('Files selected:', files.length); // Debug log
    console.log('Files:', files.map(f => f.name)); // Debug log - show filenames

    if (files.length === 0) return;

    // Validate file count (max 5 images)
    if (files.length > 5) {
      alert('You can only upload up to 5 images at once. Please select fewer files.');
      e.target.value = ''; // Reset the input
      return;
    }

    // Validate each file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let file of files) {
      if (file.size > maxSize) {
        setMessage(`File "${file.name}" is too large. Each file must be less than 5MB`);
        e.target.value = ''; // Reset the input
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setMessage(`File "${file.name}" has unsupported format. Only JPEG, PNG, JPG and WebP images are allowed`);
        e.target.value = ''; // Reset the input
        return;
      }
    }

    setForm({ ...form, images: files });
    setMessage(`${files.length} image(s) selected successfully`);
  };

  const removeImage = (indexToRemove) => {
    const newImages = Array.from(form.images).filter((_, index) => index !== indexToRemove);
    setForm({ ...form, images: newImages });
    setMessage(`Image removed. ${newImages.length} image(s) remaining`);
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
    
    // Validate rental specific fields
    if (form.transactionType === 'rent') {
      if (!form.securityDeposit) {
        setMessage('Security deposit is required for rental properties');
        setMessageType('error');
        return false;
      }
    }
    
    if (!form.bedrooms || !form.bathrooms) {
      setMessage('Bedrooms and bathrooms are required');
      setMessageType('error');
      return false;
    }
    
    if (!form.images || form.images.length === 0) {
      setMessage('At least one image is required');
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
    formData.append('transactionType', form.transactionType);
    formData.append('bedrooms', form.bedrooms);
    formData.append('bathrooms', form.bathrooms);
    if (form.size) formData.append('size', form.size);
    formData.append('type', form.type);
    formData.append('furnishingStatus', form.furnishingStatus);
    formData.append('description', form.description);
    formData.append('contactName', form.contactName);
    formData.append('contactPhone', form.contactPhone);
    formData.append('contactEmail', form.contactEmail);
    
    // Handle amenities
    if (form.amenities && form.amenities.length > 0) {
      form.amenities.forEach(amenity => {
        formData.append('amenities', amenity);
      });
    }
    
    // Handle pricing based on type
    if (form.priceType === 'fixed') {
      formData.append('price', form.price);
      formData.append('priceType', 'fixed');
    } else {
      formData.append('priceMin', form.priceMin);
      formData.append('priceMax', form.priceMax);
      formData.append('priceType', 'range');
    }
    
    // Handle rental specific fields
    if (form.transactionType === 'rent') {
      formData.append('rentPeriod', form.rentPeriod);
      formData.append('securityDeposit', form.securityDeposit);
    }

    // Append multiple images
    if (form.images && form.images.length > 0) {
      Array.from(form.images).forEach((image, index) => {
        formData.append('images', image);
      });
    }

    // Debug: Log what we're sending
    console.log('Form data being sent:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
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
        transactionType: 'rent',
        priceType: 'fixed',
        price: '',
        priceMin: '', 
        priceMax: '',
        rentPeriod: 'monthly',
        securityDeposit: '',
        bedrooms: '',
        bathrooms: '',
        size: '',
        type: 'apartment',
        furnishingStatus: 'unfurnished',
        amenities: [],
        description: '', 
        images: [],
        contactName: '',
        contactPhone: '',
        contactEmail: ''
      });
      
      // Reset file input
      const fileInput = document.querySelector('#images');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Property creation error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 403) {
        setMessage('❌ Access denied. Only Landlords, Developers, and Agents can add properties.');
      } else if (err.response?.status === 400) {
        setMessage(`❌ Validation Error: ${err.response.data.details || err.response.data.error || 'Invalid form data'}`);
      } else if (err.response?.status === 500) {
        setMessage(`❌ Server Error: ${err.response.data.details || 'Please try again later'}`);
      } else if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else if (err.response?.data?.error) {
        setMessage(`❌ ${err.response.data.error}`);
      } else if (err.message) {
        setMessage(`❌ ${err.message}`);
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

          {/* Transaction Type Selection */}
          <div className="form-group">
            <label htmlFor="transactionType">Transaction Type *</label>
            <select
              id="transactionType"
              name="transactionType"
              value={form.transactionType}
              onChange={handleChange}
              required
            >
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
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
              <label htmlFor="price">
                {form.transactionType === 'rent' ? 'Monthly Rent (KES) *' : 'Sale Price (KES) *'}
              </label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder={form.transactionType === 'rent' ? '65,000' : '5,000,000'}
                value={form.price}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          ) : (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priceMin">
                  {form.transactionType === 'rent' ? 'Min Rent (KES) *' : 'Min Price (KES) *'}
                </label>
                <input
                  id="priceMin"
                  type="number"
                  name="priceMin"
                  placeholder={form.transactionType === 'rent' ? '50,000' : '3,000,000'}
                  value={form.priceMin}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="priceMax">
                  {form.transactionType === 'rent' ? 'Max Rent (KES) *' : 'Max Price (KES) *'}
                </label>
                <input
                  id="priceMax"
                  type="number"
                  name="priceMax"
                  placeholder={form.transactionType === 'rent' ? '80,000' : '8,000,000'}
                  value={form.priceMax}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>
          )}

          {/* Rental Specific Fields */}
          {form.transactionType === 'rent' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rentPeriod">Rent Period *</label>
                  <select
                    id="rentPeriod"
                    name="rentPeriod"
                    value={form.rentPeriod}
                    onChange={handleChange}
                    required
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="securityDeposit">Security Deposit (KES) *</label>
                  <input
                    id="securityDeposit"
                    type="number"
                    name="securityDeposit"
                    placeholder="65,000"
                    value={form.securityDeposit}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>
            </>
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
                <option value="0">Studio (0 BR)</option>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="size">Size (Square Feet)</label>
              <input
                id="size"
                type="number"
                name="size"
                placeholder="1200"
                value={form.size}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="furnishingStatus">Furnishing Status</label>
              <select
                id="furnishingStatus"
                name="furnishingStatus"
                value={form.furnishingStatus}
                onChange={handleChange}
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="furnished">Fully Furnished</option>
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
              <option value="townhouse">Townhouse</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Amenities Section */}
          <div className="form-group">
            <label>Amenities (Select all that apply)</label>
            <div className="amenities-grid">
              {[
                { value: 'parking', label: 'Parking' },
                { value: 'gym', label: 'Gym' },
                { value: 'pool', label: 'Swimming Pool' },
                { value: 'security', label: '24/7 Security' },
                { value: 'garden', label: 'Garden' },
                { value: 'balcony', label: 'Balcony' },
                { value: 'elevator', label: 'Elevator' },
                { value: 'backup_power', label: 'Backup Power' },
                { value: 'water_supply', label: 'Water Supply' },
                { value: 'internet', label: 'Internet/WiFi' },
                { value: 'air_conditioning', label: 'Air Conditioning' },
                { value: 'heating', label: 'Heating' }
              ].map((amenity) => (
                <label key={amenity.value} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    value={amenity.value}
                    checked={form.amenities.includes(amenity.value)}
                    onChange={handleAmenityChange}
                  />
                  <span>{amenity.label}</span>
                </label>
              ))}
            </div>
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
                Choose Images (Max 5)
              </button>
              {form.images && form.images.length > 0 && (
                <div className="selected-files">
                  <p><strong>Selected Files:</strong></p>
                  <div className="selected-files-list">
                    {Array.from(form.images).map((file, index) => (
                      <div key={index} className="selected-file-item">
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => removeImage(index)}
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
