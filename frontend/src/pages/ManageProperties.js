import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyService, authService } from '../services/api';
import { toast } from 'react-hot-toast';

const ManageProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch only the user's properties
      const response = await propertyService.getAll();
      // For demo purposes, we'll filter by a mock owner field
      setProperties(response.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load your properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      await propertyService.delete(propertyId);
      toast.success('Property deleted successfully');
      setProperties(properties.filter(p => p._id !== propertyId));
      setShowDeleteModal(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const handleToggleStatus = async (propertyId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await propertyService.updateStatus(propertyId, newStatus);
      toast.success(`Property ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchMyProperties();
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    }
  };

  const formatPrice = (property) => {
    const price = property.listingType === 'rent' 
      ? property.pricing?.rentAmount 
      : property.pricing?.salePrice;
    
    if (!price) return 'Price not set';
    
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status = 'active') => {
    const statusConfig = {
      active: { class: 'badge-success', text: 'Active' },
      inactive: { class: 'badge-warning', text: 'Inactive' },
      pending: { class: 'badge-info', text: 'Under Review' },
      rejected: { class: 'badge-error', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="icon icon-building text-8xl mb-6 text-primary-500 animate-pulse-soft"></div>
          <div className="spinner-professional mx-auto mb-6"></div>
          <p className="text-body-lg text-neutral-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="h-20"></div>
      
      <div className="container-professional">
        <div className="section-professional">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-display-xl font-display font-bold text-neutral-900 mb-4">
                My Properties
              </h1>
              <p className="text-body-lg text-neutral-600">
                Manage your property listings and track performance
              </p>
            </div>
            
            <Link
              to="/properties/add"
              className="btn btn-primary hover-scale focus-professional"
            >
              <span className="icon icon-plus mr-3"></span>
              Add New Property
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="glass-professional p-6 rounded-xl text-center animate-slide-up">
              <div className="icon icon-building text-4xl mb-3 text-primary-600"></div>
              <div className="text-heading-lg gradient-text-professional">{properties.length}</div>
              <div className="text-body-sm text-neutral-600">Total Properties</div>
            </div>
            
            <div className="glass-professional p-6 rounded-xl text-center animate-slide-up animate-delay-100">
              <div className="icon icon-eye text-4xl mb-3 text-success-600"></div>
              <div className="text-heading-lg text-success-600">
                {properties.filter(p => p.status === 'active').length}
              </div>
              <div className="text-body-sm text-neutral-600">Active Listings</div>
            </div>
            
            <div className="glass-professional p-6 rounded-xl text-center animate-slide-up animate-delay-200">
              <div className="icon icon-message text-4xl mb-3 text-warning-600"></div>
              <div className="text-heading-lg text-warning-600">24</div>
              <div className="text-body-sm text-neutral-600">Inquiries This Month</div>
            </div>
            
            <div className="glass-professional p-6 rounded-xl text-center animate-slide-up animate-delay-300">
              <div className="icon icon-star text-4xl mb-3 text-error-600"></div>
              <div className="text-heading-lg text-error-600">4.8</div>
              <div className="text-body-sm text-neutral-600">Average Rating</div>
            </div>
          </div>

          {/* Properties List */}
          {properties.length === 0 ? (
            <div className="text-center py-20 glass-professional rounded-xl">
              <div className="icon icon-building text-8xl mb-8 text-neutral-400"></div>
              <h3 className="text-heading-xl text-neutral-900 mb-6">
                No Properties Listed Yet
              </h3>
              <p className="text-body-lg text-neutral-600 mb-8 max-w-md mx-auto">
                Start earning by listing your first property on SmartNyumba. 
                It only takes a few minutes!
              </p>
              <Link
                to="/properties/add"
                className="btn btn-primary btn-lg hover-scale focus-professional"
              >
                <span className="icon icon-plus mr-3"></span>
                List Your First Property
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {properties.map((property, index) => (
                <div
                  key={property._id}
                  className="glass-professional p-6 rounded-xl hover-lift animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="grid lg:grid-cols-4 gap-6 items-center">
                    {/* Property Image & Basic Info */}
                    <div className="lg:col-span-2">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gradient-primary-professional rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="icon icon-home text-3xl text-white"></span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-heading-md text-neutral-900 font-bold line-clamp-1">
                              {property.title}
                            </h3>
                            {getStatusBadge(property.status)}
                          </div>
                          
                          <p className="text-body-sm text-neutral-600 mb-2 flex items-center gap-2">
                            <span className="icon icon-location"></span>
                            {property.location?.area}, {property.location?.county}
                          </p>
                          
                          <div className="flex items-center gap-4 text-body-sm text-neutral-600">
                            <span className="flex items-center gap-1">
                              <span className="icon icon-bed"></span>
                              {property.bedrooms} bed
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="icon icon-bath"></span>
                              {property.bathrooms} bath
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="icon icon-building"></span>
                              {property.propertyType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="text-center lg:text-left">
                      <div className="text-2xl font-bold gradient-text-professional mb-1">
                        {formatPrice(property)}
                      </div>
                      {property.listingType === 'rent' && (
                        <div className="text-body-sm text-neutral-500">/month</div>
                      )}
                      <div className="text-body-sm text-neutral-600 mt-2">
                        Listed {new Date(property.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/properties/${property._id}`}
                          className="btn btn-secondary btn-sm hover-scale focus-professional flex-1"
                        >
                          <span className="icon icon-eye mr-2"></span>
                          View
                        </Link>
                        
                        <Link
                          to={`/properties/${property._id}/edit`}
                          className="btn btn-secondary btn-sm hover-scale focus-professional flex-1"
                        >
                          <span className="icon icon-settings mr-2"></span>
                          Edit
                        </Link>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(property._id, property.status)}
                          className={`btn btn-sm hover-scale focus-professional flex-1 ${
                            property.status === 'active' ? 'btn-warning' : 'btn-success'
                          }`}
                        >
                          <span className={`icon ${
                            property.status === 'active' ? 'icon-pause' : 'icon-play'
                          } mr-2`}></span>
                          {property.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowDeleteModal(true);
                          }}
                          className="btn btn-error btn-sm hover-scale focus-professional"
                        >
                          <span className="icon icon-trash"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Performance Tips */}
          <div className="mt-16 glass-professional p-8 rounded-xl">
            <h2 className="text-heading-lg font-bold text-neutral-900 mb-6 flex items-center gap-3">
              <span className="icon icon-star text-warning-500"></span>
              Tips to Improve Your Listings
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-primary-50 rounded-lg">
                <h3 className="text-heading-md font-bold text-primary-800 mb-3">Add Photos</h3>
                <p className="text-body-sm text-primary-700">
                  Properties with high-quality photos get 3x more inquiries than those without.
                </p>
              </div>
              
              <div className="p-6 bg-success-50 rounded-lg">
                <h3 className="text-heading-md font-bold text-success-800 mb-3">Respond Quickly</h3>
                <p className="text-body-sm text-success-700">
                  Reply to inquiries within 2 hours to increase your booking rate by 40%.
                </p>
              </div>
              
              <div className="p-6 bg-warning-50 rounded-lg">
                <h3 className="text-heading-md font-bold text-warning-800 mb-3">Update Regularly</h3>
                <p className="text-body-sm text-warning-700">
                  Keep your listings current and refresh descriptions monthly for better visibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="icon icon-warning text-6xl text-error-500 mb-4"></div>
              <h3 className="text-heading-lg font-bold text-neutral-900 mb-2">
                Delete Property?
              </h3>
              <p className="text-body-md text-neutral-600">
                Are you sure you want to delete "{selectedProperty.title}"? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProperty(null);
                }}
                className="btn btn-secondary flex-1 hover-scale focus-professional"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProperty(selectedProperty._id)}
                className="btn btn-error flex-1 hover-scale focus-professional"
              >
                <span className="icon icon-trash mr-2"></span>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;
