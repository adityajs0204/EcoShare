import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * Wraps private routes. Redirects to /login if not authenticated.
 * Optionally validates admin-only access.
 *
 * @param {React.ReactNode} children - The page/component to protect
 * @param {boolean} adminOnly - If true, only admin users can access
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Wait for auth state to be restored from localStorage
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  // Not authenticated → redirect to login, preserve intended URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin guard
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
