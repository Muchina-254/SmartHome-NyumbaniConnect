import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar-blur fixed w-full top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center animate-slide-in-left">
            <Link to="/" className="flex items-center group">
              <div className="text-3xl animate-bounce-custom">🏠</div>
              <span className="ml-3 text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-300">
                SmartNyumba
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 animate-fade-in-down">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 hover:scale-110 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/properties" 
              className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 hover:scale-110 relative group"
            >
              Properties
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 hover:scale-110 relative group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4 animate-slide-in-right">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="glass px-4 py-2 rounded-full">
                  <span className="text-gray-700 font-medium">
                    Welcome, {user?.firstName}! ✨
                  </span>
                </div>
                <span className="px-3 py-1 bg-gradient-primary text-white text-sm rounded-full font-medium animate-pulse-custom">
                  {user?.userType}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-medium transition-all duration-300 hover:scale-110"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-modern"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600 transition-colors duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-fade-in-down">
            <div className="glass px-2 pt-2 pb-3 space-y-1 mt-2 rounded-lg">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link
                to="/properties"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏢 Properties
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
              )}
              
              <div className="pt-2 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <span className="text-sm text-gray-600">Welcome, {user?.firstName}!</span>
                      <span className="block px-2 py-1 bg-gradient-primary text-white text-xs rounded-full text-center mt-1">
                        {user?.userType}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block mx-3 py-2 bg-gradient-primary text-white text-center rounded-lg font-medium transition-all duration-300 hover:scale-105"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
