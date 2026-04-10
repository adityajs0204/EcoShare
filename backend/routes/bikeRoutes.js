const express = require("express");
const router = express.Router();
const {
  getAllStations,
  rentBike,
  returnBike,
  getActiveRental,
} = require("../controllers/bikeController");
const { protect } = require("../middleware/auth");

// All bike routes require authentication
router.use(protect);

// @route GET /api/bikes
router.get("/", getAllStations);

// @route GET /api/bikes/active-rental
router.get("/active-rental", getActiveRental);

// @route POST /api/bikes/rent
router.post("/rent", rentBike);

// @route POST /api/bikes/return
router.post("/return", returnBike);

module.exports = router;
