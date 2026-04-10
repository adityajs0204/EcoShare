import { useState, useEffect } from "react";
import API from "../api/axios";
import BikeStationCard from "../components/BikeStationCard";
import toast from "react-hot-toast";

/**
 * Bike Rental Page
 * Shows all bike stations. Allows user to rent or return a bike.
 * Tracks whether user has an active rental.
 */
const BikeRental = () => {
  const [stations, setStations] = useState([]);
  const [activeRental, setActiveRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null); // station ID with pending action

  const fetchData = async () => {
    try {
      const [stationsRes, rentalRes] = await Promise.all([
        API.get("/bikes"),
        API.get("/bikes/active-rental"),
      ]);
      setStations(stationsRes.data);
      setActiveRental(rentalRes.data.hasActiveRental ? rentalRes.data : null);
    } catch (err) {
      toast.error("Failed to load bike data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRent = async (stationId) => {
    setActionId(stationId);
    try {
      await API.post("/bikes/rent", { stationId });
      toast.success("🚴 Bike rented! Have a safe ride.");
      await fetchData(); // Refresh state
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rent bike");
    } finally {
      setActionId(null);
    }
  };

  const handleReturn = async (stationId) => {
    setActionId(stationId);
    try {
      const { data } = await API.post("/bikes/return", { stationId });
      toast.success(`✅ Bike returned! Duration: ${data.durationMinutes} minutes.`);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to return bike");
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.375rem" }}>Bike Rental 🚴</h1>
      <p style={{ color: "#94a3b8", marginBottom: "1.75rem" }}>
        Rent eco-friendly bikes from campus docking stations.
      </p>

      {/* ── Active Rental Banner ── */}
      {activeRental && (
        <div style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.25)",
          borderRadius: "0.75rem",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}>
          <span style={{ fontSize: "2rem" }}>🚴</span>
          <div>
            <div style={{ fontWeight: 700, color: "#fbbf24" }}>Active Rental</div>
            <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
              Rented from{" "}
              <strong style={{ color: "#f1f5f9" }}>
                {activeRental.booking?.bike?.stationName || "a station"}
              </strong>{" "}
              at{" "}
              {activeRental.booking?.startTime
                ? new Date(activeRental.booking.startTime).toLocaleTimeString()
                : ""}
              . Return the bike below.
            </div>
          </div>
        </div>
      )}

      {/* ── Summary Bar ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "0.75rem",
        marginBottom: "1.75rem",
      }}>
        {[
          { label: "Total Stations", value: stations.length, icon: "🅿️" },
          { label: "Active Stations", value: stations.filter((s) => s.isActive).length, icon: "✅" },
          {
            label: "Bikes Available",
            value: stations.reduce((acc, s) => acc + s.availableBikes, 0),
            icon: "🚴",
          },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: "1rem" }}>
            <div style={{ fontSize: "1.5rem" }}>{s.icon}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#10b981", margin: "0.25rem 0" }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Station Grid ── */}
      {stations.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: "3rem" }}>🚴</div>
          <div style={{ fontWeight: 600, marginTop: "0.75rem" }}>No bike stations found</div>
          <div style={{ fontSize: "0.875rem", marginTop: "0.375rem" }}>Ask an admin to add stations.</div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}>
          {stations.map((station) => (
            <BikeStationCard
              key={station._id}
              station={station}
              onRent={handleRent}
              onReturn={handleReturn}
              hasActiveRental={!!activeRental}
              loading={actionId === station._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BikeRental;
