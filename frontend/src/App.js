import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import WhyChooseUs from './components/WhyChooseUs';
import FeaturedListings from './components/FeaturedListings';
import WhatWeOffer from './components/WhatWeOffer';
import Contact from './components/Contact';
import Footer from './components/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Listings from './pages/Listings';
import MyListings from './pages/MyListings';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import PropertyDetail from './pages/PropertyDetail';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Helper function to check if user can manage properties
  const canManageProperties = (user) => {
    return user && ['Landlord', 'Developer', 'Agent'].includes(user.role);
  };

  // Function to validate token
  const validateToken = async (token) => {
    try {
      // First check if token is expired
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        console.log('Token has expired');
        return null;
      }

      // Try to verify token with backend (optional - fallback if server is down)
      try {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          return data.user;
        } else {
          console.log('Backend token validation failed, using client-side validation');
        }
      } catch (serverError) {
        console.log('Server not available, using client-side token validation');
      }

      // Fallback: if server validation fails but token is not expired, 
      // use the stored user data (client-side validation)
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch {
          return null;
        }
      }

      return null;
    } catch (error) {
      console.log('Token validation error:', error);
      return null;
    }
  };

  // Clear invalid session
  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // First try to parse stored user data
          const parsedUser = JSON.parse(userData);
          
          // Validate the token
          const validatedUser = await validateToken(token);
          
          if (validatedUser) {
            // Token is valid, use the validated user data
            setUser(validatedUser);
            // Update localStorage with fresh user data
            localStorage.setItem('user', JSON.stringify(validatedUser));
          } else {
            // Token is invalid, clear session
            console.log('Invalid token, clearing session');
            clearSession();
          }
        } catch (error) {
          console.log('Error parsing user data:', error);
          // If user data is corrupted, try validating token only
          const validatedUser = await validateToken(token);
          if (validatedUser) {
            setUser(validatedUser);
            localStorage.setItem('user', JSON.stringify(validatedUser));
          } else {
            clearSession();
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
    
    // Listen for localStorage changes (for tab synchronization)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            const parsedUser = JSON.parse(e.newValue);
            setUser(parsedUser);
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else if (e.key === 'token' && !e.newValue) {
        // Token was removed in another tab
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      {isLoading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh', 
          fontSize: '18px' 
        }}>
          Loading...
        </div>
      ) : (
        <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Features />
              <WhyChooseUs />
              <FeaturedListings />
              <WhatWeOffer />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/about" element={<About />} />
        <Route path="/listings" element={<Listings />} />
        <Route 
          path="/my-listings" 
          element={
            canManageProperties(user) ? <MyListings /> : 
            user ? <Navigate to="/" /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/add" 
          element={
            canManageProperties(user) ? <AddProperty /> : 
            user ? <Navigate to="/" /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/edit/:id" 
          element={
            canManageProperties(user) ? <EditProperty /> : 
            user ? <Navigate to="/" /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/admin" 
          element={
            user?.role === 'Admin' ? <AdminDashboard /> : 
            user ? <Navigate to="/" /> : <Navigate to="/login" />
          } 
        />
        <Route path="/property/:id" element={<PropertyDetail />} />
      </Routes>
      )}
    </Router>
  );
}

export default App;
