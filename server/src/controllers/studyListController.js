"use strict";

const StudyList = require("../models/StudyList");
const Problem = require("../models/Problem");

const createStudyList = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Study list name is required",
      });
    }

    const existing = await StudyList.findOne({
      user: req.user._id,
      name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A study list with this name already exists",
      });
    }

    const studyList = new StudyList({
      name,
      description: description || "",
      color: color || "#22d3ee",
      icon: icon || "Bookmark",
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
    const studyLists = await StudyList.find({ user: req.user._id })
      .populate("problems");

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

const updateStudyList = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

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

    if (name !== undefined) {
      const trimmed = name.trim();
      if (!trimmed) {
        return res.status(400).json({
          success: false,
          message: "Study list name cannot be empty",
        });
      }

      const existing = await StudyList.findOne({
        user: req.user._id,
        name: { $regex: `^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "A study list with this name already exists",
        });
      }
      studyList.name = trimmed;
    }
    if (description !== undefined) studyList.description = description;
    if (color !== undefined) studyList.color = color;
    if (icon !== undefined) studyList.icon = icon;

    await studyList.save();

    const populated = await StudyList.findById(studyList._id).populate("problems");

    res.status(200).json({
      success: true,
      message: "Study list updated successfully",
      studyList: populated,
    });
  } catch (error) {
    console.error("Update study list error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while updating study list",
    });
  }
};

const deleteStudyList = async (req, res) => {
  try {
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

    await StudyList.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Study list deleted successfully",
    });
  } catch (error) {
    console.error("Delete study list error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting study list",
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

    const populated = await StudyList.findById(studyList._id).populate("problems");

    res.status(200).json({
      success: true,
      message: "Problem added to study list successfully",
      studyList: populated,
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
    const { problemId } = req.params;

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

    const populated = await StudyList.findById(studyList._id).populate("problems");

    res.status(200).json({
      success: true,
      message: "Problem removed from study list successfully",
      studyList: populated,
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
  updateStudyList,
  deleteStudyList,
  addProblemToStudyList,
  removeProblemFromStudyList,
};
