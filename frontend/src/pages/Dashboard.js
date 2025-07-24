import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    activeListings: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalProperties: 12,
      totalViews: 1245,
      totalInquiries: 89,
      activeListings: 8
    });
  }, []);

  const getUserTypeIcon = (userType) => {
    switch(userType) {
      case 'tenant': return 'icon-home';
      case 'landlord': return 'icon-building';
      case 'agent': return 'icon-users';
      default: return 'icon-user';
    }
  };

  const getUserTypeText = (userType) => {
    switch(userType) {
      case 'tenant': return 'Property Seeker';
      case 'landlord': return 'Property Owner';
      case 'agent': return 'Property Agent';
      default: return 'User';
    }
  };

  const quickActions = user?.userType === 'tenant' ? [
    { icon: 'icon-search', title: 'Search Properties', description: 'Find your perfect home', link: '/properties' },
    { icon: 'icon-heart', title: 'Saved Properties', description: 'View your favorites', link: '/saved-properties' },
    { icon: 'icon-message', title: 'My Inquiries', description: 'Track your applications', link: '/my-inquiries' },
    { icon: 'icon-phone', title: 'Contact Agents', description: 'Connect with property agents', link: '/contact' }
  ] : [
    { icon: 'icon-plus', title: 'Add Property', description: 'List a new property', link: '/properties/add' },
    { icon: 'icon-building', title: 'Manage Properties', description: 'View all your listings', link: '/properties/manage' },
    { icon: 'icon-chart', title: 'Analytics', description: 'View property performance', link: '/analytics' },
    { icon: 'icon-message', title: 'Messages', description: 'Respond to inquiries', link: '/messages' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
      
      <div className="section-professional">
        <div className="container-professional">
          {/* Welcome Header */}
          <div className="mb-12">
            <div className="glass-professional p-8 rounded-xl animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-display-lg font-display font-bold text-neutral-900 mb-2">
                    Welcome back,
                    <span className="gradient-text-professional block">{user?.firstName}!</span>
                  </h1>
                  <p className="text-body-lg text-neutral-600">
                    Here's what's happening with your property journey today
                  </p>
                </div>
                <div className="hidden lg:block">
                  <div className="text-6xl animate-float">
                    <span className={`icon ${getUserTypeIcon(user?.userType)} text-primary-500`}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6 text-center animate-slide-up hover-lift">
                  <div className="icon icon-home text-4xl mb-3 text-primary-600"></div>
                  <div className="text-heading-md gradient-text-professional mb-1">
                    {stats.totalProperties}
                  </div>
                  <div className="text-body-sm text-neutral-600">
                    {user?.userType === 'tenant' ? 'Viewed' : 'Total'} Properties
                  </div>
                </div>
                
                <div className="card p-6 text-center animate-slide-up animate-delay-100 hover-lift">
                  <div className="icon icon-eye text-4xl mb-3 text-secondary-600"></div>
                  <div className="text-heading-md gradient-text-professional mb-1">
                    {stats.totalViews}
                  </div>
                  <div className="text-body-sm text-neutral-600">
                    Total Views
                  </div>
                </div>
                
                <div className="card p-6 text-center animate-slide-up animate-delay-200 hover-lift">
                  <div className="icon icon-message text-4xl mb-3 text-info-600"></div>
                  <div className="text-heading-md gradient-text-professional mb-1">
                    {stats.totalInquiries}
                  </div>
                  <div className="text-body-sm text-neutral-600">
                    Inquiries
                  </div>
                </div>
                
                <div className="card p-6 text-center animate-slide-up animate-delay-300 hover-lift">
                  <div className="icon icon-verified text-4xl mb-3 text-success-600"></div>
                  <div className="text-heading-md gradient-text-professional mb-1">
                    {stats.activeListings}
                  </div>
                  <div className="text-body-sm text-neutral-600">
                    Active {user?.userType === 'tenant' ? 'Searches' : 'Listings'}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-8 animate-slide-up animate-delay-400">
                <h2 className="text-heading-lg text-neutral-900 mb-6 flex items-center gap-2">
                  <span className="icon icon-lightning text-warning-600"></span>
                  Quick Actions
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.link}
                      className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all hover-lift focus-professional"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`icon ${action.icon} text-2xl text-primary-600`}></div>
                        <div>
                          <div className="font-semibold text-neutral-900">{action.title}</div>
                          <div className="text-body-sm text-neutral-600">{action.description}</div>
                        </div>
                        <div className="ml-auto text-primary-500">→</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card p-8 animate-slide-up animate-delay-500">
                <h2 className="text-heading-lg text-neutral-900 mb-6 flex items-center gap-2">
                  <span className="icon icon-chart text-info-600"></span>
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div className="icon icon-home text-xl text-primary-600"></div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900">
                        New property viewed in Westlands
                      </div>
                      <div className="text-body-sm text-neutral-600">2 hours ago</div>
                    </div>
                    <div className="badge badge-success">New</div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div className="icon icon-message text-xl text-info-600"></div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900">
                        Inquiry received for apartment listing
                      </div>
                      <div className="text-body-sm text-neutral-600">5 hours ago</div>
                    </div>
                    <div className="badge badge-info">Message</div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div className="icon icon-star text-xl text-warning-600"></div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900">
                        Property saved to favorites
                      </div>
                      <div className="text-body-sm text-neutral-600">1 day ago</div>
                    </div>
                    <div className="badge badge-warning">Saved</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="card p-6 animate-slide-right">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    <span className={`icon ${getUserTypeIcon(user?.userType)} text-primary-600`}></span>
                  </div>
                  <h3 className="text-heading-md text-neutral-900 mb-1">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <div className="badge badge-success mb-4">
                    {getUserTypeText(user?.userType)}
                  </div>
                </div>
                
                <div className="space-y-3 text-body-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Email:</span>
                    <span className="text-neutral-900 font-medium">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Phone:</span>
                    <span className="text-neutral-900 font-medium">{user?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Location:</span>
                    <span className="text-neutral-900 font-medium">{user?.city}, {user?.county}</span>
                  </div>
                </div>

                <button className="btn btn-secondary w-full mt-6 hover-scale focus-professional">
                  <Link to="/edit-profile" className="flex items-center justify-center w-full text-decoration-none">
                    <span className="icon icon-settings mr-2"></span>
                    Edit Profile
                  </Link>
                </button>
              </div>

              {/* Tips Card */}
              <div className="card p-6 animate-slide-right animate-delay-200">
                <h3 className="text-heading-md text-neutral-900 mb-4 flex items-center gap-2">
                  <span className="icon icon-star text-warning-600"></span>
                  Pro Tips
                </h3>
                
                {user?.userType === 'tenant' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <div className="font-medium text-primary-800 mb-1">Complete Your Profile</div>
                      <div className="text-body-sm text-primary-700">
                        Add preferences to get better property recommendations
                      </div>
                    </div>
                    <div className="p-4 bg-secondary-50 rounded-lg">
                      <div className="font-medium text-secondary-800 mb-1">Set Up Alerts</div>
                      <div className="text-body-sm text-secondary-700">
                        Get notified when properties matching your criteria are listed
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <div className="font-medium text-primary-800 mb-1">Add Photos</div>
                      <div className="text-body-sm text-primary-700">
                        Properties with photos get 3x more views
                      </div>
                    </div>
                    <div className="p-4 bg-secondary-50 rounded-lg">
                      <div className="font-medium text-secondary-800 mb-1">Respond Quickly</div>
                      <div className="text-body-sm text-secondary-700">
                        Fast responses lead to higher booking rates
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
