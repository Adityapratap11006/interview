"use strict";

const StudyList = require("../models/StudyList");
const Problem = require("../models/Problem");

const createStudyList = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Study list name is required",
      });
    }

    const studyList = new StudyList({
      name,
      description: description || "",
      user: req.user._id,
      problems: [],
    });

    await studyList.save();

    res.status(201).json({
      success: true,
      message: "Study list created successfully",
      studyList,
    });
  } catch (error) {
    console.error("Create study list error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while creating study list",
    });
  }
};

const getStudyLists = async (req, res) => {
  try {
    const studyLists = await StudyList.find({ user: req.user._id }).populate(
      "problems"
    );

    res.status(200).json({
      success: true,
      count: studyLists.length,
      studyLists,
    });
  } catch (error) {
    console.error("Get study lists error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching study lists",
    });
  }
};

const getStudyListById = async (req, res) => {
  try {
    const studyList = await StudyList.findById(req.params.id).populate("problems");

    if (!studyList) {
      return res.status(404).json({
        success: false,
        message: "Study list not found",
      });
    }

    if (!studyList.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      studyList,
    });
  } catch (error) {
    console.error("Get study list by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching study list",
    });
  }
};

const addProblemToStudyList = async (req, res) => {
  try {
    const { problemId } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is required",
      });
    }

    const studyList = await StudyList.findById(req.params.id);

    if (!studyList) {
      return res.status(404).json({
        success: false,
        message: "Study list not found",
      });
    }

    if (!studyList.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    if (!problem.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied - cannot add other user's problem",
      });
    }

    if (studyList.problems.includes(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Problem already in study list",
      });
    }

    studyList.problems.push(problemId);
    await studyList.save();

    res.status(200).json({
      success: true,
      message: "Problem added to study list successfully",
      studyList,
    });
  } catch (error) {
    console.error("Add problem to study list error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding problem to study list",
    });
  }
};

const removeProblemFromStudyList = async (req, res) => {
  try {
    const { problemId } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is required",
      });
    }

    const studyList = await StudyList.findById(req.params.id);

    if (!studyList) {
      return res.status(404).json({
        success: false,
        message: "Study list not found",
      });
    }

    if (!studyList.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!studyList.problems.includes(problemId)) {
      return res.status(404).json({
        success: false,
        message: "Problem not found in study list",
      });
    }

    studyList.problems = studyList.problems.filter((id) => id.toString() !== problemId);
    await studyList.save();

    res.status(200).json({
      success: true,
      message: "Problem removed from study list successfully",
      studyList,
    });
  } catch (error) {
    console.error("Remove problem from study list error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing problem from study list",
    });
  }
};

module.exports = {
  createStudyList,
  getStudyLists,
  getStudyListById,
  addProblemToStudyList,
  removeProblemFromStudyList,
};