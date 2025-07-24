import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'First name is required';
        } else if (value.trim().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.firstName = 'First name can only contain letters';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = 'Last name is required';
        } else if (value.trim().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.lastName = 'Last name can only contain letters';
        } else {
          delete newErrors.lastName;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^(\+254|0)[0-9]{9}$/.test(value.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        } else {
          delete newErrors.password;
        }
        
        // Also validate confirm password if it exists
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (formData.confirmPassword && value === formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate field if it has been touched
    if (fieldTouched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFieldTouched({
      ...fieldTouched,
      [name]: true
    });
    validateField(name, value);
  };

  const handleUserTypeSelect = (userType) => {
    setFormData({
      ...formData,
      userType
    });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
      setFieldTouched(prev => ({ ...prev, [field]: true }));
    });

    if (!isValid) {
      toast.error('Please fix the errors in the form before submitting');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      toast.success(`Welcome to SmartNyumba, ${response.user.firstName}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      
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
          toast.error('Please fix the validation errors');
        } else if (error.response.data.message) {
          if (error.response.data.message.includes('email')) {
            setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
            toast.error('This email is already registered. Please use a different email or try logging in.');
          } else if (error.response.data.message.includes('phone')) {
            setErrors(prev => ({ ...prev, phone: 'This phone number is already registered' }));
            toast.error('This phone number is already registered. Please use a different number.');
          } else {
            toast.error(error.response.data.message);
          }
        }
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later or contact support.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    {
      type: 'tenant',
      icon: 'icon-home',
      title: 'I\'m looking for a home',
      description: 'Find your perfect rental property in Kenya',
      color: 'primary'
    },
    {
      type: 'landlord',
      icon: 'icon-building',
      title: 'I want to list my property',
      description: 'Connect with verified tenants across Kenya',
      color: 'secondary'
    },
    {
      type: 'agent',
      icon: 'icon-users',
      title: 'I\'m a property agent',
      description: 'Manage multiple properties and clients',
      color: 'neutral'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
      
      <div className="section-professional">
        <div className="container-professional">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-body-sm font-semibold mb-6 animate-scale-in">
                <span className="icon icon-rocket"></span>
                Join SmartNyumba
              </div>
              <h1 className="text-display-lg font-display font-bold text-neutral-900 mb-4 animate-slide-up">
                Start Your Property
                <span className="gradient-text-professional block">Journey Today</span>
              </h1>
              <p className="text-body-lg text-neutral-600 animate-slide-up animate-delay-200">
                Create your account and join thousands of Kenyans finding their perfect homes
              </p>
            </div>

            {step === 1 ? (
              // Step 1: User Type Selection
              <div className="animate-slide-up animate-delay-300">
                <h2 className="text-heading-lg text-center text-neutral-900 mb-8">
                  What brings you to SmartNyumba?
                </h2>
                <div className="grid gap-6">
                  {userTypes.map((userType, index) => (
                    <button
                      key={userType.type}
                      onClick={() => handleUserTypeSelect(userType.type)}
                      className="card hover:card-elevated p-8 text-left hover-lift focus-professional transition-all animate-slide-up"
                      style={{animationDelay: `${0.4 + index * 0.1}s`}}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl bg-${userType.color}-100`}>
                          <span className={`icon ${userType.icon} text-3xl`}></span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-heading-md text-neutral-900 mb-2">
                            {userType.title}
                          </h3>
                          <p className="text-body-md text-neutral-600">
                            {userType.description}
                          </p>
                        </div>
                        <div className="text-2xl text-primary-500">→</div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <span className="text-body-md text-neutral-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                      Sign in here
                    </Link>
                  </span>
                </div>
              </div>
            ) : (
              // Step 2: Registration Form
              <div className="card card-elevated p-8 animate-slide-up">
                <div className="mb-8">
                  <button
                    onClick={() => setStep(1)}
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors flex items-center gap-2"
                  >
                    ← Back to user type selection
                  </button>
                  <div className="mt-4">
                    <h2 className="text-heading-lg text-neutral-900 mb-2">
                      Create Your Account
                    </h2>
                    <p className="text-body-md text-neutral-600">
                      You selected: <strong>
                        {userTypes.find(u => u.type === formData.userType)?.title}
                      </strong>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`input-professional ${errors.firstName ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <div className="flex items-center gap-1 mt-1 text-error-600 text-body-sm">
                          <span className="icon icon-alert text-sm"></span>
                          {errors.firstName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`input-professional ${errors.lastName ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <div className="flex items-center gap-1 mt-1 text-error-600 text-body-sm">
                          <span className="icon icon-alert text-sm"></span>
                          {errors.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`input-professional ${errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <div className="flex items-center gap-1 mt-1 text-error-600 text-body-sm">
                        <span className="icon icon-alert text-sm"></span>
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`input-professional ${errors.phone ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
                      placeholder="e.g., +254 712 345 678 or 0712 345 678"
                    />
                    {errors.phone && (
                      <div className="flex items-center gap-1 mt-1 text-error-600 text-body-sm">
                        <span className="icon icon-alert text-sm"></span>
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="password" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`input-professional ${errors.password ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
                        placeholder="Create a strong password"
                      />
                      {errors.password && (
                        <div className="flex items-center gap-1 mt-1 text-error-600 text-body-sm">
                          <span className="icon icon-alert text-sm"></span>
                          {errors.password}
                        </div>
                      )}
                      {!errors.password && formData.password && (
                        <div className="mt-1 text-neutral-500 text-body-sm">
                          Must contain uppercase, lowercase, and number
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`input-professional ${errors.confirmPassword ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}`}
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && (
                        <div className="flex items-center gap-1 mt-1 text-error-600 text-body-sm">
                          <span className="icon icon-alert text-sm"></span>
                          {errors.confirmPassword}
                        </div>
                      )}
                      {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <div className="flex items-center gap-1 mt-1 text-success-600 text-body-sm">
                          <span className="icon icon-verified text-sm"></span>
                          Passwords match
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-body-sm text-neutral-600">
                      By creating an account, you agree to our Terms of Service and Privacy Policy. 
                      All properties and users are verified for your safety.
                    </p>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full justify-center hover-scale focus-professional"
                    >
                      {loading ? (
                        <>
                          <div className="spinner-professional w-5 h-5 mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <span className="icon icon-target mr-2"></span>
                          Create My Account
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <span className="text-body-md text-neutral-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                      Sign in here
                    </Link>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
