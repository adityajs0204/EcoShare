const Booking = require("../models/Booking");

/**
 * @route   GET /api/bookings/history
 * @desc    Get all bookings (carpool + bike) for the logged-in user
 * @access  Protected
 */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("ride", "source destination departureTime status")
      .populate("bike", "stationName location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyBookings };
