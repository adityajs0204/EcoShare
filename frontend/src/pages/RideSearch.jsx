import { useState, useEffect } from "react";
import API from "../api/axios";
import RideCard from "../components/RideCard";
import toast from "react-hot-toast";

/**
 * Ride Search Page
 * Allows users to search/filter rides by source, destination, and date.
 * Displays results as RideCard components.
 */
const RideSearch = () => {
  const [filters, setFilters] = useState({ source: "", destination: "", date: "" });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null); // tracks which ride is being booked
  const [searched, setSearched] = useState(false);

  // Load all rides on mount
  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await API.get("/rides/search", { params });
      setRides(data);
      setSearched(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load rides");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRides(filters);
  };

  const handleClear = () => {
    setFilters({ source: "", destination: "", date: "" });
    fetchRides({});
  };

  const handleBook = async (rideId) => {
    setBookingId(rideId);
    try {
      await API.post(`/rides/book/${rideId}`);
      toast.success("🎉 Ride booked successfully!");
      // Refresh rides to update seat count
      fetchRides(filters);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="page">
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.375rem" }}>Find a Ride 🔍</h1>
      <p style={{ color: "#94a3b8", marginBottom: "1.75rem" }}>
        Search for available carpool rides across campus.
      </p>

      {/* ── Search Filters ── */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.75rem" }}>
        <form onSubmit={handleSearch}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem",
          }}>
            <div>
              <label className="input-label" htmlFor="search-source">From</label>
              <input
                id="search-source"
                className="input"
                type="text"
                placeholder="e.g. Main Gate"
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label" htmlFor="search-dest">To</label>
              <input
                id="search-dest"
                className="input"
                type="text"
                placeholder="e.g. Library"
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label" htmlFor="search-date">Date</label>
              <input
                id="search-date"
                className="input"
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Searching…" : "🔍 Search"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* ── Results ── */}
      {loading && !searched ? (
        <div className="spinner" />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", color: "#94a3b8" }}>
              {rides.length} ride{rides.length !== 1 ? "s" : ""} found
            </h2>
          </div>

          {rides.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem" }}>🚗</div>
              <div style={{ marginTop: "0.75rem", fontWeight: 600 }}>No rides found</div>
              <div style={{ fontSize: "0.875rem", marginTop: "0.375rem" }}>
                Try different filters or{" "}
                <a href="/offer-ride" style={{ color: "#10b981" }}>offer the first one!</a>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {rides.map((ride) => (
                <RideCard
                  key={ride._id}
                  ride={ride}
                  onBook={handleBook}
                  loading={bookingId === ride._id}
                  showBook={true}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RideSearch;
