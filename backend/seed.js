const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Import models
const User = require("./models/User");
const Bike = require("./models/Bike");
const Ride = require("./models/Ride");

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
      name: "Aditya Kumar",
      email: "aditya@campus.edu",
      password: "password123",
      role: "user",
    });

    const user2 = await User.create({
      name: "Priya Sharma",
      email: "priya@campus.edu",
      password: "password123",
      role: "user",
    });

    console.log("👥 Users created");

    // ── Create Bike Stations ─────────────────────────────────────────────────
    await Bike.insertMany([
      { stationName: "Main Gate Dock", location: "Main Gate, Campus", totalBikes: 12, availableBikes: 10 },
      { stationName: "Library Hub", location: "Central Library, Block A", totalBikes: 8, availableBikes: 8 },
      { stationName: "Hostel Cluster", location: "Boys Hostel, Block C", totalBikes: 15, availableBikes: 12 },
      { stationName: "Sports Complex", location: "Sports Ground, South Campus", totalBikes: 6, availableBikes: 4 },
      { stationName: "Cafeteria Point", location: "Main Cafeteria, Block B", totalBikes: 10, availableBikes: 9 },
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
        destination: "City Centre Mall",
        departureTime: tomorrow,
        seatsAvailable: 3,
        vehicleType: "Car",
        notes: "AC available",
      },
      {
        driver: user2._id,
        source: "Hostel Block A",
        destination: "Railway Station",
        departureTime: dayAfter,
        seatsAvailable: 2,
        vehicleType: "SUV",
        notes: "Leaving sharp at 9 AM",
      },
      {
        driver: user1._id,
        source: "Campus Library",
        destination: "Airport",
        departureTime: dayAfter,
        seatsAvailable: 1,
        vehicleType: "Car",
        notes: "Large luggage allowed",
      },
    ]);
    console.log("🚗 Sample rides created");

    console.log("\n✨ Seed complete! Login credentials:");
    console.log("   Admin  → admin@ecoshare.com  | password123");
    console.log("   User 1 → aditya@campus.edu   | password123");
    console.log("   User 2 → priya@campus.edu    | password123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seed();
