const express = require('express');
const Signup = require('../Controllers/auth.controllers')
const router = express.Router();
const upload = require("../services/upload")

router.post("/signup", upload.single("profilePicture"), Signup);
router.get("/login", (req,res) => {
    res.send("login successful")
})
router.get('/logout', (req,res) =>{
    res.send("logout endpoint")
})

module.exports = router