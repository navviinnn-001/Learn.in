// ============================================================
// components/PrivateRoute.jsx — Route Guard
// ============================================================
// This component "wraps" protected pages.
// If the user isn't logged in → redirect to /login
// If a required role is specified and user doesn't have it → redirect to /
// Otherwise → render the actual page (children)
//
// Usage in App.jsx:
//   <PrivateRoute role="instructor"><CreateCourse /></PrivateRoute>
// ============================================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // While checking auth state, show a loading spinner
  if (loading) {
    return <div className="spinner" />;
  }

  // Not logged in — redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check: if a specific role is required and user doesn't have it
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // All checks passed — render the protected page
  return children;
};

export default PrivateRoute;
