"use strict";

const DailyGoal = require("../models/DailyGoal");
const Problem = require("../models/Problem");

const createDailyGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingGoal = await DailyGoal.findOne({
      user: userId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });

    if (existingGoal) {
      return res.status(400).json({
        success: false,
        message: "Daily goal already exists for today",
      });
    }

    const { problemsTarget, timeTargetMinutes, revisionTarget } = req.body;

    const dailyGoal = new DailyGoal({
      user: userId,
      date: new Date(),
      problemsTarget: problemsTarget || 0,
      timeTargetMinutes: timeTargetMinutes || 0,
      revisionTarget: revisionTarget || 0,
      status: "Active",
    });

    await dailyGoal.save();

    res.status(201).json({
      success: true,
      message: "Daily goal created successfully",
      dailyGoal,
    });
  } catch (error) {
    console.error("Create daily goal error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while creating daily goal",
    });
  }
};

const getTodaysGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayGoal = await DailyGoal.findOne({
      user: userId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });

    if (!todayGoal) {
      return res.status(404).json({
        success: false,
        message: "No daily goal found for today",
      });
    }

    res.status(200).json({
      success: true,
      dailyGoal: todayGoal,
    });
  } catch (error) {
    console.error("Get today's goal error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching today's goal",
    });
  }
};

const updateGoalProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyGoal = await DailyGoal.findOne({
      user: userId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });

    if (!dailyGoal) {
      return res.status(404).json({
        success: false,
        message: "Daily goal not found for today",
      });
    }

    const { problemsCompleted, timeCompletedMinutes, revisionCompleted } = req.body;

    if (typeof problemsCompleted !== "undefined") {
      dailyGoal.problemsCompleted = problemsCompleted;
    }
    if (typeof timeCompletedMinutes !== "undefined") {
      dailyGoal.timeCompletedMinutes = timeCompletedMinutes;
    }
    if (typeof revisionCompleted !== "undefined") {
      dailyGoal.revisionCompleted = revisionCompleted;
    }

    if (
      dailyGoal.problemsCompleted < dailyGoal.problemsTarget ||
      dailyGoal.timeCompletedMinutes < dailyGoal.timeTargetMinutes ||
      dailyGoal.revisionCompleted < dailyGoal.revisionTarget
    ) {
      dailyGoal.status = "Active";
    } else {
      dailyGoal.status = "Completed";
    }

    await dailyGoal.save();

    res.status(200).json({
      success: true,
      message: "Daily goal progress updated successfully",
      dailyGoal,
    });
  } catch (error) {
    console.error("Update goal progress error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating goal progress",
    });
  }
};

const getGoalHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const goals = await DailyGoal.find({ user: userId })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    console.error("Get goal history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching goal history",
    });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await DailyGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Daily goal not found",
      });
    }

    if (!goal.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: "Daily goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete goal error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting goal",
    });
  }
};

module.exports = {
  createDailyGoal,
  getTodaysGoal,
  updateGoalProgress,
  getGoalHistory,
  deleteGoal,
};