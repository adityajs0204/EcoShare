import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

/**
 * Ride History Page
 * Shows all past and active bookings for the logged-in user
 * (both carpool and bike rentals).
 */
const RideHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | carpool | bike

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await API.get("/bookings/history");
        setBookings(data);
      } catch (err) {
        toast.error("Failed to load booking history");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.type === filter);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.375rem" }}>My Booking History 📋</h1>
      <p style={{ color: "#94a3b8", marginBottom: "1.75rem" }}>
        All your carpool and bike rental records.
      </p>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["all", "carpool", "bike"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
          >
            {f === "all" ? "📋 All" : f === "carpool" ? "🚗 Carpool" : "🚴 Bike"}
          </button>
        ))}
        <span style={{ marginLeft: "auto", color: "#64748b", fontSize: "0.875rem", alignSelf: "center" }}>
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: "3rem" }}>📭</div>
          <div style={{ fontWeight: 600, marginTop: "0.75rem" }}>No bookings yet</div>
          <div style={{ fontSize: "0.875rem", marginTop: "0.375rem" }}>
            Book a ride or rent a bike to get started!
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {filtered.map((b) => (
            <div key={b._id} className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                {/* Left: Type + Details */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                  <div style={{
                    width: 44, height: 44,
                    borderRadius: "0.625rem",
                    background: b.type === "carpool"
                      ? "linear-gradient(135deg,#10b981,#059669)"
                      : "linear-gradient(135deg,#6366f1,#4f46e5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.375rem", flexShrink: 0,
                  }}>
                    {b.type === "carpool" ? "🚗" : "🚴"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>
                      {b.type === "carpool" ? (
                        <>
                          {b.ride?.source || "Unknown"}{" "}
                          <span style={{ color: "#64748b" }}>→</span>{" "}
                          {b.ride?.destination || "Unknown"}
                        </>
                      ) : (
                        <>Bike Rental @ {b.bike?.stationName || "Station"}</>
                      )}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                      {b.type === "carpool" ? (
                        <>🕐 {formatDate(b.ride?.departureTime)}</>
                      ) : (
                        <>
                          🕐 {formatDate(b.startTime)}
                          {b.durationMinutes != null && (
                            <> · ⏱ {b.durationMinutes} min</>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status */}
                <span className={`badge ${
                  b.status === "active"
                    ? "badge-yellow"
                    : b.status === "completed"
                    ? "badge-green"
                    : "badge-red"
                }`}>
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideHistory;
