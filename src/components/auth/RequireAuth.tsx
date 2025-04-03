import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "~/lib/useAuth";

const RequireAuth = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <p className="text-center text-gray-300">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />; // Redirect if the user doesn't have the required role
  }

  return <>{children}</>;
};

export default RequireAuth;