const express = require('express');
const { signup, login, logout } = require('../Controllers/auth.controllers');
const router = express.Router();
const upload = require("../services/upload");
const getAlldoctors = require('../Controllers/user.controllers');

//============== Auth Routes======================
router.post("/signup", upload.single("profilePic"), signup);
router.post("/login", login);
router.post('/logout', logout);

//=========== Doctors Routes===================
router.get("/doctors", getAlldoctors)

module.exports = router;