const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // Generate API Keys
const User = require("../models/User");

// JWT Secret Key (Move to .env in production)
const JWT_SECRET = "your_jwt_secret_key_here";

// **1️⃣ Register New User**
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const apiKey = uuidv4(); // Generate a unique API key
    user = new User({ name, email, password, apiKey });
    await user.save();

    res.status(201).json({ message: "User registered successfully", apiKey });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// **2️⃣ User Login**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, apiKey: user.apiKey });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// **3️⃣ Get API Key for a User**
router.get("/apikey/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ apiKey: user.apiKey });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
