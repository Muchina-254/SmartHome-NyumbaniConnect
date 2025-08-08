import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About NyumbaniConnect</h1>
        <p>Your Trusted Property & Tenant Solution Platform</p>
      </div>

      <div className="about-content">
        <p>
          At <strong>NyumbaniConnect</strong>, we simplify the way people rent, sell, or find housing solutions in Kenya.
          Whether you’re a landlord, tenant, property developer, or service provider, our platform connects you securely and conveniently.
        </p>

        <div className="about-grid">
          <div className="about-box">
            <h3>🏠 Landlords</h3>
            <p>List your properties, manage vacancies, and connect with verified tenants in one place.</p>
          </div>
          <div className="about-box">
            <h3>👨‍💼 Tenants</h3>
            <p>Search for safe, verified properties and connect easily with genuine property owners.</p>
          </div>
          <div className="about-box">
            <h3>🏗 Developers</h3>
            <p>Showcase properties for sale with full details, reach serious buyers, and streamline sales.</p>
          </div>
          <div className="about-box">
            <h3>🔌 Service Providers</h3>
            <p>Offer services like internet, water, or household products to new tenants and homes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
