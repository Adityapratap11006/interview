"use strict";

const Revision = require("../models/Revision");
const Problem = require("../models/Problem");

const createRevision = async (req, res) => {
  try {
    const { problemId, nextRevisionDate } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is required",
      });
    }

    if (!nextRevisionDate) {
      return res.status(400).json({
        success: false,
        message: "Next revision date is required",
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
        message: "Access denied - cannot create revision for other user's problem",
      });
    }

    const existingRevision = await Revision.findOne({
      user: req.user._id,
      problem: problemId,
    });

    if (existingRevision) {
      return res.status(400).json({
        success: false,
        message: "Revision already exists for this problem",
      });
    }

    const revision = new Revision({
      user: req.user._id,
      problem: problemId,
      nextRevisionDate: new Date(nextRevisionDate),
      status: "Pending",
    });

    await revision.save();

    res.status(201).json({
      success: true,
      message: "Revision created successfully",
      revision,
    });
  } catch (error) {
    console.error("Create revision error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while creating revision",
    });
  }
};

const getRevisions = async (req, res) => {
  try {
    const revisions = await Revision.find({ user: req.user._id })
      .populate("problem")
      .sort({ nextRevisionDate: 1 });

    res.status(200).json({
      success: true,
      count: revisions.length,
      revisions,
    });
  } catch (error) {
    console.error("Get revisions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching revisions",
    });
  }
};

const getDueRevisions = async (req, res) => {
  try {
    const today = new Date();

    const dueRevisions = await Revision.find({
      user: req.user._id,
      status: "Pending",
      nextRevisionDate: { $lte: today },
    })
      .populate("problem")
      .sort({ nextRevisionDate: 1 });

    res.status(200).json({
      success: true,
      count: dueRevisions.length,
      revisions: dueRevisions,
    });
  } catch (error) {
    console.error("Get due revisions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching due revisions",
    });
  }
};

const completeRevision = async (req, res) => {
  try {
    const revision = await Revision.findById(req.params.id);

    if (!revision) {
      return res.status(404).json({
        success: false,
        message: "Revision not found",
      });
    }

    if (!revision.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    revision.status = "Completed";
    revision.revisionCount += 1;
    revision.lastRevisedAt = new Date();

    await revision.save();

    res.status(200).json({
      success: true,
      message: "Revision completed successfully",
      revision,
    });
  } catch (error) {
    console.error("Complete revision error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while completing revision",
    });
  }
};

const deleteRevision = async (req, res) => {
  try {
    const revision = await Revision.findById(req.params.id);

    if (!revision) {
      return res.status(404).json({
        success: false,
        message: "Revision not found",
      });
    }

    if (!revision.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await revision.deleteOne();

    res.status(200).json({
      success: true,
      message: "Revision deleted successfully",
    });
  } catch (error) {
    console.error("Delete revision error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting revision",
    });
  }
};

module.exports = {
  createRevision,
  getRevisions,
  getDueRevisions,
  completeRevision,
  deleteRevision,
};