import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/api';

const PropertyContactModal = ({ property, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('contact');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredTime: 'anytime',
    visitDate: '',
    visitTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});

  const user = authService.getCurrentUser();

  React.useEffect(() => {
    if (user) {
      setContactForm(prev => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!contactForm.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!contactForm.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!contactForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^(\+254|0)[0-9]{9}$/.test(contactForm.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
      isValid = false;
    }

    if (!contactForm.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (contactForm.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    if (activeTab === 'visit') {
      if (!contactForm.visitDate) {
        newErrors.visitDate = 'Visit date is required';
        isValid = false;
      } else {
        const selectedDate = new Date(contactForm.visitDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          newErrors.visitDate = 'Visit date cannot be in the past';
          isValid = false;
        }
      }

      if (!contactForm.visitTime) {
        newErrors.visitTime = 'Visit time is required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    setErrors({}); // Clear existing errors

    try {
      // Simulate API call to send inquiry
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (activeTab === 'contact') {
        toast.success('Your inquiry has been sent successfully! The property owner will contact you soon.');
      } else {
        toast.success('Visit request sent successfully! The property owner will confirm your visit time.');
      }
      
      onClose();
      setContactForm({
        name: user ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
        phone: user?.phone || '',
        message: '',
        preferredTime: 'anytime',
        visitDate: '',
        visitTime: ''
      });
      setFieldTouched({});
    } catch (error) {
      console.error('Contact form error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Please log in to send an inquiry');
      } else if (error.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment before trying again.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else {
        toast.error('Failed to send inquiry. Please try again or contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (property) => {
    const price = property.listingType === 'rent' 
      ? property.pricing?.rentAmount 
      : property.pricing?.salePrice;
    
    if (!price) return 'Contact for price';
    
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-heading-xl font-bold text-neutral-900 mb-2">
              Contact Property Owner
            </h2>
            <p className="text-body-md text-neutral-600">
              Get in touch about: {property.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <span className="icon icon-x text-xl text-neutral-500"></span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 p-6">
          {/* Property Summary */}
          <div className="lg:col-span-1">
            <div className="glass-professional p-6 rounded-xl sticky top-6">
              <div className="h-48 bg-gradient-primary-professional rounded-xl flex items-center justify-center mb-6">
                <span className="icon icon-home text-6xl text-white"></span>
              </div>
              
              <h3 className="text-heading-md font-bold text-neutral-900 mb-3 line-clamp-2">
                {property.title}
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-body-sm text-neutral-600">
                  <span className="icon icon-location"></span>
                  {property.location?.area}, {property.location?.county}
                </div>
                
                <div className="flex items-center gap-4 text-body-sm text-neutral-600">
                  <span className="flex items-center gap-1">
                    <span className="icon icon-bed"></span>
                    {property.bedrooms} bed
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="icon icon-bath"></span>
                    {property.bathrooms} bath
                  </span>
                </div>
                
                <div className="text-2xl font-bold gradient-text-professional">
                  {formatPrice(property)}
                  {property.listingType === 'rent' && (
                    <span className="text-body-sm text-neutral-500 font-normal">/month</span>
                  )}
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="space-y-3">
                <a
                  href={`tel:${property.contact?.phone}`}
                  className="btn btn-primary w-full hover-scale focus-professional"
                >
                  <span className="icon icon-phone mr-3"></span>
                  Call Now
                </a>
                
                <a
                  href={`https://wa.me/${property.contact?.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success w-full hover-scale focus-professional"
                >
                  <span className="icon icon-message mr-3"></span>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'contact'
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <span className="icon icon-message mr-2"></span>
                Send Message
              </button>
              <button
                onClick={() => setActiveTab('visit')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'visit'
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <span className="icon icon-calendar mr-2"></span>
                Schedule Visit
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={handleInputChange}
                    className="input-professional focus-professional"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={handleInputChange}
                    className="input-professional focus-professional"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={contactForm.phone}
                  onChange={handleInputChange}
                  className="input-professional focus-professional"
                  placeholder="+254 700 000 000"
                />
              </div>

              {activeTab === 'contact' && (
                <>
                  <div>
                    <label htmlFor="message" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={contactForm.message}
                      onChange={handleInputChange}
                      className="input-professional focus-professional resize-none"
                      placeholder="Hi, I'm interested in this property. Could you please provide more details about..."
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                      Preferred Contact Time
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={contactForm.preferredTime}
                      onChange={handleInputChange}
                      className="select-professional focus-professional"
                    >
                      <option value="anytime">Anytime</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 6PM)</option>
                      <option value="evening">Evening (6PM - 10PM)</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'visit' && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="visitDate" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                        Preferred Visit Date *
                      </label>
                      <input
                        id="visitDate"
                        name="visitDate"
                        type="date"
                        required
                        value={contactForm.visitDate}
                        onChange={handleInputChange}
                        className="input-professional focus-professional"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label htmlFor="visitTime" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        id="visitTime"
                        name="visitTime"
                        required
                        value={contactForm.visitTime}
                        onChange={handleInputChange}
                        className="select-professional focus-professional"
                      >
                        <option value="">Select time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      className="input-professional focus-professional resize-none"
                      placeholder="Any specific questions or requirements for the visit..."
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary flex-1 hover-scale focus-professional"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1 hover-scale focus-professional"
                >
                  {loading ? (
                    <>
                      <span className="icon icon-refresh animate-spin mr-2"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="icon icon-email mr-2"></span>
                      {activeTab === 'contact' ? 'Send Message' : 'Request Visit'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyContactModal;
