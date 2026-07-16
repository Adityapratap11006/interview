"use strict";

const Problem = require("../models/Problem");
const DailyGoal = require("../models/DailyGoal");
const Revision = require("../models/Revision");

const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const weekStart = new Date(now.setHours(0, 0, 0, 0));
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const startISO = new Date(weekStart.toISOString().split("T")[0]);
    const endISO = new Date(weekEnd.toISOString().split("T")[0]);

    const userProblems = Problem.find({
      user: userId,
      solvedAt: { $exists: true, $ne: null, $gte: startISO, $lte: endISO },
    });

    const userGoals = DailyGoal.find({
      user: userId,
      date: { $gte: startISO, $lte: endISO },
    });

    const userRevisions = Revision.find({
      user: userId,
      status: "Completed",
      lastRevisedAt: { $exists: true, $ne: null, $gte: startISO, $lte: endISO },
    });

    const [problems, goals, revisions] = await Promise.all([
      userProblems
        .where("status")
        .in(["Solved"])
        .select("difficulty topic timeSpentMinutes"),
      userGoals,
      userRevisions,
    ]);

    const problemsStats = {
      totalSolved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    };

    const topicStats = {};
    let totalTimeSpent = 0;

    problems.forEach((problem) => {
      problemsStats.totalSolved++;
      problemsStats[problem.difficulty.toLowerCase()]++;
      topicStats[problem.topic] = (topicStats[problem.topic] || 0) + 1;
      totalTimeSpent += problem.timeSpentMinutes || 0;
    });

    const dailyActivityMap = {};
    problems.forEach((problem) => {
      const date = new Date(problem.solvedAt);
      const dateStr = date.toISOString().split("T")[0];
      if (!dailyActivityMap[dateStr]) {
        dailyActivityMap[dateStr] = 0;
      }
      dailyActivityMap[dateStr]++;
    });

    const dailyActivity = Object.keys(dailyActivityMap)
      .map((date) => ({
        date,
        count: dailyActivityMap[date],
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const goalsStats = {
      total: 0,
      completed: 0,
      completionPercentage: 0,
    };

    if (goals.length > 0) {
      goalsStats.total = goals.length;
      goalsStats.completed = goals.filter((goal) => goal.status === "Completed").length;
      goalsStats.completionPercentage = Math.round((goalsStats.completed / goalsStats.total) * 100);
    }

    const revisionsCompleted = revisions.length;

    const response = {
      weekStart: weekStart.toISOString().split("T")[0],
      weekEnd: weekEnd.toISOString().split("T")[0],
      problems: problemsStats,
      topics: topicStats,
      timeSpentMinutes: totalTimeSpent,
      dailyActivity,
      goals: goalsStats,
      revisionsCompleted,
    };

    res.status(200).json({
      success: true,
      analytics: response,
    });
  } catch (error) {
    console.error("Get weekly analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching weekly analytics",
    });
  }
};

module.exports = { getWeeklyAnalytics };