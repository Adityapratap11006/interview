"use strict";

const Problem = require("../models/Problem");

const createProblem = async (req, res) => {
  try {
    const { title, leetcodeLink, difficulty, topic } = req.body;

    if (!title || !leetcodeLink || !difficulty || !topic) {
      return res.status(400).json({
        success: false,
        message: "Title, LeetCode link, difficulty, and topic are required",
      });
    }

    const problem = new Problem({
      title,
      leetcodeLink,
      difficulty,
      topic,
      status: req.body.status || "Not Started",
      notes: req.body.notes || "",
      timeSpentMinutes: req.body.timeSpentMinutes || 0,
      language: req.body.language || "",
      attemptCount: req.body.attemptCount || 1,
      revisionCount: req.body.revisionCount || 0,
      solvedAt: req.body.solvedAt || null,
      user: req.user._id,
    });

    await problem.save();

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem,
    });
  } catch (error) {
    console.error("Create problem error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating problem",
    });
  }
};

const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error("Get problems error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching problems",
    });
  }
};

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({\n        success: false,\n        message: "Problem not found",\n      });\n    }

    if (!problem.user.equals(req.user._id)) {
      return res.status(403).json({\n        success: false,\n        message: "Access denied",\n      });\n    }

    res.status(200).json({\n      success: true,\n      problem,\n    });\n  }\n  catch (error) {\n    console.error("Get problem by ID error:", error);\n    res.status(500).json({\n      success: false,\n      message: "Server error while fetching problem",\n    });\n  }\n};\n
const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({\n        success: false,\n        message: "Problem not found",\n      });\n    }

    if (!problem.user.equals(req.user._id)) {
      return res.status(403).json({\n        success: false,\n        message: "Access denied",\n      });\n    }

    if (req.body.title !== undefined) problem.title = req.body.title;
    if (req.body.difficulty !== undefined) problem.difficulty = req.body.difficulty;
    if (req.body.status !== undefined) problem.status = req.body.status;
    if (req.body.topic !== undefined) problem.topic = req.body.topic;
    if (req.body.leetcodeLink !== undefined) problem.leetcodeLink = req.body.leetcodeLink;
    if (req.body.notes !== undefined) problem.notes = req.body.notes;
    if (req.body.timeSpentMinutes !== undefined) problem.timeSpentMinutes = req.body.timeSpentMinutes;
    if (req.body.language !== undefined) problem.language = req.body.language;
    if (req.body.attemptCount !== undefined) problem.attemptCount = req.body.attemptCount;
    if (req.body.revisionCount !== undefined) problem.revisionCount = req.body.revisionCount;
    if (req.body.solvedAt !== undefined) problem.solvedAt = req.body.solvedAt;

    await problem.save();

    res.status(200).json({\n      success: true,\n      message: "Problem updated successfully",\n      problem,\n    });\n  }\n  catch (error) {\n    console.error("Update problem error:", error);\n    res.status(500).json({\n      success: false,\n      message: "Server Error",\n    });\n  }\n};\n
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({\n        success: false,\n        message: "Problem not found",\n      });\n    }

    if (!problem.user.equals(req.user._id)) {
      return res.status(403).json({\n        success: false,\n        message: "Access denied",\n      });\n    }

    await problem.deleteOne();

    res.status(200).json({\n      success: true,\n      message: "Problem deleted successfully",\n    });\n  }\n  catch (error) {\n    console.error("Delete problem error:", error);\n    res.status(500).json({\n      success: false,\n      message: "Server Error",\n    });\n  }\n};\n\nmodule.exports = { createProblem, getProblems, getProblemById, updateProblem, deleteProblem };