import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus(null);
    setErrorMessage('');
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setSubmitStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      console.log('Contact form response:', response.data);

      if (response.data.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }

    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setErrorMessage(error.response.data.errors.join(', '));
      } else if (error.message === 'Network Error') {
        setErrorMessage('Network error. Please check if the server is running.');
      } else {
        setErrorMessage('Failed to send message. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with us for any inquiries about properties or our services</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h3>Get In Touch</h3>
          <div className="info-item">
            <span className="info-icon">📧</span>
            <div>
              <strong>Email</strong>
              <p>info@nyumbaniconnect.com</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📱</span>
            <div>
              <strong>Phone</strong>
              <p>+254 700 123 456</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <strong>Address</strong>
              <p>123 Uhuru Highway<br />Nairobi, Kenya</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🕒</span>
            <div>
              <strong>Business Hours</strong>
              <p>Mon - Fri: 8:00 AM - 6:00 PM<br />Sat: 9:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          {submitStatus === 'success' && (
            <div className="success-message">
              <p>✅ Your message has been sent successfully! We will get back to you soon.</p>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="error-message">
              <p>❌ {errorMessage}</p>
            </div>
          )}
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Send us a Message</h3>
            
            <div className="form-row">
              <input 
                type="text" 
                name="name"
                placeholder="Your Name *" 
                value={formData.name}
                onChange={handleChange}
                required 
                disabled={isSubmitting}
              />
              
              <input 
                type="email" 
                name="email"
                placeholder="Your Email *" 
                value={formData.email}
                onChange={handleChange}
                required 
                disabled={isSubmitting}
              />
            </div>
            
            <input 
              type="text" 
              name="subject"
              placeholder="Subject (Optional)" 
              value={formData.subject}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            
            <textarea 
              name="message"
              placeholder="Your Message *" 
              rows="6" 
              value={formData.message}
              onChange={handleChange}
              required 
              disabled={isSubmitting}
            />
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
