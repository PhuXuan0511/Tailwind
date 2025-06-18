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
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Debugging role
  console.log("Current role:", role);

  // If a requiredRole is specified, check if the user's role matches
  if (requiredRole && role !== requiredRole) {
    // Redirect to the appropriate dashboard based on the user's role
    return <Navigate to={role === "admin" ? "/admin-dashboard" : "/user-dashboard"} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;