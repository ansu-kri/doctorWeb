const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  createAppointment,
  myAppointments,
  updateAppointmentStatus,
} = require("../Controllers/booking.controllers");
const { getNotifications, markRead } = require("../Controllers/notification.controllers");

router.post("/appointments", protect, createAppointment);
router.get("/appointments", protect, myAppointments);
router.patch("/appointments/:id", protect, updateAppointmentStatus);
router.get("/notifications", protect, getNotifications);
router.patch("/notifications/read", protect, markRead);

module.exports = router;
