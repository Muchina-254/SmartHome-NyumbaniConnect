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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      toast.success(`Welcome back, ${response.user.firstName}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome Back to SmartNyumba
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Quick Login Options */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Quick test login:</p>
            <div className="space-y-2">
              <button
                onClick={() => fillSampleCredentials('landlord')}
                className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded border hover:bg-blue-100"
              >
                👤 Login as Landlord (Mary Wanjiku)
              </button>
              <button
                onClick={() => fillSampleCredentials('agent')}
                className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded border hover:bg-green-100"
              >
                🏢 Login as Agent (Peter Mwangi)
              </button>
              <button
                onClick={() => fillSampleCredentials('tenant')}
                className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded border hover:bg-purple-100"
              >
                🏠 Login as Tenant (Ann Wanjiru)
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                    Sign up here
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
