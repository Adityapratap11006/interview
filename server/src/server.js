"use strict";

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const streakRoutes = require("./routes/streakRoutes");
const heatmapRoutes = require("./routes/heatmapRoutes");
const studyListRoutes = require("./routes/studyListRoutes");
const revisionRoutes = require("./routes/revisionRoutes");
const companySheetRoutes = require("./routes/companySheetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const masteryRoutes = require("./routes/masteryRoutes");

const app = express();

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", streakRoutes);
app.use("/api", heatmapRoutes);
app.use("/api", studyListRoutes);
app.use("/api", revisionRoutes);
app.use("/api", companySheetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", masteryRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});