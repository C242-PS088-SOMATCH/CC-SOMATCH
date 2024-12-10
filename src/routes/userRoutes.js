const express = require("express");
const auth = require("../controller/auth");
const userController = require("../controller/users");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", auth.registerUser);

// Login
router.post("/login", auth.loginUser);

// Get All User
router.get("/", userController.getAllUsers);

// Get User
router.get("/user", verifyToken, userController.getUser);

//Update User
router.patch("/edit", verifyToken, userController.updateUser);

//Delete User
router.delete("/delete", verifyToken, userController.deleteUser);

module.exports = router;
