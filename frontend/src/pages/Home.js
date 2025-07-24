import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/api';
import HeroSection from '../components/HeroSection';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await propertyService.getAll({ limit: 6 });
        setFeaturedProperties(response.properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const formatPrice = (property) => {
    const price = property.listingType === 'rent' 
      ? property.pricing.rentAmount 
      : property.pricing.salePrice;
    
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  const features = [
    {
      icon: 'icon-search',
      title: 'Smart Property Search',
      description: 'AI-powered search engine that learns your preferences and finds the perfect home matches across Kenya.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'icon-shield',
      title: 'Verified Listings Only',
      description: 'Every property and landlord undergoes rigorous verification to ensure authenticity and prevent fraud.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '�',
      title: 'Premium Experience',
      description: 'Enjoy white-glove service with dedicated support, virtual tours, and seamless booking process.',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: 'icon-mobile',
      title: 'Mobile-First Platform',
      description: 'Native mobile experience with offline search, instant notifications, and GPS-based recommendations.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: 'icon-lightning',
      title: 'Instant Connections',
      description: 'Connect directly with verified property owners and agents within minutes, not days.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: 'icon-trophy',
      title: 'Award-Winning Service',
      description: 'Recognized as Kenya\'s leading property platform with industry-leading customer satisfaction.',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="section-professional bg-neutral-50">
        <div className="container-professional">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-body-sm font-semibold mb-6 animate-scale-in">
              <span className="icon icon-star"></span>
              Why Choose SmartNyumba
            </div>
            <h2 className="text-display-lg font-display font-bold text-neutral-900 mb-6 animate-slide-up">
              Experience the Future of 
              <span className="gradient-text-professional block">Property Hunting in Kenya</span>
            </h2>
            <p className="text-body-lg text-neutral-600 max-w-3xl mx-auto animate-slide-up animate-delay-200">
              We've reimagined how Kenyans find and secure their perfect homes. Our platform combines cutting-edge 
              technology with local expertise to deliver an unmatched property experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card card-elevated p-8 text-center hover-lift animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} text-white text-2xl mb-6 animate-pulse-soft`}>
                  <span className={`icon ${feature.icon} icon-lg text-white`}></span>
                </div>
                <h3 className="text-heading-md text-neutral-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-body-md text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-professional bg-white">
        <div className="container-professional">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
            <div className="mb-8 lg:mb-0">
              <div className="inline-flex items-center gap-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full text-body-sm font-semibold mb-6 animate-scale-in">
                <span>🏆</span>
                Featured Properties
              </div>
              <h2 className="text-display-lg font-display font-bold text-neutral-900 mb-4 animate-slide-up">
                Handpicked Premium
                <span className="gradient-text-professional block">Properties</span>
              </h2>
              <p className="text-body-lg text-neutral-600 max-w-2xl animate-slide-up animate-delay-200">
                Discover our carefully curated selection of premium properties across Kenya's most desirable locations.
              </p>
            </div>
            <Link
              to="/properties"
              className="btn btn-secondary hover-scale focus-professional animate-slide-right"
            >
              <span className="icon icon-eye mr-2"></span>
              View All Properties
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="spinner-professional mx-auto mb-6"></div>
              <p className="text-body-lg text-neutral-600 font-medium">
                Loading premium properties...
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <div
                  key={property._id}
                  className="property-card-professional animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Property Image */}
                  <div className="h-64 bg-gradient-to-br from-primary-400 via-secondary-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="icon icon-home text-white" style={{fontSize: '4rem'}}></span>
                    </div>
                    
                    {/* Property Type Badge */}
                    <div className="absolute top-4 left-4 badge badge-premium">
                      {property.propertyType?.charAt(0).toUpperCase() + property.propertyType?.slice(1)}
                    </div>
                    
                    {/* Listing Type Badge */}
                    <div className={`absolute top-4 right-4 badge ${
                      property.listingType === 'rent' ? 'badge-info' : 'badge-success'
                    }`}>
                      {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                    </div>

                    {/* Verified Badge */}
                    <div className="absolute bottom-4 left-4 status-verified">
                      ✓ Verified
                    </div>
                  </div>
                  
                  <div className="p-6 relative z-10">
                    <h3 className="text-heading-md text-neutral-900 mb-3 hover:text-primary-600 transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                    
                    <p className="text-body-md text-neutral-600 mb-3 flex items-center gap-2">
                      <span className="icon icon-location icon-lg"></span>
                      <span className="font-medium">{property.location.area}, {property.location.county}</span>
                    </p>
                    
                    <p className="text-body-sm text-neutral-600 mb-6 line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <div className="text-2xl font-bold gradient-text-professional">
                          {formatPrice(property)}
                        </div>
                        {property.listingType === 'rent' && (
                          <div className="text-body-sm text-neutral-500">per month</div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="badge badge-info">
                          <span className="icon icon-bed mr-1"></span> {property.bedrooms}
                        </div>
                        <div className="badge badge-success">
                          <span className="icon icon-bath mr-1"></span> {property.bathrooms}
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to={`/properties/${property._id}`}
                      className="btn btn-primary w-full justify-center hover-scale focus-professional"
                    >
                      <span className="icon icon-eye mr-2"></span>
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-professional gradient-hero-professional text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="animate-float absolute top-10 left-1/4 text-4xl opacity-30">
            <span className="icon icon-star icon-2xl"></span>
          </div>
          <div className="animate-float absolute bottom-10 right-1/4 text-5xl opacity-30 animate-delay-300">
            <span className="icon icon-key icon-3xl"></span>
          </div>
          <div className="animate-float absolute top-1/2 left-10 text-3xl opacity-20 animate-delay-500">
            <span className="icon icon-home icon-xl"></span>
          </div>
        </div>
        
        <div className="container-professional text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-display-lg font-display font-bold mb-6 animate-slide-up">
              Ready to Find Your 
              <span className="block text-yellow-300">Dream Home?</span>
            </h2>
            <p className="text-body-lg mb-12 opacity-95 animate-slide-up animate-delay-200">
              Join thousands of satisfied Kenyans who found their perfect homes through SmartNyumba. 
              Start your journey to homeownership or find your ideal rental today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up animate-delay-400">
              <Link
                to="/register"
                className="btn btn-primary btn-lg bg-white text-primary-600 hover:bg-neutral-100 hover-scale focus-professional"
              >
                <span className="icon icon-target mr-3"></span>
                Start Your Search Today
              </Link>
              <Link
                to="/properties"
                className="btn btn-secondary btn-lg glass-professional border-white border-opacity-50 text-white hover:bg-white hover:text-primary-600 hover-scale focus-professional"
              >
                <span className="mr-3 text-xl">🔍</span>
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
