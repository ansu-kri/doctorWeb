const express = require("express");
const { signup, login, logout, getMe, updateMe } = require("../Controllers/auth.controllers");
const router = express.Router();
const upload = require("../services/upload");
const { protect } = require("../middleware/auth.middleware");

router.post("/signup", upload.single("profilePic"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.patch("/me", protect, upload.single("profilePic"), updateMe);

module.exports = router;
