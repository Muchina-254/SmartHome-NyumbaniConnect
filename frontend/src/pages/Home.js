import React from "react";
import GetStartedDropdown from "../components/GetStartedDropdown";
import FeaturesSection from "../components/FeaturesSection";
import FeaturedListings from "../components/FeaturedListings";
import "../components/GetStartedDropdown.css";
import "./PageStyles.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Top navigation bar */}
      <div className="top-bar">
        <h1 className="site-title">NyumbaniConnect</h1>
        <GetStartedDropdown />
      </div>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-text">
          <h2>Find Your Perfect Home</h2>
          <p>Connecting tenants, landlords, developers, and agents seamlessly.</p>
        </div>
      </header>

      {/* What We Offer */}
      <section className="section offer-section">
        <h2>What We Offer</h2>
        <FeaturesSection />
      </section>

      {/* Why Choose Us */}
      <section className="section why-us-section">
        <h2>Why Choose NyumbaniConnect?</h2>
        <ul className="reasons-list">
          <li>✅ Reduced Tenant Fraud</li>
          <li>✅ Faster Vacancy Fill for Landlords</li>
          <li>✅ Developers Reach Buyers Easily</li>
        </ul>
      </section>

      {/* Featured Listings */}
      <section className="section featured-listings-section">
        <h2>Featured Listings</h2>
        <div className="scroll-container">
          <FeaturedListings />
        </div>
      </section>
    </div>
  );
};

export default Home;
