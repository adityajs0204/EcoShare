const express = require("express");
const router = express.Router();
const { getMyBookings } = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

// @route GET /api/bookings/history
router.get("/history", protect, getMyBookings);

module.exports = router;
