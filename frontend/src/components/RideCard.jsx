/**
 * RideCard Component
 * Displays a single carpool ride listing with driver info,
 * route, time, seats and a Book button.
 *
 * @param {Object} ride - Ride document from API
 * @param {Function} onBook - Callback when user clicks "Book"
 * @param {boolean} loading - Shows spinner on Book button when true
 * @param {boolean} showBook - Whether to show the book button
 */
const RideCard = ({ ride, onBook, loading = false, showBook = true }) => {
  const seatsLeft = ride.seatsAvailable;
  const isAvailable = seatsLeft > 0 && ride.status === "active";

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      {/* Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#10b981,#059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.125rem", flexShrink: 0,
          }}>
            🧑
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
              {ride.driver?.name || "Driver"}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              {ride.driver?.email || ""}
            </div>
          </div>
        </div>
        <span className={`badge ${isAvailable ? "badge-green" : "badge-red"}`}>
          {isAvailable ? `${seatsLeft} seat${seatsLeft !== 1 ? "s" : ""} left` : "Full"}
        </span>
      </div>

      {/* Route */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
        }}>
          <span style={{ color: "#10b981", fontSize: "0.7rem" }}>●</span>
          <span style={{ width: 1, height: 20, background: "#334155" }} />
          <span style={{ color: "#f87171", fontSize: "0.7rem" }}>●</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: "0.375rem" }}>{ride.source}</div>
          <div style={{ fontWeight: 600, color: "#94a3b8" }}>{ride.destination}</div>
        </div>
        <div style={{ textAlign: "right", color: "#94a3b8", fontSize: "0.8rem" }}>
          <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "1rem" }}>{formatTime(ride.departureTime)}</div>
          <div>{formatDate(ride.departureTime)}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="badge badge-blue">🚗 {ride.vehicleType || "Car"}</span>
          {ride.notes && (
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>
              &quot;{ride.notes}&quot;
            </span>
          )}
        </div>
        {showBook && onBook && (
          <button
            className="btn btn-primary btn-sm"
            disabled={!isAvailable || loading}
            onClick={() => onBook(ride._id)}
            style={{ flexShrink: 0 }}
          >
            {loading ? (
              <span style={{ width: 14, height: 14, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
            ) : "Book Ride"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RideCard;
