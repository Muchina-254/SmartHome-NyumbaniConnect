import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = ({ user: currentUser, setUser: setCurrentUser }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const roles = ['Tenant', 'Landlord', 'Developer', 'Agent'];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { user: userData, stats } = response.data;
      setUser({ ...userData, stats });
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Failed to load profile data');
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // Validation
    if (!formData.name.trim()) {
      setMessage('Name is required');
      setMessageType('error');
      return;
    }
    
    if (!formData.email.trim()) {
      setMessage('Email is required');
      setMessageType('error');
      return;
    }
    
    if (!formData.phone.trim()) {
      setMessage('Phone is required');
      setMessageType('error');
      return;
    }

    // Password validation if changing password
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setMessage('Current password is required to change password');
        setMessageType('error');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage('New passwords do not match');
        setMessageType('error');
        return;
      }
      if (formData.newPassword.length < 6) {
        setMessage('New password must be at least 6 characters long');
        setMessageType('error');
        return;
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      };

      // Only include password fields if changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put('http://localhost:5000/api/auth/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage with new user data
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser({ ...updatedUser, stats: user.stats });
      
      // Update parent component's user state
      if (setCurrentUser) {
        setCurrentUser(updatedUser);
      }
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setMessage('Profile updated successfully!');
      setMessageType('success');
      setEditing(false);
      setLoading(false);

      // Reload page to update navbar
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setEditing(false);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-title">
            <h2>{user?.name}</h2>
            <span className={`role-badge ${user?.role?.toLowerCase()}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!editing}
                className={editing ? 'editing' : 'readonly'}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!editing}
                className={editing ? 'editing' : 'readonly'}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!editing}
                className={editing ? 'editing' : 'readonly'}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={!editing}
                className={editing ? 'editing' : 'readonly'}
                required
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {editing && (
                <small className="help-text">
                  Choose your account type: Tenant (rent properties), Landlord (own properties), 
                  Developer (develop properties), or Agent (sell/manage properties)
                </small>
              )}
            </div>
          </div>

          {editing && (
            <div className="form-section">
              <h3>Change Password (Optional)</h3>
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </form>

        <div className="profile-stats">
          <h3>Account Details</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Updated</span>
              <span className="stat-value">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Account Status</span>
              <span className="stat-value status-active">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
