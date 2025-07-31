import React from "react";
import "./FeaturesSection.css";

const FeaturesSection = () => {
  return (
    <div className="features-container">
      <h2>Why Choose NyumbaniConnect?</h2>
      <div className="feature-cards">
        <div className="feature-card">
          <h3>🚫 Tenant Fraud</h3>
          <p>We verify property listings to protect tenants from fake landlords or agents.</p>
        </div>
        <div className="feature-card">
          <h3>📉 High Vacancy Periods</h3>
          <p>Landlords get instant access to a pool of trusted tenants and real-time inquiries.</p>
        </div>
        <div className="feature-card">
          <h3>🏗️ Difficult Developer Sales</h3>
          <p>Developers can showcase units with images and 3D tours, reaching buyers directly.</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
