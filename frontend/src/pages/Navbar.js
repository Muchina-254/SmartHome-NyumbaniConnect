import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <h1>NyumbaniConnect</h1>
      <div className="dropdown">
        <button className="dropbtn" onClick={() => setOpen(!open)}>
          ☰ Menu
        </button>
        {open && (
          <div className="dropdown-content">
            {!user && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
            {user && <button onClick={onLogout}>Logout</button>}
            <Link to="/">About Us</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
