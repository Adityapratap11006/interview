"use strict";

const Problem = require("../models/Problem");

const getStreak = async (req, res) => {
  try {
    const userId = req.user._id;

    const solvedProblems = await Problem.find({
      user: userId,
      status: "Solved",
      solvedAt: { $exists: true, $ne: null }
    }).select("solvedAt");

    const uniqueDates = Array.from(
      new Set(
        solvedProblems.map((problem) => {
          const date = new Date(problem.solvedAt);
          return date.toISOString().split("T")[0];
        })
      )
    ).sort();

    if (uniqueDates.length === 0) {
      return res.status(200).json({
        success: true,
        currentStreak: 0,
        longestStreak: 0,
        totalSolvedDays: 0
      });
    }

    const dates = uniqueDates.map((dateStr) => new Date(dateStr));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let longestStreak = 1;
    let tempStreak = 1;

    for (let i = dates.length - 1; i > 0; i--) {
      const current = dates[i];
      const prev = dates[i - 1];

      const diffTime = current - prev;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        if (current.getTime() === today.getTime()) {
          currentStreak = tempStreak;
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 1;
      }
    }

    if (dates[dates.length - 1].getTime() === today.getTime()) {
      if (currentStreak === 0) {
        currentStreak = 1;
      }
    }

    const response = {
      success: true,
      currentStreak,
      longestStreak,
      totalSolvedDays: uniqueDates.length
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Get streak error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching streak data"
    });
  }
};

module.exports = { getStreak };