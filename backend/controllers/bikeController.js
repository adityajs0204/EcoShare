const Bike = require("../models/Bike");
const Booking = require("../models/Booking");
const User = require("../models/User");

/**
 * @route   GET /api/bikes
 * @desc    Get all active bike stations
 * @access  Protected
 */
const getAllStations = async (req, res) => {
  try {
    const stations = await Bike.find({ isActive: true }).sort({ stationName: 1 });
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/bikes/rent
 * @desc    Rent a bike from a station
 * @access  Protected
 */
const rentBike = async (req, res) => {
  try {
    const { stationId } = req.body;

    if (!stationId) {
      return res.status(400).json({ message: "Station ID is required" });
    }

    // Check if user already has an active rental
    const user = await User.findById(req.user._id);
    if (user.activeBikeRental) {
      return res.status(400).json({ message: "You already have an active bike rental. Please return the bike first." });
    }

    // Find the station
    const station = await Bike.findById(stationId);
    if (!station) {
      return res.status(404).json({ message: "Bike station not found" });
    }
    if (!station.isActive) {
      return res.status(400).json({ message: "This station is currently inactive" });
    }
    if (station.availableBikes <= 0) {
      return res.status(400).json({ message: "No bikes available at this station" });
    }

    // Start the rental
    station.availableBikes -= 1;
    await station.save();

    // Create a booking record for the rental
    const booking = await Booking.create({
      user: req.user._id,
      bike: station._id,
      type: "bike",
      status: "active",
      startTime: new Date(),
    });

    // Track active rental on user
    user.activeBikeRental = booking._id;
    await user.save();

    res.status(201).json({
      message: `Bike rented from ${station.stationName}! Enjoy your ride 🚴`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/bikes/return
 * @desc    Return a rented bike to a station
 * @access  Protected
 */
const returnBike = async (req, res) => {
  try {
    const { stationId } = req.body;

    if (!stationId) {
      return res.status(400).json({ message: "Return station ID is required" });
    }

    // Check if user has an active rental
    const user = await User.findById(req.user._id);
    if (!user.activeBikeRental) {
      return res.status(400).json({ message: "You don't have an active bike rental" });
    }

    // Find the active booking
    const booking = await Booking.findById(user.activeBikeRental);
    if (!booking) {
      return res.status(404).json({ message: "Booking record not found" });
    }

    // Find the return station
    const returnStation = await Bike.findById(stationId);
    if (!returnStation) {
      return res.status(404).json({ message: "Return station not found" });
    }

    // Calculate duration in minutes
    const endTime = new Date();
    const durationMs = endTime - booking.startTime;
    const durationMinutes = Math.round(durationMs / 60000); // ms → minutes

    // Update booking as completed
    booking.endTime = endTime;
    booking.durationMinutes = durationMinutes;
    booking.status = "completed";
    booking.bike = returnStation._id; // Book at return station
    await booking.save();

    // Add bike back to the return station
    returnStation.availableBikes = Math.min(
      returnStation.availableBikes + 1,
      returnStation.totalBikes
    );
    await returnStation.save();

    // Clear user's active rental
    user.activeBikeRental = null;
    await user.save();

    res.json({
      message: `Bike returned to ${returnStation.stationName} successfully!`,
      durationMinutes,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/bikes/active-rental
 * @desc    Check if user has an active bike rental
 * @access  Protected
 */
const getActiveRental = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.activeBikeRental) {
      return res.json({ hasActiveRental: false });
    }

    const booking = await Booking.findById(user.activeBikeRental).populate("bike", "stationName location");
    res.json({ hasActiveRental: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStations, rentBike, returnBike, getActiveRental };
