const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables from .env file
dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rides", require("./routes/rideRoutes"));
app.use("/api/bikes", require("./routes/bikeRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🌿 Eco-Share API is running!", version: "1.0.0" });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── DB + Server Startup ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

/**
 * Try connecting to the configured MONGO_URI first.
 * If that fails (e.g. MongoDB not installed locally), fall back to
 * mongodb-memory-server so the app can still run without any MongoDB setup.
 */
const startServer = async () => {
  let mongoUri = process.env.MONGO_URI;
  let usingMemoryServer = false;

  try {
    // Attempt real MongoDB connection (5s timeout)
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ MongoDB Connected:", mongoose.connection.host);
  } catch (realErr) {
    console.warn("⚠️  Real MongoDB unavailable:", realErr.message);
    console.log("🔄 Falling back to in-memory MongoDB...");

    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      usingMemoryServer = true;
      console.log("✅ In-memory MongoDB started at:", mongoUri);

      // Auto-seed sample data when using in-memory DB
      await seedSampleData();
    } catch (memErr) {
      console.error("❌ Could not start in-memory MongoDB:", memErr.message);
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    if (usingMemoryServer) {
      console.log("📦 Using IN-MEMORY database (data resets on restart)");
      console.log("   Demo logins:");
      console.log("   Admin → admin@ecoshare.com  | password123");
      console.log("   User  → aditya@gmail.com   | password123");
    }
  });
};

/**
 * Seed sample data into the in-memory database so the app is immediately usable.
 */
const seedSampleData = async () => {
  const User = require("./models/User");
  const Bike = require("./models/Bike");
  const Ride = require("./models/Ride");

  try {
    // Create users (passwords hashed via pre-save hook)
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

    // Create bike stations
    const bikeStations = [
      { stationName: "Main Gate Dock", location: "Main Gate, Campus", totalBikes: 12, availableBikes: 10 },
      { stationName: "Library Hub", location: "Central Library, Block A", totalBikes: 8, availableBikes: 8 },
      { stationName: "Hostel Cluster", location: "Boys Hostel, Block C", totalBikes: 15, availableBikes: 12 },
      { stationName: "Sports Complex", location: "Sports Ground, South Campus", totalBikes: 6, availableBikes: 4 },
      { stationName: "Cafeteria Point", location: "Main Cafeteria, Block B", totalBikes: 10, availableBikes: 9 },
    ];
    for (const s of bikeStations) await Bike.create(s);

    // Create sample rides (tomorrow + day after)
    const t1 = new Date(Date.now() + 20 * 60 * 60 * 1000); // +20 hours
    const t2 = new Date(Date.now() + 44 * 60 * 60 * 1000); // +44 hours
    const t3 = new Date(Date.now() + 30 * 60 * 60 * 1000); // +30 hours

    await Ride.create({ driver: user1._id, source: "Main Gate", destination: "City Centre Mall", departureTime: t1, seatsAvailable: 3, vehicleType: "Car", notes: "AC available" });
    await Ride.create({ driver: user2._id, source: "Hostel Block A", destination: "Railway Station", departureTime: t2, seatsAvailable: 2, vehicleType: "SUV", notes: "Leaving sharp on time" });
    await Ride.create({ driver: user1._id, source: "Campus Library", destination: "Airport", departureTime: t3, seatsAvailable: 1, vehicleType: "Car", notes: "Large luggage allowed" });


    console.log("🌱 Sample data seeded successfully");
  } catch (err) {
    console.warn("Seed warning:", err.message);
  }
};

startServer();
