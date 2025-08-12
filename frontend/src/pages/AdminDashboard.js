import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch admin dashboard data
      const [propertiesRes, usersRes, dashboardRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/properties', { headers }),
        axios.get('http://localhost:5000/api/admin/users', { headers }),
        axios.get('http://localhost:5000/api/admin/dashboard', { headers })
      ]);

      setProperties(propertiesRes.data);
      setUsers(usersRes.data);
      setStatistics(dashboardRes.data.statistics);
      setLoading(false);
    } catch (error) {
      console.error('Admin data fetch error:', error);
      alert('Access denied. Admin privileges required.');
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
      alert(isVerified ? 'Property unverified successfully' : 'Property verified successfully');
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>🛡️ Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{statistics.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Properties</h3>
          <p className="stat-number">{statistics.totalProperties || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Verified Properties</h3>
          <p className="stat-number verified">{statistics.verifiedProperties || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Verification</h3>
          <p className="stat-number pending">{statistics.pendingProperties || 0}</p>
        </div>
      </div>

      {/* Property Management */}
      <div className="admin-section">
        <h2> Property Management</h2>
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
                  <td>KES {property.price?.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${property.verified ? 'verified' : 'pending'}`}>
                      {property.verified ? '✅ Verified' : '⏳ Pending'}
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

      {/* User Management */}
      <div className="admin-section">
        <h2> User Management</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
