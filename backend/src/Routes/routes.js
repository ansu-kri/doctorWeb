const express = require('express');
const { signup, login, logout } = require('../Controllers/auth.controllers');
const router = express.Router();
const upload = require("../services/upload");

router.post("/signup", upload.single("profilePic"), signup);
router.post("/login", login);
// router.get('/logout', logout);

module.exports = router;