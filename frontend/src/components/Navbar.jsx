import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

/**
 * Navbar Component
 * Responsive top navigation bar with role-based links and logout.
 */
const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper to detect active route for styling
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/rides", label: "Find Rides", icon: "🔍" },
    { path: "/offer-ride", label: "Offer Ride", icon: "🚗" },
    { path: "/bikes", label: "Bike Rental", icon: "🚴" },
    { path: "/history", label: "History", icon: "📋" },
  ];

  if (isAdmin) {
    navLinks.push({ path: "/admin", label: "Admin", icon: "⚙️" });
  }

  return (
    <nav style={{
      background: "rgba(15, 23, 42, 0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(51,65,85,0.8)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "3.75rem" }}>

          {/* ── Logo ── */}
          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🌿</span>
            <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.125rem" }}>
              <span className="gradient-text">Eco</span>
              <span style={{ color: "#f1f5f9" }}>Share</span>
            </span>
          </Link>

          {/* ── Desktop Links ── */}
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="desktop-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    padding: "0.4rem 0.875rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: isActive(link.path) ? "#10b981" : "#94a3b8",
                    background: isActive(link.path) ? "rgba(16,185,129,0.1)" : "transparent",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = "#f1f5f9"; }}
                  onMouseLeave={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = "#94a3b8"; }}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* ── Right: User + Logout ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user ? (
              <>
                <div style={{ textAlign: "right", display: "none" }} className="user-info-desktop">
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#f1f5f9" }}>{user.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "#10b981", textTransform: "uppercase", fontWeight: 700 }}>
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Logout"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
            )}

            {/* Mobile menu toggle */}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ background: "none", border: "none", color: "#f1f5f9", fontSize: "1.25rem", display: "none" }}
                className="mobile-menu-btn"
              >
                {mobileOpen ? "✕" : "☰"}
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {user && mobileOpen && (
          <div style={{
            borderTop: "1px solid rgba(51,65,85,0.6)",
            padding: "0.75rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "0.625rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.9375rem",
                  color: isActive(link.path) ? "#10b981" : "#f1f5f9",
                  background: isActive(link.path) ? "rgba(16,185,129,0.1)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <div style={{ padding: "0.375rem 1rem", fontSize: "0.8125rem", color: "#64748b" }}>
              Signed in as <strong style={{ color: "#f1f5f9" }}>{user.name}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Responsive styles injected as a style tag */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .user-info-desktop { display: none !important; }
        }
        @media (min-width: 769px) {
          .user-info-desktop { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
