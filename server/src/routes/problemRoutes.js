"use strict";

const express = require("express");
const router = express.Router();

const { createProblem, getProblems, getProblemById, updateProblem, deleteProblem } = require("../controllers/problemController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createProblem);
router.get("/", protect, getProblems);
router.get("/:id", protect, getProblemById);
router.patch("/:id", protect, updateProblem);
router.delete("/:id", protect, deleteProblem);

module.exports = router;