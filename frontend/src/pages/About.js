import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="section-lg-professional">
      <div className="container-professional">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-6 py-3 mb-8 animate-scale-in">
            <span className="icon icon-star text-primary-600"></span>
            <span className="text-body-sm font-semibold text-primary-700">
              About SmartNyumba
            </span>
          </div>
          
          <h1 className="text-display-xl font-display font-bold text-neutral-900 mb-8 animate-slide-up">
            Kenya's Premier Property Platform
          </h1>
          
          <p className="text-body-lg text-neutral-600 leading-relaxed animate-slide-up animate-delay-200">
            SmartNyumba is revolutionizing the property market in Kenya by connecting verified properties, 
            trusted landlords, and quality tenants across all 47 counties.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="animate-slide-left">
            <div className="icon icon-target text-8xl text-primary-500 mb-8"></div>
            <h2 className="text-heading-xl font-display font-bold text-neutral-900 mb-6">
              Our Mission
            </h2>
            <p className="text-body-lg text-neutral-600 mb-6 leading-relaxed">
              To make property hunting safe, transparent, and efficient for all Kenyans. 
              We believe everyone deserves access to quality, verified properties with transparent pricing.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="icon icon-verified text-success-500 text-xl"></span>
                <span className="text-body-md text-neutral-700">100% Verified Properties</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="icon icon-shield text-primary-500 text-xl"></span>
                <span className="text-body-md text-neutral-700">Secure Transactions</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="icon icon-lightning text-warning-500 text-xl"></span>
                <span className="text-body-md text-neutral-700">24/7 Customer Support</span>
              </li>
            </ul>
          </div>
          
          <div className="animate-slide-right">
            <div className="glass-professional p-12 rounded-xl">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
                  <div className="text-body-sm text-neutral-600">Verified Properties</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">47</div>
                  <div className="text-body-sm text-neutral-600">Counties Covered</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">5K+</div>
                  <div className="text-body-sm text-neutral-600">Happy Clients</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">24hr</div>
                  <div className="text-body-sm text-neutral-600">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-heading-xl font-display font-bold text-neutral-900 mb-6">
              Why Choose SmartNyumba?
            </h2>
            <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Experience the difference with Kenya's most trusted property platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-professional p-8 rounded-xl text-center animate-slide-up">
              <div className="icon icon-mobile text-6xl text-primary-500 mb-6"></div>
              <h3 className="text-heading-md font-bold text-neutral-900 mb-4">Mobile-First Design</h3>
              <p className="text-body-md text-neutral-600 leading-relaxed">
                Optimized for mobile users with intuitive navigation and fast loading speeds
              </p>
            </div>
            
            <div className="glass-professional p-8 rounded-xl text-center animate-slide-up animate-delay-200">
              <div className="icon icon-verified text-6xl text-success-500 mb-6"></div>
              <h3 className="text-heading-md font-bold text-neutral-900 mb-4">Verified Listings</h3>
              <p className="text-body-md text-neutral-600 leading-relaxed">
                Every property is verified by our team to ensure authenticity and quality
              </p>
            </div>
            
            <div className="glass-professional p-8 rounded-xl text-center animate-slide-up animate-delay-400">
              <div className="icon icon-lightning text-6xl text-warning-500 mb-6"></div>
              <h3 className="text-heading-md font-bold text-neutral-900 mb-4">Quick Connections</h3>
              <p className="text-body-md text-neutral-600 leading-relaxed">
                Connect with property owners instantly through our secure messaging system
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center glass-professional p-12 rounded-xl animate-slide-up">
          <h2 className="text-heading-xl font-display font-bold text-neutral-900 mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-body-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who found their dream properties through SmartNyumba
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="btn btn-primary btn-lg hover-scale focus-professional"
            >
              <span className="icon icon-search mr-3"></span>
              Browse Properties
            </Link>
            <Link
              to="/register"
              className="btn btn-secondary btn-lg hover-scale focus-professional"
            >
              <span className="icon icon-rocket mr-3"></span>
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
