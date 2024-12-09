const express = require("express");
const auth = require("../controller/auth");

const router = express.Router();

// Register
router.post("/register", auth.registerUser);

// Login
router.post("/login", auth.loginUser);

module.exports = router;
