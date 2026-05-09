const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { permit } = require("../middleware/role.middleware");

const { getAlldoctors } = require("../Controllers/user.controllers");

// All logged-in users can access
router.get(
  "/doctors",
  protect,
  getAlldoctors
);

module.exports = router;