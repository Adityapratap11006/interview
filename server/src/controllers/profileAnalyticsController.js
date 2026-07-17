"use strict";

const Problem = require("../models/Problem");
const Revision = require("../models/Revision");
const DailyGoal = require("../models/DailyGoal");
const CompanySheet = require("../models/CompanySheet");

const getLearningProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const [problems, revisions, goals, companySheets] = await Promise.all([
      Problem.find({ user: userId }),
      Revision.find({ user: userId }),
      DailyGoal.find({ user: userId }),
      CompanySheet.find({ user: userId }),
    ]);

    const dsaProfile = {
      totalSolved: 0,
      difficulty: { Easy: 0, Medium: 0, Hard: 0 },
      strongTopics: [],
      weakTopics: [],
    };

    const topicStats = {};
    problems.forEach((problem) => {
      dsaProfile.totalSolved++;
      dsaProfile.difficulty[problem.difficulty]++;

      if (!topicStats[problem.topic]) {
        topicStats[problem.topic] = { total: 0, solved: 0 };
      }

      topicStats[problem.topic].total++;

      if (problem.status === "Solved") {
        topicStats[problem.topic].solved++;
      }
    });

    Object.keys(topicStats).forEach((topic) => {
      const mastery = (topicStats[topic].solved / topicStats[topic].total) * 100;
      if (mastery >= 70) {
        dsaProfile.strongTopics.push(topic);
      } else if (mastery > 0) {
        dsaProfile.weakTopics.push(topic);
      }
    });

    const completedRevisions = revisions.filter((r) => r.status === "Completed").length;
    const revisionCompletion = revisions.length > 0 ? Math.round((completedRevisions / revisions.length) * 100) : 0;

    const completedGoals = goals.filter((g) => g.status === "Completed").length;
    const goalCompletion = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

    let consistencyLevel = "Poor";
    if (revisionCompletion >= 80 && goalCompletion >= 80) consistencyLevel = "Excellent";
    else if (revisionCompletion >= 60 && goalCompletion >= 60) consistencyLevel = "Good";

    const careerProfile = {
      targetCompanies: companySheets.map((sheet) => sheet.company),
    };

    const response = {
      user: {
        id: userId,
      },
      dsaProfile,
      learningConsistency: {
        revisionCompletion,
        goalCompletion,
        consistencyLevel,
      },
      careerProfile,
    };

    res.status(200).json({
      success: true,
      learningProfile: response,
    });
  } catch (error) {
    console.error("Get learning profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching learning profile",
    });
  }
};

module.exports = { getLearningProfile };