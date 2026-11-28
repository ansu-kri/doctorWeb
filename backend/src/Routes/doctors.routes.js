const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { getAlldoctors, getDoctorById, getAvailability } = require("../Controllers/user.controllers");
const { addReview } = require("../Controllers/review.controllers");
const {
  getDoctorStats,
  getDoctorAppointments,
  getDoctorPatients,
  getDoctorAvailability,
  updateDoctorAvailability,
  updateDoctorProfile,
} = require("../Controllers/doctor.controllers");
const { upload, validateImageContent } = require("../services/upload");
const { permit } = require("../middleware/role.middleware");

router.get("/doctors", getAlldoctors);
router.get("/doctors/:id", getDoctorById);
router.get("/doctors/:id/availability", getAvailability);
router.post("/doctors/:id/reviews", protect, addReview);
router.get("/doctor/stats", protect, permit("doctor"), getDoctorStats);

router.get("/doctor/appointments", protect, permit("doctor"), getDoctorAppointments);

router.get("/doctor/patients", protect, permit("doctor"), getDoctorPatients);

router.get("/doctor/availability", protect, permit("doctor"), getDoctorAvailability);

router.patch(
  "/doctor/availability",
  protect,
  permit("doctor"),
  updateDoctorAvailability
);

router.patch(
  "/doctor/profile",
  protect,
  permit("doctor"),
  upload.single("profilePic"),
  validateImageContent,
  updateDoctorProfile
);

module.exports = router;