"use strict";

const Problem = require("../models/Problem");

const getTopicMastery = async (req, res) => {
  try {
    const userId = req.user._id;

    const masteryData = await Problem.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$topic",
          totalProblems: { $sum: 1 },
          solvedProblems: {
            $sum: {
              $cond: [{$eq: ["$status", "Solved"]}, 1, 0]
            }
          },
          easySolved: {
            $sum: {
              $cond: [
                {$eq: ["$status", "Solved"]},
                {$cond: [{$eq: ["$difficulty", "Easy"]}, 1, 0]},
                0
              ]
            }
          },
          mediumSolved: {
            $sum: {
              $cond: [
                {$eq: ["$status", "Solved"]},
                {$cond: [{$eq: ["$difficulty", "Medium"]}, 1, 0]},
                0
              ]
            }
          },
          hardSolved: {
            $sum: {
              $cond: [
                {$eq: ["$status", "Solved"]},
                {$cond: [{$eq: ["$difficulty", "Hard"]}, 1, 0]},
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          topic: "$_id",
          totalProblems: 1,
          solvedProblems: 1,
          easySolved: 1,
          mediumSolved: 1,
          hardSolved: 1,
          masteryPercentage: {
            $round: [{
              $cond: [
                {$eq: ["$totalProblems", 0]},
                0,
                {
                  $multiply: [
                    {
                      $divide: [
                        "$solvedProblems",
                        "$totalProblems"
                      ]
                    },
                    100
                  ]
                }
              ]
            }, 0]
          },
          _id: 0
        }
      },
      { $sort: { topic: 1 } }
    ]);

    res.status(200).json({
      success: true,
      topics: masteryData,
    });
  } catch (error) {
    console.error("Get topic mastery error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching topic mastery",
    });
  }
};

module.exports = { getTopicMastery };