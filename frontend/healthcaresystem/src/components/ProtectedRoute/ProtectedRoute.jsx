import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userInfo.roleId)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 