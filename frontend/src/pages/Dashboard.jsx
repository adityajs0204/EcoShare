import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

/**
 * Dashboard Page
 * Landing page after login. Shows user stats, active rental,
 * and quick-action cards for all main features.
 */
const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeRental, setActiveRental] = useState(null);
  const [myRides, setMyRides] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rentalRes, ridesRes] = await Promise.all([
          API.get("/bikes/active-rental"),
          API.get("/rides/my-rides"),
        ]);
        setActiveRental(rentalRes.data.hasActiveRental ? rentalRes.data : null);
        setMyRides(ridesRes.data.slice(0, 3)); // Show last 3

        if (isAdmin) {
          const statsRes = await API.get("/admin/stats");
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error("Dashboard data error:", err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const quickActions = [
    { icon: "🔍", label: "Find a Ride", desc: "Search available carpools", path: "/rides", color: "#10b981" },
    { icon: "🚗", label: "Offer Ride", desc: "Share your journey", path: "/offer-ride", color: "#6366f1" },
    { icon: "🚴", label: "Rent a Bike", desc: "Quick eco-friendly trips", path: "/bikes", color: "#f59e0b" },
    { icon: "📋", label: "My History", desc: "View past bookings", path: "/history", color: "#38bdf8" },
  ];

  return (
    <div className="page">
      {/* ── Welcome Header ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(99,102,241,0.08) 100%)",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: "1rem",
        padding: "2rem",
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: "8rem", opacity: 0.06 }}>🌿</div>
        <div style={{ fontSize: "0.875rem", color: "#10b981", fontWeight: 600, marginBottom: "0.375rem" }}>
          Good day 👋
        </div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p style={{ color: "#94a3b8" }}>
          Let's make today's commute a little greener. 🌱
        </p>
        {user?.role === "admin" && (
          <span className="badge badge-blue" style={{ marginTop: "0.75rem" }}>⚙️ Admin</span>
        )}
      </div>

      {/* ── Active Bike Rental Alert ── */}
      {activeRental && (
        <div style={{
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.3)",
          borderRadius: "0.75rem",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <span style={{ fontSize: "1.5rem" }}>🚴</span>
          <div>
            <div style={{ fontWeight: 700, color: "#fbbf24" }}>Active Bike Rental</div>
            <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
              You have a bike rented from{" "}
              <strong style={{ color: "#f1f5f9" }}>
                {activeRental.booking?.bike?.stationName || "a station"}
              </strong>.
              Head to <Link to="/bikes" style={{ color: "#10b981" }}>Bike Rental</Link> to return it.
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Stats ── */}
      {isAdmin && stats && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.125rem", marginBottom: "1rem", color: "#94a3b8" }}>Platform Overview</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}>
            {[
              { label: "Users", value: stats.totalUsers, icon: "👥", color: "#6366f1" },
              { label: "Rides", value: stats.totalRides, icon: "🚗", color: "#10b981" },
              { label: "Stations", value: stats.totalBikeStations, icon: "🅿️", color: "#f59e0b" },
              { label: "Bookings", value: stats.totalBookings, icon: "📋", color: "#38bdf8" },
              { label: "Active", value: stats.activeBookings, icon: "⚡", color: "#f43f5e" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <h2 style={{ fontSize: "1.125rem", marginBottom: "1rem", color: "#94a3b8" }}>Quick Actions</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}>
        {quickActions.map((action) => (
          <Link key={action.path} to={action.path} style={{ textDecoration: "none" }}>
            <div className="card" style={{ padding: "1.5rem", cursor: "pointer", borderLeft: `3px solid ${action.color}` }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{action.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{action.label}</div>
              <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>{action.desc}</div>
            </div>
          </Link>
        ))}
        {isAdmin && (
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <div className="card" style={{ padding: "1.5rem", cursor: "pointer", borderLeft: "3px solid #f43f5e" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚙️</div>
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Admin Panel</div>
              <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>Manage platform data</div>
            </div>
          </Link>
        )}
      </div>

      {/* ── Recent Rides Offered ── */}
      {myRides.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.125rem", color: "#94a3b8" }}>My Recent Rides</h2>
            <Link to="/history" style={{ fontSize: "0.8125rem", color: "#10b981" }}>View all →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {myRides.map((ride) => (
              <div key={ride._id} className="card" style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{ride.source}</span>
                  <span style={{ color: "#64748b", margin: "0 0.375rem" }}>→</span>
                  <span style={{ fontWeight: 600 }}>{ride.destination}</span>
                </div>
                <span className={`badge ${ride.status === "active" ? "badge-green" : "badge-yellow"}`}>
                  {ride.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
