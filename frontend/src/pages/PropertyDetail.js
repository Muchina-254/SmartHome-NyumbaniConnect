import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../services/api';
import toast from 'react-hot-toast';
import PropertyContactModal from '../components/PropertyContactModal';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await propertyService.getById(id);
      setProperty(response);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Property not found');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-professional mx-auto mb-6"></div>
          <p className="text-body-lg text-neutral-600 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="icon icon-home text-8xl mb-6 text-neutral-400"></div>
          <h1 className="text-heading-xl text-neutral-900 mb-4">Property Not Found</h1>
          <p className="text-body-lg text-neutral-600 mb-8">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/properties" className="btn btn-primary hover-scale focus-professional">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
      
      <div className="section-professional">
        <div className="container-professional">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-body-sm text-neutral-600">
              <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
              <span>→</span>
              <Link to="/properties" className="hover:text-primary-600 transition-colors">Properties</Link>
              <span>→</span>
              <span className="text-neutral-900 font-medium">Property Details</span>
            </nav>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Image */}
              <div className="card overflow-hidden animate-slide-up">
                <div className="h-96 gradient-hero-professional flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <span className="icon icon-home text-8xl z-10 text-white"></span>
                  
                  {/* Property Type Badge */}
                  <div className="absolute top-6 left-6 badge badge-premium">
                    {property.propertyType?.charAt(0).toUpperCase() + property.propertyType?.slice(1)}
                  </div>
                  
                  {/* Listing Type Badge */}
                  <div className={`absolute top-6 right-6 badge ${
                    property.listingType === 'rent' ? 'badge-info' : 'badge-success'
                  }`}>
                    {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute bottom-6 left-6 status-verified">
                    <span className="icon icon-verified mr-1"></span>
                    Verified Property
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="card p-8 animate-slide-up animate-delay-200">
                <h1 className="text-display-lg font-display font-bold text-neutral-900 mb-4">
                  {property.title}
                </h1>
                
                <div className="flex items-center gap-2 text-body-lg text-neutral-600 mb-6">
                  <span className="icon icon-location text-2xl text-primary-600"></span>
                  <span className="font-medium">
                    {property.location.area}, {property.location.county}, Kenya
                  </span>
                </div>

                <div className="flex items-center justify-between mb-8 p-6 bg-neutral-50 rounded-xl">
                  <div>
                    <div className="text-3xl font-bold gradient-text-professional mb-1">
                      {formatPrice(property)}
                    </div>
                    {property.listingType === 'rent' && (
                      <div className="text-body-sm text-neutral-500">per month</div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="badge badge-info">
                      <span className="icon icon-bed mr-1"></span>
                      {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                    </div>
                    <div className="badge badge-success">
                      <span className="icon icon-bath mr-1"></span>
                      {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h2 className="text-heading-lg text-neutral-900 mb-4">Description</h2>
                  <p className="text-body-md text-neutral-700 leading-relaxed mb-6">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h2 className="text-heading-lg text-neutral-900 mb-6">Property Features</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
                      <span className="icon icon-home text-xl text-primary-600"></span>
                      <div>
                        <div className="font-medium text-primary-800">Property Type</div>
                        <div className="text-body-sm text-primary-700 capitalize">{property.propertyType}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary-50 rounded-lg">
                      <span className="icon icon-bed text-xl text-secondary-600"></span>
                      <div>
                        <div className="font-medium text-secondary-800">Bedrooms</div>
                        <div className="text-body-sm text-secondary-700">{property.bedrooms} rooms</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-success-100 rounded-lg">
                      <span className="icon icon-bath text-xl text-success-600"></span>
                      <div>
                        <div className="font-medium text-success-800">Bathrooms</div>
                        <div className="text-body-sm text-success-700">{property.bathrooms} bathrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-warning-100 rounded-lg">
                      <span className="icon icon-location text-xl text-warning-600"></span>
                      <div>
                        <div className="font-medium text-warning-800">Location</div>
                        <div className="text-body-sm text-warning-700">{property.location.area}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="btn btn-primary hover-scale focus-professional"
                  >
                    <span className="icon icon-email mr-2"></span>
                    Contact Property Owner
                  </button>
                  <button className="btn btn-secondary hover-scale focus-professional">
                    <span className="icon icon-phone mr-2"></span>
                    Call Now
                  </button>
                  <button className="btn btn-secondary hover-scale focus-professional">
                    <span className="icon icon-heart mr-2"></span>
                    Save Property
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Contact Card */}
              <div className="card p-6 animate-slide-right">
                <h3 className="text-heading-md text-neutral-900 mb-4 flex items-center gap-2">
                  <span className="icon icon-phone text-primary-600"></span>
                  Quick Contact
                </h3>
                <div className="space-y-4">
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full btn btn-primary justify-center hover-scale focus-professional"
                  >
                    <span className="icon icon-email mr-2"></span>
                    Send Message
                  </button>
                  <button className="w-full btn btn-secondary justify-center hover-scale focus-professional">
                    <span className="icon icon-phone mr-2"></span>
                    Call Owner
                  </button>
                  <button className="w-full btn btn-secondary justify-center hover-scale focus-professional">
                    <span className="icon icon-message mr-2"></span>
                    WhatsApp
                  </button>
                </div>
              </div>

              {/* Property Stats */}
              <div className="card p-6 animate-slide-right animate-delay-200">
                <h3 className="text-heading-md text-neutral-900 mb-4 flex items-center gap-2">
                  <span className="icon icon-chart text-info-600"></span>
                  Property Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Views</span>
                    <span className="font-medium text-neutral-900">245</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Inquiries</span>
                    <span className="font-medium text-neutral-900">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Listed</span>
                    <span className="font-medium text-neutral-900">2 days ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Status</span>
                    <span className="badge badge-success">Available</span>
                  </div>
                </div>
              </div>

              {/* Similar Properties */}
              <div className="card p-6 animate-slide-right animate-delay-300">
                <h3 className="text-heading-md text-neutral-900 mb-4 flex items-center gap-2">
                  <span className="icon icon-search text-secondary-600"></span>
                  Similar Properties
                </h3>
                <div className="space-y-4">
                  <div className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center text-xl">
                        <span className="icon icon-home text-primary-600"></span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900 text-body-sm">
                          Modern Apartment in Westlands
                        </div>
                        <div className="text-body-sm text-neutral-600">KES 85,000/month</div>
                        <div className="text-body-sm text-primary-600">3 bed • 2 bath</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center text-xl">
                        <span className="icon icon-building text-secondary-600"></span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900 text-body-sm">
                          Spacious House in Karen
                        </div>
                        <div className="text-body-sm text-neutral-600">KES 120,000/month</div>
                        <div className="text-body-sm text-primary-600">4 bed • 3 bath</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link
                  to="/properties"
                  className="btn btn-secondary w-full justify-center mt-4 hover-scale focus-professional"
                >
                  View All Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Contact Modal */}
      <PropertyContactModal
        property={property}
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
};

export default PropertyDetail;
