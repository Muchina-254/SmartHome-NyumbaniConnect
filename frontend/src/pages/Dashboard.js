import React from 'react';
import { authService } from '../services/api';

const Dashboard = () => {
  const user = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Welcome to Your Dashboard
          </h1>
          {user && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>User Type:</strong> {user.userType}</p>
                <p><strong>Location:</strong> {user.city}, {user.county}</p>
              </div>
            </div>
          )}
          <div className="text-gray-600">
            <p>Dashboard features coming soon:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>View your property listings</li>
              <li>Manage bookings and inquiries</li>
              <li>Update profile information</li>
              <li>View analytics and reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
