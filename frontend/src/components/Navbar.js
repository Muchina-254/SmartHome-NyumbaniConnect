import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, setUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    // Force page reload to ensure clean state
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 100);
  };

  const canManageProperties = (user) => {
    return user && ['Landlord', 'Developer', 'Agent'].includes(user.role);
  };

  const isAdmin = (user) => {
    return user && user.role === 'Admin';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">NyumbaniConnect</Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/listings" className="nav-link">Listings</Link>
        {canManageProperties(user) && (
          <>
            <Link to="/my-listings" className="nav-link">My Properties</Link>
            <Link to="/add" className="nav-link">Add Property</Link>
          </>
        )}
        {isAdmin(user) && (
          <Link to="/admin" className="nav-link" style={{color: '#fbbf24'}}>Admin Panel</Link>
        )}
      </div>

      <div className="navbar-right">
        {user && (
          <span className="welcome">
            Welcome, {user.name?.split(' ')[0]} ({user.role})
          </span>
        )}

        {user ? (
          // When user is logged in: Show only Logout button
          <button onClick={handleLogout} className="nav-link logout-btn">
              Logout
          </button>
        ) : (
          // When user is NOT logged in: Show Get Started dropdown
          <div className="dropdown">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-btn">
              Get Started ▾
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/login" className="dropdown-item"> Login</Link>
                <Link to="/register" className="dropdown-item"> Register</Link>
                <Link to="/about" className="dropdown-item">ℹ️ About Us</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
