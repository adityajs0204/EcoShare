const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Import models
const User = require("./models/User");
const Bike = require("./models/Bike");
const Ride = require("./models/Ride");
const Booking = require("./models/Booking");

/**
 * Seed Script
 * Run with: node seed.js
 * Creates sample admin, users, bike stations, and rides.
 */
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Bike.deleteMany({});
    await Ride.deleteMany({});
    await Booking.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // ── Create Users ──────────────────────────────────────────────────────────
    // Note: Plain text passwords are used here.
    // The User model's pre-save hook automatically hashes them before saving.
    const admin = await User.create({
      name: "Admin User",
      email: "admin@ecoshare.com",
      password: "password123",
      role: "admin",
    });

    const user1 = await User.create({
      name: "Sai Aditya",
      email: "aditya@gmail.com",
      password: "password123",
      role: "user",
    });

    const user2 = await User.create({
      name: "Praneeth Singh",
      email: "praneeth@gmail.com",
      password: "password123",
      role: "user",
    });

    console.log("👥 Users created");

    // ── Create Bike Stations ─────────────────────────────────────────────────
    await Bike.insertMany([
      { stationName: "Gate No. 3", location: "Main Gate, Campus", totalBikes: 12, availableBikes: 10 },
      { stationName: "Library", location: "Admin Block", totalBikes: 8, availableBikes: 8 },
      { stationName: "SR Block", location: "Kaveri Hostel", totalBikes: 15, availableBikes: 12 },
      { stationName: "Ganga B", location: "Main Gate", totalBikes: 6, availableBikes: 4 },
      { stationName: "Admin Block", location: "C Block", totalBikes: 10, availableBikes: 9 },
    ]);
    console.log("🚴 Bike stations created");

    // ── Create Sample Rides ──────────────────────────────────────────────────
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 30, 0);

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(9, 0, 0);

    await Ride.insertMany([
      {
        driver: user1._id,
        source: "Main Gate",
        destination: "Railway Station",
        departureTime: tomorrow,
        seatsAvailable: 3,
        vehicleType: "Car",
        notes: "AC available",
      },
      {
        driver: user2._id,
        source: "Gate No.3",
        destination: "Mangalagiri",
        departureTime: dayAfter,
        seatsAvailable: 1,
        vehicleType: "Bike",
        notes: "Leaving sharp at 9 AM",
      },
      {
        driver: user1._id,
        source: "C Block",
        destination: "Neerukonda",
        departureTime: dayAfter,
        seatsAvailable: 1,
        vehicleType: "Car",
        notes: "Large luggage allowed",
      },
    ]);
    console.log("Sample rides created");

    console.log("\n✨ Seed complete! Login credentials:");
    console.log("   Admin  → admin@ecoshare.com | password123");
    console.log("   User 1 → aditya@gmail.com   | password123");
    console.log("   User 2 → praneeth@gmail.com | password123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seed();
