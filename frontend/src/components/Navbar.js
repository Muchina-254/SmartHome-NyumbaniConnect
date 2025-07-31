import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaUser, FaUserPlus, FaSignOutAlt, FaInfoCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">NyumbaniConnect</div>
      <div className="dropdown">
        <button className="dropbtn">Get Started ▾</button>
        <div className="dropdown-content">
          <Link to="/login"><FaUser /> Login</Link>
          <Link to="/register"><FaUserPlus /> Register</Link>
          <Link to="/about"><FaInfoCircle /> About Us</Link>
          <Link to="/logout"><FaSignOutAlt /> Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
