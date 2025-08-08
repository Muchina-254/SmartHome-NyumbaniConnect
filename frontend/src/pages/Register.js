import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Tenant'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.role) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    // Phone validation (basic)
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccess(res.data.message);
      setError('');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'Tenant'
      });
    } catch (err) {
      console.error('Registration error:', err);
      setSuccess('');
      
      if (err.response) {
        // Server responded with error status
        const errorMsg = err.response.data?.error || 'Registration failed. Please try again.';
        setError(errorMsg);
      } else if (err.request) {
        // Request was made but no response received
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="form-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="Tenant">Tenant</option>
          <option value="Landlord">Landlord</option>
          <option value="Developer">Developer</option>
          <option value="Agent">Agent</option>
        </select>

        <button type="submit">Register</button>
        <div className="login-link">Already have an account? <a href="/login">Login</a></div>
      </form>
    </div>
  );
};

export default Register;
