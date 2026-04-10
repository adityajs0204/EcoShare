import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

/**
 * Admin Panel Page
 * Full management dashboard for admins.
 * Tabs: Stats | Users | Rides | Bike Stations | Bookings
 */
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // New station form
  const [stationForm, setStationForm] = useState({ stationName: "", location: "", totalBikes: 10 });
  const [addingStation, setAddingStation] = useState(false);

  // Load data based on active tab
  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab]);

  const loadTab = async (tab) => {
    setLoading(true);
    try {
      if (tab === "stats") {
        const { data } = await API.get("/admin/stats");
        setStats(data);
      } else if (tab === "users") {
        const { data } = await API.get("/admin/users");
        setUsers(data);
      } else if (tab === "rides") {
        const { data } = await API.get("/admin/rides");
        setRides(data);
      } else if (tab === "stations") {
        const { data } = await API.get("/admin/bikes");
        setStations(data);
      } else if (tab === "bookings") {
        const { data } = await API.get("/admin/bookings");
        setBookings(data);
      }
    } catch (err) {
      toast.error(`Failed to load ${tab} data`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteStation = async (id) => {
    if (!window.confirm("Remove this bike station?")) return;
    try {
      await API.delete(`/admin/bikes/${id}`);
      toast.success("Station removed");
      setStations(stations.filter((s) => s._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove station");
    }
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    const { stationName, location, totalBikes } = stationForm;
    if (!stationName || !location || !totalBikes) {
      toast.error("Fill in all fields");
      return;
    }
    setAddingStation(true);
    try {
      const { data } = await API.post("/admin/bikes", {
        ...stationForm,
        totalBikes: parseInt(totalBikes),
      });
      toast.success(`Station "${data.stationName}" added!`);
      setStations([...stations, data]);
      setStationForm({ stationName: "", location: "", totalBikes: 10 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add station");
    } finally {
      setAddingStation(false);
    }
  };

  const tabs = [
    { id: "stats", label: "📊 Stats" },
    { id: "users", label: "👥 Users" },
    { id: "rides", label: "🚗 Rides" },
    { id: "stations", label: "🅿️ Stations" },
    { id: "bookings", label: "📋 Bookings" },
  ];

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Admin Panel ⚙️</h1>
          <p style={{ color: "#94a3b8" }}>Manage the EcoShare platform</p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => loadTab(activeTab)}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{
        display: "flex",
        gap: "0.375rem",
        marginBottom: "1.5rem",
        overflowX: "auto",
        paddingBottom: "0.25rem",
      }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`btn btn-sm ${activeTab === t.id ? "btn-primary" : "btn-secondary"}`}
            style={{ flexShrink: 0 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div className="spinner" />}

      {/* ── STATS ── */}
      {!loading && activeTab === "stats" && stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "#6366f1" },
            { label: "Total Rides", value: stats.totalRides, icon: "🚗", color: "#10b981" },
            { label: "Bike Stations", value: stats.totalBikeStations, icon: "🅿️", color: "#f59e0b" },
            { label: "Total Bookings", value: stats.totalBookings, icon: "📋", color: "#38bdf8" },
            { label: "Active Bookings", value: stats.activeBookings, icon: "⚡", color: "#f43f5e" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: "2rem" }}>{s.icon}</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: s.color, margin: "0.375rem 0" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── USERS ── */}
      {!loading && activeTab === "users" && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: "#94a3b8" }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-blue" : "badge-green"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {u.role !== "admin" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b" }}>No users found</div>}
        </div>
      )}

      {/* ── RIDES ── */}
      {!loading && activeTab === "rides" && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Driver</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Seats</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((r) => (
                <tr key={r._id}>
                  <td>{r.driver?.name || "—"}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{r.source}</span>
                    <span style={{ color: "#64748b", margin: "0 0.25rem" }}>→</span>
                    <span style={{ fontWeight: 600 }}>{r.destination}</span>
                  </td>
                  <td style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                    {new Date(r.departureTime).toLocaleString()}
                  </td>
                  <td>{r.seatsAvailable}</td>
                  <td>
                    <span className={`badge ${r.status === "active" ? "badge-green" : "badge-yellow"}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rides.length === 0 && <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b" }}>No rides found</div>}
        </div>
      )}

      {/* ── BIKE STATIONS ── */}
      {!loading && activeTab === "stations" && (
        <>
          {/* Add Station Form */}
          <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>➕ Add New Station</h3>
            <form onSubmit={handleAddStation}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <label className="input-label" htmlFor="admin-station-name">Station Name</label>
                  <input
                    id="admin-station-name"
                    className="input"
                    type="text"
                    placeholder="e.g. Library Dock"
                    value={stationForm.stationName}
                    onChange={(e) => setStationForm({ ...stationForm, stationName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label" htmlFor="admin-station-loc">Location</label>
                  <input
                    id="admin-station-loc"
                    className="input"
                    type="text"
                    placeholder="e.g. Block C, Campus"
                    value={stationForm.location}
                    onChange={(e) => setStationForm({ ...stationForm, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label" htmlFor="admin-station-bikes">Total Bikes</label>
                  <input
                    id="admin-station-bikes"
                    className="input"
                    type="number"
                    min="1"
                    max="50"
                    value={stationForm.totalBikes}
                    onChange={(e) => setStationForm({ ...stationForm, totalBikes: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={addingStation}>
                {addingStation ? "Adding…" : "Add Station"}
              </button>
            </form>
          </div>

          {/* Stations Table */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Station Name</th>
                  <th>Location</th>
                  <th>Available / Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((s) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600 }}>{s.stationName}</td>
                    <td style={{ color: "#94a3b8" }}>{s.location}</td>
                    <td>{s.availableBikes} / {s.totalBikes}</td>
                    <td>
                      <span className={`badge ${s.isActive ? "badge-green" : "badge-red"}`}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteStation(s._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stations.length === 0 && <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b" }}>No stations found</div>}
          </div>
        </>
      )}

      {/* ── BOOKINGS ── */}
      {!loading && activeTab === "bookings" && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Details</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.user?.name || "—"}</td>
                  <td>
                    <span className={`badge ${b.type === "carpool" ? "badge-green" : "badge-blue"}`}>
                      {b.type === "carpool" ? "🚗" : "🚴"} {b.type}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
                    {b.type === "carpool"
                      ? `${b.ride?.source || "—"} → ${b.ride?.destination || "—"}`
                      : `Station: ${b.bike?.stationName || "—"}`}
                    {b.durationMinutes != null && ` (${b.durationMinutes} min)`}
                  </td>
                  <td>
                    <span className={`badge ${b.status === "active" ? "badge-yellow" : b.status === "completed" ? "badge-green" : "badge-red"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b" }}>No bookings found</div>}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
