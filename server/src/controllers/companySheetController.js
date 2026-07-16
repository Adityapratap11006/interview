"use strict";

const CompanySheet = require("../models/CompanySheet");
const Problem = require("../models/Problem");

const createCompanySheet = async (req, res) => {
  try {
    const { name, company, description } = req.body;

    if (!name || !company) {
      return res.status(400).json({
        success: false,
        message: "Sheet name and company are required",
      });
    }

    const companySheet = new CompanySheet({
      name,
      company,
      description: description || "",
      user: req.user._id,
      problems: [],
    });

    await companySheet.save();

    res.status(201).json({
      success: true,
      message: "Company sheet created successfully",
      companySheet,
    });
  } catch (error) {
    console.error("Create company sheet error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while creating company sheet",
    });
  }
};

const getCompanySheets = async (req, res) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.company) {
      filter.company = req.query.company;
    }

    const companySheets = await CompanySheet.find(filter).populate("problems");

    res.status(200).json({
      success: true,
      count: companySheets.length,
      companySheets,
    });
  } catch (error) {
    console.error("Get company sheets error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching company sheets",
    });
  }
};

const getCompanySheetById = async (req, res) => {
  try {
    const companySheet = await CompanySheet.findById(req.params.id).populate("problems");

    if (!companySheet) {
      return res.status(404).json({
        success: false,
        message: "Company sheet not found",
      });
    }

    if (!companySheet.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      companySheet,
    });
  } catch (error) {
    console.error("Get company sheet by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching company sheet",
    });
  }
};

const addProblemToCompanySheet = async (req, res) => {
  try {
    const { problemId } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is required",
      });
    }

    const companySheet = await CompanySheet.findById(req.params.id);

    if (!companySheet) {
      return res.status(404).json({
        success: false,
        message: "Company sheet not found",
      });
    }

    if (!companySheet.user.equals(req.user._id)) {
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

    if (companySheet.problems.includes(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Problem already in company sheet",
      });
    }

    companySheet.problems.push(problemId);
    await companySheet.save();

    res.status(200).json({
      success: true,
      message: "Problem added to company sheet successfully",
      companySheet,
    });
  } catch (error) {
    console.error("Add problem to company sheet error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding problem to company sheet",
    });
  }
};

const removeProblemFromCompanySheet = async (req, res) => {
  try {
    const { problemId } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is required",
      });
    }

    const companySheet = await CompanySheet.findById(req.params.id);

    if (!companySheet) {
      return res.status(404).json({
        success: false,
        message: "Company sheet not found",
      });
    }

    if (!companySheet.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!companySheet.problems.includes(problemId)) {
      return res.status(404).json({
        success: false,
        message: "Problem not found in company sheet",
      });
    }

    companySheet.problems = companySheet.problems.filter((id) => id.toString() !== problemId);
    await companySheet.save();

    res.status(200).json({
      success: true,
      message: "Problem removed from company sheet successfully",
      companySheet,
    });
  } catch (error) {
    console.error("Remove problem from company sheet error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing problem from company sheet",
    });
  }
};

module.exports = {
  createCompanySheet,
  getCompanySheets,
  getCompanySheetById,
  addProblemToCompanySheet,
  removeProblemFromCompanySheet,
};