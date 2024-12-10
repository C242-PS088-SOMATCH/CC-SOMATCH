const express = require("express");
const passport = require("../config/auth");

const router = express.Router();

// Login with Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/auth/google/failure" }), (req, res) => {
  // On success, return user info or redirect
  res.status(200).json({
    message: "Authentication successful",
    user: req.user,
  });
});

// Handle login failure
router.get("/google/failure", (req, res) => {
  res.status(401).json({ message: "Authentication failed" });
});

module.exports = router;
