const mongoose = require("mongoose");

const BugSchema = new mongoose.Schema({
  description: { type: String, required: true },
  screenshot: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bug", BugSchema);
