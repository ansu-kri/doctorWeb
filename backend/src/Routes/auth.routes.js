const express = require("express");
const {
  signup,
  login,
  logout,
  getMe,
  updateMe,
  deleteMeProfileImage,
} = require("../Controllers/auth.controllers");
const router = express.Router();
const { upload, validateImageContent } = require("../services/upload");
const { protect } = require("../middleware/auth.middleware");

router.post("/signup", upload.single("profilePic"), validateImageContent, signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.patch("/me", protect, upload.single("profilePic"), validateImageContent, updateMe);
router.delete("/me/profile-image", protect, deleteMeProfileImage);

module.exports = router;
