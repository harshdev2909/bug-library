const express = require("express");
const ApiKey = require("../models/ApiKey");
const generateApiKey = require("../utils/generateApiKey");
const authMiddleware = require("../middleware/apiKeyAuth"); // Ensure user is logged in

const router = express.Router();

// Generate API Key
router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const existingKey = await ApiKey.findOne({ userId: req.user.id });

    if (existingKey) {
      return res.status(400).json({ message: "API key already exists", key: existingKey.key });
    }

    const newKey = generateApiKey();
    const apiKey = new ApiKey({ userId: req.user.id, key: newKey });
    await apiKey.save();

    res.json({ message: "API key generated successfully", key: newKey });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get API Key
router.get("/", authMiddleware, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({ userId: req.user.id });

    if (!apiKey) {
      return res.status(404).json({ message: "No API key found" });
    }

    res.json({ key: apiKey.key });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
