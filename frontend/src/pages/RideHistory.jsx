import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

/**
 * Ride History Page
 * Tab 1 – My Bookings: rides/bikes booked by the logged-in user (as passenger)
 * Tab 2 – Rides I Offered: rides posted by the user as driver, with passenger list
 */
const RideHistory = () => {
  const [activeTab, setActiveTab]   = useState("bookings"); // "bookings" | "offered"
  const [bookings, setBookings]     = useState([]);
  const [offeredRides, setOfferedRides] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all"); // all | carpool | bike

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bookingsRes, ridesRes] = await Promise.all([
          API.get("/bookings/history"),
          API.get("/rides/my-rides"),
        ]);
        setBookings(bookingsRes.data);
        setOfferedRides(ridesRes.data);
      } catch (err) {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.type === filter);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleDeleteRide = async (rideId) => {
    if (!window.confirm("Are you sure you want to delete this ride? This will also cancel any bookings associated with it.")) return;
    
    try {
      await API.delete(`/rides/${rideId}`);
      toast.success("Ride deleted successfully");
      setOfferedRides(offeredRides.filter((r) => r._id !== rideId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete ride");
    }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.375rem" }}>History</h1>
      <p style={{ color: "#94a3b8", marginBottom: "1.75rem" }}>
        Your bookings and rides you've offered.
      </p>

      {/* ── Main Tabs ── */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.75rem", borderBottom: "1px solid #334155", paddingBottom: "0.75rem" }}>
        <button
          className={`btn btn-sm ${activeTab === "bookings" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("bookings")}
        >
          My Bookings
        </button>
        <button
          className={`btn btn-sm ${activeTab === "offered" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setActiveTab("offered")}
        >
          Rides I Offered
          {offeredRides.length > 0 && (
            <span style={{
              marginLeft: "0.375rem", background: "rgba(255,255,255,0.15)",
              borderRadius: "999px", padding: "0 0.4rem", fontSize: "0.7rem",
            }}>
              {offeredRides.length}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════
          TAB 1 — MY BOOKINGS
      ══════════════════════════════════════════ */}
      {activeTab === "bookings" && (
        <>
          {/* Filter sub-tabs */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
            {["all", "carpool", "bike"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
              >
                {f === "all" ? "All" : f === "carpool" ? "Carpool" : "Bike"}
              </button>
            ))}
            <span style={{ marginLeft: "auto", color: "#64748b", fontSize: "0.875rem", alignSelf: "center" }}>
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "2.5rem" }}>📭</div>
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
                    {/* Left */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: "0.625rem",
                        background: b.type === "carpool"
                          ? "linear-gradient(135deg,#10b981,#059669)"
                          : "linear-gradient(135deg,#6366f1,#4f46e5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.25rem", flexShrink: 0,
                      }}>
                        {b.type === "carpool" ? "🚗" : "🚴"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>
                          {b.type === "carpool" ? (
                            <>{b.ride?.source || "Unknown"} <span style={{ color: "#64748b" }}>→</span> {b.ride?.destination || "Unknown"}</>
                          ) : (
                            <>Bike Rental @ {b.bike?.stationName || "Station"}</>
                          )}
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                          {b.type === "carpool" ? (
                            <>Departure: {formatDate(b.ride?.departureTime)}</>
                          ) : (
                            <>
                              Started: {formatDate(b.startTime)}
                              {b.durationMinutes != null && <> · {b.durationMinutes} min</>}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Right: Status */}
                    <span className={`badge ${
                      b.status === "active" ? "badge-yellow"
                      : b.status === "completed" ? "badge-green"
                      : "badge-red"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════
          TAB 2 — RIDES I OFFERED (DRIVER VIEW)
      ══════════════════════════════════════════ */}
      {activeTab === "offered" && (
        <>
          {offeredRides.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "2.5rem" }}>🚗</div>
              <div style={{ fontWeight: 600, marginTop: "0.75rem" }}>No rides offered yet</div>
              <div style={{ fontSize: "0.875rem", marginTop: "0.375rem" }}>
                Go to <a href="/offer-ride" style={{ color: "#10b981" }}>Offer Ride</a> to post your first trip.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {offeredRides.map((ride) => {
                const passengers = ride.bookedBy || [];
                const isFull = ride.seatsAvailable === 0;

                return (
                  <div key={ride._id} className="card" style={{ padding: "1.5rem" }}>
                    {/* Route + Meta */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: "0.25rem" }}>
                          {ride.source} <span style={{ color: "#64748b" }}>→</span> {ride.destination}
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
                          Departure: {formatDate(ride.departureTime)}
                          &nbsp;·&nbsp;
                          {ride.vehicleType}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span className={`badge ${ride.status === "active" ? "badge-green" : "badge-yellow"}`}>
                          {ride.status}
                        </span>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteRide(ride._id)}
                          title="Delete Ride"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Seats summary */}
                    <div style={{
                      display: "flex", gap: "1rem", marginBottom: "1rem",
                      padding: "0.75rem 1rem",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                    }}>
                      <span style={{ color: "#94a3b8" }}>
                        Seats booked: <strong style={{ color: "#f1f5f9" }}>{passengers.length}</strong>
                      </span>
                      <span style={{ color: "#94a3b8" }}>
                        Seats left: <strong style={{ color: isFull ? "#f87171" : "#34d399" }}>{ride.seatsAvailable}</strong>
                      </span>
                      {ride.notes && (
                        <span style={{ color: "#64748b", fontStyle: "italic" }}>
                          Note: {ride.notes}
                        </span>
                      )}
                    </div>

                    {/* Passenger list */}
                    {passengers.length === 0 ? (
                      <div style={{ fontSize: "0.875rem", color: "#475569", padding: "0.5rem 0" }}>
                        No passengers yet — share this ride!
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                          Passengers
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {passengers.map((p, i) => (
                            <div key={p._id || i} style={{
                              display: "flex", alignItems: "center", gap: "0.75rem",
                              padding: "0.625rem 0.875rem",
                              background: "rgba(16,185,129,0.06)",
                              border: "1px solid rgba(16,185,129,0.15)",
                              borderRadius: "0.5rem",
                            }}>
                              {/* Avatar */}
                              <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.875rem", fontWeight: 700, color: "white", flexShrink: 0,
                              }}>
                                {p.name?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{p.name}</div>
                                <div style={{ fontSize: "0.775rem", color: "#64748b" }}>{p.email}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RideHistory;
