// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth(); // ✅ Get loading state from context

  // ⏳ Show a loader while checking auth
  if (loading) return <div className="text-center mt-5">Checking authentication...</div>;

  // 🚫 If not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // 🚫 If role does not match, redirect to their own dashboard
  if (role && user.role !== role) {
    const redirectPath = `/${user.role.toLowerCase()}-dashboard`;
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ User is logged in and role matches
  return children;
};

export default PrivateRoute;
