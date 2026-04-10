const mongoose = require("mongoose");

/**
 * Bike Station Schema
 * Represents a campus bike docking station.
 */
const bikeSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: [true, "Station name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location/address is required"],
      trim: true,
    },
    totalBikes: {
      type: Number,
      required: true,
      default: 10,
    },
    availableBikes: {
      type: Number,
      required: true,
      default: 10,
    },
    // Geo coordinates (optional, for map integration)
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bike", bikeSchema);
