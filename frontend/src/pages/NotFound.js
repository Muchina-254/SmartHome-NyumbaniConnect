import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
    <div className="text-center">
      <div className="icon icon-warning text-8xl mb-6 text-error-500"></div>
      <h1 className="text-heading-xl text-neutral-900 mb-4">404 - Page Not Found</h1>
      <p className="text-body-lg text-neutral-600 mb-8">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary hover-scale focus-professional">
        ← Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
