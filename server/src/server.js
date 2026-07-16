"use strict";

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const streakRoutes = require("./routes/streakRoutes");

const app = express();

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", streakRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});