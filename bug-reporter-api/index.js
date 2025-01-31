require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bugRoutes = require("./routes/Bug");
const app = express();
app.use(express.json());
app.use(cors());
const api = require("./routes/apiKeyRoutes");
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.use("/api/bugs",api);
app.use("/api/bugs", bugRoutes);