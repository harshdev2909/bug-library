const ApiKey = require("../models/ApiKey");

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    return res.status(401).json({ message: "API key required" });
  }

  const validKey = await ApiKey.findOne({ key: apiKey });

  if (!validKey) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  next();
};

module.exports = apiKeyAuth;
