import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/api';
import { toast } from 'react-hot-toast';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    propertyType: '',
    listingType: '',
    
    // Location
    location: {
      county: '',
      area: '',
      address: '',
      nearbyLandmarks: ''
    },
    
    // Property Details
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    furnished: false,
    parking: false,
    garden: false,
    
    // Pricing
    pricing: {
      rentAmount: '',
      salePrice: '',
      deposit: '',
      serviceCharge: ''
    },
    
    // Amenities
    amenities: [],
    
    // Contact Information
    contact: {
      phone: '',
      email: '',
      preferredContactTime: 'anytime'
    },
    
    // Additional Features
    features: [],
    petPolicy: 'not-allowed',
    minimumLease: '12-months'
  });

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale',
    'Garissa', 'Kakamega', 'Machakos', 'Meru', 'Nyeri', 'Kericho', 'Naivasha', 'Voi',
    'Kilifi', 'Lamu', 'Isiolo', 'Marsabit', 'Wajir', 'Mandera', 'Moyale', 'Lodwar',
    'Kapenguria', 'Kapsabet', 'Bomet', 'Sotik', 'Narok', 'Kajiado', 'Magadi', 'Namanga',
    'Taveta', 'Makindu', 'Maralal', 'Rumuruti', 'Nanyuki', 'Embu', 'Chuka', 'Mwingi',
    'Kitui', 'Kibwezi', 'Makueni', 'Wote', 'Migori', 'Awendo', 'Rongo', 'Homa Bay'
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'studio', label: 'Studio' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'commercial', label: 'Commercial Space' }
  ];

  const amenitiesList = [
    'Swimming Pool', 'Gym/Fitness Center', 'Security/Gated Community', 'Backup Generator',
    'Water Tank/Borehole', 'Internet/WiFi', 'DSTV Ready', 'Laundry Area',
    'Balcony/Terrace', 'Kitchen Appliances', 'Air Conditioning', 'Elevator',
    'Playground', 'Shopping Center Nearby', 'School Nearby', 'Hospital Nearby'
  ];

  const featuresList = [
    'Master En-suite', 'Walk-in Closet', 'Modern Kitchen', 'Spacious Living Room',
    'Dining Room', 'Study Room/Office', 'Servant Quarter', 'Store Room',
    'Tiled Floors', 'Wooden Floors', 'Built-in Wardrobes', 'Ceiling Fans'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayChange = (arrayName, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(value)
        ? prev[arrayName].filter(item => item !== value)
        : [...prev[arrayName], value]
    }));
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (validateCurrentStep()) {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fill in all required fields before continuing');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields based on current step
    const isValid = validateCurrentStep();
    if (!isValid) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    
    setLoading(true);
    setErrors({}); // Clear any existing errors

    try {
      // Clean up the data before submission
      const cleanedData = {
        ...formData,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        squareFootage: parseInt(formData.squareFootage) || null,
        pricing: {
          ...formData.pricing,
          rentAmount: formData.listingType === 'rent' ? parseInt(formData.pricing.rentAmount) : null,
          salePrice: formData.listingType === 'sale' ? parseInt(formData.pricing.salePrice) : null,
          deposit: parseInt(formData.pricing.deposit) || null,
          serviceCharge: parseInt(formData.pricing.serviceCharge) || null
        }
      };

      await propertyService.create(cleanedData);
      toast.success('🎉 Property listed successfully! Your listing is now live.');
      navigate('/properties/manage');
    } catch (error) {
      console.error('Error creating property:', error);
      
      // Handle specific error types
      if (error.response?.status === 400) {
        const serverErrors = error.response.data.errors;
        if (Array.isArray(serverErrors)) {
          // Handle validation errors from express-validator
          const errorObj = {};
          serverErrors.forEach(err => {
            errorObj[err.path || err.param] = err.msg;
          });
          setErrors(errorObj);
          toast.error('Please fix the validation errors highlighted below');
        } else {
          toast.error(error.response.data.message || 'Invalid property data. Please check all fields.');
        }
      } else if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to create property listings. Please contact support.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later or contact support.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else {
        toast.error('Failed to list property. Please try again or contact support if the problem persists.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    let isValid = true;

    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.title.trim()) {
          newErrors.title = 'Property title is required';
          isValid = false;
        } else if (formData.title.trim().length < 10) {
          newErrors.title = 'Title must be at least 10 characters';
          isValid = false;
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'Description is required';
          isValid = false;
        } else if (formData.description.trim().length < 50) {
          newErrors.description = 'Description must be at least 50 characters';
          isValid = false;
        }
        
        if (!formData.propertyType) {
          newErrors.propertyType = 'Property type is required';
          isValid = false;
        }
        
        if (!formData.listingType) {
          newErrors.listingType = 'Listing type is required';
          isValid = false;
        }
        break;

      case 2: // Location
        if (!formData.location.county) {
          newErrors.county = 'County is required';
          isValid = false;
        }
        
        if (!formData.location.area.trim()) {
          newErrors.area = 'Area/neighborhood is required';
          isValid = false;
        }
        break;

      case 3: // Pricing
        if (formData.listingType === 'rent') {
          if (!formData.pricing.rentAmount || formData.pricing.rentAmount <= 0) {
            newErrors.rentAmount = 'Rent amount is required and must be greater than 0';
            isValid = false;
          }
        }
        
        if (formData.listingType === 'sale') {
          if (!formData.pricing.salePrice || formData.pricing.salePrice <= 0) {
            newErrors.salePrice = 'Sale price is required and must be greater than 0';
            isValid = false;
          }
        }
        break;

      case 4: // Contact
        if (!formData.contact.phone.trim()) {
          newErrors.phone = 'Phone number is required';
          isValid = false;
        } else if (!/^(\+254|0)[0-9]{9}$/.test(formData.contact.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid Kenyan phone number';
          isValid = false;
        }
        
        if (!formData.contact.email.trim()) {
          newErrors.email = 'Email address is required';
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
          newErrors.email = 'Please enter a valid email address';
          isValid = false;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateFieldOnBlur = (fieldName, value) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Property title is required';
        } else if (value.trim().length < 10) {
          newErrors.title = 'Title must be at least 10 characters';
        } else {
          delete newErrors.title;
        }
        break;
        
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Description is required';
        } else if (value.trim().length < 50) {
          newErrors.description = 'Description must be at least 50 characters';
        } else {
          delete newErrors.description;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-heading-xl font-bold text-neutral-900 mb-4">Basic Information</h2>
              <p className="text-body-md text-neutral-600">Let's start with the basics about your property</p>
            </div>

            <div>
              <label htmlFor="title" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                Property Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="input-professional focus-professional"
                placeholder="e.g., Modern 2-Bedroom Apartment in Westlands"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
                className="input-professional focus-professional resize-none"
                placeholder="Describe your property in detail..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="propertyType" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Property Type *
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  required
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="select-professional focus-professional"
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="listingType" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Listing Type *
                </label>
                <select
                  id="listingType"
                  name="listingType"
                  required
                  value={formData.listingType}
                  onChange={handleInputChange}
                  className="select-professional focus-professional"
                >
                  <option value="">Select listing type</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-heading-xl font-bold text-neutral-900 mb-4">Location & Details</h2>
              <p className="text-body-md text-neutral-600">Where is your property located?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="county" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  County *
                </label>
                <select
                  id="county"
                  name="location.county"
                  required
                  value={formData.location.county}
                  onChange={handleInputChange}
                  className="select-professional focus-professional"
                >
                  <option value="">Select county</option>
                  {kenyanCounties.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="area" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Area/Neighborhood *
                </label>
                <input
                  id="area"
                  name="location.area"
                  type="text"
                  required
                  value={formData.location.area}
                  onChange={handleInputChange}
                  className="input-professional focus-professional"
                  placeholder="e.g., Westlands, Karen, Kilimani"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                Specific Address
              </label>
              <input
                id="address"
                name="location.address"
                type="text"
                value={formData.location.address}
                onChange={handleInputChange}
                className="input-professional focus-professional"
                placeholder="Street address or building name"
              />
            </div>

            <div>
              <label htmlFor="nearbyLandmarks" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                Nearby Landmarks
              </label>
              <input
                id="nearbyLandmarks"
                name="location.nearbyLandmarks"
                type="text"
                value={formData.location.nearbyLandmarks}
                onChange={handleInputChange}
                className="input-professional focus-professional"
                placeholder="e.g., Near Sarit Centre, 5 minutes from Westgate Mall"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="bedrooms" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Bedrooms *
                </label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  required
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="select-professional focus-professional"
                >
                  <option value="">Select</option>
                  <option value="0">Studio</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Bathrooms *
                </label>
                <select
                  id="bathrooms"
                  name="bathrooms"
                  required
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="select-professional focus-professional"
                >
                  <option value="">Select</option>
                  <option value="1">1 Bathroom</option>
                  <option value="2">2 Bathrooms</option>
                  <option value="3">3 Bathrooms</option>
                  <option value="4">4+ Bathrooms</option>
                </select>
              </div>

              <div>
                <label htmlFor="squareFootage" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Size (sq ft)
                </label>
                <input
                  id="squareFootage"
                  name="squareFootage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={handleInputChange}
                  className="input-professional focus-professional"
                  placeholder="e.g., 1200"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="text-body-md text-neutral-700">Furnished</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="text-body-md text-neutral-700">Parking Available</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="garden"
                  checked={formData.garden}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="text-body-md text-neutral-700">Garden/Yard</span>
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-heading-xl font-bold text-neutral-900 mb-4">Pricing & Features</h2>
              <p className="text-body-md text-neutral-600">Set your price and highlight amenities</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {formData.listingType === 'rent' && (
                <>
                  <div>
                    <label htmlFor="rentAmount" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                      Monthly Rent (KES) *
                    </label>
                    <input
                      id="rentAmount"
                      name="pricing.rentAmount"
                      type="number"
                      required
                      value={formData.pricing.rentAmount}
                      onChange={handleInputChange}
                      className="input-professional focus-professional"
                      placeholder="e.g., 50000"
                    />
                  </div>

                  <div>
                    <label htmlFor="deposit" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                      Security Deposit (KES)
                    </label>
                    <input
                      id="deposit"
                      name="pricing.deposit"
                      type="number"
                      value={formData.pricing.deposit}
                      onChange={handleInputChange}
                      className="input-professional focus-professional"
                      placeholder="e.g., 100000"
                    />
                  </div>
                </>
              )}

              {formData.listingType === 'sale' && (
                <div>
                  <label htmlFor="salePrice" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                    Sale Price (KES) *
                  </label>
                  <input
                    id="salePrice"
                    name="pricing.salePrice"
                    type="number"
                    required
                    value={formData.pricing.salePrice}
                    onChange={handleInputChange}
                    className="input-professional focus-professional"
                    placeholder="e.g., 8000000"
                  />
                </div>
              )}

              <div>
                <label htmlFor="serviceCharge" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Service Charge (KES)
                </label>
                <input
                  id="serviceCharge"
                  name="pricing.serviceCharge"
                  type="number"
                  value={formData.pricing.serviceCharge}
                  onChange={handleInputChange}
                  className="input-professional focus-professional"
                  placeholder="e.g., 5000"
                />
              </div>
            </div>

            <div>
              <h3 className="text-heading-md font-bold text-neutral-900 mb-4">Amenities</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center gap-3 cursor-pointer p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleArrayChange('amenities', amenity)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <span className="text-body-sm text-neutral-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-heading-md font-bold text-neutral-900 mb-4">Additional Features</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {featuresList.map(feature => (
                  <label key={feature} className="flex items-center gap-3 cursor-pointer p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleArrayChange('features', feature)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <span className="text-body-sm text-neutral-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-heading-xl font-bold text-neutral-900 mb-4">Contact & Policies</h2>
              <p className="text-body-md text-neutral-600">How should tenants contact you?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="contact.phone"
                  type="tel"
                  required
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  className="input-professional focus-professional"
                  placeholder="e.g., +254 700 000 000"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="contact.email"
                  type="email"
                  required
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  className="input-professional focus-professional"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="preferredContactTime" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                Preferred Contact Time
              </label>
              <select
                id="preferredContactTime"
                name="contact.preferredContactTime"
                value={formData.contact.preferredContactTime}
                onChange={handleInputChange}
                className="select-professional focus-professional"
              >
                <option value="anytime">Anytime</option>
                <option value="morning">Morning (8AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 6PM)</option>
                <option value="evening">Evening (6PM - 10PM)</option>
                <option value="weekends">Weekends Only</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="petPolicy" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Pet Policy
                </label>
                <select
                  id="petPolicy"
                  name="petPolicy"
                  value={formData.petPolicy}
                  onChange={handleInputChange}
                  className="select-professional focus-professional"
                >
                  <option value="not-allowed">Pets Not Allowed</option>
                  <option value="cats-only">Cats Only</option>
                  <option value="dogs-only">Dogs Only</option>
                  <option value="cats-and-dogs">Cats & Dogs Allowed</option>
                  <option value="all-pets">All Pets Welcome</option>
                </select>
              </div>

              <div>
                <label htmlFor="minimumLease" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                  Minimum Lease Period
                </label>
                <select
                  id="minimumLease"
                  name="minimumLease"
                  value={formData.minimumLease}
                  onChange={handleInputChange}
                  className="select-professional focus-professional"
                >
                  <option value="1-month">1 Month</option>
                  <option value="3-months">3 Months</option>
                  <option value="6-months">6 Months</option>
                  <option value="12-months">12 Months</option>
                  <option value="24-months">24 Months</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="h-20"></div>
      
      <div className="container-professional">
        <div className="section-professional">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-body-sm font-semibold mb-6 animate-scale-in">
              <span className="icon icon-plus"></span>
              List Your Property
            </div>
            <h1 className="text-display-xl font-display font-bold text-neutral-900 mb-6 animate-slide-up">
              Add New Property
            </h1>
            <p className="text-body-lg text-neutral-600 animate-slide-up animate-delay-200 max-w-2xl mx-auto">
              Reach thousands of potential tenants by listing your property on SmartNyumba
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-neutral-200 text-neutral-500'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-20 h-1 mx-2 ${
                      step < currentStep 
                        ? 'bg-primary-600' 
                        : 'bg-neutral-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-body-sm text-neutral-600">
              <span>Basic Info</span>
              <span>Location</span>
              <span>Pricing</span>
              <span>Contact</span>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="glass-professional p-8 rounded-xl">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`btn btn-secondary hover-scale focus-professional ${
                    currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="icon icon-arrow-left mr-2"></span>
                  Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn btn-primary hover-scale focus-professional"
                  >
                    Next Step
                    <span className="icon icon-arrow-right ml-2"></span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary hover-scale focus-professional"
                  >
                    {loading ? (
                      <>
                        <span className="icon icon-refresh animate-spin mr-2"></span>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <span className="icon icon-rocket mr-2"></span>
                        Publish Property
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
