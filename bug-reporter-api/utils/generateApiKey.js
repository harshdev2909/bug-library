const crypto = require("crypto");

const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex"); // 64-character API key
};

module.exports = generateApiKey;
