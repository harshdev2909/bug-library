const express = require("express");
const router = express.Router();
const BugReport = require("../models/Bug");
const User = require("../models/User");
const cloudinary = require("../cloudinaryConfig"); // Import cloudinary configuration

// **1️⃣ Submit a Bug Report**
router.post("/submit", async (req, res) => {
  try {
    const { apiKey, description, screenshot } = req.body;

    // Validate API Key
    const user = await User.findOne({ apiKey });
    if (!user) return res.status(403).json({ message: "Invalid API Key" });

    let uploadedScreenshot = null;
    if (screenshot) {
      // Upload screenshot to Cloudinary (base64 format)
      /**
       * Uploads a screenshot to Cloudinary.
       *
       * @param {string} screenshot - The base64 encoded image or image URL to be uploaded.
       * @returns {Promise<Object>} The response from Cloudinary after the upload is complete.
       * @throws {Error} If the upload fails.
       */
      const uploadResponse = await cloudinary.uploader.upload(screenshot, {
        resource_type: "image", // Specifies that the file is an image
        public_id: `bug-reports/${Date.now()}`, // Optional: You can set a custom public ID
        overwrite: true, // Set to true if you want to overwrite any existing image with the same public ID
      });
      
      // Store the Cloudinary image URL
      uploadedScreenshot = uploadResponse.secure_url; // The URL of the uploaded image
    }
    console.log(uploadedScreenshot);
    // Create a new bug report in the database
    const bugReport = new BugReport({
      apiKey,
      description,
      screenshot: uploadedScreenshot, // Store the Cloudinary image URL
    });

    await bugReport.save();
    res.status(201).json({ message: "Bug reported successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;