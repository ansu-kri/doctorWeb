const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { getAlldoctors, getDoctorById, getAvailability } = require("../Controllers/user.controllers");
const { addReview } = require("../Controllers/review.controllers");

router.get("/doctors", getAlldoctors);
router.get("/doctors/:id", getDoctorById);
router.get("/doctors/:id/availability", getAvailability);
router.post("/doctors/:id/reviews", protect, addReview);

module.exports = router;
