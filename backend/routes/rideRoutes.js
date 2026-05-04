const express = require("express");
const router = express.Router();
const {
  createRide,
  searchRides,
  bookRide,
  getMyRides,
  getRideById,
  deleteRide,
} = require("../controllers/rideController");
const { protect } = require("../middleware/auth");

// All ride routes require authentication
router.use(protect);

// @route POST /api/rides/create
router.post("/create", createRide);

// @route GET /api/rides/search
router.get("/search", searchRides);

// @route GET /api/rides/my-rides
router.get("/my-rides", getMyRides);

// @route GET /api/rides/:id
router.get("/:id", getRideById);

// @route POST /api/rides/book/:id
router.post("/book/:id", bookRide);

// @route DELETE /api/rides/:id
router.delete("/:id", deleteRide);

module.exports = router;
