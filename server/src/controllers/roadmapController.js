"use strict";

const Problem = require("../models/Problem");

const generateRoadmap = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetCompany, targetMonths, dailyHours } = req.body;

    if (!targetCompany) {
      return res.status(400).json({
        success: false,
        message: "Target company is required",
      });
    }

    const allProblems = await Problem.find({ user: userId });

    const topicStats = {};
    const difficultyStats = { Easy: 0, Medium: 0, Hard: 0 };

    allProblems.forEach((problem) => {
      if (!topicStats[problem.topic]) {
        topicStats[problem.topic] = {
          total: 0,
          solved: 0,
          easy: 0,
          medium: 0,
          hard: 0,
        };
      }

      topicStats[problem.topic].total++;

      if (problem.status === "Solved") {
        topicStats[problem.topic].solved++;

        if (problem.difficulty === "Easy") topicStats[problem.topic].easy++;
        else if (problem.difficulty === "Medium")
          topicStats[problem.topic].medium++;
        else if (problem.difficulty === "Hard")
          topicStats[problem.topic].hard++;
      }

      if (problem.difficulty === "Easy") difficultyStats.Easy++;
      else if (problem.difficulty === "Medium") difficultyStats.Medium++;
      else if (problem.difficulty === "Hard") difficultyStats.Hard++;
    });

    const weakTopics = Object.keys(topicStats).filter(
      (topic) => topicStats[topic].total > 0 && (topicStats[topic].solved / topicStats[topic].total) * 100 < 50
    );

    const strongTopics = Object.keys(topicStats).filter(
      (topic) => topicStats[topic].total > 0 && (topicStats[topic].solved / topicStats[topic].total) * 100 >= 70
    );

    const roadmap = [];
    let weekNumber = 1;

    weakTopics.forEach((topic) => {
      roadmap.push({
        week: weekNumber++,
        topic: topic,
        focus: "Basics and patterns",
        priority: "High",
      });
    });

    strongTopics.forEach((topic) => {
      roadmap.push({
        week: weekNumber++,
        topic: topic,
        focus: "Revision and advanced problems",
        priority: "Medium",
      });
    });

    if (roadmap.length === 0) {
      roadmap.push({
        week: 1,
        topic: "Arrays",
        focus: "Basics and patterns",
        priority: "High",
      });
    }

    const response = {
      targetCompany,
      durationMonths: targetMonths || 3,
      analysis: {
        strongTopics: strongTopics,
        weakTopics: weakTopics,
      },
      roadmap: roadmap,
    };

    res.status(200).json({
      success: true,
      roadmap: response,
    });
  } catch (error) {
    console.error("Generate roadmap error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while generating roadmap",
    });
  }
};

module.exports = { generateRoadmap };