import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
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

    // Clear server errors when user starts typing
    if (errors[name] && fieldTouched[name]) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const fieldsToValidate = ['email', 'password'];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
      setFieldTouched(prev => ({ ...prev, [field]: true }));
    });

    if (!isValid) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setErrors({}); // Clear any existing errors

    try {
      const response = await authService.login(formData);
      toast.success(`Welcome back, ${response.user.firstName}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error.response?.status === 401) {
        const message = error.response.data.message;
        if (message.includes('Invalid credentials') || message.includes('password')) {
          setErrors({ 
            password: 'Invalid email or password. Please check your credentials and try again.' 
          });
          toast.error('Invalid email or password');
        } else if (message.includes('email')) {
          setErrors({ 
            email: 'No account found with this email address' 
          });
          toast.error('No account found with this email address');
        } else {
          toast.error('Login failed. Please check your credentials.');
        }
      } else if (error.response?.status === 429) {
        toast.error('Too many login attempts. Please try again later.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later or contact support.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillSampleCredentials = (userType) => {
    const credentials = {
      landlord: { email: 'mary.wanjiku@gmail.com', password: 'password123' },
      agent: { email: 'peter.mwangi@realtor.com', password: 'password123' },
      tenant: { email: 'ann.wanjiru@student.uon.ac.ke', password: 'password123' }
    };
    
    setFormData(credentials[userType]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center">
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
      
      <div className="section-professional">
        <div className="container-professional">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-body-sm font-semibold mb-6 animate-scale-in">
                <span className="icon icon-key"></span>
                Secure Login
              </div>
              <h1 className="text-display-lg font-display font-bold text-neutral-900 mb-4 animate-slide-up">
                Welcome Back to 
                <span className="gradient-text-professional block">SmartNyumba</span>
              </h1>
              <p className="text-body-lg text-neutral-600 animate-slide-up animate-delay-200">
                Sign in to your account to continue your property journey
              </p>
            </div>

            <div className="card card-elevated p-8 animate-slide-up animate-delay-300">
              {/* Quick Login Options */}
              <div className="mb-8">
                <p className="text-body-sm text-neutral-600 mb-4 font-medium">Quick test login:</p>
                <div className="space-y-3">
                  <button
                    onClick={() => fillSampleCredentials('landlord')}
                    className="w-full text-left p-3 bg-secondary-50 text-secondary-700 rounded-lg border border-secondary-200 hover:bg-secondary-100 transition-all hover-lift focus-professional"
                  >
                    <span className="flex items-center gap-3">
                      <span className="icon icon-user text-xl"></span>
                      <div>
                        <div className="font-medium">Login as Landlord</div>
                        <div className="text-body-sm opacity-75">Mary Wanjiku</div>
                      </div>
                    </span>
                  </button>
                  <button
                    onClick={() => fillSampleCredentials('agent')}
                    className="w-full text-left p-3 bg-primary-50 text-primary-700 rounded-lg border border-primary-200 hover:bg-primary-100 transition-all hover-lift focus-professional"
                  >
                    <span className="flex items-center gap-3">
                      <span className="icon icon-building text-xl"></span>
                      <div>
                        <div className="font-medium">Login as Agent</div>
                        <div className="text-body-sm opacity-75">Peter Mwangi</div>
                      </div>
                    </span>
                  </button>
                  <button
                    onClick={() => fillSampleCredentials('tenant')}
                    className="w-full text-left p-3 bg-neutral-100 text-neutral-700 rounded-lg border border-neutral-200 hover:bg-neutral-200 transition-all hover-lift focus-professional"
                  >
                    <span className="flex items-center gap-3">
                      <span className="icon icon-home text-xl"></span>
                      <div>
                        <div className="font-medium">Login as Tenant</div>
                        <div className="text-body-sm opacity-75">Ann Wanjiru</div>
                      </div>
                    </span>
                  </button>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <div className="flex items-center gap-1 mt-1 text-error-600 text-body-sm">
                        <span className="icon icon-alert text-sm"></span>
                        {errors.password}
                      </div>
                    )}
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
                          Signing in...
                        </>
                      ) : (
                        <>
                          <span className="icon icon-rocket mr-2"></span>
                          Sign in to Account
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <span className="text-body-md text-neutral-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                      Sign up here
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
