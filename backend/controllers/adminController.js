const User = require("../models/User");
const Ride = require("../models/Ride");
const Bike = require("../models/Bike");
const Booking = require("../models/Booking");

/**
 * @route   GET /api/admin/users
 * @desc    Get all registered users
 * @access  Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user by ID
 * @access  Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Cannot delete admin users" });
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/admin/rides
 * @desc    Get all rides
 * @access  Admin
 */
const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate("driver", "name email")
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/admin/bikes
 * @desc    Get all bike stations
 * @access  Admin
 */
const getAllBikeStations = async (req, res) => {
  try {
    const stations = await Bike.find().sort({ stationName: 1 });
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/admin/bikes
 * @desc    Add a new bike station
 * @access  Admin
 */
const addBikeStation = async (req, res) => {
  try {
    const { stationName, location, totalBikes, coordinates } = req.body;

    if (!stationName || !location || !totalBikes) {
      return res.status(400).json({ message: "Station name, location, and total bikes are required" });
    }

    const station = await Bike.create({
      stationName,
      location,
      totalBikes,
      availableBikes: totalBikes, // All bikes available on creation
      coordinates: coordinates || { lat: null, lng: null },
    });

    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/admin/bikes/:id
 * @desc    Update a bike station
 * @access  Admin
 */
const updateBikeStation = async (req, res) => {
  try {
    const station = await Bike.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!station) return res.status(404).json({ message: "Station not found" });
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/admin/bikes/:id
 * @desc    Remove a bike station
 * @access  Admin
 */
const deleteBikeStation = async (req, res) => {
  try {
    const station = await Bike.findById(req.params.id);
    if (!station) return res.status(404).json({ message: "Station not found" });
    await station.deleteOne();
    res.json({ message: "Bike station removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all bookings (carpool + bike)
 * @access  Admin
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("ride", "source destination")
      .populate("bike", "stationName")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get platform-wide statistics for dashboard
 * @access  Admin
 */
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalRides, totalBikeStations, totalBookings, activeBookings] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        Ride.countDocuments(),
        Bike.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: "active" }),
      ]);

    res.json({
      totalUsers,
      totalRides,
      totalBikeStations,
      totalBookings,
      activeBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllRides,
  getAllBikeStations,
  addBikeStation,
  updateBikeStation,
  deleteBikeStation,
  getAllBookings,
  getStats,
};
