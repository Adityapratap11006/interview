"use strict";

const Problem = require("../models/Problem");

const getHeatmap = async (req, res) => {
  try {
    const userId = req.user._id;

    const solvedProblems = await Problem.find({
      user: userId,
      status: "Solved",
      solvedAt: { $exists: true, $ne: null }
    }).select("solvedAt");

    const heatmapData = {};

    solvedProblems.forEach((problem) => {
      const date = new Date(problem.solvedAt);
      const dateStr = date.toISOString().split("T")[0];

      if (!heatmapData[dateStr]) {
        heatmapData[dateStr] = 0;
      }

      heatmapData[dateStr]++;
    });

    const heatmap = Object.keys(heatmapData)
      .map((date) => ({
        date,
        count: heatmapData[date]
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.status(200).json({
      success: true,
      heatmap
    });
  } catch (error) {
    console.error("Get heatmap error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching heatmap data"
    });
  }
};

module.exports = { getHeatmap };