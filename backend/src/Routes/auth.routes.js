const express = require('express');
const { signup, login, logout } = require('../Controllers/auth.controllers');
const router = express.Router();
const upload = require("../services/upload");

//============== Auth Routes======================
router.post("/signup", upload.single("profilePic"), signup);
router.post("/login", login);
router.post('/logout', logout);


module.exports = router;