import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from '../components/Logo';
import './AdminDashboard.css';
import '../components/Logo.css';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [contactStats, setContactStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Toast notification system
  const showNotification = (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch admin dashboard data
      const [propertiesRes, usersRes, dashboardRes, contactsRes, contactStatsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/properties', { headers }),
        axios.get('http://localhost:5000/api/admin/users', { headers }),
        axios.get('http://localhost:5000/api/admin/dashboard', { headers }),
        axios.get('http://localhost:5000/api/contact', { headers }),
        axios.get('http://localhost:5000/api/contact/stats/summary', { headers })
      ]);

      setProperties(propertiesRes.data);
      setUsers(usersRes.data);
      setStatistics(dashboardRes.data.statistics);
      setContacts(contactsRes.data.data);
      setContactStats(contactStatsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Admin data fetch error:', error);
      showNotification('Access denied. Admin privileges required.', 'error');
      setLoading(false);
    }
  };

  const handleVerifyProperty = async (propertyId, isVerified) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isVerified ? 'unverify' : 'verify';
      const data = isVerified ? { reason: 'Admin verification review' } : {};

      await axios.patch(
        `http://localhost:5000/api/admin/properties/${propertyId}/${endpoint}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh properties list
      fetchAdminData();
      showNotification(
        isVerified ? 'Property unverified successfully' : 'Property verified successfully',
        'success'
      );
    } catch (error) {
      console.error('Verification error:', error);
      showNotification('Verification failed. Please try again.', 'error');
    }
  };

  const handleViewContact = async (contactId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/contact/${contactId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedContact(response.data.data);
      setShowContactModal(true);
    } catch (error) {
      console.error('Error fetching contact:', error);
      showNotification('Failed to fetch contact details', 'error');
    }
  };

  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/contact/${contactId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh contact data
      fetchAdminData();
      showNotification(`Contact marked as ${status}`, 'success');
      setShowContactModal(false);
    } catch (error) {
      console.error('Error updating contact status:', error);
      showNotification('Failed to update contact status', 'error');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/contact/${contactId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh contact data
      fetchAdminData();
      showNotification('Contact message deleted successfully', 'success');
      setShowContactModal(false);
    } catch (error) {
      console.error('Error deleting contact:', error);
      showNotification('Failed to delete contact message', 'error');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  const sidebarTabs = [
    { id: 'overview', icon: 'dashboard', label: 'Overview', count: null },
    { id: 'properties', icon: 'home', label: 'Properties', count: statistics.totalProperties },
    { id: 'messages', icon: 'mail', label: 'Messages', count: contactStats.unread },
    { id: 'users', icon: 'users', label: 'Users', count: statistics.totalUsers },
    { id: 'analytics', icon: 'chart', label: 'Analytics', count: null },
  ];

  const renderOverviewContent = () => (
    <div className="admin-content overview-content">
      <div className="content-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome to the admin dashboard. Here's a summary of your platform.</p>
      </div>

      {/* Statistics Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon users"></div>
          <h3>Total Users</h3>
          <p className="stat-number">{statistics.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon home"></div>
          <h3>Total Properties</h3>
          <p className="stat-number">{statistics.totalProperties || 0}</p>
        </div>
        <div className="stat-card verified">
          <div className="stat-icon check"></div>
          <h3>Verified Properties</h3>
          <p className="stat-number verified">{statistics.verifiedProperties || 0}</p>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon clock"></div>
          <h3>Pending Verification</h3>
          <p className="stat-number pending">{statistics.pendingProperties || 0}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon mail"></div>
          <h3>Contact Messages</h3>
          <p className="stat-number">{contactStats.total || 0}</p>
        </div>
        <div className="stat-card unread">
          <div className="stat-icon notification"></div>
          <h3>Unread Messages</h3>
          <p className="stat-number unread">{contactStats.unread || 0}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            className="action-btn properties"
            onClick={() => setActiveTab('properties')}
          >
            <span className="action-icon home"></span>
            <span>Manage Properties</span>
          </button>
          <button 
            className="action-btn messages"
            onClick={() => setActiveTab('messages')}
          >
            <span className="action-icon mail"></span>
            <span>View Messages ({contactStats.unread || 0})</span>
          </button>
          <button 
            className="action-btn users"
            onClick={() => setActiveTab('users')}
          >
            <span className="action-icon users"></span>
            <span>Manage Users</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPropertiesContent = () => (
    <div className="admin-content">
      <div className="content-header">
        <h2>Property Management</h2>
        <p>Manage and verify property listings on your platform.</p>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Owner</th>
              <th>Location</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(property => (
              <tr key={property._id}>
                <td>
                  <div className="property-info">
                    <strong>{property.title}</strong>
                    <br />
                    <small>{property.description?.substring(0, 50)}...</small>
                  </div>
                </td>
                <td>
                  <div className="owner-info">
                    <strong>{property.user?.name || 'Unknown'}</strong>
                    <br />
                    <small>{property.user?.role || 'N/A'}</small>
                  </div>
                </td>
                <td>{property.location}</td>
                <td>
                  {property.priceType === 'range' 
                    ? `KSh ${property.priceMin?.toLocaleString()} - ${property.priceMax?.toLocaleString()}`
                    : `KSh ${property.price?.toLocaleString()}`
                  }
                </td>
                <td>
                  <span className={`status-badge ${property.verified ? 'verified' : 'pending'}`}>
                    {property.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td>
                  <button
                    className={`admin-btn ${property.verified ? 'unverify-btn' : 'verify-btn'}`}
                    onClick={() => handleVerifyProperty(property._id, property.verified)}
                  >
                    {property.verified ? 'Unverify' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMessagesContent = () => (
    <div className="admin-content">
      <div className="content-header">
        <h2>Contact Messages</h2>
        <p>View and manage contact messages from users.</p>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message Preview</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact._id} className={!contact.isRead ? 'unread' : ''}>
                <td><strong>{contact.name}</strong></td>
                <td>{contact.email}</td>
                <td>{contact.subject || 'No Subject'}</td>
                <td>
                  <div className="message-preview">
                    {contact.message?.substring(0, 80)}
                    {contact.message?.length > 80 && '...'}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${contact.status || 'new'}`}>
                    {!contact.isRead ? 'New' : contact.status === 'replied' ? 'Replied' : contact.status === 'resolved' ? 'Resolved' : 'Read'}
                  </span>
                </td>
                <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="admin-btn view-btn"
                    onClick={() => handleViewContact(contact._id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsersContent = () => (
    <div className="admin-content">
      <div className="content-header">
        <h2>User Management</h2>
        <p>Manage registered users and their roles.</p>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Properties</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className="property-count">
                    {properties.filter(p => p.user?._id === user._id).length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalyticsContent = () => (
    <div className="admin-content">
      <div className="content-header">
        <h2>Analytics</h2>
        <p>View platform analytics and insights.</p>
      </div>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>User Growth</h3>
          <div className="coming-soon-badge">Coming Soon</div>
          <p>Track user registration trends over time.</p>
        </div>
        <div className="analytics-card">
          <h3>Property Trends</h3>
          <div className="coming-soon-badge">Coming Soon</div>
          <p>Monitor property listing and verification rates.</p>
        </div>
        <div className="analytics-card">
          <h3>Geographic Distribution</h3>
          <div className="coming-soon-badge">Coming Soon</div>
          <p>See where your properties and users are located.</p>
        </div>
        <div className="analytics-card">
          <h3>Revenue Analytics</h3>
          <div className="coming-soon-badge">Coming Soon</div>
          <p>Track platform revenue and growth metrics.</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'properties':
        return renderPropertiesContent();
      case 'messages':
        return renderMessagesContent();
      case 'users':
        return renderUsersContent();
      case 'analytics':
        return renderAnalyticsContent();
      default:
        return renderOverviewContent();
    }
  };
  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            {!sidebarCollapsed && <span>Admin Panel</span>}
            <button 
              className="collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarTabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={sidebarCollapsed ? tab.label : ''}
            >
              <span className={`tab-icon ${tab.icon}`}></span>
              {!sidebarCollapsed && (
                <>
                  <span className="tab-label">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="tab-count">{tab.count}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {renderContent()}
      </div>

      {/* Contact Message Modal */}
      {showContactModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contact Message</h3>
              <button 
                className="close-btn"
                onClick={() => setShowContactModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="contact-details">
                <div className="detail-row">
                  <strong>Name:</strong> {selectedContact.name}
                </div>
                <div className="detail-row">
                  <strong>Email:</strong> 
                  <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                </div>
                <div className="detail-row">
                  <strong>Subject:</strong> {selectedContact.subject || 'No Subject'}
                </div>
                <div className="detail-row">
                  <strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}
                </div>
                <div className="detail-row">
                  <strong>Status:</strong> 
                  <span className={`status-badge ${selectedContact.status || 'new'}`}>
                    {selectedContact.status || 'new'}
                  </span>
                </div>
              </div>

              <div className="message-content">
                <h4>Message:</h4>
                <div className="message-text">
                  {selectedContact.message}
                </div>
              </div>

              {selectedContact.adminNotes && (
                <div className="admin-notes">
                  <h4>Admin Notes:</h4>
                  <div className="notes-text">
                    {selectedContact.adminNotes}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <div className="status-buttons">
                <button 
                  className="admin-btn read-btn"
                  onClick={() => handleUpdateContactStatus(selectedContact._id, 'read')}
                >
                  Mark as Read
                </button>
                <button 
                  className="admin-btn replied-btn"
                  onClick={() => handleUpdateContactStatus(selectedContact._id, 'replied')}
                >
                  Mark as Replied
                </button>
                <button 
                  className="admin-btn resolved-btn"
                  onClick={() => handleUpdateContactStatus(selectedContact._id, 'resolved')}
                >
                  Mark as Resolved
                </button>
                <button 
                  className="admin-btn delete-btn"
                  onClick={() => handleDeleteContact(selectedContact._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`toast toast-${notification.type}`}
          >
            <div className="toast-content">
              <span className={`toast-icon toast-icon-${notification.type}`}></span>
              <span className="toast-message">{notification.message}</span>
            </div>
            <button 
              className="toast-close"
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
