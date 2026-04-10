/**
 * BikeStationCard Component
 * Displays a bike docking station with availability counts
 * and Rent/Return buttons.
 *
 * @param {Object} station - Bike station document from API
 * @param {Function} onRent - Called when user clicks "Rent"
 * @param {Function} onReturn - Called when user clicks "Return"
 * @param {boolean} hasActiveRental - Whether user currently has a bike rented
 * @param {boolean} loading - Shows loading state on buttons
 */
const BikeStationCard = ({ station, onRent, onReturn, hasActiveRental, loading = false }) => {
  const available = station.availableBikes;
  const total = station.totalBikes;
  const pct = Math.round((available / total) * 100);

  const barColor = pct > 50 ? "#10b981" : pct > 20 ? "#f59e0b" : "#ef4444";

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{
            width: 44, height: 44,
            borderRadius: "0.625rem",
            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.375rem", flexShrink: 0,
          }}>
            🚴
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem" }}>{station.stationName}</div>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>📍 {station.location}</div>
          </div>
        </div>
        <span className={`badge ${available > 0 ? "badge-green" : "badge-red"}`}>
          {available > 0 ? "Available" : "Empty"}
        </span>
      </div>

      {/* Availability Bar */}
      <div style={{ marginBottom: "1.125rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.375rem" }}>
          <span style={{ color: "#94a3b8" }}>Bikes available</span>
          <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{available} / {total}</span>
        </div>
        <div style={{ height: 6, background: "#334155", borderRadius: 999 }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: barColor,
            borderRadius: 999,
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
          disabled={available === 0 || hasActiveRental || loading || !station.isActive}
          onClick={() => onRent(station._id)}
          title={hasActiveRental ? "Return your current bike first" : ""}
        >
          {loading ? "..." : "🔑 Rent"}
        </button>
        <button
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
          disabled={!hasActiveRental || loading || !station.isActive}
          onClick={() => onReturn(station._id)}
        >
          {loading ? "..." : "↩️ Return Here"}
        </button>
      </div>

      {!station.isActive && (
        <div style={{ marginTop: "0.625rem", fontSize: "0.75rem", color: "#f87171", textAlign: "center" }}>
          ⚠️ Station temporarily inactive
        </div>
      )}
    </div>
  );
};

export default BikeStationCard;
