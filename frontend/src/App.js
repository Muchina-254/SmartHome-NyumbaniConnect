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
import PropertyDetail from './pages/PropertyDetail';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  
  // Helper function to check if user can manage properties
  const canManageProperties = (user) => {
    return user && ['Landlord', 'Developer', 'Agent'].includes(user.role);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch {
        // Fallback to JWT decode if user data not in localStorage
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/property/:id" element={<PropertyDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
