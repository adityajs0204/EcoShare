const mongoose = require("mongoose");

/**
 * Ride Schema
 * Represents a carpool ride offered by a driver.
 */
const rideSchema = new mongoose.Schema(
  {
    // The user who created/offers the ride
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    source: {
      type: String,
      required: [true, "Source location is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    departureTime: {
      type: Date,
      required: [true, "Departure time is required"],
    },
    seatsAvailable: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: 1,
      max: 8,
    },
    // Array of user IDs who booked this ride
    bookedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    // Optional notes from the driver (e.g., AC available, luggage space)
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    vehicleType: {
      type: String,
      enum: ["Car", "SUV", "Bike", "Auto"],
      default: "Car",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
