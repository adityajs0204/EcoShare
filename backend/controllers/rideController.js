const Ride = require("../models/Ride");
const Booking = require("../models/Booking");

/**
 * @route   POST /api/rides/create
 * @desc    Create a new carpool ride (driver only)
 * @access  Protected
 */
const createRide = async (req, res) => {
  try {
    const { source, destination, departureTime, seatsAvailable, notes, vehicleType } = req.body;

    if (!source || !destination || !departureTime || !seatsAvailable) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Departure time must be in the future
    if (new Date(departureTime) < new Date()) {
      return res.status(400).json({ message: "Departure time must be in the future" });
    }

    const ride = await Ride.create({
      driver: req.user._id,
      source,
      destination,
      departureTime,
      seatsAvailable,
      notes: notes || "",
      vehicleType: vehicleType || "Car",
    });

    // Populate driver info for response
    await ride.populate("driver", "name email");

    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/rides/search
 * @desc    Search rides by source/destination/date (all optional filters)
 * @access  Protected
 */
const searchRides = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    // Build dynamic filter object
    let filter = { status: "active", seatsAvailable: { $gt: 0 } };

    if (source) {
      filter.source = { $regex: source, $options: "i" }; // case-insensitive search
    }
    if (destination) {
      filter.destination = { $regex: destination, $options: "i" };
    }
    if (date) {
      // Filter rides happening on a specific calendar date
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.departureTime = { $gte: start, $lt: end };
    }

    const rides = await Ride.find(filter)
      .populate("driver", "name email")
      .sort({ departureTime: 1 }); // Sort by soonest departure

    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/rides/book/:id
 * @desc    Book a seat on a ride
 * @access  Protected
 */
const bookRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Cannot book your own ride
    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot book your own ride" });
    }

    // Check if already booked
    if (ride.bookedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already booked this ride" });
    }

    // Check seat availability
    if (ride.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available for this ride" });
    }

    // Decrement available seats and add user to bookedBy
    ride.seatsAvailable -= 1;
    ride.bookedBy.push(req.user._id);
    await ride.save();

    // Create a booking record
    const booking = await Booking.create({
      user: req.user._id,
      ride: ride._id,
      type: "carpool",
      status: "active",
    });

    res.status(201).json({ message: "Ride booked successfully!", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/rides/my-rides
 * @desc    Get all rides offered by the logged-in user
 * @access  Protected
 */
const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .populate("bookedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/rides/:id
 * @desc    Get a single ride by ID
 * @access  Protected
 */
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("driver", "name email");
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/rides/:id
 * @desc    Delete a ride posted by the logged-in driver
 * @access  Protected (driver only)
 */
const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // Only the driver who created the ride can delete it
    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this ride" });
    }

    // Clean up all bookings linked to this ride
    await Booking.deleteMany({ ride: ride._id });

    await ride.deleteOne();
    res.json({ message: "Ride deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRide, searchRides, bookRide, getMyRides, getRideById, deleteRide };
