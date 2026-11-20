const express = require("express");
const router = express.Router();
const {
  getSpecialties,
  getServices,
  getStats,
  createContact,
} = require("../Controllers/catalog.controllers");

router.get("/specialties", getSpecialties);
router.get("/services", getServices);
router.get("/public-stats", getStats);
router.post("/contact", createContact);

module.exports = router;
