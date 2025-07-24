import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="section-lg-professional gradient-hero-professional text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="animate-float absolute top-20 left-10 text-6xl opacity-20">
          <span className="icon icon-home icon-3xl"></span>
        </div>
        <div className="animate-float absolute top-32 right-20 text-4xl opacity-20 animate-delay-300">
          <span className="icon icon-star icon-2xl"></span>
        </div>
        <div className="animate-float absolute bottom-20 left-1/4 text-5xl opacity-20 animate-delay-500">
          <span className="icon icon-key icon-3xl"></span>
        </div>
        <div className="animate-float absolute bottom-32 right-1/3 text-3xl opacity-20 animate-delay-200">
          <span className="icon icon-star icon-xl"></span>
        </div>
        <div className="animate-float absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl opacity-10 animate-delay-400">
          <span className="icon icon-building icon-lg"></span>
        </div>
      </div>

      <div className="container-professional relative z-10">
        <div className="hero-content text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm border border-white border-opacity-50 rounded-full px-6 py-3 mb-8 animate-scale-in">
            <span className="status-verified"></span>
            <span className="text-body-sm font-semibold">
              Kenya's #1 Trusted Property Platform
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title text-display-2xl font-display font-bold mb-8 animate-slide-up">
            Find Your Perfect
            <span className="block text-yellow-300 animate-delay-200">
              Kenyan Home
            </span>
          </h1>

          {/* Subheading */}
          <p className="hero-subtitle text-body-lg mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up animate-delay-300">
            SmartNyumba connects you with verified properties, trusted landlords, and quality rental solutions 
            across all 47 counties in Kenya. Experience safe, transparent, and mobile-first property hunting.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-slide-up animate-delay-400">
            <Link
              to="/properties"
              className="btn btn-primary btn-lg hover-scale focus-professional"
            >
              <span className="icon icon-search mr-3"></span>
              Explore Properties
            </Link>
            <Link
              to="/register"
              className="btn btn-secondary btn-lg glass-professional border-white border-opacity-50 text-white hover:bg-white hover:text-primary-600 hover-scale focus-professional"
            >
              <span className="icon icon-rocket mr-3"></span>
              Start Your Journey
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up animate-delay-500">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-body-sm opacity-90">Verified Properties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">47</div>
              <div className="text-body-sm opacity-90">Counties Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">5K+</div>
              <div className="text-body-sm opacity-90">Happy Tenants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24hr</div>
              <div className="text-body-sm opacity-90">Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
