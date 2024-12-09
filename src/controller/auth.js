const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../models/users");

const registerUser = async (req, res) => {
  const { body } = req;
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const [result] = await auth.registerUser(body, hashedPassword);
    res.status(201).json({ message: "User registered successfully", userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { body } = req;
  try {
    const [rows] = await auth.loginUser(body);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(body.password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
