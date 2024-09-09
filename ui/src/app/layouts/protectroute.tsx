/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authentication';

const ProtectedRoute: React.FC<{ element?: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the element (protected content)
  return <>{element}</>;
};

export default ProtectedRoute;
