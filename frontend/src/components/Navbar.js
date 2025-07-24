import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import Logo from './Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  const navItems = [
    { path: '/', label: 'Home', icon: 'icon-home' },
    { path: '/properties', label: 'Properties', icon: 'icon-building' },
    { path: '/about', label: 'About', icon: 'icon-info' },
    { path: '/contact', label: 'Contact', icon: 'icon-envelope' },
    ...(isAuthenticated ? [{ path: '/dashboard', label: 'Dashboard', icon: 'icon-chart' }] : [])
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className={`navbar-professional ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container-professional">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="logo-container animate-slide-left">
            <Link to="/" className="hover-lift">
              <Logo size="default" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 animate-slide-down">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className={`icon ${item.icon} text-lg`}></span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-3 animate-slide-right">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="user-profile">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="status-online"></div>
                      <span className="text-body-sm font-semibold text-neutral-800">
                        {user?.firstName}
                      </span>
                    </div>
                    <div className="badge badge-success text-xs">
                      {user?.userType}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-auth btn-signin hover-scale focus-professional"
                >
                  <span className="icon icon-arrow-right"></span>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="btn-auth btn-signin hover-scale focus-professional"
                >
                  <span className="icon icon-key"></span>
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-auth btn-signup hover-scale focus-professional"
                >
                  <span className="icon icon-rocket"></span>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-all duration-200 focus-professional"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="mobile-menu p-6 mb-4 animate-slide-down">
            {/* Mobile Navigation Links */}
            <div className="space-y-2 mb-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-menu-item flex items-center gap-3 font-medium text-decoration-none
                    ${isActivePath(item.path) 
                      ? 'text-primary-700 bg-primary-50' 
                      : 'text-neutral-700 hover:text-primary-600'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className={`icon ${item.icon} text-xl`}></span>
                  {item.label}
                  {isActivePath(item.path) && (
                    <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-neutral-200 pt-6">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="status-online"></div>
                      <span className="text-body-sm font-medium text-neutral-700">
                        {user?.firstName} {user?.lastName}
                      </span>
                    </div>
                    <div className="badge badge-success">
                      {user?.userType}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full btn btn-secondary justify-center"
                  >
                    <span className="icon icon-arrow-right mr-2"></span>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="w-full btn btn-secondary justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="icon icon-key mr-2"></span>
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full btn btn-primary justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="icon icon-rocket mr-2"></span>
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
