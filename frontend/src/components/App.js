import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import PostProperty from './pages/PostProperty';
import Listings from './pages/Listings';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/post-property" element={<PostProperty />} />
        <Route path="/listings" element={<Listings />} />
        <Route
          path="/"
          element={
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <h1>Welcome to NyumbaniConnect</h1>
              <p>Find your next home, rent, buy, or list your property with confidence.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
