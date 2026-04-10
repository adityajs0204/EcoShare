const mongoose = require("mongoose");

/**
 * Booking Schema
 * Tracks both carpool ride bookings and bike rental sessions.
 */
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Only one of 'ride' or 'bike' is populated, based on 'type'
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      default: null,
    },
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      default: null,
    },
    // Discriminator: which kind of booking is this?
    type: {
      type: String,
      enum: ["carpool", "bike"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    // For bike rentals: track start/end time and compute duration
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
    // Duration in minutes (calculated on return)
    durationMinutes: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
