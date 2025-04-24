import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "~/lib/useAuth";

const RequireAuth = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="text-center text-gray-300">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect users to the correct dashboard based on their role
  if (role === "user" && location.pathname === "/") {
    return <Navigate to="/user-dashboard" replace />;
  }

  if (role === "admin" && location.pathname === "/") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Redirect if the user doesn't have the required role
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;