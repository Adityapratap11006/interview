"use strict";

const Problem = require("../models/Problem");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const dashboardData = await Problem.aggregate([
      {
        $match: { user: userId }
      },
      {
        $group: {
          _id: null,
          totalProblems: { $sum: 1 },
          solvedProblems: {
            $sum: { $cond: [{ $eq: ["$status", "Solved"] }, 1, 0] }
          },
          attemptedProblems: {
            $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] }
          },
          todoProblems: {
            $sum: { $cond: [{ $eq: ["$status", "Not Started"] }, 1, 0] }
          },
          easyProblems: {
            $sum: { $cond: [{ $eq: ["$difficulty", "Easy"] }, 1, 0] }
          },
          mediumProblems: {
            $sum: { $cond: [{ $eq: ["$difficulty", "Medium"] }, 1, 0] }
          },
          hardProblems: {
            $sum: { $cond: [{ $eq: ["$difficulty", "Hard"] }, 1, 0] }
          },
          totalTimeSpentMinutes: { $sum: "$timeSpentMinutes" },
          totalAttempts: { $sum: "$attemptCount" },
          totalRevisions: { $sum: "$revisionCount" }
        }
      }
    ]);

    const result = dashboardData[0] || {};

    const formatResponse = (data) => ({
      success: true,
      totalProblems: data.totalProblems || 0,
      solvedProblems: data.solvedProblems || 0,
      attemptedProblems: data.attemptedProblems || 0,
      todoProblems: data.todoProblems || 0,
      easyProblems: data.easyProblems || 0,
      mediumProblems: data.mediumProblems || 0,
      hardProblems: data.hardProblems || 0,
      totalTimeSpentMinutes: data.totalTimeSpentMinutes || 0,
      totalAttempts: data.totalAttempts || 0,
      totalRevisions: data.totalRevisions || 0
    });

    res.status(200).json(formatResponse(result));
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data",
    });
  }
};

module.exports = { getDashboard };