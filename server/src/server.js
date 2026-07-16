"use strict";

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");

const app = express();

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});