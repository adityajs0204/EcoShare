const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllRides,
  getAllBikeStations,
  addBikeStation,
  updateBikeStation,
  deleteBikeStation,
  getAllBookings,
  getStats,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

// All admin routes: must be authenticated AND be an admin
router.use(protect, adminOnly);

// Stats
router.get("/stats", getStats);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Rides
router.get("/rides", getAllRides);

// Bike Stations
router.get("/bikes", getAllBikeStations);
router.post("/bikes", addBikeStation);
router.put("/bikes/:id", updateBikeStation);
router.delete("/bikes/:id", deleteBikeStation);

// Bookings
router.get("/bookings", getAllBookings);

module.exports = router;
