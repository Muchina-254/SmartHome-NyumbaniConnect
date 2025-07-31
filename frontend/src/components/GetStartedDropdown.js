import React, { useState } from "react";
import "./GetStartedDropdown.css";
import { Link } from "react-router-dom";

const GetStartedDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={() => setOpen(!open)}>
        Get Started ⬇
      </button>
      {open && (
        <div className="dropdown-menu">
          <Link to="/login" className="dropdown-item">Login</Link>
          <Link to="/register" className="dropdown-item">Register</Link>
          <Link to="/about" className="dropdown-item">About Us</Link>
          <Link to="/logout" className="dropdown-item">Logout</Link>
        </div>
      )}
    </div>
  );
};

export default GetStartedDropdown;

