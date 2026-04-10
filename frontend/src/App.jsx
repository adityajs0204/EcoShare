import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RideSearch from "./pages/RideSearch";
import OfferRide from "./pages/OfferRide";
import BikeRental from "./pages/BikeRental";
import RideHistory from "./pages/RideHistory";
import AdminPanel from "./pages/AdminPanel";

/**
 * App Component
 * Root of the application.
 * Sets up routing, AuthProvider context, and the global toast notification system.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
              borderRadius: "0.625rem",
              fontSize: "0.9rem",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />

        {/* Sticky Navbar (shown on all pages) */}
        <Navbar />

        {/* Page Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes (authenticated users) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rides"
            element={
              <ProtectedRoute>
                <RideSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer-ride"
            element={
              <ProtectedRoute>
                <OfferRide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bikes"
            element={
              <ProtectedRoute>
                <BikeRental />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <RideHistory />
              </ProtectedRoute>
            }
          />

          {/* Admin-Only Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="page" style={{ textAlign: "center", paddingTop: "4rem" }}>
                <div style={{ fontSize: "4rem" }}>🌿</div>
                <h2 style={{ fontSize: "2rem", marginTop: "1rem" }}>404 – Page Not Found</h2>
                <p style={{ color: "#94a3b8", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                  This path doesn't exist on EcoShare.
                </p>
                <a href="/dashboard" className="btn btn-primary">← Go to Dashboard</a>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
