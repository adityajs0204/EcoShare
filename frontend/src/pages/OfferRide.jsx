import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

/**
 * Offer Ride Page
 * Allows a logged-in user (driver) to create a new carpool ride listing.
 */
const OfferRide = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    source: "",
    destination: "",
    departureTime: "",
    seatsAvailable: 1,
    vehicleType: "Car",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { source, destination, departureTime, seatsAvailable } = form;

    if (!source || !destination || !departureTime || !seatsAvailable) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(departureTime) < new Date()) {
      toast.error("Departure time must be in the future");
      return;
    }

    setLoading(true);
    try {
      await API.post("/rides/create", {
        ...form,
        seatsAvailable: parseInt(seatsAvailable),
      });
      toast.success("🚗 Ride posted successfully!");
      navigate("/rides");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  // Compute min datetime (now, for departure picker)
  const minDateTime = new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16);

  return (
    <div className="page" style={{ maxWidth: 620 }}>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.375rem" }}>Offer a Ride 🚗</h1>
      <p style={{ color: "#94a3b8", marginBottom: "1.75rem" }}>
        Share your commute and help reduce campus traffic.
      </p>

      <div className="card" style={{ padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
          {/* Source */}
          <div className="form-group">
            <label className="input-label" htmlFor="offer-source">
              From <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="offer-source"
              name="source"
              className="input"
              type="text"
              placeholder="e.g. Main Gate, Hostel Block A"
              value={form.source}
              onChange={handleChange}
              required
            />
          </div>

          {/* Destination */}
          <div className="form-group">
            <label className="input-label" htmlFor="offer-dest">
              To <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="offer-dest"
              name="destination"
              className="input"
              type="text"
              placeholder="e.g. City Centre, Railway Station"
              value={form.destination}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date + Time */}
          <div className="form-group">
            <label className="input-label" htmlFor="offer-time">
              Departure Date & Time <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="offer-time"
              name="departureTime"
              className="input"
              type="datetime-local"
              min={minDateTime}
              value={form.departureTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Seats + Vehicle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="input-label" htmlFor="offer-seats">
                Seats Available <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                id="offer-seats"
                name="seatsAvailable"
                className="input"
                type="number"
                min="1"
                max="8"
                value={form.seatsAvailable}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="offer-vehicle">Vehicle Type</label>
              <select
                id="offer-vehicle"
                name="vehicleType"
                className="input"
                value={form.vehicleType}
                onChange={handleChange}
                style={{ appearance: "none" }}
              >
                <option value="Car">🚗 Car</option>
                <option value="Bike">🏍️ Bike</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="input-label" htmlFor="offer-notes">Notes (optional)</label>
            <input
              id="offer-notes"
              name="notes"
              className="input"
              type="text"
              placeholder="e.g. AC available, no smoking"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="divider" />

          <button
            id="offer-submit"
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Posting ride…" : "Post Ride 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfferRide;
