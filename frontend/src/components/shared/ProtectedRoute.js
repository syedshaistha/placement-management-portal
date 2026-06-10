// frontend/src/components/shared/ProtectedRoute.js
// Wraps routes that require authentication

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border" style={{ color: '#5378ff' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Not logged in → redirect to appropriate login page
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/student/login'} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Wrong role → redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
