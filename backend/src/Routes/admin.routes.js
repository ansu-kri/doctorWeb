const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { permit } = require("../middleware/role.middleware");
const { upload, validateImageContent } = require("../services/upload");
const admin = require("../Controllers/admin.controllers");

router.use(protect, permit("admin"));

router.get("/stats", admin.dashboard);
router.get("/users", admin.listUsers);
router.post("/users", upload.single("profilePic"), validateImageContent, admin.createUser);
router.patch("/users/:id", upload.single("profilePic"), validateImageContent, admin.updateUser);
router.delete("/users/:id", admin.deleteUser);

router.get("/appointments", admin.listAppointments);
router.patch("/appointments/:id", admin.updateAppointment);

router.get("/specialties", admin.listSpecialties);
router.post("/specialties", admin.saveSpecialty);
router.patch("/specialties/:id", admin.saveSpecialty);
router.delete("/specialties/:id", admin.deleteSpecialty);

router.get("/services", admin.listServices);
router.post("/services", admin.saveService);
router.patch("/services/:id", admin.saveService);
router.delete("/services/:id", admin.deleteService);

module.exports = router;
