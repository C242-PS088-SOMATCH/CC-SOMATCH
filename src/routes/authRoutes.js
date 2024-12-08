const express = require("express");
const passport = require("../config/auth");
const router = express.Router();

// Google OAuth2
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/"); // Redirect to your app's main page
});

module.exports = router;
